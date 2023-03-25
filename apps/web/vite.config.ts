import react from "@vitejs/plugin-react";
import { join } from "path";
import { defineConfig } from "vite";

export default defineConfig(() => {
  return {
    root: ".",
    build: {
      outDir: "build",
    },
    server: {
      port: 3001,
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@/": join(__dirname, "./src/"),
      },
    },
  };
});
