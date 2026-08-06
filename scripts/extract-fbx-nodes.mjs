#!/usr/bin/env node

import { dirname } from "node:path";
import { readFile, writeFile } from "node:fs/promises";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";

class NodeFileReader {
  result = null;
  onloadend = null;

  readAsArrayBuffer(blob) {
    void blob.arrayBuffer().then((result) => {
      this.result = result;
      queueMicrotask(() => this.onloadend?.());
    });
  }

  readAsDataURL(blob) {
    void blob.arrayBuffer().then((result) => {
      this.result = `data:${blob.type};base64,${Buffer.from(result).toString("base64")}`;
      queueMicrotask(() => this.onloadend?.());
    });
  }
}

globalThis.FileReader ??= NodeFileReader;

const args = process.argv.slice(2);
const listOnly = args[0] === "--list";
const inputPath = listOnly ? args[1] : args[0];
const outputPath = listOnly ? null : args[1];
const patterns = args.slice(2);

if (!inputPath || (!listOnly && (!outputPath || patterns.length === 0))) {
  console.error(
    "Usage:\n" +
      "  node scripts/extract-fbx-nodes.mjs --list <input.fbx> [pattern ...]\n" +
      "  node scripts/extract-fbx-nodes.mjs <input.fbx> <output.glb> <pattern ...>",
  );
  process.exitCode = 1;
} else {
  const expressions = patterns.map((pattern) => new RegExp(pattern, "i"));
  const matches = (name) => expressions.length === 0 || expressions.some((expression) => expression.test(name));
  const source = await readFile(inputPath);
  const data = source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const scene = new FBXLoader().parse(data, `${dirname(inputPath)}/`);
  const meshNodes = [];
  scene.traverse((node) => {
    if (node.isMesh) meshNodes.push(node);
  });
  const selected = meshNodes.filter((node) => matches(node.name));

  if (listOnly) {
    for (const node of selected) console.log(node.name);
  } else if (selected.length === 0) {
    console.error(`No mesh nodes matched: ${patterns.join(", ")}`);
    process.exitCode = 2;
  } else {
    const selectedSet = new Set(selected);
    for (const node of meshNodes) {
      if (!selectedSet.has(node)) node.removeFromParent();
    }
    scene.updateMatrixWorld(true);

    const glb = await new GLTFExporter().parseAsync(scene, {
      binary: true,
      onlyVisible: false,
    });
    await writeFile(outputPath, Buffer.from(glb));
    console.log(`Extracted ${selected.length} mesh nodes into ${outputPath}:`);
    for (const node of selected) console.log(`- ${node.name}`);
  }
}
