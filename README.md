# 解剖工坊 (Anatomy Atelier)

中文的人体器官 3D 图鉴：浏览 26 个器官的介绍与结构，旋转、剖切、分层查看
交互式 3D 标本，点击模型上的圆点了解各部位结构。

基于 [vinext](https://github.com/cloudflare/vinext)（Vite 上的 Next.js 兼容
运行时）+ React 19 + three.js 构建。

## 功能

- 26 个器官的中文档案：描述、大小/重量/位置/功能/血供、医学意义、趣味知识
- 交互式 3D 标本：旋转、缩放、隔离、剖面、分层（线框）、重置
- 模型表面的解剖结构热点标注，点击查看详情
- 器官库搜索与移动端抽屉浏览

## 快速开始

```bash
npm install
npm run dev    # 本地开发
npm run build  # 验证构建产物
```

需要 Node.js `>=22.13.0`。

## 项目结构

- `app/components/` — 页面组件（`AnatomyApp` 主界面、`OrganViewer` 3D 查看器）
- `app/lib/anatomy-data.ts` — 全部器官数据（文案、模型路径、热点坐标）
- `app/lib/three/` — 3D 渲染（加载归一化、热点层、材质、查看器）
- `public/models/` — 器官 GLB 模型
- `public/anatomy/` — 原始 9 个器官的手绘插图（新器官无插图，界面自动回退为图形符号）

## 新增一个器官

1. 把 GLB 模型放入 `public/models/<id>.glb`；
2. 在 `app/lib/anatomy-data.ts` 的 `OrganId` 与 `organs` 中登记：
   文案、`model` 路径、`accent` 颜色、`illustrated`（无插图设 `false`）、
   `hotspots`；
3. 热点坐标在查看器的归一化空间（最长边 3.8、中心在原点）中书写，
   大致方向对即可——渲染时会自动吸附到最近的模型表面顶点。

## 本地开发说明

`vite.config.ts` 在 `npm run dev` 时不加载 `@cloudflare/vite-plugin`：
本机 workerd/Miniflare 无法正常工作（请求直接以 "fetch failed" 失败），
而项目未声明任何 D1/R2 绑定，因此 dev 回退到 Vite 的 Node 运行时。
`npm run build` 仍走 Cloudflare 插件，部署产物不受影响。

`db/`、`worker/`、`examples/`、`tests/` 是 vinext 模板的遗留物，当前页面
没有用到；`npm test` 校验的是模板的加载骨架，与本站内容无关。

## 常用命令

- `npm run dev`：本地开发（默认 3000 端口，被占用时自动顺延）
- `npm run build`：验证 vinext 构建产物
- `npm run lint`：ESLint（`public/basis`、`public/draco` 下第三方
  解码器的既有告警可忽略）

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)

## 3D Model Sources and Licenses

The additional organ models in `public/models/` come from open anatomical
datasets and are used under their respective licenses:

- `spleen.glb`, `gallbladder.glb`, `bladder.glb`, `thymus.glb`,
  `spinal-cord.glb`, `uterus.glb`, `ovary.glb`, `prostate.glb`, `ureter.glb`
  (merged left + right) — HuBMAP CCF 3D Reference Object Library, licensed
  under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
  Source: <https://ccf-ontology.hubmapconsortium.org/objects/v1.2/>
  (orientation or material adjustments baked into `gallbladder.glb`,
  `spinal-cord.glb` and `uterus.glb`).
- `stomach.glb` (FMA7148), `esophagus.glb` (FMA7131), `trachea.glb` (FMA7394),
  `appendix.glb` (FMA14542), `tongue.glb` (FMA54640), `ear.glb` (FMA52781,
  one auricle extracted from the paired mesh), `adrenal.glb` (FMA9604,
  left + right merged), `diaphragm.glb` (FMA13295) — BodyParts3D,
  (c) The Database Center for Life Science, licensed under
  [CC BY-SA 2.1 Japan](https://creativecommons.org/licenses/by-sa/2.1/jp/).
  Source: <https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html>
  (converted from OBJ to GLB, Z-up to Y-up rotation baked in).

The nine original models (`heart`, `brain`, `lungs`, `liver`, `kidneys`,
`eyeball`, `intestine`, `pancreas`, `skin`) and the illustrations under
`public/anatomy/` shipped with the original project.
