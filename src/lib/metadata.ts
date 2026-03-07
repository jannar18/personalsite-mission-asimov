import type { Metadata } from "next";

/**
 * Shared metadata configuration.
 * Site title, description, and OG defaults for Parallax (parallax.haus).
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://parallax.haus";

export const siteMetadata: Metadata = {
  title: {
    default: "Parallax",
    template: "%s — Parallax",
  },
  description:
    "Depth revealed through perspective. Architecture, software, and AI.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Parallax",
    title: "Parallax",
    description:
      "Depth revealed through perspective. Architecture, software, and AI.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};
