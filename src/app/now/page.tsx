import type { Metadata } from "next";
import { getAllNowEntries } from "@/lib/content";
import InfiniteCanvas from "@/components/interactive/InfiniteCanvas";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm working on, thinking about, and making right now.",
};

/**
 * Now / Studio Desk page.
 *
 * Infinite canvas — a freeform, pannable, zoomable surface
 * where artifacts float at varied positions and scales,
 * like objects scattered on a designer's desk.
 */
export default function NowPage() {
  const entries = getAllNowEntries();

  // Filter to entries with images/videos for the canvas
  const canvasEntries = entries
    .filter((entry) => entry.image)
    .map((entry) => ({
      slug: entry.slug,
      date: entry.date,
      mood: entry.mood,
      image: entry.image!,
      project: entry.project,
      description: entry.description,
    }));

  return <InfiniteCanvas entries={canvasEntries} />;
}
