/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  printWidth: 120,
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
  tailwindStylesheet: "./src/app/globals.css",
};

export default config;
