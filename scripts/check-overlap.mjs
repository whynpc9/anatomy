#!/usr/bin/env node
// Report near-duplicate/overlapping mesh nodes in a GLB (AABB overlap > 60% of
// the smaller box). Used to spot duplicated combined meshes before merging.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { getBounds } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder } from "meshoptimizer";

const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "draco3d.decoder": await draco3d.createDecoderModule(), "meshopt.decoder": MeshoptDecoder });
const doc = await io.read(process.argv[2]);
const infos = [];
for (const node of doc.getRoot().listNodes()) {
  if (!node.getMesh()) continue;
  const b = getBounds(node);
  const size = [0, 1, 2].map((i) => b.max[i] - b.min[i]);
  infos.push({ name: node.getName(), min: b.min, max: b.max, vol: size[0] * size[1] * size[2] });
}
console.log(`nodes: ${infos.length}`);
const overlap = (a, b) => {
  const s = [0, 1, 2].map((i) => Math.max(0, Math.min(a.max[i], b.max[i]) - Math.max(a.min[i], b.min[i])));
  return s[0] * s[1] * s[2];
};
let flagged = 0;
for (let i = 0; i < infos.length; i++) {
  for (let j = i + 1; j < infos.length; j++) {
    const a = infos[i], b = infos[j];
    const smaller = Math.min(a.vol, b.vol);
    if (smaller > 0 && overlap(a, b) / smaller > 0.6) {
      flagged++;
      console.log(`OVERLAP ${((overlap(a, b) / smaller) * 100).toFixed(0)}%  ${a.name}  <->  ${b.name}`);
    }
  }
}
console.log(`flagged pairs: ${flagged}`);
