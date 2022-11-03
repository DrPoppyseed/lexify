import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

import react from "@vitejs/plugin-react";
import { join } from "path";
import visualizer from "rollup-plugin-visualizer";

const chunks = (id: string) => {
  if (id.includes("node_modules")) {
    if (id.includes("firebase")) {
      return "vendor_firebase";
    }
    if (id.includes("@mui")) {
      return "vendor_mui";
    }

    return "vendor"; // all other package goes here
  }
};

export default defineConfig(({ mode }) => {
  return {
    root: ".",
    build: {
      rollupOptions: {
        output: {
          manualChunks: chunks,
        },
        plugins: [visualizer()],
      },
      outDir: "build",
    },
    server: {
      port: 3001,
    },
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
    ],
    resolve: {
      alias: {
        "@/": join(__dirname, "./src/"),
      },
    },
  };
});
