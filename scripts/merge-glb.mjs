#!/usr/bin/env node

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { dedup, mergeDocuments, unpartition } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [outputPath, ...inputPaths] = process.argv.slice(2);

if (!outputPath || inputPaths.length < 2) {
  console.error("Usage: node scripts/merge-glb.mjs <output.glb> <input-a.glb> <input-b.glb> [...]");
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

  const target = await io.read(inputPaths[0]);
  for (const inputPath of inputPaths.slice(1)) {
    mergeDocuments(target, await io.read(inputPath));
  }

  const root = target.getRoot();
  const scenes = root.listScenes();
  const mainScene = scenes[0];
  for (const scene of scenes.slice(1)) {
    for (const node of scene.listChildren()) mainScene.addChild(node);
    scene.dispose();
  }
  root.setDefaultScene(mainScene);

  await target.transform(dedup(), unpartition());
  await io.write(outputPath, target);
  console.log(`Merged ${inputPaths.length} files into ${outputPath}`);
}
