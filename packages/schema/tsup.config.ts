import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  splitting: false,
  dts: true,
  sourcemap: false,
  format: ["cjs", "esm"],
  outDir: "dist",
  clean: true,
  treeshake: true,
  target: "es2020",
  minify: false,
});
