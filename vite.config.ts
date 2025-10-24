import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dts from "vite-plugin-dts";

const banner = `/*!
 * NotifyX v3.0.0
 * A lightweight, framework-agnostic toast notification library
 * https://github.com/awalhadi/notifyx
 * @author A Awal Hadi
 */`;

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
      output: {
        // Avoid warning for mixing default and named exports in UMD build
        exports: 'named',
        banner
      }
    },
    sourcemap: false,
    minify: 'terser',
    // Production-grade JS minification via Terser
    terserOptions: {
      ecma: 2020,
      compress: {
        // safe compress defaults for libraries
        passes: 2,
        pure_getters: true,
        toplevel: true,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log']
      },
      mangle: {
        toplevel: true
      }
    },
    target: 'esnext'
  }
});