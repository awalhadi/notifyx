import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import terser from "@rollup/plugin-terser";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    })
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "NotifyX",
      fileName: (format) => `notifyx.${format}.js`,
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'notifyx.min.css';
          return assetInfo.name;
        },
      },
      plugins: [terser()]
    },
    sourcemap: true,
  }
});