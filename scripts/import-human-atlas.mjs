#!/usr/bin/env node
// Usage: node scripts/import-human-atlas.mjs /path/to/human-atlas
// Regenerates ONLY the 25 curated models, generated content and audit manifest.
import { readFile, writeFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { Document, NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import { Box3, Vector3, Matrix4, Color } from 'three';
import { selections } from './human-atlas-selection.mjs';

const revision = '1c38bf35c254a891200d3cedecfd57abebe83d8d';
const source = resolve(process.argv[2] || '/tmp/human-atlas-audit');
const root = resolve(import.meta.dirname, '..');
assert.equal(execFileSync('git', ['-C', source, 'rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(), revision, 'Wrong source revision');
const atlasBytes = await readFile(join(source, 'public/models/atlas.json'));
const atlas = JSON.parse(atlasBytes);
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const parts = new Map(atlas.parts.map(p => [p.id, p]));
const concepts = new Map(atlas.concepts.map(c => [c.id, c]));
const chunks = await Promise.all(atlas.chunks.map(async c => {
  const bytes = await readFile(join(source, 'public', c.url));
  assert.equal(bytes.byteLength, c.bytes);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}));
await MeshoptEncoder.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
});
const content = [], records = [];
for (const spec of selections) {
  const ids = [...new Set(spec.concepts.flatMap(id => {
    assert(concepts.has(id), `Unknown concept ${id}`);
    return concepts.get(id).elements;
  }))].filter(id => !spec.only || spec.only.includes(id));
  if (spec.only) assert.deepEqual([...ids].sort(), [...spec.only].sort());
  assert(ids.length);
  const doc = new Document(), buffer = doc.createBuffer(), scene = doc.createScene(spec.id);
  const originalBounds = new Box3();
  for (const [i, id] of ids.entries()) {
    const p = parts.get(id); assert(p, `Unknown part ${id}`);
    const chunk = chunks[p.chunk];
    const positions = new Float32Array(chunk, p.positions, p.vertexCount * 3).slice();
    const rawNormals = new Int16Array(chunk, p.normals, p.vertexCount * 3);
    const normals = Float32Array.from(rawNormals, n => Math.max(-1, n / 32767));
    const indices = new Uint32Array(chunk, p.indices, p.indexCount).slice();
    assert.equal(indices.length % 3, 0);
    assert(positions.every(Number.isFinite));
    for (let j = 0; j < positions.length; j += 3) originalBounds.expandByPoint(new Vector3().fromArray(positions, j));
    assert(indices.every(n => n < p.vertexCount));
    const color = new Color(spec.accent);
    // Slight tonal differences distinguish adjacent anatomical components.
    color.offsetHSL((i % 3 - 1) * .012, 0, (i % 3 - 1) * .04);
    const material = doc.createMaterial(id).setBaseColorFactor([color.r, color.g, color.b, 1])
      .setMetallicFactor(0).setRoughnessFactor(.58).setDoubleSided(true);
    const accessor = (name, array, type) => doc.createAccessor(name).setBuffer(buffer).setType(type).setArray(array);
    const primitive = doc.createPrimitive()
      .setAttribute('POSITION', accessor('position', positions, 'VEC3'))
      .setAttribute('NORMAL', accessor('normal', normals, 'VEC3'))
      .setIndices(accessor('indices', indices, 'SCALAR')).setMaterial(material);
    const mesh = doc.createMesh(p.name).setExtras({ sourcePartId: id, conceptId: p.conceptId }).addPrimitive(primitive);
    scene.addChild(doc.createNode(`${id} ${p.name}`).setMesh(mesh));
  }
  doc.getRoot().getAsset().copyright = 'BodyParts3D © The Database Center for Life Science licensed under CC BY 4.0';
  doc.getRoot().setExtras({ source: 'BodyParts3D 4.0 / ashemag/human-atlas', revision, concepts: spec.concepts });
  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  // Quantization may move geometry to unnamed child nodes. Restore source IDs
  // from mesh metadata instead of relying on ordering or vertex counts.
  for (const n of doc.getRoot().listNodes()) {
    const id = n.getMesh()?.getExtras().sourcePartId;
    if (id) n.setName(`${id} ${parts.get(id).name}`);
  }
  const output = join(root, 'public/models', `${spec.id}.glb`);
  await io.write(output, doc);
  // Read the actual compressed output back: landmarks must match final geometry.
  const decoded = await io.read(output);
  const worldPoints = new Map(), bounds = new Box3();
  for (const n of decoded.getRoot().listNodes()) {
    const mesh = n.getMesh(); if (!mesh) continue;
    const matrix = new Matrix4().fromArray(n.getWorldMatrix());
    const pts = [];
    for (const prim of mesh.listPrimitives()) {
      const a = prim.getAttribute('POSITION');
      for (let i = 0; i < a.getCount(); i++) {
        // getArray() returns raw quantized integers; getElement() applies
        // accessor normalization, just as GLTFLoader does in the browser.
        const v = new Vector3().fromArray(a.getElement(i, [])).applyMatrix4(matrix);
        assert(v.toArray().every(Number.isFinite));
        pts.push(v); bounds.expandByPoint(v);
      }
    }
    worldPoints.set(mesh.getExtras().sourcePartId, pts);
  }
  assert.equal(worldPoints.size, ids.length);
  assert(bounds.min.distanceTo(originalBounds.min) < .0001 && bounds.max.distanceTo(originalBounds.max) < .0001,
    `${spec.id}: transformed bounds differ from meter-scale source`);
  const center = bounds.getCenter(new Vector3());
  const extent = Math.max(...bounds.getSize(new Vector3()).toArray());
  assert(extent > 0);
  const hotspots = spec.hotspots.map((h, i) => {
    const pts = worldPoints.get(h.mesh); assert(pts?.length, `Missing landmark ${h.mesh}`);
    const b = new Box3().setFromPoints(pts);
    const target = b.getCenter(new Vector3()); target.z = b.max.z;
    const surface = pts.reduce((best, v) => v.distanceToSquared(target) < best.distanceToSquared(target) ? v : best);
    return { id: `${spec.id}-${i + 1}`, label: h.label, detail: h.detail,
      position: surface.clone().sub(center).multiplyScalar(3.8 / extent).toArray().map(v => +v.toFixed(6)),
      color: ['#cf7868', '#7397b9', '#bd9a65', '#9d87b4', '#79a18c'][i % 5] };
  });
  const { concepts: selectedConcepts, hotspots: sourceSpots, ...fields } = spec;
  delete fields.only;
  content.push({ ...fields, description: `${fields.description} 模型采用成年男性参考数据。`,
    attribution: { label: 'BodyParts3D © The Database Center for Life Science · CC BY 4.0', href: '/human-atlas-attribution.txt' },
    model: `/models/${spec.id}.glb`, icon: '◉', illustrated: true, hotspots });
  records.push({ id: spec.id, name: spec.name, concepts: selectedConcepts,
    parts: ids.map(id => ({ id, name: parts.get(id).name, conceptId: parts.get(id).conceptId })),
    landmarks: sourceSpots, bounds: [bounds.min.toArray(), bounds.max.toArray()],
    bytes: (await stat(output)).size, sha256: sha256(await readFile(output)) });
  console.log(`${spec.id}: ${ids.length} meshes, ${(records.at(-1).bytes / 1024).toFixed(1)} KiB`);
}
const dataPath = join(root, 'app/lib/anatomy-data.ts');
let data = await readFile(dataPath, 'utf8');
const typeBlock = `\n  // human-atlas IDs begin\n${content.map(x => `  | "${x.id}"`).join('\n')}\n  // human-atlas IDs end`;
if (data.includes('// human-atlas IDs begin')) data = data.replace(/\n  \/\/ human-atlas IDs begin[\s\S]*?\/\/ human-atlas IDs end/, typeBlock);
else data = data.replace('  | "ear-ossicles";', `  | "ear-ossicles"${typeBlock};`);
const contentBlock = `  // human-atlas content begin (generated by scripts/import-human-atlas.mjs)\n${content.map(x => '  ' + JSON.stringify(x, null, 2).replace(/\n/g, '\n  ') + ',').join('\n')}\n  // human-atlas content end\n`;
if (data.includes('// human-atlas content begin')) data = data.replace(/  \/\/ human-atlas content begin[\s\S]*?  \/\/ human-atlas content end\n/, contentBlock);
else data = data.replace('\n];\n\nexport const organById', `\n${contentBlock}];\n\nexport const organById`);
await writeFile(dataPath, data);
await writeFile(join(root, 'docs/human-atlas-import.json'), JSON.stringify({
  source: `https://github.com/ashemag/human-atlas/tree/${revision}`, revision,
  atlasSha256: sha256(atlasBytes),
  chunks: atlas.chunks.map((c, i) => ({ url: c.url, sha256: sha256(Buffer.from(chunks[i])) })),
  license: 'CC BY 4.0', coordinateSystem: 'meters / Y-up; original relative positions retained',
  records,
}, null, 2) + '\n');
