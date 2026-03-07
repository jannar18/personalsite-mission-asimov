"use client";

import { useEffect, useRef } from "react";

/**
 * FooterCanvas — Static single-frame wire network.
 *
 * Renders one frame of a procedural node/wire network similar to the hero
 * canvas, but static (no animation, no mouse tracking). Used as a subtle
 * background layer in the footer.
 */

interface Node {
  x: number;
  y: number;
  phase: number;
}

interface Edge {
  from: number;
  to: number;
  alpha: number;
  weight: number;
}

function generateNetwork(w: number, h: number): { nodes: Node[]; edges: Edge[] } {
  const nodeCount = 60;
  const nodes: Node[] = [];
  const rng = (seed: number) => {
    // Simple deterministic PRNG for consistent render
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  };
  const rand = rng(42);

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: rand() * w,
      y: rand() * h,
      phase: rand() * Math.PI * 2,
    });
  }

  const edges: Edge[] = [];
  const maxDist = Math.min(w, h) * 0.3;

  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < maxDist) {
        edges.push({
          from: i,
          to: j,
          alpha: 0.1 + rand() * 0.25,
          weight: 0.3 + rand() * 0.5,
        });
      }
    }
  }

  // A few long-range edges
  for (let i = 0; i < 8; i++) {
    const a = Math.floor(rand() * nodeCount);
    let b = Math.floor(rand() * nodeCount);
    while (b === a) b = Math.floor(rand() * nodeCount);
    edges.push({
      from: a,
      to: b,
      alpha: 0.04 + rand() * 0.08,
      weight: 0.2 + rand() * 0.3,
    });
  }

  return { nodes, edges };
}

export default function FooterCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const { nodes, edges } = generateNetwork(w, h);
    const inkRGB = "253,252,234"; // paper color for dark bg

    // Draw edges
    for (const edge of edges) {
      const nA = nodes[edge.from];
      const nB = nodes[edge.to];
      ctx.strokeStyle = `rgba(${inkRGB},${edge.alpha})`;
      ctx.lineWidth = edge.weight;
      ctx.beginPath();
      ctx.moveTo(nA.x, nA.y);
      ctx.lineTo(nB.x, nB.y);
      ctx.stroke();
    }

    // Draw nodes
    for (const node of nodes) {
      const a = 0.15 + 0.1 * Math.sin(node.phase);
      ctx.fillStyle = `rgba(${inkRGB},${a})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-[0.08] mix-blend-screen pointer-events-none"
    />
  );
}
