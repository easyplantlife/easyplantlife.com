import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Prettier integration - must come after other configs to override conflicting rules
  eslintPluginPrettier,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Coverage output from Jest:
    "coverage/**",
  ]),
  // TypeScript strict rules
  {
    rules: {
      // Ensure TypeScript type errors are caught
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      // Prettier formatting errors should be reported as errors
      "prettier/prettier": "error",
    },
  },
]);

export default eslintConfig;
