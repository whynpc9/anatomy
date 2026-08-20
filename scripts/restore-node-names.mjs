#!/usr/bin/env node
// Restore node names blanked by gltf-transform's quantize()/meshopt() step
// (it clears names on nodes whose meshes are shared or re-quantized).
// The transform preserves mesh-node order, so names are restored by matching
// each unnamed mesh node to the reference node at the same sequence index,
// verified by equal vertex count.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [referencePath, targetPath, outputPath] = process.argv.slice(2);

if (!referencePath || !targetPath || !outputPath) {
  console.error("Usage: node scripts/restore-node-names.mjs <reference.glb> <target.glb> <output.glb>");
  process.exitCode = 1;
} else {
  await MeshoptEncoder.ready;
  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
      "meshopt.decoder": MeshoptDecoder,
      "meshopt.encoder": MeshoptEncoder,
    });

  const meshNodes = (doc) =>
    doc.getRoot().listNodes().filter((n) => n.getMesh()).map((node) => {
      let verts = 0;
      for (const prim of node.getMesh().listPrimitives()) verts += prim.getAttribute("POSITION")?.getCount() ?? 0;
      return { node, name: node.getName(), verts };
    });

  const reference = meshNodes(await io.read(referencePath));
  const targetDoc = await io.read(targetPath);
  const target = meshNodes(targetDoc);

  // quantize() appends re-quantized nodes at the end of the node list without
  // names. Match them to reference nodes whose names disappeared, preserving
  // sequence order on both sides, and verify by vertex count.
  const targetNames = new Set(target.filter((entry) => entry.name).map((entry) => entry.name));
  const missing = reference.filter((entry) => entry.name && !targetNames.has(entry.name));
  const blanks = target.filter((entry) => !entry.name);

  let restored = 0;
  const problems = [];
  if (missing.length !== blanks.length) {
    problems.push(`unnamed target nodes (${blanks.length}) do not match disappeared reference names (${missing.length})`);
  } else {
    for (let i = 0; i < blanks.length; i++) {
      // weld/quantize can collapse duplicated vertices, so the compressed
      // node may have fewer vertices than the reference, but never more.
      if (blanks[i].verts > missing[i].verts) {
        problems.push(`position ${i}: reference "${missing[i].name}" verts=${missing[i].verts} < target verts=${blanks[i].verts}`);
        continue;
      }
      blanks[i].node.setName(missing[i].name);
      console.log(`${missing[i].name} <- restored (ref verts=${missing[i].verts}, compressed verts=${blanks[i].verts})`);
      restored++;
    }
  }

  if (problems.length > 0) {
    for (const problem of problems) console.error(`PROBLEM: ${problem}`);
    process.exitCode = 2;
  } else {
    await io.write(outputPath, targetDoc);
    console.log(`Restored ${restored} node names -> ${outputPath}`);
  }
}
