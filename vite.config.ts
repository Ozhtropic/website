import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

function localApiPlugin() {
  return {
    name: "ozthropic-local-api",
    configureServer(server: { middlewares: { use: (handler: unknown) => void } }) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = req.url ? req.url.split("?")[0] : "";

        try {
          if (pathname === "/api/chat") {
            const module = await import("./api/chat.js");
            await module.default(req, res);
            return;
          }

          if (pathname === "/api/telegram-webhook") {
            const module = await import("./api/telegram-webhook.js");
            await module.default(req, res);
            return;
          }
        } catch (error) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(
            JSON.stringify({
              ok: false,
              error: error instanceof Error ? error.message : "Local API handler failed.",
            })
          );
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [react(), localApiPlugin()],
  };
});
