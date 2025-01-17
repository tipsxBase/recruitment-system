import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts"],
  splitting: false,
  dts: true,
  sourcemap: false,
  format: "cjs",
  clean: true,
});
