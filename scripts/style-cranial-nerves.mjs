#!/usr/bin/env node

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/style-cranial-nerves.mjs <input.glb> <output.glb>");
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
  const contextMaterial = document
    .createMaterial("Cerebral white matter context")
    .setBaseColorFactor([0.78, 0.56, 0.54, 0.22])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.82)
    .setAlphaMode("BLEND")
    .setDoubleSided(true);
  const brainstemMaterial = document
    .createMaterial("Brainstem context")
    .setBaseColorFactor([0.76, 0.48, 0.43, 0.78])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.78)
    .setAlphaMode("BLEND")
    .setDoubleSided(true);
  const nerveMaterial = document
    .createMaterial("Cranial nerves")
    .setBaseColorFactor([0.91, 0.67, 0.2, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.68);

  for (const node of document.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;

    const name = node.getName();
    const material = name.startsWith("White_matter_of_telencephalon")
      ? contextMaterial
      : /^(Midbrain|Pons|Medulla_oblongata)/.test(name)
        ? brainstemMaterial
        : nerveMaterial;

    for (const primitive of mesh.listPrimitives()) primitive.setMaterial(material);
  }

  await io.write(outputPath, document);
  console.log(`Styled cranial nerves model written to ${outputPath}`);
}
