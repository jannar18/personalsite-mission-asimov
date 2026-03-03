import type { Metadata } from "next";
import Link from "next/link";
import { getAllWritingPosts } from "@/lib/content";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays and reflections on architecture, software, and practice.",
};

/**
 * Writing listing page.
 *
 * Chronological listing of essays and posts.
 * Editorial pacing — generous spacing between entries.
 */
export default function WritingPage() {
  const posts = getAllWritingPosts();

  return (
    <PageSection>
      <ContentContainer>
        <PageHeader title="Writing" />
        <div className="flex flex-col gap-12">
          {posts.length === 0 ? (
            <p className="text-ink-light">Essays coming soon.</p>
          ) : (
            posts.map((post) => (
              <Link
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="group block"
              >
                <h2 className="text-2xl font-light text-ink transition-colors group-hover:text-terracotta">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-2 max-w-text text-base text-ink-light">
                    {post.description}
                  </p>
                )}
                <p className="mt-1 font-mono text-xs tracking-wider text-ink-lighter">
                  {post.date}
                </p>
              </Link>
            ))
          )}
        </div>
      </ContentContainer>
    </PageSection>
  );
}
