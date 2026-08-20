#!/usr/bin/env node
// 把同一 mesh 下兼容的多个 primitive 合并为一个，保留节点名称与层级。
// 用于 Z-Anatomy FBX 提取产物：FBXLoader 会把单个解剖结构拆成大量碎片 primitive。
import { NodeIO, PropertyType } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, joinPrimitives, prune } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/consolidate-glb.mjs <input.glb> <output.glb>");
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
await document.transform(
  dedup({ propertyTypes: [PropertyType.MATERIAL, PropertyType.ACCESSOR] }),
);

let joined = 0;
for (const mesh of document.getRoot().listMeshes()) {
  const primitives = mesh.listPrimitives();
  if (primitives.length < 2) continue;
  // 按材质分组后分别合并，保留同一结构内的不同材质（如骨与牙）
  const byMaterial = new Map();
  for (const primitive of primitives) {
    const key = primitive.getMaterial() ?? "(none)";
    if (!byMaterial.has(key)) byMaterial.set(key, []);
    byMaterial.get(key).push(primitive);
  }
  const consolidated = [];
  for (const group of byMaterial.values()) {
    try {
      consolidated.push(group.length > 1 ? joinPrimitives(group) : group[0]);
    } catch {
      consolidated.push(...group);
    }
  }
  if (consolidated.length < primitives.length) {
    for (const primitive of primitives) mesh.removePrimitive(primitive);
    for (const primitive of consolidated) mesh.addPrimitive(primitive);
    joined++;
  }
}

await document.transform(prune());
await io.write(outputPath, document);
console.log(`Consolidated ${joined} meshes into ${outputPath}`);
