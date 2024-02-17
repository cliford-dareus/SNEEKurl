/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    container: {
      center: true, // Centers the container by default
      screens: {
        sm: "640px", // Default Tailwind breakpoint
        md: "768px", // Default Tailwind breakpoint
        lg: "1080px", // Customizes the lg breakpoint container max-width
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
