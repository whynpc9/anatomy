import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";
import { organs } from "../app/lib/anatomy-data.ts";

const projectRoot = new URL("../", import.meta.url);

function readOrgans() {
  return organs.map(({ id, model, illustrated, hotspots }) => ({
    id,
    model,
    illustrated,
    hotspots: hotspots.map((hotspot) => hotspot.label),
  }));
}

async function assertNonEmpty(relativePath) {
  const file = await stat(new URL(relativePath, projectRoot));
  assert.ok(file.isFile(), `${relativePath} must be a file`);
  assert.ok(file.size > 1_000, `${relativePath} must not be empty`);
}

test("registers the complete 71-item anatomy collection", async () => {
  const organs = await readOrgans();
  assert.equal(organs.length, 71);
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
  assert.match(sources, /muscular-system\.glb/);
  assert.match(sources, /rotator-cuff\.glb/);
  assert.match(sources, /brachial-plexus\.glb/);
  assert.match(sources, /brainstem-cerebellum\.glb/);
  assert.match(sources, /coronary-circulation\.glb/);
  assert.match(sources, /sciatic-nerve\.glb/);
  assert.match(sources, /cranial-nerves\.glb/);
  assert.match(sources, /pelvic-floor-perineum\.glb/);
  assert.match(sources, /inguinal-canal\.glb/);
  assert.match(sources, /tmj\.glb/);
  assert.match(sources, /intervertebral-discs\.glb/);
  assert.match(sources, /3d-vh-f-trachea\.glb/);
  assert.match(sources, /median-nerve\.glb/);
  assert.match(sources, /ulnar-nerve\.glb/);
  assert.match(sources, /radial-nerve\.glb/);
  assert.match(sources, /typical-vertebrae\.glb/);
  assert.match(sources, /lymphatic-system\.glb/);
  assert.match(sources, /teeth\.glb/);
  assert.match(sources, /nose\.glb/);
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
    "muscular-system": ["胸锁乳突肌", "腹直肌", "股四头肌"],
    skull: ["额骨", "蝶骨", "下颌骨"],
    spine: ["寰椎与枢椎", "胸椎", "骶骨"],
    "hand-wrist": ["舟骨", "月骨", "头状骨"],
    "rotator-cuff": ["冈上肌", "冈下肌", "小圆肌", "肩胛下肌"],
    "brachial-plexus": ["C5–T1 神经根", "上、中、下干", "臂丛三束"],
    "brainstem-cerebellum": ["中脑", "脑桥", "延髓", "小脑蚓部", "小脑脚"],
    "coronary-circulation": ["左冠状动脉主干", "前降支", "回旋支", "右冠状动脉", "冠状窦"],
    "sciatic-nerve": ["梨状肌出口", "坐骨神经主干", "胫神经与腓总神经分叉", "胫神经", "腓总神经"],
    "cranial-nerves": ["I 嗅神经", "V 三叉神经", "VII 面神经", "X 迷走神经", "XII 舌下神经"],
    "pelvic-floor-perineum": ["髂尾肌", "耻骨直肠肌与耻骨尾骨肌", "肛门外括约肌", "阴部神经"],
    "inguinal-canal": ["腹股沟韧带", "腹股沟浅环", "髂耻束", "腔隙韧带", "输精管"],
    tmj: ["关节盘", "关节囊", "颞下颌韧带", "下颌头（髁突）", "颞骨关节面"],
    "intervertebral-discs": ["颈椎间盘（C5–C6）", "腰椎间盘（L4–L5）", "前纵韧带", "后纵韧带", "棘上韧带"],
    "median-nerve": ["内、外侧根", "腕管", "肘窝与旋前圆肌"],
    "ulnar-nerve": ["尺神经沟（肘管）", "腕尺管", "臂丛内侧束"],
    "radial-nerve": ["桡神经沟", "肱三头肌", "骨间后神经", "浅支（感觉支）"],
    "typical-vertebrae": ["颈椎横突孔（C4）", "胸椎肋凹（T7）", "腰椎椎体（L3）"],
    "lymphatic-system": ["腋淋巴结", "肠系膜淋巴结", "腹股沟浅淋巴结", "胸腺（右叶）", "脾"],
    teeth: ["上颌中切牙", "上颌尖牙", "上颌第一磨牙", "下颌第一磨牙"],
    nose: ["鼻骨", "鼻中隔软骨", "鼻外侧软骨", "下鼻甲"],
  };

  for (const [id, labels] of Object.entries(required)) {
    const organ = byId.get(id);
    assert.ok(organ, `${id} must exist`);
    labels.forEach((label) => assert.ok(organ.hotspots.includes(label), `${id} must include ${label}`));
  }
});
