/**
 * Deterministic layout generator for infinite canvas items.
 * Positions are seeded from entry slugs so they're stable across renders.
 */

/* ── Seeded PRNG (mulberry32) ── */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return Math.abs(hash);
}

/* ── Layout Types ── */
export interface CanvasItemLayout {
  slug: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface LayoutConfig {
  /** Virtual canvas width */
  worldWidth: number;
  /** Virtual canvas height */
  worldHeight: number;
  /** Base item size (px) */
  baseSize: number;
  /** Size variation range [min multiplier, max multiplier] */
  sizeRange: [number, number];
  /** Max rotation in degrees */
  maxRotation: number;
  /** Minimum distance between item centers */
  minDistance: number;
}

const DEFAULT_CONFIG: LayoutConfig = {
  worldWidth: 3000,
  worldHeight: 2500,
  baseSize: 280,
  sizeRange: [0.72, 1.43],  // yields ~200-400px width range
  maxRotation: 3,
  minDistance: 260,
};

/**
 * Generate deterministic, scattered positions for canvas items.
 * Uses rejection sampling to avoid overlapping items.
 */
export function generateLayout(
  slugs: string[],
  config: Partial<LayoutConfig> = {}
): CanvasItemLayout[] {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  const items: CanvasItemLayout[] = [];
  const padding = 100; // Keep items away from edges

  for (const slug of slugs) {
    const seed = hashString(slug);
    const rng = mulberry32(seed);

    const sizeMult = cfg.sizeRange[0] + rng() * (cfg.sizeRange[1] - cfg.sizeRange[0]);
    const width = cfg.baseSize * sizeMult;
    const height = cfg.baseSize * sizeMult;
    const rotation = (rng() - 0.5) * 2 * cfg.maxRotation;

    // Try up to 50 positions to find one that doesn't overlap
    let bestX = padding + rng() * (cfg.worldWidth - width - padding * 2);
    let bestY = padding + rng() * (cfg.worldHeight - height - padding * 2);
    let bestMinDist = 0;

    for (let attempt = 0; attempt < 50; attempt++) {
      const candidateX =
        padding + rng() * (cfg.worldWidth - width - padding * 2);
      const candidateY =
        padding + rng() * (cfg.worldHeight - height - padding * 2);

      // Find minimum distance to existing items
      let minDist = Infinity;
      for (const existing of items) {
        const cx = candidateX + width / 2;
        const cy = candidateY + height / 2;
        const ex = existing.x + existing.width / 2;
        const ey = existing.y + existing.height / 2;
        const dist = Math.sqrt((cx - ex) ** 2 + (cy - ey) ** 2);
        minDist = Math.min(minDist, dist);
      }

      if (minDist >= cfg.minDistance) {
        bestX = candidateX;
        bestY = candidateY;
        break;
      }

      // Keep the best candidate so far
      if (minDist > bestMinDist) {
        bestMinDist = minDist;
        bestX = candidateX;
        bestY = candidateY;
      }
    }

    items.push({ slug, x: bestX, y: bestY, width, height, rotation });
  }

  return items;
}

/**
 * Calculate initial camera offset to center the canvas items in the viewport.
 */
export function getInitialCamera(
  items: CanvasItemLayout[],
  viewportWidth: number,
  viewportHeight: number
): { x: number; y: number; scale: number } {
  if (items.length === 0) {
    return { x: 0, y: 0, scale: 1 };
  }

  // Find bounding box of all items
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;

  for (const item of items) {
    minX = Math.min(minX, item.x);
    minY = Math.min(minY, item.y);
    maxX = Math.max(maxX, item.x + item.width);
    maxY = Math.max(maxY, item.y + item.height);
  }

  const contentWidth = maxX - minX;
  const contentHeight = maxY - minY;
  const centerX = minX + contentWidth / 2;
  const centerY = minY + contentHeight / 2;

  // Scale to fit with some padding
  const scaleX = viewportWidth / (contentWidth + 200);
  const scaleY = viewportHeight / (contentHeight + 200);
  const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in past 1:1

  const x = viewportWidth / 2 - centerX * scale;
  const y = viewportHeight / 2 - centerY * scale;

  return { x, y, scale };
}
