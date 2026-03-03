import { type ReactNode } from "react";

/**
 * PageHeader — Consistent page title block with optional subtitle and metadata.
 *
 * Used at the top of every page for a unified typographic treatment.
 * Title uses the sans font (Futura PT / Jost) at display scale,
 * subtitle uses serif at body scale. Metadata slot for dates, locations, etc.
 *
 * Follows the brand guide: headings in font-sans, light weight (300),
 * tight tracking for display sizes, ink color.
 */

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  metadata?: ReactNode;
  className?: string;
}

export default function PageHeader({
  title,
  subtitle,
  metadata,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`mb-16 ${className}`.trim()}>
      <h1 className="text-4xl font-light tracking-tighter text-ink md:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-4 max-w-text text-lg leading-relaxed text-ink-light">
          {subtitle}
        </p>
      )}
      {metadata && (
        <div className="mt-4 text-sm tracking-wide text-ink-lighter">
          {metadata}
        </div>
      )}
    </header>
  );
}
