import { Cormorant_Garamond, Jost, DM_Mono } from "next/font/google";

/**
 * Font configuration — Parallax brand typography.
 *
 * Final typeface decisions:
 *   Headings / Nav: Futura PT (Adobe Fonts)    — stand-in: Jost
 *   Body text:      Cormorant Garamond          — final (Google Fonts)
 *   Mono / Labels:  Degular Mono (Adobe Fonts)  — stand-in: DM Mono
 *
 * Upgrade path: Acquire Futura PT and Degular Mono web font licenses
 * (e.g., via MyFonts or a foundry that permits self-hosting), place
 * .woff2 files in public/fonts/, then swap to next/font/local.
 * Alternatively, use Adobe Fonts' hosted web project (requires their
 * CSS embed instead of next/font). The CSS variable names stay the
 * same — no downstream changes needed either way.
 */

export const fontSans = Jost({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const fontSerif = Cormorant_Garamond({
  subsets: ["latin", "latin-ext"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export const fontMono = DM_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
  display: "swap",
  weight: ["300", "400", "500"],
});
