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
  plugins: ["@umijs/plugins/dist/locale"],
  locale: {
    default: "zh-CN",
    baseSeparator: "-",
  },

  proxy: {
    "/api": {
      target: "http://localhost:10008",
      changeOrigin: true,
      // pathRewrite: { "^/api": "" },
    },
  },
});
