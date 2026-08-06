#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { Scene } from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/addons/libs/meshopt_decoder.module.js";

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

const [outputPath, ...inputPaths] = process.argv.slice(2);

if (!outputPath || inputPaths.length < 2) {
  console.error("Usage: node scripts/merge-glb.mjs <output.glb> <input-a.glb> <input-b.glb> [...]");
  process.exitCode = 1;
} else {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const outputScene = new Scene();

  for (const inputPath of inputPaths) {
    const source = await readFile(inputPath);
    const data = source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    const gltf = await loader.parseAsync(data, "");
    outputScene.add(gltf.scene);
  }

  const exporter = new GLTFExporter();
  const glb = await exporter.parseAsync(outputScene, {
    binary: true,
    onlyVisible: false,
  });
  await writeFile(outputPath, Buffer.from(glb));
  console.log(`Merged ${inputPaths.length} files into ${outputPath}`);
}
