/** vinext 的服务端入口，仅 `npm run build` / `npm start` 使用。
 *  生产环境部署 `out/` 静态导出（Workers Static Assets），不经过这里。 */
import handler from "vinext/server/app-router-entry";

const worker = {
  fetch: handler.fetch,
};

export default worker;
