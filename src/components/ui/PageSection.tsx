import { type ReactNode } from "react";

/**
 * PageSection — Semantic section wrapper with vertical spacing and background options.
 *
 * Provides consistent vertical rhythm between sections. Supports background
 * alternation for visual pacing — cream (default), surface (elevated), and
 * accent (terracotta tint) variants.
 *
 * Follows the Asimov spacing model: generous vertical gaps (py-24 default,
 * py-32 for large sections) with section-level background color shifts to
 * create editorial pacing without heavy borders or dividers.
 *
 * Props:
 * - `background`: Visual variant — "default" (cream), "surface" (slightly lighter),
 *   "accent" (terracotta ghost tint), "ink" (dark section)
 * - `spacing`: Vertical padding — "md" (py-24), "lg" (py-32), "xl" (py-40)
 * - `className`: Additional classes
 */

interface PageSectionProps {
  children: ReactNode;
  background?: "default" | "surface" | "accent" | "ink";
  spacing?: "md" | "lg" | "xl";
  className?: string;
}

const backgroundClasses: Record<string, string> = {
  default: "",
  surface: "bg-surface",
  accent: "bg-[#F2E8DF]", // Terracotta 5% tint on cream — near-cream warmth
  ink: "bg-ink text-cream",
};

const spacingClasses: Record<string, string> = {
  md: "py-24",
  lg: "py-32",
  xl: "py-40",
};

export default function PageSection({
  children,
  background = "default",
  spacing = "md",
  className = "",
}: PageSectionProps) {
  return (
    <section
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`.trim()}
    >
      {children}
    </section>
  );
}
