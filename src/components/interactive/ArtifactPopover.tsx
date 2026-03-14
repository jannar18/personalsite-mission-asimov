"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { isVideo } from "@/lib/media-utils";

export interface ArtifactEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  project?: string;
  description?: string;
}

interface ArtifactPopoverProps {
  entry: ArtifactEntry;
  onClose: () => void;
}

export default function ArtifactPopover({
  entry,
  onClose,
}: ArtifactPopoverProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Focus trap + Escape key
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;

    // Focus the dialog on open
    el.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      // Simple focus trap: keep Tab within dialog
      if (e.key === "Tab") {
        const focusable = el.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      {/* Scrim */}
      <div
        className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={entry.description || `Artifact from ${entry.date}`}
        tabIndex={-1}
        className="fixed inset-0 z-[70] flex items-center justify-center p-8 pointer-events-none outline-none"
      >
        <div className="pointer-events-auto w-full max-w-3xl rounded-lg bg-surface shadow-2xl ring-1 ring-border overflow-hidden">
          <div className="bg-paper p-6">
            {isVideo(entry.image) ? (
              <video
                src={entry.image}
                muted
                autoPlay
                loop
                playsInline
                controls
                className="mx-auto h-auto max-h-[75vh] w-auto object-contain"
              />
            ) : (
              <Image
                src={entry.image}
                alt={entry.description || `Artifact from ${entry.date}`}
                width={1200}
                height={1200}
                className="mx-auto h-auto max-h-[75vh] w-auto object-contain"
                unoptimized
              />
            )}
          </div>

          <div className="px-5 py-4 flex items-start justify-between">
            <div>
              <p
                className="font-sans text-ink-lighter uppercase"
                style={{ fontSize: "0.7rem", letterSpacing: "0.1em" }}
              >
                {entry.date}
                {entry.mood && (
                  <span className="ml-2 normal-case italic text-ink-light">
                    {entry.mood}
                  </span>
                )}
              </p>
              {entry.project && (
                <p className="mt-1 font-mono text-xs text-ink-light">
                  {entry.project}
                </p>
              )}
              {entry.description && (
                <p className="mt-2 text-sm text-ink-light leading-relaxed">
                  {entry.description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 shrink-0 font-mono text-xs uppercase tracking-wider text-ink-lighter hover:text-ink transition-colors"
              aria-label="Close"
            >
              Esc
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
