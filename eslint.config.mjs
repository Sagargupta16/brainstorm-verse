import coreWebVitals from "eslint-config-next/core-web-vitals";
import * as espree from "espree";

const eslintConfig = [
  ...coreWebVitals,
  {
    ignores: [".next/**", "node_modules/**"],
  },
  {
    // eslint-plugin-react's version auto-detect breaks on ESLint 10
    settings: {
      react: {
        version: "19.2.6",
      },
    },
  },
  {
    // Next's bundled babel parser predates ESLint 10; use espree for JS files
    files: ["**/*.{js,jsx,mjs,cjs}"],
    languageOptions: {
      parser: espree,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
  },
];

export default eslintConfig;
