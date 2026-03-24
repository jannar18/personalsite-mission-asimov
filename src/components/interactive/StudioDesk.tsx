"use client";

import { type LayoutMode } from "./LayoutSwitcher";
import LayoutSwitcher from "./LayoutSwitcher";
import InfiniteCanvas from "./InfiniteCanvas";
import MasonryLayout from "./MasonryLayout";

export interface StudioDeskEntry {
  slug: string;
  date: string;
  mood?: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  project?: string;
  description?: string;
}

interface StudioDeskProps {
  entries: StudioDeskEntry[];
  layout: LayoutMode;
}

export default function StudioDesk({ entries, layout }: StudioDeskProps) {
  return (
    <>
      {layout === "scatter" && <InfiniteCanvas entries={entries} />}
      {layout === "masonry" && <MasonryLayout entries={entries} />}
      <LayoutSwitcher current={layout} />
    </>
  );
}
