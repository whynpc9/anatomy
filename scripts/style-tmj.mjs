#!/usr/bin/env node

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/style-tmj.mjs <input.glb> <output.glb>");
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
  const boneMaterial = document
    .createMaterial("Bone context")
    .setBaseColorFactor([0.86, 0.81, 0.73, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.78);
  const discMaterial = document
    .createMaterial("Articular disc")
    .setBaseColorFactor([0.55, 0.72, 0.88, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.6);
  const capsuleMaterial = document
    .createMaterial("Joint capsule")
    .setBaseColorFactor([0.84, 0.78, 0.7, 0.38])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.82)
    .setAlphaMode("BLEND")
    .setDoubleSided(true);
  const ligamentMaterial = document
    .createMaterial("Lateral temporomandibular ligament")
    .setBaseColorFactor([0.78, 0.66, 0.46, 1])
    .setMetallicFactor(0)
    .setRoughnessFactor(0.72);

  for (const node of document.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;

    const name = node.getName();
    const material = /^(Mandible|Temporal_bone)/.test(name)
      ? boneMaterial
      : name.startsWith("Articular_disc")
        ? discMaterial
        : name.startsWith("Articular_capsule")
          ? capsuleMaterial
          : ligamentMaterial;

    for (const primitive of mesh.listPrimitives()) primitive.setMaterial(material);
  }

  await io.write(outputPath, document);
  console.log(`Styled TMJ model written to ${outputPath}`);
}
