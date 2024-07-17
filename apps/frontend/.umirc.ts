const { join } = require("path");
import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: "/",
      component: "@/layouts/index",
      layout: false,
      routes: [
        { path: "/docs", component: "docs", wrappers: ["@/wrappers/auth"] },
      ],
    },
    { path: "/signup", component: "auth/signup", layout: false },
    { path: "/login", component: "auth/login", layout: false },
  ],

  npmClient: "pnpm",
  plugins: [
    "./umi-plugin.ts",
    "@umijs/plugins/dist/locale",
    "@umijs/plugins/dist/tailwindcss",
  ],
  locale: {
    antd: false,
    default: "en-US",
    baseSeparator: "-",
  },

  proxy: {
    "/api": {
      target: "http://localhost:10008",
      changeOrigin: true,
      // pathRewrite: { "^/api": "" },
    },
  },

  alias: {
    "@flavor/ui": join(__dirname, "../../packages/ui/src"),
    "@flavor/core": join(__dirname, "../../packages/core/src"),
  },

  tailwindcss: {},

  // fix react multi-instance issues
  mfsu: {
    shared: {
      react: {
        singleton: true,
      },
    },
  },
});
