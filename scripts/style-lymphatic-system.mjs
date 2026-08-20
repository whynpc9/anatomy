#!/usr/bin/env node

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/style-lymphatic-system.mjs <input.glb> <output.glb>");
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
  const nodeMaterial = document
    .createMaterial("Lymph node groups")
    .setBaseColorFactor([0.45, 0.62, 0.38, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.62);
  const spleenMaterial = document
    .createMaterial("Spleen")
    .setBaseColorFactor([0.69, 0.42, 0.47, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.58);
  const thymusMaterial = document
    .createMaterial("Thymus")
    .setBaseColorFactor([0.73, 0.54, 0.65, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.6);
  const tonsilMaterial = document
    .createMaterial("Palatine tonsils")
    .setBaseColorFactor([0.72, 0.5, 0.55, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.6);

  for (const node of document.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;

    const name = node.getName();
    const material = name === "Spleen"
      ? spleenMaterial
      : /lobe_of_thymus$/i.test(name)
        ? thymusMaterial
        : /^Palatine_tonsil/i.test(name)
          ? tonsilMaterial
          : nodeMaterial;

    for (const primitive of mesh.listPrimitives()) primitive.setMaterial(material);
  }

  await io.write(outputPath, document);
  console.log(`Styled lymphatic system model written to ${outputPath}`);
}
