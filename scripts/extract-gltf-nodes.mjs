#!/usr/bin/env node

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { prune } from "@gltf-transform/functions";
import draco3d from "draco3dgltf";

const args = process.argv.slice(2);
const listOnly = args[0] === "--list";
const inputPath = listOnly ? args[1] : args[0];
const outputPath = listOnly ? null : args[1];
const patterns = args.slice(listOnly ? 2 : 2);

if (!inputPath || (!listOnly && (!outputPath || patterns.length === 0))) {
  console.error(
    "Usage:\n" +
      "  node scripts/extract-gltf-nodes.mjs --list <input.glb> [pattern ...]\n" +
      "  node scripts/extract-gltf-nodes.mjs <input.glb> <output.glb> <pattern ...>",
  );
  process.exitCode = 1;
} else {
  const expressions = patterns.map((pattern) => new RegExp(pattern, "i"));
  const matches = (name) => expressions.length === 0 || expressions.some((expression) => expression.test(name));

  const io = new NodeIO()
    .registerExtensions(ALL_EXTENSIONS)
    .registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
      "draco3d.encoder": await draco3d.createEncoderModule(),
    });
  const document = await io.read(inputPath);
  const nodes = document.getRoot().listNodes();
  const selected = nodes.filter((node) => node.getMesh() && matches(node.getName()));

  if (listOnly) {
    for (const node of selected) {
      console.log(node.getName());
    }
  } else if (selected.length === 0) {
    console.error(`No mesh nodes matched: ${patterns.join(", ")}`);
    process.exitCode = 2;
  } else {
    const selectedSet = new Set(selected);
    for (const node of nodes) {
      if (node.getMesh() && !selectedSet.has(node)) node.setMesh(null);
    }

    await document.transform(prune());
    await io.write(outputPath, document);
    console.log(`Extracted ${selected.length} mesh nodes into ${outputPath}:`);
    for (const node of selected) console.log(`- ${node.getName()}`);
  }
}
