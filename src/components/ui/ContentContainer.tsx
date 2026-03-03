import { type ReactNode } from "react";

/**
 * ContentContainer — Centered content wrapper with max-width and horizontal padding.
 *
 * The standard content container for all page content. Applies consistent
 * max-width (72rem / 1152px) and horizontal padding matching the Asimov
 * spacing system (20px mobile, scales up).
 *
 * Props:
 * - `as`: HTML element to render (default: "div")
 * - `width`: "full" (max-w-content) or "text" (max-w-text, 640px)
 * - `className`: Additional classes
 */

interface ContentContainerProps {
  children: ReactNode;
  as?: "div" | "section" | "article" | "main";
  width?: "full" | "text";
  className?: string;
}

export default function ContentContainer({
  children,
  as: Component = "div",
  width = "full",
  className = "",
}: ContentContainerProps) {
  const widthClass = width === "text" ? "max-w-text" : "max-w-content";

  return (
    <Component
      className={`mx-auto ${widthClass} px-5 ${className}`.trim()}
    >
      {children}
    </Component>
  );
}
