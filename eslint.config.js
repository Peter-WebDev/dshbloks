import eslint from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      'dist',
      '.output',
      '.vinxi',
      'node_modules',
      'src/generated',
      '*.config.js',
    ],
  },
];