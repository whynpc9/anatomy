#!/usr/bin/env node

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { getBounds } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const FIT_SIZE = 3.8;
const inputPaths = process.argv.slice(2);

if (inputPaths.length === 0) {
  console.error("Usage: node scripts/inspect-glb.mjs <model.glb> [...]");
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

  for (const inputPath of inputPaths) {
    const document = await io.read(inputPath);
    const scene = document.getRoot().getDefaultScene() ?? document.getRoot().listScenes()[0];
    if (!scene) throw new Error(`Model has no scene: ${inputPath}`);

    const sourceBox = getBounds(scene);
    const sourceSize = sourceBox.max.map((value, index) => value - sourceBox.min[index]);
    const sourceCenter = sourceBox.max.map((value, index) => (value + sourceBox.min[index]) / 2);
    const scale = FIT_SIZE / Math.max(...sourceSize);
    const round = (value) => Number(value.toFixed(3));

    const nodes = document
      .getRoot()
      .listNodes()
      .filter((node) => node.getMesh())
      .map((node) => {
        const box = getBounds(node);
        const center = box.max.map((value, index) => ((value + box.min[index]) / 2 - sourceCenter[index]) * scale);
        const size = box.max.map((value, index) => (value - box.min[index]) * scale);
        return {
          name: node.getName() || "(unnamed)",
          center: center.map(round),
          size: size.map(round),
        };
      });

    console.log(JSON.stringify({ file: inputPath, nodes }, null, 2));
  }
}
