# 解剖工坊 (Anatomy Atelier)

中文的人体器官 3D 图鉴：浏览 64 个器官与解剖结构的介绍，旋转、剖切、分层查看
交互式 3D 标本，点击模型上的圆点了解各部位结构。

基于 [vinext](https://github.com/cloudflare/vinext)（Vite 上的 Next.js 兼容
运行时）+ React 19 + three.js 构建。

## 致谢与项目沿革

本项目基于 [thebuggeddev/anatomy](https://github.com/thebuggeddev/anatomy)
开发。感谢原作者完成 Anatomy Atelier 的产品设计、首批器官内容、插图，以及
three.js 交互式查看器的基础实现。当前仓库是在该项目基础上的独立扩展，并非原作者
或下列医学数据源的官方版本或背书产品。

相较于上游项目，本项目主要增加或调整了：

- 将界面与内容收敛为中文人体器官 3D 图鉴，并把内容扩展到 64 个器官与解剖结构；
- 从 HuBMAP CCF、BodyParts3D、Open3DModel / AnatomyTOOL 和 Z-Anatomy
  引入可追溯的开放模型，完成格式转换、左右侧合并、节点提取和网页压缩；上游已有
  模型保持原文件不变，HuBMAP 对照版本以 `-hubmap` 后缀并存；
- 为新增条目补充中文档案、热点、缩略图和科普插图，并标明性别、侧别等模型边界；
- 改进模型取景、材质、加载、热点尺寸和内容完整性测试，补充模型处理脚本与来源文档。

## 功能

- 64 个器官与解剖结构的中文档案：描述、大小/重量/位置/功能/血供、医学意义、趣味知识
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
- `public/anatomy/` — 器官详情插图与缩略图；卵巢、前列腺和睾丸与附睾暂时回退为图形符号
- `docs/model-sources.md` — 模型逐项来源、许可证、质量边界与新增验收规范

## 新增一个器官

1. 把 GLB 模型放入 `public/models/<id>.glb`；
2. 在 `app/lib/anatomy-data.ts` 的 `OrganId` 与 `organs` 中登记：
   文案、`model` 路径、`accent` 颜色、`illustrated`（无插图设 `false`）、
   `hotspots`；当源模型包含很长的邻近结构、主体在统一包围盒中显得过小时，
   可设置仅影响取景的 `viewScale`；热点密集时可用 `hotspotSize` 缩小圆点；
3. 热点坐标在查看器的归一化空间（最长边 3.8、中心在原点）中书写，
   大致方向对即可——渲染时会自动吸附到最近的模型表面顶点。

## 本地开发说明

`vite.config.ts` 在 `npm run dev` 时不加载 `@cloudflare/vite-plugin`：
本机 workerd/Miniflare 无法正常工作（请求直接以 "fetch failed" 失败），
而项目未声明任何 D1/R2 绑定，因此 dev 回退到 Vite 的 Node 运行时。
`npm run build` 仍走 Cloudflare 插件，部署产物不受影响。

`worker/index.ts` 是 vinext 的服务端入口，只有 `npm run build` 和
`npm start` 会用到；生产静态部署不经过它。
`npm test` 会先构建站点，再检查 64 个内容条目的模型、插图和来源文档是否完整。

## Cloudflare 静态部署

生产部署使用 Next.js 静态导出与 Cloudflare Workers Static Assets。首页、脚本、
图片和 GLB 模型均作为静态资源提供，不需要 SSR Worker、D1 或 R2，也不会消耗
Workers 请求与 CPU 配额。

当前生产地址：<https://anatomy-atelier.whynpc.workers.dev>

```bash
npm run build:cloudflare
npm run deploy:cloudflare
```

静态产物位于 `out/`，部署配置位于 `wrangler.jsonc`。首次部署前运行
`npx wrangler login` 登录 Cloudflare。正式域名确定后，在构建环境设置
`NEXT_PUBLIC_SITE_URL`，确保 Open Graph 图片等元数据使用正确的绝对地址。

## 常用命令

- `npm run dev`：本地开发（默认 3000 端口，被占用时自动顺延）
- `npm run build`：验证 vinext 构建产物
- `npm run build:cloudflare`：生成不依赖服务端运行时的 `out/` 静态站点
- `npm run deploy:cloudflare`：静态构建并部署到 Cloudflare Workers Static Assets
- `npm run test:content`：不构建，快速检查器官数据、模型和插图是否一一对应
- `npm run lint`：ESLint（`public/basis`、`public/draco` 下第三方
  解码器的既有告警可忽略）

## 相关项目

- [vinext Documentation](https://github.com/cloudflare/vinext)

## 3D 模型数据源

仓库中的模型并非来自单一数据集，许可证也不相同：

| 数据源 | 本项目中的主要内容 | 许可证 |
| --- | --- | --- |
| [HuBMAP CCF 3D Reference Object Library](https://hubmapconsortium.github.io/ccf/pages/ccf-3d-reference-library.html) | 血管、盆骨、膝关节、气管等新增模型，以及心、脑、肺、肝、肾、眼、胰腺的 `-hubmap` 对照资产 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [BodyParts3D](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html) | 胃、食管、阑尾、舌、耳、肾上腺、膈、垂体 | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| [Open3DModel / AnatomyTOOL](https://anatomytool.org/open3dmodel-create) | 骨骼、颅骨、脊柱、手与腕、肩/肘/髋关节、踝与足、旋转袖、臂丛神经 | CC BY-SA（以源项目标注为准） |
| [Z-Anatomy](https://github.com/LluisV/Z-Anatomy) | 全身主要肌群、脑神经、甲状腺、甲状旁腺、睾丸与附睾、唾液腺、咽、颞下颌关节、椎间盘 | CC BY-SA 4.0；源项目中的混合资产需逐项核对 |
| 上游 `thebuggeddev/anatomy` | 心、脑、肺、肝、肾、眼、肠道、胰腺、皮肤九个初始模型及上游插图 | 上游未提供逐文件来源或明确许可证 |

完整的逐文件来源、版本、作者/署名、转换方式、性别与侧别限制，见
[`docs/model-sources.md`](docs/model-sources.md)。其中 BodyParts3D 的指定署名为：
`BodyParts3D © The Database Center for Life Science licensed under CC BY 4.0`。

## 许可证与免责声明

本仓库目前**没有统一的项目许可证**。上游仓库没有提供明确的软件许可证，因此，
不能仅因代码公开可见就推定其允许复制、修改、再分发或商用；本仓库也不能替上游
作者对原始代码和资产授予许可。各 3D 模型仍受上表及来源文档所列许可证约束，署名、
相同方式共享（ShareAlike）及其他义务需要分别履行。来源或授权尚未确认的上游模型
与插图，不应视为可自由再分发或商用。若计划公开部署、再发布或商用，请先完成逐项
权利核验，并移除或替换无法确认授权的内容。

本项目仅用于一般性的解剖科普与技术演示。模型、插图、尺寸、重量、位置、功能、
热点和文字可能经过简化、转换或自动生成，尚未构成经过医学专家系统审校的专业图谱，
不得用于诊断、治疗、手术规划、医学教育考核或替代医生及其他合格专业人员的意见。
项目维护者不保证内容完整、准确或适用于特定用途；使用者应自行核验医学信息及相应
资产的许可证。第三方名称和链接仅用于说明来源，不代表其对本项目的认可或背书。
