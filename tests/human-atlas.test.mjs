import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Box3, Matrix4, Vector3 } from 'three';
import sharp from 'sharp';
import { organs } from '../app/lib/anatomy-data.ts';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('docs/human-atlas-import.json', root)));
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });

test('all 25 atlas selections retain source geometry, meter scale, surface landmarks and previews', async () => {
  assert.equal(manifest.records.length, 25);
  assert.equal(manifest.revision, '1c38bf35c254a891200d3cedecfd57abebe83d8d');
  assert.equal(manifest.records.reduce((n, r) => n + r.parts.length, 0), 227);
  for (const record of manifest.records) {
    const organ = organs.find(o => o.id === record.id);
    assert(organ, record.id);
    const bytes = await readFile(new URL(`public${organ.model}`, root));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), record.sha256, record.id);
    const doc = await io.readBinary(bytes);
    assert.match(doc.getRoot().getAsset().copyright, /BodyParts3D.*CC BY 4.0/);
    const points = new Map(), box = new Box3();
    for (const node of doc.getRoot().listNodes()) {
      const mesh = node.getMesh(); if (!mesh) continue;
      const id = mesh.getExtras().sourcePartId;
      assert(node.getName().startsWith(`${id} `));
      const matrix = new Matrix4().fromArray(node.getWorldMatrix());
      const vertices = [];
      for (const prim of mesh.listPrimitives()) {
        const position = prim.getAttribute('POSITION');
        const indices = prim.getIndices();
        assert(indices.getArray().every(i => i < position.getCount()), record.id);
        assert.equal(indices.getCount() % 3, 0);
        for (let i = 0; i < position.getCount(); i++) {
          const p = new Vector3().fromArray(position.getElement(i, [])).applyMatrix4(matrix);
          assert(p.toArray().every(Number.isFinite), record.id);
          box.expandByPoint(p); vertices.push(p);
        }
      }
      points.set(id, vertices);
    }
    assert.deepEqual([...points.keys()].sort(), record.parts.map(p => p.id).sort());
    const extent = Math.max(...box.getSize(new Vector3()).toArray());
    assert(extent > .001 && extent < 2, `${record.id}: expected human meter scale`);
    assert(box.min.distanceTo(new Vector3().fromArray(record.bounds[0])) < 1e-7);
    assert(box.max.distanceTo(new Vector3().fromArray(record.bounds[1])) < 1e-7);
    const center = box.getCenter(new Vector3());
    assert.equal(organ.hotspots.length, record.landmarks.length);
    for (const [i, h] of organ.hotspots.entries()) {
      const source = record.landmarks[i];
      assert.equal(h.label, source.label);
      const target = new Vector3().fromArray(h.position).multiplyScalar(extent / 3.8).add(center);
      assert(points.get(source.mesh).some(p => p.distanceTo(target) < 1e-6), `${record.id}: ${h.label} off source mesh`);
    }
    for (const [file, size] of [['organ', 720], ['thumb', 180]]) {
      const image = sharp(await readFile(new URL(`public/anatomy/${record.id}/${file}.webp`, root)));
      const info = await image.metadata();
      assert.equal(info.width, size); assert.equal(info.height, size);
      const stats = await image.stats();
      assert(stats.channels.some(c => c.stdev > 3), `${record.id}: blank preview`);
    }
  }
});

test('curated labels correct upstream system and grouping mistakes', () => {
  const byId = new Map(organs.map(o => [o.id, o]));
  assert.equal(byId.get('brain-ventricles').system, '神经系统');
  assert.equal(byId.get('pineal-gland').system, '内分泌系统');
  assert.equal(byId.get('hyoid').system, '骨骼系统');
  assert.equal(manifest.records.find(r => r.id === 'gluteal-muscles').parts.length, 6);
  assert.match(byId.get('biliary-tree').description, /未单独提供完整胆总管/);
  assert.match(byId.get('extraocular-muscles').medical, /六条.*一条/);
});
