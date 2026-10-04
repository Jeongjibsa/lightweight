import { mergeConfig } from "vite";
import production from "../vite.config.ts";

const build = process.env.LIGHTWEIGHT_E2E_BUILD_ID;
if (!["v1", "v2"].includes(build))
  throw new Error("Missing E2E build identity");
// A test-only HTML difference gives Workbox a real changed precache revision.
export default mergeConfig(production, {
  plugins: [
    {
      name: "e2e-build-identity",
      transformIndexHtml: () => [
        {
          tag: "meta",
          attrs: { name: "lightweight-e2e-build", content: build },
          injectTo: "head",
        },
      ],
    },
  ],
});
