import { Inter, Lora, JetBrains_Mono } from "next/font/google";

/**
 * Font configuration using next/font/google.
 *
 * Placeholder fonts — will be swapped when brand identity (ASMV-4) is finalized.
 * - Sans: Inter (placeholder for brand sans-serif)
 * - Serif: Lora (placeholder for brand serif)
 * - Mono: JetBrains Mono (placeholder for brand monospace)
 *
 * next/font automatically handles:
 * - Self-hosting (no external requests to Google)
 * - Subsetting
 * - Preloading
 * - font-display: swap
 * - Zero layout shift
 */

export const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const fontSerif = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500"],
});
