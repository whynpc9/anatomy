#!/usr/bin/env node

import { readFile, writeFile } from "node:fs/promises";
import { Mesh, MeshStandardMaterial } from "three";
import { GLTFExporter } from "three/addons/exporters/GLTFExporter.js";
import { STLLoader } from "three/addons/loaders/STLLoader.js";

class NodeFileReader {
  result = null;
  onloadend = null;

  readAsArrayBuffer(blob) {
    void blob.arrayBuffer().then((result) => {
      this.result = result;
      queueMicrotask(() => this.onloadend?.());
    });
  }
}

globalThis.FileReader ??= NodeFileReader;

const [inputPath, outputPath, meshName = "anatomical-structure"] = process.argv.slice(2);

if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/convert-stl-to-glb.mjs <input.stl> <output.glb> [mesh-name]");
  process.exitCode = 1;
} else {
  const source = await readFile(inputPath);
  const data = source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const geometry = new STLLoader().parse(data);
  // BodyParts3D polygon exports are Z-up; the viewer and glTF convention are Y-up.
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();
  const mesh = new Mesh(
    geometry,
    new MeshStandardMaterial({ color: 0xc98696, roughness: 0.68, metalness: 0 }),
  );
  mesh.name = meshName;

  const glb = await new GLTFExporter().parseAsync(mesh, { binary: true, onlyVisible: false });
  await writeFile(outputPath, Buffer.from(glb));
  console.log(`Converted ${inputPath} to ${outputPath}`);
}
