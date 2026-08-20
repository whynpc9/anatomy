#!/usr/bin/env node

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/style-teeth.mjs <input.glb> <output.glb>");
  process.exitCode = 1;
} else {
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
  const enamelMaterial = document
    .createMaterial("Enamel")
    .setBaseColorFactor([0.93, 0.91, 0.86, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.35);

  for (const node of document.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;
    for (const primitive of mesh.listPrimitives()) primitive.setMaterial(enamelMaterial);
  }

  await io.write(outputPath, document);
  console.log(`Styled teeth model written to ${outputPath}`);
}
