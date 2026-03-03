import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNowEntries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Now",
  description: "What I'm working on, thinking about, and making right now.",
};

/**
 * Now / Studio Desk page.
 *
 * Daily entries rendered chronologically (newest first).
 * "Studio desk" metaphor — populated but not messy.
 * Sparse days look as intentional as rich days.
 * No timestamps unless they add meaning — dates only.
 */
export default function NowPage() {
  const entries = getAllNowEntries();

  return (
    <div className="mx-auto max-w-content px-5">
      <section className="py-24">
        <h1 className="text-4xl font-light text-ink md:text-5xl">Now</h1>
        <div className="mt-16 flex flex-col gap-20">
          {entries.length === 0 ? (
            <p className="text-ink-light">Nothing here yet.</p>
          ) : (
            entries.map((entry) => (
              <article key={entry.slug} className="max-w-text">
                <time className="text-sm text-ink-lighter tracking-wide">
                  {entry.date}
                </time>
                <div className="prose mt-4">
                  <MDXRemote source={entry.content} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
