export type OrganId =
  | "heart"
  | "brain"
  | "lungs"
  | "liver"
  | "kidneys"
  | "eyeball"
  | "intestine"
  | "pancreas"
  | "skin";

export type Hotspot = {
  id: string;
  label: string;
  detail: string;
  position: [number, number, number];
  color: string;
};

export type Organ = {
  id: OrganId;
  name: string;
  scientificName: string;
  system: string;
  model: string;
  icon: string;
  accent: string;
  description: string;
  poetic: string;
  size: string;
  weight: string;
  location: string;
  function: string;
  dailyFact: string;
  medical: string;
  bloodSupply: string;
  /** A single memorable line, surfaced as the "Did you know" note. */
  funFact: string;
  hotspots: Hotspot[];
  /** Whether `/anatomy/<id>/*.webp` illustrations exist. Organs without them
   *  fall back to the accent glyph rather than a broken image. */
  illustrated: boolean;
};

export const organs: Organ[] = [
  {
    id: "heart",
    name: "心脏",
    scientificName: "Cor",
    system: "心血管系统",
    model: "/models/heart.glb",
    icon: "♥",
    accent: "#ee7c6a",
    description: "一个肌性器官，推动血液流遍全身，为每个细胞输送氧气和营养。",
    poetic: "不知疲倦的泵",
    size: "约等于你自己的拳头",
    weight: "250–350 克",
    location: "胸骨后方，略偏左",
    function: "推动含氧血液循环",
    dailyFact: "每天跳动约 10 万次",
    medical: "它的电节律协调着每一次心跳。",
    bloodSupply: "左、右冠状动脉",
    funFact: "人的一生中它约跳动 25 亿次，而且在出生之前就已经开始跳动。",
    illustrated: true,
    hotspots: [
      { id: "aorta", label: "主动脉", detail: "全身最大的动脉", position: [-0.35, 1.65, 0.55], color: "#ee7c6a" },
      { id: "left-atrium", label: "左心房", detail: "接收含氧血液", position: [0.82, 0.65, 0.5], color: "#f2a33b" },
      { id: "right-atrium", label: "右心房", detail: "接收静脉血", position: [-0.9, 0.35, 0.55], color: "#6393d8" },
      { id: "left-ventricle", label: "左心室", detail: "将血液泵向全身", position: [0.7, -0.75, 0.65], color: "#f2a33b" },
      { id: "right-ventricle", label: "右心室", detail: "将血液泵向肺部", position: [-0.65, -0.68, 0.66], color: "#ee7c6a" },
      { id: "mitral", label: "二尖瓣", detail: "防止血液回流", position: [0.18, -1.35, 0.48], color: "#d89bc4" },
    ],
  },
  {
    id: "brain",
    name: "大脑",
    scientificName: "Encephalon",
    system: "神经系统",
    model: "/models/brain.glb",
    icon: "◉",
    accent: "#c58696",
    description: "人体的指挥中心，整合感觉、记忆、情绪与精确的运动。",
    poetic: "内在宇宙",
    size: "约等于两只紧握的拳头",
    weight: "1.3–1.4 千克",
    location: "受颅骨保护",
    function: "处理并协调信号",
    dailyFact: "消耗全身约 20% 的能量",
    medical: "数十亿神经元通过电信号与化学信号相互通信。",
    bloodSupply: "颈内动脉与椎动脉",
    funFact: "大脑本身没有痛觉感受器——头痛其实来自它周围的组织。",
    illustrated: true,
    hotspots: [
      { id: "frontal", label: "额叶", detail: "计划与运动", position: [-0.7, 0.65, 0.8], color: "#ee7c6a" },
      { id: "parietal", label: "顶叶", detail: "感觉整合", position: [0.15, 1.1, 0.65], color: "#f2a33b" },
      { id: "temporal", label: "颞叶", detail: "记忆与听觉", position: [0.75, -0.1, 0.82], color: "#6393d8" },
      { id: "cerebellum", label: "小脑", detail: "平衡与协调", position: [0.72, -0.9, 0.55], color: "#d89bc4" },
    ],
  },
  {
    id: "lungs",
    name: "肺",
    scientificName: "Pulmones",
    system: "呼吸系统",
    model: "/models/lungs.glb",
    icon: "◍",
    accent: "#dd8f8b",
    description: "成对的器官，吸入空气，在广阔而脆弱的表面上以氧气交换二氧化碳。",
    poetic: "生命的气息",
    size: "每侧约 25 厘米高",
    weight: "双肺共约 1 千克",
    location: "心脏两侧，胸腔之内",
    function: "以氧气交换二氧化碳",
    dailyFact: "每天通气约 11,000 升",
    medical: "肺泡把相当于一个网球场大小的交换表面折叠进胸腔。",
    bloodSupply: "肺动脉与支气管动脉",
    funFact: "右肺有三叶，左肺只有两叶——为心脏留出了位置。",
    illustrated: true,
    hotspots: [
      { id: "trachea", label: "气管", detail: "将空气输送入肺", position: [0, 1.6, 0.2], color: "#6393d8" },
      { id: "right-lung", label: "右肺", detail: "分为三叶", position: [-1.2, 0.1, 0.7], color: "#ee7c6a" },
      { id: "left-lung", label: "左肺", detail: "两叶，为心脏留出空间", position: [1.2, 0.1, 0.7], color: "#f2a33b" },
      { id: "bronchus", label: "支气管", detail: "分支状气道", position: [-0.03, 0.3, 0.35], color: "#d89bc4" },
      { id: "base", label: "肺底", detail: "坐落在膈肌上", position: [-1.14, -1.2, 1], color: "#7fa88a" },
    ],
  },
  {
    id: "liver",
    name: "肝脏",
    scientificName: "Hepar",
    system: "消化系统",
    model: "/models/liver.glb",
    icon: "≈",
    accent: "#b86858",
    description: "卓越的代谢器官，过滤血液、处理营养物质并生成胆汁。",
    poetic: "沉默的炼金术士",
    size: "约一个橄榄球大小",
    weight: "1.4–1.6 千克",
    location: "右上腹",
    function: "代谢、解毒与分泌胆汁",
    dailyFact: "执行 500 多种功能",
    medical: "失去大量组织后仍能再生。",
    bloodSupply: "肝动脉与门静脉",
    funFact: "它是唯一能从一小部分组织再生回完整大小的人体器官。",
    illustrated: true,
    hotspots: [
      { id: "right-lobe", label: "右叶", detail: "最大的肝叶", position: [-0.75, 0.35, 0.75], color: "#ee7c6a" },
      { id: "left-lobe", label: "左叶", detail: "跨越中线", position: [0.85, 0.25, 0.75], color: "#f2a33b" },
      { id: "portal", label: "门静脉", detail: "富含营养的入肝血流", position: [0.1, -0.3, 0.82], color: "#6393d8" },
    ],
  },
  {
    id: "kidneys",
    name: "肾脏",
    scientificName: "Renes",
    system: "泌尿系统",
    model: "/models/kidneys.glb",
    icon: "∞",
    accent: "#c96963",
    description: "成对的过滤器官，维持体液、电解质与血压的平衡，并清除代谢废物。",
    poetic: "大师级过滤器",
    size: "每个约一只鼠标大小",
    weight: "每个 120–170 克",
    location: "脊柱两侧、肋骨下方",
    function: "过滤血液并生成尿液",
    dailyFact: "每天过滤约 180 升液体",
    medical: "肾单位精细调节血液的化学成分。",
    bloodSupply: "肾动脉",
    funFact: "过滤出的物质几乎都会被重吸收——最终只有约 1–2 升以尿液排出体外。",
    illustrated: true,
    hotspots: [
      { id: "cortex", label: "肾皮质", detail: "外层过滤结构", position: [-0.9, 0.55, 0.7], color: "#ee7c6a" },
      { id: "medulla", label: "肾髓质", detail: "浓缩尿液", position: [0.85, 0.2, 0.7], color: "#f2a33b" },
      { id: "ureter", label: "输尿管", detail: "输送尿液", position: [0.4, -1.1, 0.5], color: "#6393d8" },
    ],
  },
  {
    id: "eyeball",
    name: "眼",
    scientificName: "Oculus",
    system: "感觉系统",
    model: "/models/eyeball.glb",
    icon: "⊙",
    accent: "#7294b9",
    description: "精密的感觉器官，将聚焦的光线转化为神经信号，被大脑解读为视觉。",
    poetic: "一扇由光构成的窗",
    size: "直径约 24 毫米",
    weight: "约 7.5 克",
    location: "骨性眼眶之内",
    function: "捕捉并聚焦光线",
    dailyFact: "每天进行数千次微小运动",
    medical: "视网膜是中枢神经系统的延伸。",
    bloodSupply: "眼动脉",
    funFact: "角膜完全不含血管，直接从空气中获取氧气。",
    illustrated: true,
    hotspots: [
      { id: "cornea", label: "角膜", detail: "透明的聚焦表面", position: [-0.94, 0.05, 1.47], color: "#6393d8" },
      { id: "iris", label: "虹膜", detail: "控制进光量", position: [-1.22, -0.53, 1.15], color: "#f2a33b" },
      { id: "optic", label: "视神经", detail: "传递视觉信号", position: [1.61, -0.18, 0.54], color: "#d89bc4" },
    ],
  },
  {
    id: "intestine",
    name: "肠道",
    scientificName: "Intestinum",
    system: "消化系统",
    model: "/models/intestine.glb",
    icon: "§",
    accent: "#d78b77",
    description: "曲折盘绕的消化管道，营养在此吸收，肠道菌群支持着全身健康。",
    poetic: "内在花园",
    size: "完全展开约 6–7 米",
    weight: "随内容物而变化",
    location: "腹部中下部",
    function: "消化与营养吸收",
    dailyFact: "栖息着数万亿微生物",
    medical: "它的表面积被皱襞、绒毛和微绒毛逐级放大。",
    bloodSupply: "肠系膜上、下动脉",
    funFact: "肠内壁每隔几天就自我更新一次——是全身更新最快的组织。",
    illustrated: true,
    hotspots: [
      { id: "duodenum", label: "十二指肠", detail: "小肠的第一段", position: [0.6, 0.8, 0.75], color: "#f2a33b" },
      { id: "jejunum", label: "空肠", detail: "主要的吸收区域", position: [-0.45, 0.1, 0.82], color: "#ee7c6a" },
      { id: "colon", label: "结肠", detail: "重吸收水分", position: [0.75, -0.55, 0.72], color: "#6393d8" },
    ],
  },
  {
    id: "pancreas",
    name: "胰腺",
    scientificName: "Pancreas",
    system: "内分泌系统",
    model: "/models/pancreas.glb",
    icon: "◈",
    accent: "#c69a5e",
    description: "一腺两用：向肠道释放消化酶，同时分泌稳定血糖的激素。",
    poetic: "安静的调节者",
    size: "长约 15 厘米",
    weight: "70–100 克",
    location: "胃的后方，横过上腹部",
    function: "分泌消化酶与胰岛素",
    dailyFact: "每天产生约 1.5 升富含酶的胰液",
    medical: "胰岛释放胰岛素和胰高血糖素，维持血糖平衡。",
    bloodSupply: "脾动脉与胰十二指肠动脉",
    funFact: "只有约 2% 的组织负责分泌激素，其余都用于制造消化酶。",
    illustrated: true,
    hotspots: [
      { id: "head", label: "胰头", detail: "被十二指肠环抱", position: [-1.32, -0.36, 0.55], color: "#ee7c6a" },
      { id: "body", label: "胰体", detail: "横跨脊柱", position: [0.05, 0.25, 0.45], color: "#f2a33b" },
      { id: "tail", label: "胰尾", detail: "延伸至脾脏", position: [1.55, 0.3, 0.35], color: "#6393d8" },
      { id: "duct", label: "胰管", detail: "将消化酶排入肠道", position: [-0.61, 0.39, 0.5], color: "#d89bc4" },
    ],
  },
  {
    id: "skin",
    name: "皮肤",
    scientificName: "Integumentum",
    system: "体被系统",
    model: "/models/skin.glb",
    icon: "▦",
    accent: "#c99277",
    description: "人体最大的器官——一道活的屏障，感知触觉、锁住水分并调节体温。",
    poetic: "活的边界",
    size: "摊平约 2 平方米",
    weight: "3.5–5 千克",
    location: "覆盖全身",
    function: "保护、感知与散热",
    dailyFact: "每天脱落约 5 亿个细胞",
    medical: "表皮、真皮、皮下组织三层各有分工。",
    bloodSupply: "真皮血管丛",
    funFact: "一平方厘米的皮肤可容纳数百个汗腺和数米长的血管。",
    illustrated: true,
    hotspots: [
      { id: "epidermis", label: "表皮", detail: "外部的保护层", position: [-0.05, 0.88, 1.4], color: "#ee7c6a" },
      { id: "dermis", label: "真皮", detail: "神经、血管与腺体所在", position: [0.29, 0.05, 1.4], color: "#f2a33b" },
      { id: "hypodermis", label: "皮下组织", detail: "脂肪与保温层", position: [-0.39, -1.15, 1.4], color: "#6393d8" },
      { id: "follicle", label: "毛囊", detail: "固定每根毛发", position: [0.89, -0.44, 1.4], color: "#d89bc4" },
    ],
  },
];

export const organById = Object.fromEntries(organs.map((organ) => [organ.id, organ])) as Record<OrganId, Organ>;
