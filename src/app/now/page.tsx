import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNowEntries } from "@/lib/content";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

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
    <PageSection>
      <ContentContainer>
        <PageHeader title="Now" />
        <div className="mt-16 flex flex-col gap-20">
          {entries.length === 0 ? (
            <p className="text-ink-light">Nothing here yet.</p>
          ) : (
            entries.map((entry) => (
              <article key={entry.slug} className="max-w-text">
                <time className="font-mono text-xs uppercase tracking-wider text-ink-lighter">
                  {entry.date}
                </time>
                <div className="prose mt-4">
                  <MDXRemote source={entry.content} />
                </div>
              </article>
            ))
          )}
        </div>
      </ContentContainer>
    </PageSection>
  );
}
