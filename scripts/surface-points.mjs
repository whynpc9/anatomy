#!/usr/bin/env node
// 输出每个 mesh 在查看器归一化坐标中的逐轴极值顶点，用于把热点钉在真实表面。
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { getBounds } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const FIT_SIZE = 3.8;
const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node /tmp/surface-points.mjs <model.glb>");
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
const scene = document.getRoot().getDefaultScene() ?? document.getRoot().listScenes()[0];
const box = getBounds(scene);
const size = box.max.map((v, i) => v - box.min[i]);
const center = box.max.map((v, i) => (v + box.min[i]) / 2);
const scale = FIT_SIZE / Math.max(...size);
const round = (v) => Number(v.toFixed(3));

for (const node of document.getRoot().listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const world = node.getWorldMatrix();
  const extremes = {
    minX: { v: Infinity }, maxX: { v: -Infinity },
    minY: { v: Infinity }, maxY: { v: -Infinity },
    minZ: { v: Infinity }, maxZ: { v: -Infinity },
  };
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute("POSITION");
    if (!pos) continue;
    const arr = pos.getArray();
    const el = [0, 0, 0];
    for (let i = 0; i < pos.getCount(); i++) {
      let x = pos.getElement(i, el)[0], y = el[1], z = el[2];
      // 应用节点世界变换
      const m = world;
      const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
      const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
      const wz = m[2] * x + m[6] * y + m[10] * z + m[14];
      const nx = (wx - center[0]) * scale, ny = (wy - center[1]) * scale, nz = (wz - center[2]) * scale;
      if (nx < extremes.minX.v) extremes.minX = { v: nx, p: [nx, ny, nz] };
      if (nx > extremes.maxX.v) extremes.maxX = { v: nx, p: [nx, ny, nz] };
      if (ny < extremes.minY.v) extremes.minY = { v: ny, p: [nx, ny, nz] };
      if (ny > extremes.maxY.v) extremes.maxY = { v: ny, p: [nx, ny, nz] };
      if (nz < extremes.minZ.v) extremes.minZ = { v: nz, p: [nx, ny, nz] };
      if (nz > extremes.maxZ.v) extremes.maxZ = { v: nz, p: [nx, ny, nz] };
    }
    void arr;
  }
  const out = {};
  for (const [k, e] of Object.entries(extremes)) out[k] = e.p?.map(round);
  console.log(node.getName() || "(unnamed)", JSON.stringify(out));
}
