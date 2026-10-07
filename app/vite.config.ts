import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import { readFileSync } from "node:fs";

const previewHeaders = Object.fromEntries(
  readFileSync(new URL("./public/_headers", import.meta.url), "utf8")
    .split("\n")
    .flatMap((line) => {
      const match = line.match(/^\s+([^:]+):\s*(.+)$/);
      return match ? [[match[1]!, match[2]!]] : [];
    }),
);

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "prompt",
      includeAssets: [
        "icon.svg",
        "icon-192.png",
        "icon-512.png",
        "apple-touch-icon.png",
      ],
      manifest: {
        id: "/",
        name: "Lightweight · 나의 훈련",
        short_name: "Lightweight",
        description: "내 조건으로 운동을 준비하고 기록하는 훈련 노트",
        lang: "ko",
        start_url: "/",
        scope: "/",
        display: "standalone",
        theme_color: "#1f1f1f",
        background_color: "#1f1f1f",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any",
          },
        ],
      },
      workbox: {
        globPatterns: [
          "**/*.{js,css,html,svg,png,woff2,webmanifest}",
          "content/exercise-guides.json",
        ],
        cleanupOutdatedCaches: true,
      },
    }),
  ],
  server: { host: "127.0.0.1" },
  preview: { host: "127.0.0.1", headers: previewHeaders },
  build: {
    sourcemap: false,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react",
              test: /node_modules\/(react|react-dom|scheduler)\//,
            },
            {
              name: "mantine",
              test: /node_modules\/(@mantine|@floating-ui|react-remove-scroll|react-style-singleton|use-sidecar)\//,
            },
            { name: "supabase", test: /node_modules\/@supabase\// },
            {
              name: "storage-validation",
              test: /node_modules\/(dexie|dexie-react-hooks|zod)\//,
            },
          ],
        },
      },
    },
  },
});
