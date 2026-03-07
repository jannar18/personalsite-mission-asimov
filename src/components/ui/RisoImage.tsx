"use client";

import React, { useId } from "react";

interface RisoImageProps {
  src: string;
  alt: string;
  className?: string;
  mode?: "threshold" | "full";
  breathability?: number;
  inkColor?: string;
}

/**
 * RisoImage — Simplified version to debug 500 error.
 */
export default function RisoImage({
  src,
  alt,
  className = "",
  mode = "threshold",
  breathability = 0.6,
  inkColor = "#4a635d",
}: RisoImageProps) {
  const id = useId().replace(/:/g, "");
  const filterId = `f${id}`;

  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return [r, g, b];
  };

  const ink = hexToRgb(inkColor);
  const cutoff = 1.0 - (breathability * 0.4);

  return (
    <div className={`relative overflow-hidden bg-paper ${className}`} style={{ backgroundColor: "#FDFCEA" }}>
      <img
        src={src}
        alt={alt}
        className="relative z-10 w-full h-auto"
        style={{
          filter: `url(#${filterId}) grayscale(1) contrast(1.1)`,
          mixBlendMode: "multiply",
        }}
      />

      <svg className="absolute w-0 h-0 invisible" aria-hidden="true">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB">
            {/* Simple Halftone Grain */}
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" result="noise" />
            <feColorMatrix in="noise" type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 10 -5" result="dots" />
            <feComposite in="SourceGraphic" in2="dots" operator="in" result="textured" />

            {/* Threshold to Riso Palette */}
            <feColorMatrix
              in="textured"
              type="matrix"
              values={`0 0 0 0 ${ink[0]} 0 0 0 0 ${ink[1]} 0 0 0 0 ${ink[2]} ${cutoff} 0 0 0 -${cutoff * 0.3}`}
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
