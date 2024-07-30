const { join } = require("path");
import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    { path: "/", redirect: "/docs", layout: false },
    {
      path: "/docs",
      component: "@/layouts/docs",
      wrappers: ["@/wrappers/auth"],
      layout: false,
      routes: [
        {
          path: "/docs/:docId",
          component: "docs/doc",
        },
      ],
    },
    {
      path: "/invite",
      component: "invite",
      wrappers: ["@/wrappers/auth"],
      layout: false,
    },
    { path: "/signup", component: "auth/signup", layout: false },
    { path: "/login", component: "auth/login", layout: false },
    { path: "/*", component: "404", layout: false },
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
