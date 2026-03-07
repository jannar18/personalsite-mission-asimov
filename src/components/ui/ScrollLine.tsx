"use client";

import { useEffect, useRef, useState } from "react";

/**
 * ScrollLine — A thin line that extends into view as you scroll near it.
 *
 * Uses IntersectionObserver with a rootMargin to trigger before the
 * element is fully in view, giving the "approaching" feel.
 *
 * Props:
 *   origin: which side the line extends from ("left" | "right" | "center")
 *   color:  CSS color string (defaults to ink at low opacity)
 */
export default function ScrollLine({
  origin = "left",
  color,
  className = "",
}: {
  origin?: "left" | "right" | "center";
  color?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
        else setVisible(false);
      },
      {
        // Trigger when within 15% of viewport edge
        rootMargin: "0px 0px -15% 0px",
        threshold: 0,
      },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const transformOrigin =
    origin === "right"
      ? "right center"
      : origin === "center"
        ? "center center"
        : "left center";

  return (
    <div ref={ref} className={`w-full overflow-hidden ${className}`}>
      <div
        className="h-px transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          backgroundColor: color || "rgba(var(--color-ink-rgb), 0.12)",
          transformOrigin,
          transform: visible ? "scaleX(1)" : "scaleX(0)",
        }}
      />
    </div>
  );
}
