import { defineConfig } from "vite";
import vinext from "vinext";
import { cloudflare } from "@cloudflare/vite-plugin";
import { sitesPlugin } from "./build/sites-vite-plugin";

// vinext() auto-registers @vitejs/plugin-rsc — do not add rsc() again
export default defineConfig({
  plugins: [
    vinext(),
    cloudflare({
      viteEnvironment: {
        name: "rsc",
        childEnvironments: ["ssr"],
      },
    }),
    sitesPlugin(),
  ],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  ssr: {
    external: ["cloudflare:workers"],
  },
});
