import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Primary warmth */
        terracotta: "#C4724E",
        amber: "#D4A76A",
        cream: "#F5F0E8",
        "warm-gray": "#B5AFA6",

        /* Secondary earth */
        sage: "#8B9E7E",
        "dusty-rose": "#C9A5A0",
        slate: "#7A8B9A",

        /* Accent */
        coral: "#C95D45",

        /* Neutrals */
        ink: {
          DEFAULT: "#2C2824",
          light: "#5C554E",
          lighter: "#8A847D",
        },
        border: "#E2DCD5",
        surface: "#FAF8F5",
        background: "#F5F0E8",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Futura PT", "Jost", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Cormorant Garamond", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Degular Mono", "DM Mono", "monospace"],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1.6" }],
        sm: ["0.875rem", { lineHeight: "1.6" }],
        base: ["1rem", { lineHeight: "1.6" }],
        lg: ["1.125rem", { lineHeight: "1.6" }],
        xl: ["1.25rem", { lineHeight: "1.35" }],
        "2xl": ["1.5rem", { lineHeight: "1.35" }],
        "3xl": ["1.875rem", { lineHeight: "1.2" }],
        "4xl": ["2.25rem", { lineHeight: "1.2" }],
        "5xl": ["3rem", { lineHeight: "1.2" }],
        "6xl": ["3.75rem", { lineHeight: "1.2" }],
        "7xl": ["4.5rem", { lineHeight: "1.2" }],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
      },
      letterSpacing: {
        tighter: "-0.02em",
        normal: "0",
        wide: "0.05em",
        wider: "0.1em",
      },
      lineHeight: {
        tight: "1.2",
        snug: "1.35",
        normal: "1.6",
        relaxed: "1.75",
      },
      spacing: {
        /* Extended spacing scale for generous section gaps */
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        34: "8.5rem",
        38: "9.5rem",
        42: "10.5rem",
      },
      maxWidth: {
        content: "72rem",
        text: "40rem",
      },
      /* ── @tailwindcss/typography — Brand customization ──
       * Serif body, sans headings, mono code, terracotta links.
       * Matches brand-guide §4 and tokens.css color system.
       */
      typography: {
        DEFAULT: {
          css: {
            /* Body text: serif, ink color, relaxed reading */
            fontFamily: "var(--font-serif), Cormorant Garamond, Georgia, serif",
            color: "#2C2824", /* ink */
            lineHeight: "1.75",
            /* Headings: sans, medium weight, tight tracking */
            "h1, h2, h3, h4, h5, h6": {
              fontFamily: "var(--font-sans), Futura PT, Jost, system-ui, sans-serif",
              fontWeight: "500",
              letterSpacing: "-0.02em",
              color: "#2C2824", /* ink */
            },
            h1: { fontSize: "1.875rem", lineHeight: "1.2" },
            h2: { fontSize: "1.5rem", lineHeight: "1.35" },
            h3: { fontSize: "1.25rem", lineHeight: "1.35" },
            h4: { fontSize: "1.125rem", lineHeight: "1.35" },
            /* Links: terracotta accent, no underline, hover to coral */
            a: {
              color: "#C4724E", /* terracotta */
              textDecoration: "none",
              fontWeight: "inherit",
              transition: "color 0.2s ease",
              "&:hover": {
                color: "#C95D45", /* coral */
              },
            },
            /* Strong: medium weight, not bold */
            strong: {
              fontWeight: "500",
              color: "#2C2824", /* ink */
            },
            /* Blockquotes: left border terracotta, italic serif */
            blockquote: {
              fontStyle: "italic",
              borderLeftColor: "#C4724E", /* terracotta */
              borderLeftWidth: "2px",
              color: "#5C554E", /* ink-light */
              paddingLeft: "1.5rem",
            },
            /* Code: mono font, slate background */
            code: {
              fontFamily: "var(--font-mono), Degular Mono, DM Mono, monospace",
              color: "#2C2824", /* ink */
              backgroundColor: "#FAF8F5", /* surface */
              borderRadius: "0.25rem",
              padding: "0.125rem 0.375rem",
              fontSize: "0.875em",
              fontWeight: "400",
            },
            "code::before": { content: '""' },
            "code::after": { content: '""' },
            /* Pre blocks: surface background */
            pre: {
              backgroundColor: "#FAF8F5", /* surface */
              color: "#2C2824", /* ink */
              borderRadius: "0.375rem",
              border: "1px solid #E2DCD5", /* border color */
            },
            "pre code": {
              backgroundColor: "transparent",
              padding: "0",
              borderRadius: "0",
            },
            /* Horizontal rules: border color */
            hr: {
              borderColor: "#E2DCD5", /* border */
            },
            /* Lists: ink-light bullets */
            "ul > li::marker": {
              color: "#B5AFA6", /* warm-gray */
            },
            "ol > li::marker": {
              color: "#B5AFA6", /* warm-gray */
            },
            /* Figures and captions */
            figcaption: {
              fontFamily: "var(--font-sans), Futura PT, Jost, system-ui, sans-serif",
              fontSize: "0.875rem",
              color: "#8A847D", /* ink-lighter */
              letterSpacing: "0.05em",
            },
            /* Table styling */
            "thead th": {
              fontFamily: "var(--font-sans), Futura PT, Jost, system-ui, sans-serif",
              fontWeight: "500",
              borderBottomColor: "#E2DCD5", /* border */
              color: "#2C2824", /* ink */
            },
            "tbody td": {
              borderBottomColor: "#E2DCD5", /* border */
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
