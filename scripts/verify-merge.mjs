#!/usr/bin/env node
// 验证合并模型中两组网格的空间对齐：抽样顶点计算组间最近距离与包围盒重叠。
// 用法: node scripts/verify-merge.mjs <model.glb> <patternA> <patternB>
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { getBounds } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [inputPath, patternA, patternB] = process.argv.slice(2);
if (!inputPath || !patternA || !patternB) {
  console.error("Usage: node scripts/verify-merge.mjs <model.glb> <patternA> <patternB>");
  process.exit(1);
}

await MeshoptDecoder.ready;
await MeshoptEncoder.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({
    "draco3d.decoder": await draco3d.createDecoderModule(),
    "draco3d.encoder": await draco3d.createEncoderModule(),
    "meshopt.decoder": MeshoptDecoder,
    "meshopt.encoder": MeshoptEncoder,
  });

const document = await io.read(inputPath);
const reA = new RegExp(patternA, "i");
const reB = new RegExp(patternB, "i");

function collectPoints(pattern, stride = 7) {
  const points = [];
  const boxes = [];
  for (const node of document.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh || !pattern.test(node.getName())) continue;
    boxes.push({ name: node.getName(), box: getBounds(node) });
    const m = node.getWorldMatrix();
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute("POSITION");
      if (!pos) continue;
      const el = [0, 0, 0];
      for (let i = 0; i < pos.getCount(); i += stride) {
        pos.getElement(i, el);
        points.push([
          m[0] * el[0] + m[4] * el[1] + m[8] * el[2] + m[12],
          m[1] * el[0] + m[5] * el[1] + m[9] * el[2] + m[13],
          m[2] * el[0] + m[6] * el[1] + m[10] * el[2] + m[14],
        ]);
      }
    }
  }
  return { points, boxes };
}

const a = collectPoints(reA);
const b = collectPoints(reB);
if (a.points.length === 0 || b.points.length === 0) {
  console.error(`No meshes matched (A: ${a.boxes.length}, B: ${b.boxes.length})`);
  process.exit(2);
}

let minDist = Infinity;
for (const p of a.points) {
  for (const q of b.points) {
    const d = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
    if (d < minDist) minDist = d;
  }
}

const sceneBox = getBounds(document.getRoot().getDefaultScene() ?? document.getRoot().listScenes()[0]);
const sceneSize = Math.max(...sceneBox.max.map((v, i) => v - sceneBox.min[i]));
console.log(`A meshes: ${a.boxes.length}, B meshes: ${b.boxes.length}`);
console.log(`scene size: ${sceneSize.toFixed(2)} raw units`);
console.log(`min sampled vertex distance A<->B: ${minDist.toFixed(3)} raw units (${((minDist / sceneSize) * 100).toFixed(2)}% of scene size)`);
for (const { name, box } of a.boxes.slice(0, 30)) {
  const c = box.max.map((v, i) => ((v + box.min[i]) / 2).toFixed(1));
  console.log(`  A ${name}: center [${c}]`);
}
