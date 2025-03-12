import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import terser from "@rollup/plugin-terser";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "NotifyX",
      fileName: (format) => `notifyx.${format}.js`,
      formats: ["es", "umd"] // Output both ES modules and UMD for broader compatibility
    },
    rollupOptions: {
      plugins: [terser()]
    },
    sourcemap: true, // Generate source maps for debugging
  }
});