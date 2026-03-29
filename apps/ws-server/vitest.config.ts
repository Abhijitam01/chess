import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    // Prefer .ts over .js so stale compiled files don't shadow TypeScript source
    extensions: [".ts", ".tsx", ".mjs", ".js", ".jsx", ".json"],
    // Strip .js extensions so vitest can find .ts source files in workspace packages
    extensionAlias: {
      ".js": [".ts", ".js"],
    },
    alias: {
      "@repo/types": path.resolve(__dirname, "../../packages/types/src/index.ts"),
      "@repo/db": path.resolve(__dirname, "../../packages/db/src/index.ts"),
      "@chess/chess-engine": path.resolve(__dirname, "../../packages/chess-engine/src/index.ts"),
    },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.ts"],
      exclude: ["src/__tests__/**", "src/test-db.ts", "src/index.ts"],
    },
  },
});
