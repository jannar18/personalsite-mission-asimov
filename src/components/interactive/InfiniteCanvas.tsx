"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  generateLayout,
  getInitialCamera,
  type CanvasItemLayout,
} from "@/lib/canvas-layout";

/* ── Types ── */

interface CanvasEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  project?: string;
  description?: string;
}

interface InfiniteCanvasProps {
  entries: CanvasEntry[];
}

function isVideo(src: string) {
  return /\.(mov|mp4|webm)$/i.test(src);
}

/* ── Constants ── */
const MIN_SCALE = 0.2;
const MAX_SCALE = 2.5;
const ZOOM_FACTOR_IN = 1.08;
const ZOOM_FACTOR_OUT = 0.92;
const DRAG_THRESHOLD = 5;
const LERP_FACTOR = 0.12;
const CONVERGENCE_EPSILON = 0.01;

/* ── Component ── */

export default function InfiniteCanvas({ entries }: InfiniteCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  // Dual-state camera: current lerps toward target each frame
  const current = useRef({ x: 0, y: 0, scale: 1 });
  const target = useRef({ x: 0, y: 0, scale: 1 });
  const animating = useRef(false);
  const rafId = useRef(0);

  // Drag state
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const dragOrigin = useRef({ x: 0, y: 0 });

  // Layout
  const [layout, setLayout] = useState<CanvasItemLayout[]>([]);
  const [ready, setReady] = useState(false);

  /* ── rAF animation loop ── */

  const startAnimation = useCallback(() => {
    if (animating.current) return;
    animating.current = true;

    const tick = () => {
      const c = current.current;
      const t = target.current;

      c.x += (t.x - c.x) * LERP_FACTOR;
      c.y += (t.y - c.y) * LERP_FACTOR;
      c.scale += (t.scale - c.scale) * LERP_FACTOR;

      if (worldRef.current) {
        worldRef.current.style.transform = `translate(${c.x}px, ${c.y}px) scale(${c.scale})`;
      }

      // Continue if not converged
      const dx = Math.abs(t.x - c.x);
      const dy = Math.abs(t.y - c.y);
      const ds = Math.abs(t.scale - c.scale);

      if (
        dx > CONVERGENCE_EPSILON ||
        dy > CONVERGENCE_EPSILON ||
        ds > 0.0001
      ) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        // Snap to target
        c.x = t.x;
        c.y = t.y;
        c.scale = t.scale;
        if (worldRef.current) {
          worldRef.current.style.transform = `translate(${c.x}px, ${c.y}px) scale(${c.scale})`;
        }
        animating.current = false;
      }
    };

    rafId.current = requestAnimationFrame(tick);
  }, []);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  /* ── Init layout & camera ── */

  useEffect(() => {
    const slugs = entries.map((e) => e.slug);
    const items = generateLayout(slugs);
    setLayout(items);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const initial = getInitialCamera(items, vw, vh);

    // Set both current and target to initial (no animation on load)
    current.current = { ...initial };
    target.current = { ...initial };

    if (worldRef.current) {
      worldRef.current.style.transform = `translate(${initial.x}px, ${initial.y}px) scale(${initial.scale})`;
    }
    setReady(true);
  }, [entries]);

  /* ── Pointer Events (mouse drag panning) ── */

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (e.button === 2) return; // ignore right-click
    isDragging.current = true;
    hasDragged.current = false;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    dragOrigin.current = { x: e.clientX, y: e.clientY };
    containerRef.current?.setPointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.cursor = "grabbing";
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;

      // Check if we've moved past the drag threshold
      const totalDx = e.clientX - dragOrigin.current.x;
      const totalDy = e.clientY - dragOrigin.current.y;
      if (
        !hasDragged.current &&
        Math.sqrt(totalDx * totalDx + totalDy * totalDy) > DRAG_THRESHOLD
      ) {
        hasDragged.current = true;
      }

      // Screen-space offset: translate is applied before scale in the transform,
      // so 1:1 screen-pixel mapping gives constant pan speed at any zoom level
      target.current.x += dx;
      target.current.y += dy;

      lastPointer.current = { x: e.clientX, y: e.clientY };
      startAnimation();
    },
    [startAnimation]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    containerRef.current?.releasePointerCapture(e.pointerId);
    if (containerRef.current) containerRef.current.style.cursor = "grab";
  }, []);

  /* ── Wheel Zoom (zoom toward cursor) ── */

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const t = target.current;
      const zoomFactor = e.deltaY > 0 ? ZOOM_FACTOR_OUT : ZOOM_FACTOR_IN;
      const newScale = Math.min(
        MAX_SCALE,
        Math.max(MIN_SCALE, t.scale * zoomFactor)
      );

      // Zoom toward cursor position
      const rect = container.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const cursorY = e.clientY - rect.top;

      // Convert cursor to world coordinates before scale change
      const worldX = (cursorX - t.x) / t.scale;
      const worldY = (cursorY - t.y) / t.scale;

      // Adjust offset so the world point under cursor stays under cursor
      target.current.scale = newScale;
      target.current.x = cursorX - worldX * newScale;
      target.current.y = cursorY - worldY * newScale;

      startAnimation();
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [startAnimation]);

  /* ── Render ── */

  const entryMap = new Map(entries.map((e) => [e.slug, e]));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden bg-paper"
      style={{ cursor: "grab", touchAction: "none" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Grain texture overlay */}
      <div className="grain-texture absolute inset-0 pointer-events-none z-10" />

      {/* World container — single CSS transform, no React re-renders */}
      <div
        ref={worldRef}
        className="absolute top-0 left-0"
        style={{
          transformOrigin: "0 0",
          willChange: "transform",
          opacity: ready ? 1 : 0,
          transition: "opacity 0.4s ease",
        }}
      >
        {layout.map((item) => {
          const entry = entryMap.get(item.slug);
          if (!entry) return null;

          return (
            <div
              key={item.slug}
              className="absolute"
              style={{
                left: item.x,
                top: item.y,
                width: item.width,
                height: item.height,
                transform: `rotate(${item.rotation}deg)`,
              }}
            >
              <div className="artifact-treatment relative w-full h-full rounded-sm">
                {isVideo(entry.image) ? (
                  <video
                    src={entry.image}
                    muted
                    autoPlay
                    loop
                    playsInline
                    className="w-full h-full object-cover rounded-sm"
                  />
                ) : (
                  <Image
                    src={entry.image}
                    alt={entry.description || `Artifact from ${entry.date}`}
                    fill
                    sizes={`${item.width}px`}
                    className="object-cover rounded-sm"
                    loading="lazy"
                    unoptimized
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Title overlay */}
      <div className="absolute top-6 left-6 z-20 pointer-events-none">
        <h1
          className="font-serif font-bold italic text-ink"
          style={{ fontSize: "clamp(1.25rem, 2.5vw, 2rem)" }}
        >
          the studio desk
        </h1>
        <p
          className="font-mono text-ink-lighter uppercase"
          style={{
            fontSize: "clamp(0.55rem, 0.7vw, 0.65rem)",
            letterSpacing: "0.1em",
          }}
        >
          drag to explore &middot; scroll to zoom
        </p>
      </div>
    </div>
  );
}
