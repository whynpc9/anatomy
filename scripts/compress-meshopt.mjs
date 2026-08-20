#!/usr/bin/env node
// Meshopt-compress a GLB via the gltf-transform API. Unlike the CLI's
// `meshopt` command this preserves node names (the CLI silently blanks
// some of them, e.g. VH_F_trachea, Spleen).
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { meshopt } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";
import { MeshoptDecoder, MeshoptEncoder } from "meshoptimizer";

const [inputPath, outputPath] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/compress-meshopt.mjs <input.glb> <output.glb>");
  process.exitCode = 1;
} else {
  await MeshoptDecoder.ready;
  await MeshoptEncoder.ready;

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
      "meshopt.decoder": MeshoptDecoder,
      "meshopt.encoder": MeshoptEncoder,
    });
  const document = await io.read(inputPath);
  await document.transform(meshopt({ encoder: MeshoptEncoder, level: "medium" }));
  await io.write(outputPath, document);
  console.log(`Meshopt-compressed ${inputPath} -> ${outputPath}`);
}
