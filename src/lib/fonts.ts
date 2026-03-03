import { Cormorant_Garamond, Jost, DM_Mono } from "next/font/google";

/**
 * Font configuration — Parallax brand typography.
 *
 * Final typeface decisions:
 *   Headings / Nav: Futura PT (Adobe Fonts)    — stand-in: Jost
 *   Body text:      Cormorant Garamond          — final (Google Fonts)
 *   Mono / Labels:  Degular Mono (Adobe Fonts)  — stand-in: DM Mono
 *
 * Upgrade path: Export Futura PT and Degular Mono from Adobe Creative
 * Cloud, place .woff2 files in public/fonts/, then swap to
 * next/font/local. The CSS variable names (--font-sans, --font-serif,
 * --font-mono) stay the same — no downstream changes needed.
 */

export const fontSans = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const fontSerif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const fontMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});
