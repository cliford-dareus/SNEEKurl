/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base colors using CSS variables
        base: {
          100: "oklch(var(--color-base-100))",
          200: "oklch(var(--color-base-200))",
          300: "oklch(var(--color-base-300))",
          content: "oklch(var(--color-base-content))",
        },
        primary: {
          DEFAULT: "oklch(var(--color-primary))",
          content: "oklch(var(--color-primary-content))",
        },
        secondary: {
          DEFAULT: "oklch(var(--color-secondary))",
          content: "oklch(var(--color-secondary-content))",
        },
        accent: {
          DEFAULT: "oklch(var(--color-accent))",
          content: "oklch(var(--color-accent-content))",
        },
        neutral: {
          DEFAULT: "oklch(var(--color-neutral))",
          content: "oklch(var(--color-neutral-content))",
        },
        info: {
          DEFAULT: "oklch(var(--color-info))",
          content: "oklch(var(--color-info-content))",
        },
        success: {
          DEFAULT: "oklch(var(--color-success))",
          content: "oklch(var(--color-success-content))",
        },
        warning: {
          DEFAULT: "oklch(var(--color-warning))",
          content: "oklch(var(--color-warning-content))",
        },
        error: {
          DEFAULT: "oklch(var(--color-error))",
          content: "oklch(var(--color-error-content))",
        },
      },
      borderRadius: {
        selector: "var(--radius-selector)",
        field: "var(--radius-field)",
        box: "var(--radius-box)",
      },
    },
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
