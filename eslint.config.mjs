import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "off",  // Disable unused variables
      "@typescript-eslint/no-explicit-any": "off", // Allow `any` type
      "@typescript-eslint/explicit-module-boundary-types": "off", // Allow missing return types
      "@typescript-eslint/ban-ts-comment": "off",  // Allow @ts-ignore and other TS comments
      "@typescript-eslint/ban-types": "off", // Allow banned types like `{}` or `Function`
      "@typescript-eslint/no-inferrable-types": "off", // Allow redundant type annotations
      "@typescript-eslint/no-non-null-assertion": "off", // Allow `!` non-null assertions
      "@next/next/no-img-element": "off",  // Allow `<img>` usage in Next.js
      "react/no-unescaped-entities": "off", // Disable rule for unescaped entities
    },
  },
];

export default eslintConfig;
