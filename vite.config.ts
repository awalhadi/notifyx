import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import terser from "@rollup/plugin-terser";
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
      fileName: (format) => {
        if(format === 'umd') return 'notifyx.min.js';
        return `notifyx.${format}.js`;
      },
      formats: ["es", "umd"]
    },
    rollupOptions: {
      external: [],
      plugins: [
        terser({
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          format: {
            comments: false
          }
        })
      ]
    },
    sourcemap: false,
    minify: 'terser',
    target: 'esnext'
  }
});