#!/usr/bin/env node
// Bucket-sample a mesh's surface vertices along the Y axis and print the
// centroid of each bucket in viewer-normalized coordinates (FIT_SIZE = 3.8,
// longest edge scaled, centered on the bounding-box center). Used to place
// hotspots along a nerve/vessel course instead of only at node centers.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { getBounds } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder } from "meshoptimizer";

const [file, pattern, bucketsArg] = process.argv.slice(2);

if (!file || !pattern) {
  console.error("Usage: node scripts/sample-path.mjs <model.glb> <node-name-regex> [buckets=8]");
  process.exitCode = 1;
} else {
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({ "draco3d.decoder": await draco3d.createDecoderModule(), "meshopt.decoder": MeshoptDecoder });
  const doc = await io.read(file);
  const sceneBox = getBounds(doc.getRoot().listScenes()[0]);
  const size = Math.max(...sceneBox.max.map((v, i) => v - sceneBox.min[i]));
  const center = sceneBox.min.map((v, i) => (v + sceneBox.max[i]) / 2);
  const norm = (p) => p.map((v, i) => ((v - center[i]) / size) * 3.8);
  const re = new RegExp(pattern, "i");
  const N = Number(bucketsArg ?? 8);

  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh || !re.test(node.getName())) continue;
    const ws = node.getWorldMatrix();
    const mul = (m, v) => [
      m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12],
      m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13],
      m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14],
    ];
    const pts = [];
    for (const prim of mesh.listPrimitives()) {
      const pos = prim.getAttribute("POSITION");
      const stride = Math.max(1, Math.floor(pos.getCount() / 3000));
      const e = [0, 0, 0];
      for (let i = 0; i < pos.getCount(); i += stride) {
        pos.getElement(i, e);
        pts.push(norm(mul(ws, e)));
      }
    }
    const ys = pts.map((p) => p[1]);
    const lo = Math.min(...ys);
    const hi = Math.max(...ys);
    console.log(`== ${node.getName()}  y ${lo.toFixed(2)} -> ${hi.toFixed(2)}  (${pts.length} samples)`);
    for (let b = 0; b < N; b++) {
      const a = lo + ((hi - lo) * b) / N;
      const c = lo + ((hi - lo) * (b + 1)) / N;
      const bucket = pts.filter((p) => p[1] >= a && (b === N - 1 ? p[1] <= c : p[1] < c));
      if (bucket.length === 0) continue;
      const m = [0, 0, 0];
      for (const p of bucket) {
        m[0] += p[0];
        m[1] += p[1];
        m[2] += p[2];
      }
      console.log(`  [${m.map((v) => (v / bucket.length).toFixed(2)).join(", ")}]  n=${bucket.length}`);
    }
  }
}
