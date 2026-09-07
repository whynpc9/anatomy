# 3D 模型来源与选型

本项目的定位是大众科普型 3D 器官图鉴，不是诊断、手术规划或医学院精细图谱。
模型是否可下载、是否适合网页展示、是否足够准确、是否允许再分发，是四个不同问题；
新增或替换模型时必须逐项记录来源文件、版本、许可证和加工方式。

## 推荐顺序

| 优先级 | 数据源 | 优点 | 局限 | 许可证边界 |
| --- | --- | --- | --- | --- |
| 1 | [HuBMAP CCF 3D Reference Object Library](https://hubmapconsortium.github.io/ccf/pages/ccf-3d-reference-library.html) | 医学插画师制作、器官专家确认、原生 GLB、子结构命名较完整 | 器官覆盖有限，部分对象区分性别与左右侧 | CC BY 4.0，必须署名 |
| 2 | [Open3DModel / AnatomyTOOL](https://anatomytool.org/open3dmodel-create) | 解剖学团队维护，提供带材质 GLB，适合骨骼、四肢和盆底扩展 | 仍在持续建设，当前不是完整内脏库 | CC BY-SA；衍生模型需要相同许可证 |
| 3 | [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html) | 覆盖广、使用 FMA 编号、可批量下载 OBJ | 许多单器官网格较简略，无纹理，需转换、定向和减面 | 官方许可自 2025-02-27 起为 CC BY 4.0，必须使用指定署名 |
| 4 | [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy) | 结构数多，适合研究器官关系与继续拆分 | Blender 源工程较重，单器官抽取和网页优化成本高，混合来源需逐项核对 | CC BY-SA 4.0；部分引用资产另有更严格条款 |
| 5 | [NIH 3D](https://3d.nih.gov/) | 生物医学模型丰富，部分来自影像分割或专家团队 | 质量、用途和许可证按条目变化，不能把平台整体视为统一开放许可 | 每个模型单独核对许可证和署名 |

当前补充模型的首选是 HuBMAP。BodyParts3D 适合补覆盖面，不适合在没有进一步
细化、材质和医学复核时冒充高精度模型。Open3DModel 更适合下一阶段补骨骼、关节、
肌肉与盆底；Z-Anatomy 和 NIH 3D 只应按具体对象引入，不应整库混用。

## 当前仓库的模型来源

### HuBMAP CCF 3D Reference Object Library v1.2–v1.4

许可：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。原始对象由
Kristen Browne 制作，HuBMAP CCF 团队发布。项目内模型保留原有子结构名称；成对
结构在不改变相对坐标的前提下合并为一个 GLB。

- `spleen.glb`、`gallbladder.glb`、`bladder.glb`
- `thymus.glb`、`spinal-cord.glb`
- `uterus.glb`、`ovary.glb`、`prostate.glb`
- `ureter.glb`：男性左右侧对象合并
- `fallopian-tubes.glb`：`VH_F_Fallopian_Tube_L.glb` 与
  `VH_F_Fallopian_Tube_R.glb` 合并
- `lymph-node.glb`：`NIH_F_Lymph_Node.glb`
- `blood-vessels.glb`：`VH_F_Blood_Vasculature.glb`
- `placenta.glb`：`VH_F_Placenta.glb`
- `urethra.glb`：`VH_M_Urethra.glb`，页面明确标为男性参考
- `small-intestine.glb`：`VH_F_Small_Intestine.glb`，女性参考
- `large-intestine.glb`：`SBU_F_Intestine_Large.glb`，女性参考
- `pelvis.glb`：`VH_F_Pelvis.glb`，女性骨盆参考
- `knee-joint.glb`：`VH_F_Knee_L.glb`，女性左膝参考
- `brainstem-cerebellum.glb`：从 `brain-hubmap.glb` 提取双侧小脑半球、蚓部、
  深部核团、小脑脚，以及中脑、脑桥和延髓结构
- `coronary-circulation.glb`：从 `blood-vessels.glb` 提取左右冠状动脉、前降支、
  回旋支、缘支和主要心静脉，再与同坐标系的 `heart-hubmap.glb` 合并；女性参考

下载目录：<https://github.com/hubmapconsortium/ccf-releases/tree/main/v1.2/models>

推荐引用：Browne, K., Schlehlein, H., Herr II, B. W., Quardokus, E.,
Bueckle, A., Börner, K. (2022). *HuBMAP CCF 3D Reference Object Library*.

2026-08-06 又按“每个对象最新可用版本”新增了以下文件。HuBMAP 的 v1.4
目录只包含本版发生变化的对象，因此未在 v1.4 重发的对象继续取 v1.3。为保留上游
项目的原始模型，已有器官的 HuBMAP 版本使用 `-hubmap` 后缀作为对照资产，不覆盖
原文件名：

- v1.3：`brain-hubmap.glb`、`heart-hubmap.glb`、`liver-hubmap.glb`、
  `kidneys-hubmap.glb`、`pancreas-hubmap.glb`、`mammary-glands.glb`
- v1.4：`eyeball-hubmap.glb`（女性左眼参考）、
  `lungs-hubmap.glb`（女性参考）、
  `larynx.glb`、`main-bronchus.glb`、`palatine-tonsils.glb`

下载目录：
<https://github.com/hubmapconsortium/ccf-releases/tree/main/v1.3/models>、
<https://github.com/hubmapconsortium/ccf-releases/tree/main/v1.4/models>。
成对结构保留原始相对坐标后合并；网页文件使用 Meshopt 压缩，并保留子结构节点名称
用于热点复核。当前页面继续引用不带 `-hubmap` 后缀的上游心、脑、肺、肝、肾、眼
和胰腺模型；对照资产暂不进入器官列表。HuBMAP 的皮肤对象是全身表面壳层，不能
替代当前展示表皮、真皮和皮下组织的教学剖面，因此也没有覆盖 `skin.glb`。

2026-08-20 使用 v1.4 的 `3d-vh-f-trachea.glb`（女性参考）替换了 `trachea.glb`
原 BodyParts3D 版本。新文件保留 `VH_F_trachea`、`VH_F_tracheal_cartilage` 和
`VH_F_carina` 三个子结构节点，经 Meshopt 压缩；热点改为定位气管软骨环、膜性后壁
和气管杈，条目 ID 与归一化约定不变。压缩流程会丢弃外膜节点的名称，需按网格
对应关系补回 `VH_F_trachea` 节点名后再入库。

### Open3DModel / AnatomyTOOL

许可：CC BY-SA。2026-08-06 下载官方 GLB 选择模型，并从右侧上、下肢文件按节点名
提取关节结构：

- `skeleton.glb`：Overview skeleton
- `shoulder-joint.glb`：肱骨、肩胛骨、锁骨、关节唇、关节囊和主要韧带
- `elbow-joint.glb`：肱骨、桡尺骨、关节囊和主要副韧带
- `hip-joint.glb`：髋骨、股骨、髋臼唇、关节囊和主要韧带
- `ankle-foot.glb`：小腿远端、足骨与主要踝足韧带

2026-08-19 继续使用同一官方发布页增加 5 个条目，不覆盖已有模型：

- `skull.glb`：`overview-colored-skull.glb`，保留彩色分骨材质
- `spine.glb`：从已入库的 Overview skeleton 中提取 C1–C7、T1–T12、
  L1–L5、骶骨和尾骨
- `hand-wrist.glb`：官方 `hand.glb`，包含腕骨、掌指骨以及主要韧带、肌腱和肌群
- `rotator-cuff.glb`：从 `upper-limb.glb` 提取右侧肩胛骨、锁骨、肱骨以及
  冈上肌、冈下肌、小圆肌和肩胛下肌
- `brachial-plexus.glb`：从 `upper-limb.glb` 提取右侧 C5–T1 神经根、三干、
  前后股、三束和主要终末神经，并保留锁骨和肩胛骨作为空间参照

2026-08-19 又从官方的下肢、盆底和腹股沟区域模型提取 3 个条目：

- `sciatic-nerve.glb`：从 `lower-limb.glb` 提取右侧坐骨神经、胫神经、腓总神经、
  腓浅神经、腓深神经，并保留右侧髋骨、股骨、骶骨和梨状肌作为空间参照
- `pelvic-floor-perineum.glb`：从官方 `pelvicfloor.glb` 提取男性右侧提肛肌、
  尾骨肌、肛门外括约肌、会阴膜、阴部神经和阴部管，并保留半侧骨盆参照
- `inguinal-canal.glb`：从官方 `inguinal-ligament.glb` 提取男性右侧腹壁肌层、
  腹股沟韧带、浅环内外侧脚、髂耻束、腔隙韧带、耻骨梳韧带和输精管

来源：<https://anatomytool.org/open3dmodel-create>。原始 GLB 使用 Draco；仓库内通过
`scripts/extract-gltf-nodes.mjs` 按解剖节点提取，再转为当前查看器使用的 Meshopt。
本批次的区域页面分别为：
<https://anatomytool.org/content/open3danatomy-3d-model-pelvic-floor-and-perineum-english-labels>、
<https://anatomytool.org/content/open3danatomy-3d-model-inguinal-ligament-and-related-structures-english-labels>。

2026-08-20 继续从官方主题子模型增加 4 个条目，均保留右侧（`.r`）结构和官方
材质配色（神经橙黄、骨米白），仅做节点筛选和 Meshopt 转换：

- `median-nerve.glb`：正中神经及其内、外侧根与内、外侧束，保留肱骨、桡尺骨
  作为行程参照
- `ulnar-nerve.glb`：尺神经、臂丛内侧束与 T1 根，保留肱骨、桡尺骨参照
- `radial-nerve.glb`：桡神经主干与浅支、深支、骨间后神经及三条皮支，保留肱骨
  和肱三头肌作为行程参照
- `typical-vertebrae.glb`：官方 vertebrae 子模型整体保留，含第 4 颈椎、第 7 胸椎
  和第 3 腰椎三块典型椎骨

子模型页面（含署名要求）：
<https://anatomytool.org/content/open3dmodel-median-nerve-english-labels>、
<https://anatomytool.org/content/open3dmodel-ulnar-nerve-english-labels>、
<https://anatomytool.org/content/open3dmodel-radial-nerve-english-labels>；
网页 GLB 取自官方查看器目录
<https://caskanatomy.info/open3dviewer/3dmodels/>，椎骨源文件取自
<https://caskanatomy.info/open3dmodelfiles/vertebrae/vertebrae-glb.zip>。
许可证均为 CC BY-SA，数字使用需附各页面给出的署名行。

同日再从官方主题子模型增加 6 个条目，同样保留右侧（`.r`）结构和官方材质，
仅做节点筛选与 Meshopt 转换：

- `axillary-nerve.glb`：腋神经（含臂外侧上皮神经终支）、臂丛后束，
  保留肱骨、三角肌和小圆肌作为行程与支配参照
- `musculocutaneous-nerve.glb`：肌皮神经及其终支前臂外侧皮神经、臂丛外侧束，
  保留肱骨、桡尺骨和喙肱肌、肱二头肌、肱肌作为行程参照
- `forearm-flexors.glb`：前臂前室四层屈肌群（旋前圆肌、桡侧腕屈肌、掌长肌、
  尺侧腕屈肌、指浅屈肌、指深屈肌、拇长屈肌、旋前方肌）与掌腱膜，
  保留肱骨、桡尺骨参照
- `shoulder-girdle-muscles.glb`：来自 axio-appendicular 子模型，含斜方肌
  降/横/升三部、胸大肌三头、胸小肌、锁骨下肌、前锯肌、大小菱形肌和
  肩胛提肌，保留锁骨、肩胛骨、肱骨和胸骨参照；源模型的“muscle-and-
  ligament-parts-hidden”子集只展示与上肢带相关的部分
- `colored-skull-base.glb`：官方 colored-skull-base 子模型整体保留，
  29 个骨块按彩色分区，用于观察颅底孔道
- `exploded-skull.glb`：官方 exploded-skull 子模型整体保留，
  22 块颅骨按缝隙分解展开

子模型页面（含署名要求）：
<https://anatomytool.org/content/open3dmodel-axillary-nerve-english-labels>、
<https://anatomytool.org/content/open3dmodel-musculocutaneous-nerve-english-labels>、
<https://anatomytool.org/content/open3dmodel-forearm-anterior-compartment-muscles-english-labels>、
<https://anatomytool.org/content/open3dmodel-axio-appendicular-muscles-muscle-and-ligament-parts-hidden-english-labels>、
<https://anatomytool.org/content/open3dmodel-coloured-skull-base-english-labels>、
<https://anatomytool.org/content/open3dmodel-exploded-view-skull-english-labels>。

同日又从 Open3DAnatomy 疝手术区域模型增加 1 个条目：

- `femoral-canal.glb`：男性右侧股鞘、股管、股环高亮网格，股神经、股动静脉、
  髂外血管、腹壁下动脉及其与闭孔动脉的吻合支（corona mortis）、腹股沟韧带、
  腔隙韧带、耻骨梳韧带、髂耻束、髂耻弓和髂肌、腰大肌，保留髋骨与股骨参照。
  该模型以 BodyParts 项目和 Z-Anatomy 为先前模型，许可 CC BY-SA。
  页面：<https://anatomytool.org/content/open3danatomy-3d-model-inguinal-and-femoral-canal-and-structures-hernia-surgery>。

注意：caskanatomy.info 的大文件传输经常在中途停滞且不支持断点续传，
可用 `scripts/chunked-dl.sh` 按固定字节区间分块下载再拼接。

### Z-Anatomy

许可：CC BY-SA 4.0。2026-08-06 从 Z-Anatomy Unity 项目的
`VisceralSystem100.fbx` 按节点提取：

- `thyroid.glb`、`parathyroids.glb`
- `testis-epididymis.glb`
- `salivary-glands.glb`：双侧腮腺、下颌下腺、舌下腺和主要导管
- `pharynx.glb`：鼻咽、口咽、喉咽

来源：<https://github.com/LluisV/Z-Anatomy>。这些模型以 BodyParts3D 为基础并由
Z-Anatomy 继续整理；使用 `scripts/extract-fbx-nodes.mjs` 转换并保留结构节点。

2026-08-19 又从同一 Unity 项目的 `MuscularSystem100.fbx` 提取 60 个主要表层肌
网格，生成 `muscular-system.glb`。当前对象覆盖胸锁乳突肌、斜方肌、三角肌、胸大肌、
腹直肌、腹外斜肌、背阔肌、肱二头肌、肱三头肌、臀大/中肌、股四头肌、缝匠肌、
股二头肌、腓肠肌、比目鱼肌和胫骨前肌等，定位是“全身主要肌群概览”，不是包含
所有深层肌、筋膜和肌腱的完整数字人体。原 FBX 转为 GLB 后以 Meshopt 压缩，并将
几何简化到适合网页实时查看的级别。

同日从 `Resources/Models/FBX/NervousSystem100.fbx` 提取 12 对脑神经、视交叉、
中脑、脑桥、延髓及双侧大脑白质参照，生成 `cranial-nerves.glb`。为避免 FBX 中共用
的白质材质让细小神经难以辨认，`scripts/style-cranial-nerves.mjs` 将脑神经设为金黄色，
并把大脑白质设为半透明参照。脑神经网格在 Z-Anatomy 的来源
说明中标注为 University of Dundee、CC BY 4.0；其余 Z-Anatomy 整理内容仍按项目的
CC BY-SA 4.0 边界处理。原始文件：
<https://github.com/LluisV/Z-Anatomy/blob/PC-Version/Resources/Models/FBX/NervousSystem100.fbx>。

2026-08-20 又从 `Joints100.fbx` 与 `SkeletalSystem100.fbx` 提取 2 个条目。
两个 FBX 同属一套体坐标系，跨文件合并后用 `scripts/verify-merge.mjs` 做了
顶点级贴合校验（关节盘与髁突、椎间盘与相邻椎体的最近顶点距离均接近 0）：

- `tmj.glb`：右侧颞下颌关节，含关节盘、关节囊和颞下颌（外侧）韧带，
  并保留下颌骨与右侧颞骨作为空间参照。注意上游 `Joints100.fbx` 中
  颞下颌韧带的 l/r 标记与关节盘、关节囊相反：经与 `SkeletalSystem100.fbx`
  右侧颞骨的空间比对，取标记为 `Lateral_temporomandibular_ligamentl` 的
  网格作为解剖右侧，提取记录在此留存备查。
- `intervertebral-discs.glb`：C2–S1 全部 23 个椎间盘、前纵韧带、后纵韧带、
  棘上韧带和棘间韧带，并保留 C1 至骶骨的全部椎骨作为空间参照。

`SkeletalSystem100.fbx` 的提取产物中单个骨骼网格被拆成数千个碎片 primitive，
已用 `scripts/consolidate-glb.mjs` 按材质合并为每网格少量 primitive，再经
`scripts/merge-glb.mjs`（gltf-transform 实现，保留节点名称）合并；两个条目分别由
`scripts/style-tmj.mjs` 和 `scripts/style-intervertebral-discs.mjs` 设置骨骼、
椎间盘（关节盘）、韧带和关节囊的区分色，最后以 Meshopt 压缩。

同日又从 `LymphoidOrgans100.fbx` 与 `SkeletalSystem100.fbx` 提取 3 个条目：

- `lymphatic-system.glb`：全身主要淋巴结群（头颈、胸、腹、盆腔与四肢）加
  胸腺、脾和腭扁桃体，共 133 个网格。该 FBX 中所有以 `j` 结尾的节点均为
  36 顶点的标注牌而非解剖网格，提取时已排除；`scripts/check-overlap.mjs`
  用于排查包围盒重叠的重复网格，`scripts/style-lymphatic-system.mjs` 将
  淋巴结群设为绿色，脾、胸腺、扁桃体沿用各自条目色系。
- `teeth.glb`：28 颗恒牙（上、下颌各 14 颗，模型不含第三磨牙），
  由 `scripts/style-teeth.mjs` 设置牙釉质材质。
- `nose.glb`：鼻骨、鼻中隔软骨、鼻外侧软骨和下鼻甲，
  由 `scripts/style-nose.mjs` 区分骨与软骨材质。

注意：gltf-transform 的 `quantize()`（含 `meshopt()` 管线）会把被重新量化的
节点清空名称并追加到节点列表末尾；`scripts/compress-meshopt.mjs` 调用 API 压缩，
`scripts/restore-node-names.mjs` 再按出现顺序和顶点数把名称补回。牙齿等 FBX
网格是每顶点重复的三角面汤，压缩管线中的 weld 会将其收敛到十分之一的顶点数，
属预期行为。`scripts/node-info.mjs` 可输出每个节点的顶点数与包围盒备查。

同日从 `SkeletalSystem100.fbx` 提取右侧锤骨、砧骨和镫骨，生成
`ear-ossicles.glb`；`scripts/style-ear-ossicles.mjs` 设置骨质材质。
`scripts/sample-path.mjs` 可按 Y 轴分桶采样网格顶点，用于沿神经、
血管行程放置热点。

### BodyParts3D 4.0

许可：[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)。指定署名：
`BodyParts3D © The Database Center for Life Science licensed under CC BY 4.0`。

- `stomach.glb`：FMA7148
- `esophagus.glb`：FMA7131
- `appendix.glb`：FMA14542
- `tongue.glb`：FMA54640
- `ear.glb`：FMA52781，取成对网格中的单侧耳廓
- `adrenal.glb`：FMA9604，左右侧合并
- `diaphragm.glb`：FMA13295
- `pituitary.glb`：FMA13889，由独立 STL 转换

这些文件由 OBJ 转换为 GLB，并烘焙了 Z-up 到 Y-up 的旋转。它们的网格与材质
明显简于 HuBMAP 模型，后续替换时应保持同一器官 ID 和热点归一化约定。
其中 `trachea.glb` 已于 2026-08-20 替换为 HuBMAP v1.4 版本（见上文）。

### Human Atlas / BodyParts3D 4.0：25 个主题（2026-09-07）

从 [ashemag/human-atlas](https://github.com/ashemag/human-atlas/tree/1c38bf35c254a891200d3cedecfd57abebe83d8d)
固定提交 `1c38bf35c254a891200d3cedecfd57abebe83d8d` 的 `public/models/atlas.json`
及 `body-0.bin` 至 `body-14.bin` 提取 **227 个源网格，组成 25 个主题**。
项目展示条目从 79 个增至 104 个。这是新增独立页面，不代表这些结构从未出现在
已有全脑、骨骼、肌肉或血管的组合模型中。

原始数据为 `isa_BP3D_4.0_obj_99.zip`，BodyParts3D 4.0 成年男性参考。
作者/署名：`BodyParts3D © The Database Center for Life Science licensed under CC BY 4.0`。
[官方现行许可](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html)与
[上游加工记录](https://github.com/ashemag/human-atlas/blob/1c38bf35c254a891200d3cedecfd57abebe83d8d/public/ATTRIBUTION.md)
已核对。模型数据按 CC BY 4.0 使用；本次没有移植上游应用代码。

上游完成毫米/Z-up 到米/Y-up 转换及误差阈值 0.2% 的几何简化。本次按 FMA 概念
选取网格，保留原始相对坐标，以自编脚本解包、指定材质并转换为 Meshopt GLB。
没有再对几何减面；压缩包含顶点量化。保留每个节点的 FJ 网格编号、英文名与 FMA
编号，并在 GLB 中嵌入版权信息。25 个 GLB 共 4,039,900 字节，约 3.85 MiB。

| 模型文件 | 主题 | 源网格数 |
| --- | --- | ---: |
| `pineal-gland.glb` | 松果体 | 1 |
| `hippocampus.glb` | 海马 | 2 |
| `amygdala.glb` | 杏仁核 | 2 |
| `thalamus.glb` | 丘脑 | 2 |
| `hypothalamus.glb` | 下丘脑 | 4 |
| `corpus-callosum.glb` | 胼胝体 | 1 |
| `brain-ventricles.glb` | 脑室系统 | 5 |
| `aorta.glb` | 主动脉 | 5 |
| `superior-vena-cava.glb` | 上腔静脉 | 1 |
| `inferior-vena-cava.glb` | 下腔静脉 | 2 |
| `hepatic-portal-vein.glb` | 肝门静脉 | 19 |
| `biliary-tree.glb` | 胆道系统 | 17 |
| `pancreatic-ducts.glb` | 胰管系统 | 2 |
| `mesentery.glb` | 肠系膜 | 3 |
| `seminal-vesicles.glb` | 精囊（男性参考） | 2 |
| `ductus-deferens.glb` | 输精管（男性参考） | 2 |
| `lacrimal-apparatus.glb` | 泪器 | 10 |
| `extraocular-muscles.glb` | 眼外肌 | 14 |
| `hyoid.glb` | 舌骨 | 2 |
| `achilles-tendons.glb` | 跟腱 | 2 |
| `intercostal-muscles.glb` | 肋间肌 | 6 |
| `quadriceps.glb` | 股四头肌 | 8 |
| `gluteal-muscles.glb` | 臀肌群 | 6 |
| `bronchial-tree.glb` | 肺内支气管树 | 98 |
| `heart-valves.glb` | 心脏瓣膜 | 11 |

范围与纠正：

- 脑室归入神经系统，纠正上游 `cardiac` 分类；腔隙模型不称为实质组织。
- 臀肌仅取双侧臀大、中、小肌六个网格，排除上游组合中的深层外旋肌等。
- 眼外肌包含双侧六条眼球运动肌及提上睑肌，共 14 个网格，文案明确区分。
- 胆道保留肝内分支、左右肝管、肝总管和胆囊管；未将缺少完整胆总管的模型称为完整胆道。
- 肠系膜包含小肠系膜、阑尾系膜和横结肠系膜；支气管树不含肺泡。
- 瓣膜呈静态形态，不构成完整腱索、乳头肌装置或瓣膜运动模拟。
- 同名源网格不等于重复几何，继续保留源模型的组成关系。两块舌骨网格不称为两块舌骨。
- 精囊、输精管明确标注男性参考；其他条目也说明参考标本的性别。

导航图片是本次 GLB 的真实渲染，非生成式医学插图：每个主题提供 720×720 主图与
180×180 缩略图，均按 CC BY 4.0 保留来源。公开署名文件为
`public/human-atlas-attribution.txt`，各新增条目的信息面板链接到该文件。
查看器保留 GLB 材质的双面属性，以支持旋转观察系膜等薄片。

复现与校验：

1. 将上游仓库检出到上述固定提交。
2. `node scripts/import-human-atlas.mjs /path/to/human-atlas`；选取与中文文案源文件为
   `scripts/human-atlas-selection.mjs`。只重建这 25 个模型和标记的生成内容区。
3. 本地服务仓库根目录，在浏览器打开 `scripts/human-atlas-previews.html`，依次调用
   `renderAtlasPreview(id)`；将返回的 base64 WebP 写为对应 `organ.webp` / `thumb.webp`。
4. `npm run test:content` 验证 104 个条目的资源以及这 25 个模型的源网格成员、版权、
   文件哈希、米制尺度、压缩读回、热点与指定网格的表面距离和图片尺寸/非空像素。

逐文件 FMA/FJ 清单、热点对应网格、源 JSON/二进制 SHA-256、GLB 哈希和包围盒见
[`human-atlas-import.json`](human-atlas-import.json)。热点由最终 GLB 解码后的实际表面
顶点计算，包含归一化整数 accessor 的解码与节点世界变换，使用查看器的最长边 3.8
归一化约定。原始二进制的顶点包围盒与导出结果误差校验小于 0.1 毫米。

中文内容按一般解剖事实独立编写，不复制来源文章；不提供诊疗建议或未经核实的精确
重量。内容参考包括 [NCBI 脑的主要结构](https://www.ncbi.nlm.nih.gov/books/NBK234157/)、
[下丘脑与垂体](https://www.ncbi.nlm.nih.gov/books/NBK279126/)、
[胆道](https://www.ncbi.nlm.nih.gov/books/NBK459246/)、
[眼外肌](https://www.ncbi.nlm.nih.gov/books/NBK519565/)、
[眼与泪器](https://www.ncbi.nlm.nih.gov/books/NBK482428/)、
[精囊](https://www.ncbi.nlm.nih.gov/books/NBK499854/)及
[腹部解剖](https://www.ncbi.nlm.nih.gov/books/NBK553104/)。
完成源码、模型和一般解剖资料核对不等同于医学专家审校；仍遵循项目的科普用途边界。

本次本地验收：`npm test`（构建及 7 项测试）、`npm run build:cloudflare`、
`npx tsc --noEmit`、`git diff --check` 通过；变更代码 ESLint 无错误，保留原有
`<img>` 提示。浏览器逐项验证 25 个条目的模型加载、首个热点联动与署名，检查全部
25 张模型渲染预览；另验证搜索、分层、390×844 移动端器官库选择与无横向溢出。
静态导出中的 25 个 GLB 与源文件逐字节一致。该验收不包含生产部署或实体手机测试。

### 原项目资产

当前心、脑、肺、肝、肾、眼、肠道、胰腺与皮肤这九个初始条目的 3D 模型仍直接
来自上游项目；原始插图也随上游项目提供。上游仓库没有给出这些资产的逐文件来源或
许可证，因此在完成来源追溯前，不应把它们视为可自由再分发或商用。

## 生成插图

2026-08-05 至 2026-08-06 使用 OpenAI 内置图像生成工具，为新增条目生成了水彩风格的科普插图；
每张主图转为 720×720 WebP，并从同一图派生 180×180 缩略图。统一提示规范为：

> 居中展示单个解剖结构；医学上基本可信；手绘医学水彩与彩铅细节；米白纸张背景，
> 少量粉色和淡紫色水彩晕染；留出均匀边距；缩小到 180px 后轮廓仍清晰；不含文字、
> 标注、箭头、人物、水印、签名、边框、投影或无关器官。

这些插图用于视觉导航，不替代经医学插画师绘制和解剖学专家审校的教学图谱。
`ovary` 与 `prostate` 的生成结果因图像安全系统误判未采用，当前继续使用字符回退。

2026-08-06 的 HuBMAP 补充批次分别以“小肠（十二指肠、空肠、回肠连续展示）”、
“大肠（盲肠至直肠连续展示）”、“女性骨盆正面骨性结构”和“左膝关节及半月板”
为主体生成；四张图都沿用上述背景、媒介、构图与禁止文字的统一约束。

同日为本轮 15 个新增模型中的 14 个生成专属插图：喉、主支气管、乳腺、腭扁桃体、
全身骨骼、肩关节、肘关节、髋关节、踝与足、甲状腺、垂体、甲状旁腺、大唾液腺和咽。
每张图保存为 720×720 的 `organ.webp`，并派生 180×180 的 `thumb.webp`。
`testis-epididymis` 连续两次被图像安全系统误判为性内容，未使用不相干图片替代，
继续使用字符回退。

2026-08-19 使用同一内置图像生成模式，为全身肌肉系统、颅骨、脊柱、手与腕、
旋转袖和臂丛神经生成 6 张统一风格的专属插图。提示词继续要求暖米白纸、水彩和彩铅、
粉色与淡紫色背景晕染、主体居中、无文字和无标注；主图保存为 720×720 WebP，
缩略图保存为 180×180 WebP。全身肌肉图的前两次输出被安全系统误判拦截，最终采用
穿着不透明教学短裤的运动生物力学示意图，避免用不相干资产替代。

同日为脑干与小脑、冠状循环、右侧坐骨神经、十二对脑神经、男性右侧盆底与会阴、
男性右侧腹股沟管生成 6 张同风格导航插图。盆底和腹股沟插图只展示骨盆、肌肉、
筋膜、韧带和神经的临床解剖关系，不展示外生殖器；所有图片仍不含文字或标注。

2026-08-20 为新增的 `tmj` 与 `intervertebral-discs` 两个条目生成同风格导航插图；
均采用象牙色纸张、水彩解剖图与粉紫色淡晕背景，不含文字或标注。

同日为新增的 `median-nerve`、`ulnar-nerve`、`radial-nerve` 与 `typical-vertebrae`
四个条目生成同风格导航插图。三条上肢神经以骨骼为参照并用橙黄色突出行程；
典型椎骨按 C4、T7、L3 自上而下比较。所有图片均不含文字或标注。

同日为新增的 `lymphatic-system`、`teeth` 与 `nose` 三个条目生成同风格导航插图：
淋巴系统突出绿色淋巴管、主要淋巴结群和淋巴器官；恒牙展示不含第三磨牙的
上下牙弓；鼻展示鼻骨、软骨与鼻甲的切面关系。所有图片均不含文字或标注。

同日为新增的 `axillary-nerve`、`musculocutaneous-nerve`、`forearm-flexors`、
`shoulder-girdle-muscles`、`colored-skull-base`、`exploded-skull`、
`femoral-canal` 与 `ear-ossicles` 八个条目生成同风格导航插图。上肢条目分别
突出神经行程和肌层关系；颅骨条目采用彩色分区与分解构图；股管展示血管、
淋巴与韧带毗邻；听小骨展示锤骨、砧骨和镫骨链。所有图片均不含文字或标注。

## 引入新模型的验收条件

1. 记录稳定来源 URL、原文件名、版本、作者和许可证。
2. 确认许可证允许项目所需的修改、再分发和部署方式。
3. 检查性别、年龄、侧别和姿态，不把单侧或特定人群模型描述为通用标本。
4. 检查网格、材质、纹理、法线、坐标方向和浏览器加载体积。
5. 使用 `scripts/inspect-glb.mjs` 在查看器的归一化坐标中定位热点；需要把热点
   钉在网格表面时，可用 `scripts/surface-points.mjs` 输出逐轴极值顶点。
6. 成对对象可用 `scripts/merge-glb.mjs` 合并，但必须保留原始来源记录。
7. 文案与热点至少经过一次医学内容复核；页面继续保留科普用途声明。
