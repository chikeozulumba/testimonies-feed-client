/**
 * @type {import('@types/tailwindcss/tailwind-config').TailwindConfig}
 */
module.exports = {
  mode: 'jit',
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/**/*.{ts,tsx}",
    "./public/**/*.html",
  ],
  plugins: [require("flowbite/plugin")],
  theme: {},
};
