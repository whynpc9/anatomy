#!/usr/bin/env node
// Print per-node vertex counts and world bounds, optionally filtered by a name regex.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { getBounds } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder } from "meshoptimizer";

const [, , file, pattern] = process.argv;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "draco3d.decoder": await draco3d.createDecoderModule(), "meshopt.decoder": MeshoptDecoder });
const doc = await io.read(file);
const re = pattern ? new RegExp(pattern, "i") : null;
for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh();
  if (!mesh) continue;
  const name = node.getName();
  if (re && !re.test(name)) continue;
  let verts = 0, tris = 0;
  for (const prim of mesh.listPrimitives()) {
    verts += prim.getAttribute("POSITION")?.getCount() ?? 0;
    tris += (prim.getIndices()?.getCount() ?? 0) / 3;
  }
  const b = getBounds(node);
  const f = (v) => v.map((x) => x.toFixed(2)).join(",");
  console.log(`${name}\tverts=${verts}\ttris=${tris}\tmin=[${f(b.min)}]\tmax=[${f(b.max)}]`);
}
