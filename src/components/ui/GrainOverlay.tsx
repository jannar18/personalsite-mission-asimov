/**
 * GrainOverlay — Subtle paper texture using CSS SVG feTurbulence filter.
 *
 * Renders a fixed, full-viewport overlay that adds grain/noise to the page.
 * Pointer events pass through. The effect is subtle (3% opacity, multiply blend).
 *
 * Based on the grain technique from research/03-graphics-pipeline-final.md
 * and the CSS demo in research/asset-workflows/css-grain-overlay.html.
 */
export default function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
