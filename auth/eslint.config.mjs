import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    extends: [js.configs.recommended], // ✅ Use this instead
    languageOptions: { globals: globals.browser },
    rules: {
      "no-multiple-empty-lines": ["error", { max: 1 }],
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },
  tseslint.configs.recommended,
]);
