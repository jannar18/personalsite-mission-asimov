"use client";

/**
 * SmoothScroll — Lenis smooth scroll provider (stub).
 *
 * STUB: Currently passes children through with no smooth scroll behavior.
 * CSS `scroll-behavior: smooth` in globals.css provides baseline smoothing.
 *
 * To activate Lenis:
 * 1. `pnpm add lenis`
 * 2. Import Lenis and initialize in a useEffect here
 * 3. Wrap children or apply to document scroll
 *
 * Reference: Asimov Collective uses Lenis across all client sites.
 * See research/01-asimov-collective-analysis.md for patterns.
 */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  // TODO: Initialize Lenis smooth scroll here when ready
  // const lenisRef = useRef<Lenis | null>(null);
  // useEffect(() => {
  //   const lenis = new Lenis({ duration: 1.2, easing: (t) => ... });
  //   lenisRef.current = lenis;
  //   function raf(time: number) { lenis.raf(time); requestAnimationFrame(raf); }
  //   requestAnimationFrame(raf);
  //   return () => lenis.destroy();
  // }, []);

  return <>{children}</>;
}
