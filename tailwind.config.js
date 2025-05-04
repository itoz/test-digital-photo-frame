// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  safelist: [
    {
      pattern: /aspect-\[\d+\/\d+\]/, // aspect-[4/3] などを許可
    },
  ],
  plugins: [],
};
