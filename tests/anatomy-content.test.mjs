import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);
const dataUrl = new URL("../app/lib/anatomy-data.ts", import.meta.url);

async function readOrgans() {
  const source = await readFile(dataUrl, "utf8");
  const matches = [...source.matchAll(
    /\n  \{\n    id: "([^"]+)",([\s\S]*?)(?=\n  \{\n    id: "|\n\];)/g,
  )];

  return matches.map((match) => {
    const model = match[2].match(/\n    model: "([^"]+)",/)?.[1];
    const illustrated = match[2].match(/\n    illustrated: (true|false),/)?.[1];
    const hotspots = [...match[2].matchAll(/\{ id: "[^"]+", label: "([^"]+)"/g)]
      .map((hotspot) => hotspot[1]);

    assert.ok(model, `${match[1]} must register a model`);
    assert.ok(illustrated, `${match[1]} must declare illustration availability`);

    return {
      id: match[1],
      model,
      illustrated: illustrated === "true",
      hotspots,
    };
  });
}

async function assertNonEmpty(relativePath) {
  const file = await stat(new URL(relativePath, projectRoot));
  assert.ok(file.isFile(), `${relativePath} must be a file`);
  assert.ok(file.size > 1_000, `${relativePath} must not be empty`);
}

test("registers the complete 50-item anatomy collection", async () => {
  const organs = await readOrgans();
  assert.equal(organs.length, 50);
  assert.equal(new Set(organs.map(({ id }) => id)).size, organs.length);
  assert.deepEqual(
    organs.filter(({ illustrated }) => !illustrated).map(({ id }) => id).sort(),
    ["ovary", "prostate", "testis-epididymis"],
  );
});

test("every anatomy item has its registered model and artwork", async () => {
  const organs = await readOrgans();

  await Promise.all(organs.flatMap(({ id, model, illustrated }) => {
    assert.match(model, /^\/models\/[a-z0-9-]+\.glb$/);
    const files = [assertNonEmpty(`public${model}`)];

    if (illustrated) {
      files.push(
        assertNonEmpty(`public/anatomy/${id}/organ.webp`),
        assertNonEmpty(`public/anatomy/${id}/thumb.webp`),
      );
    }

    return files;
  }));
});

test("keeps the upstream starter models active beside HuBMAP comparison assets", async () => {
  const organs = await readOrgans();
  const byId = new Map(organs.map((organ) => [organ.id, organ]));
  const preserved = ["heart", "brain", "lungs", "liver", "kidneys", "eyeball", "pancreas"];

  await Promise.all(preserved.flatMap((id) => {
    assert.equal(byId.get(id)?.model, `/models/${id}.glb`);
    return [
      assertNonEmpty(`public/models/${id}.glb`),
      assertNonEmpty(`public/models/${id}-hubmap.glb`),
    ];
  }));
});

test("documents model provenance and license boundaries", async () => {
  const sources = await readFile(new URL("../docs/model-sources.md", import.meta.url), "utf8");

  assert.match(sources, /HuBMAP CCF 3D Reference Object Library/);
  assert.match(sources, /BodyParts3D/);
  assert.match(sources, /CC BY 4\.0/);
  assert.match(sources, /fallopian-tubes\.glb/);
  assert.match(sources, /blood-vessels\.glb/);
  assert.match(sources, /small-intestine\.glb/);
  assert.match(sources, /large-intestine\.glb/);
  assert.match(sources, /pelvis\.glb/);
  assert.match(sources, /knee-joint\.glb/);
  assert.match(sources, /Open3DModel \/ AnatomyTOOL/);
  assert.match(sources, /Z-Anatomy/);
  assert.match(sources, /v1\.4/);
  assert.match(sources, /heart-hubmap\.glb/);
  assert.match(sources, /testis-epididymis/);
  assert.match(sources, /原项目资产/);
});

test("keeps the audited high-detail structures covered by hotspots", async () => {
  const organs = await readOrgans();
  const byId = new Map(organs.map((organ) => [organ.id, organ]));
  const required = {
    "large-intestine": ["结肠肝曲", "结肠脾曲", "盲肠", "回盲瓣"],
    pelvis: ["坐骨", "髋臼"],
    "knee-joint": ["关节软骨", "交叉韧带附着区"],
    prostate: ["外周带", "移行带", "中央带", "射精管"],
    "lymph-node": ["输入淋巴管", "副皮质区", "淋巴结血管"],
    "blood-vessels": ["冠状循环", "肺循环血管", "肝门静脉系统", "肾血管", "肠系膜血管"],
    placenta: ["基底板", "脐血管"],
    larynx: ["甲状软骨", "环状软骨", "会厌软骨"],
    "main-bronchus": ["右主支气管", "左主支气管"],
    "mammary-glands": ["左侧乳腺叶", "右侧输乳管"],
    "palatine-tonsils": ["左腭扁桃体", "右腭扁桃体"],
    skeleton: ["颅骨", "脊柱", "骨盆"],
    "shoulder-joint": ["肱骨头", "关节盂", "盂唇"],
    "elbow-joint": ["桡骨头", "桡骨环状韧带"],
    "hip-joint": ["股骨头", "髋臼", "髋臼唇"],
    "ankle-foot": ["距骨", "跟骨", "足中部"],
    thyroid: ["右叶", "左叶", "峡部"],
    pituitary: ["腺垂体", "神经垂体"],
    parathyroids: ["右上甲状旁腺", "左下甲状旁腺"],
    "testis-epididymis": ["右睾丸", "左附睾"],
    "salivary-glands": ["右腮腺", "左下颌下腺", "右舌下腺"],
    pharynx: ["鼻咽", "口咽", "喉咽"],
  };

  for (const [id, labels] of Object.entries(required)) {
    const organ = byId.get(id);
    assert.ok(organ, `${id} must exist`);
    labels.forEach((label) => assert.ok(organ.hotspots.includes(label), `${id} must include ${label}`));
  }
});
