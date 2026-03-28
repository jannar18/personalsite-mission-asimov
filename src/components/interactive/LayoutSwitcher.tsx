"use client";

export type LayoutMode = "scatter" | "masonry";

const LAYOUTS: { mode: LayoutMode; label: string }[] = [
  { mode: "scatter", label: "Canvas" },
  { mode: "masonry", label: "Scroll" },
];

interface LayoutSwitcherProps {
  current: LayoutMode;
  onChange: (mode: LayoutMode) => void;
}

export default function LayoutSwitcher({ current, onChange }: LayoutSwitcherProps) {
  return (
    <nav
      className="fixed left-5 z-30 flex items-center gap-0"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom, 1rem))" }}
    >
      {LAYOUTS.map(({ mode, label }, i) => (
        <span key={mode} className="flex items-center">
          {i > 0 && (
            <span
              className="text-ink-lighter/20 select-none mx-[3px]"
              style={{ fontSize: "0.45rem" }}
            >
              /
            </span>
          )}
          <button
            onClick={() => onChange(mode)}
            className={`font-mono uppercase transition-colors duration-200 bg-transparent border-0 cursor-pointer p-0
              ${
                current === mode
                  ? "text-ink-lighter/40"
                  : "text-ink-lighter/15 hover:text-ink-lighter/35"
              }`}
            style={{ fontSize: "0.5rem", letterSpacing: "0.08em" }}
          >
            {label}
          </button>
        </span>
      ))}
    </nav>
  );
}
