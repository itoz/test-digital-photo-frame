import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// GitHub Pages 用の base パス（ユーザー名.github.io でなければ必要）
const repoName = "test-digital-photo-frame";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? `/${repoName}/` : "/",
  build: {
    outDir: "docs", // ← GitHub Pages 用に docs に出力
  },
});
