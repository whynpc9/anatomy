import vinext from "vinext";
import { defineConfig } from "vite";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

export default defineConfig(async ({ command }) => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // The Cloudflare plugin runs dev requests through workerd/Miniflare, which
  // fails with a bare "fetch failed" in some local environments. Since the app
  // declares no D1/R2 bindings, dev falls back to Vite's plain Node runtime;
  // the plugin stays enabled for builds so deploy output is unchanged.
  const { cloudflare } = command === "build"
    ? await import("@cloudflare/vite-plugin")
    : { cloudflare: null };

  return {
    server: isCodexSeatbeltSandbox
      ? { watch: { useFsEvents: false, usePolling: true } }
      : undefined,
    plugins: [
      vinext(),
      ...(cloudflare
        ? [
            cloudflare({
              viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
              config: {
                main: "./worker/index.ts",
                compatibility_flags: ["nodejs_compat"],
              },
            }),
          ]
        : []),
    ],
  };
});
