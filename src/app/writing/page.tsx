import type { Metadata } from "next";
import Link from "next/link";
import { getAllWritingPosts } from "@/lib/content";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Writing",
  description: "Essays, book reviews, and session logs from the studio.",
};

export default function WritingPage() {
  const posts = getAllWritingPosts();

  return (
    <div className="mx-auto max-w-content px-5">
      <div className="py-24">
        {/* Page header */}
        <header className="mb-20">
          <h1 className="text-5xl font-light text-ink">Writing</h1>
          <p className="mt-4 max-w-text text-lg text-ink-light leading-relaxed">
            Essays, book reviews, and session logs from the studio.
          </p>
        </header>

        {/* Post list */}
        <div className="divide-y divide-border">
          {posts.map((post) => (
            <article key={post.slug} className="py-10">
              <Link href={`/writing/${post.slug}`} className="group block">
                <p className="font-mono text-xs text-ink-lighter uppercase tracking-wider">
                  {formatDate(post.date)}
                </p>
                <h2 className="mt-2 text-2xl font-light text-ink transition-colors group-hover:text-scarlet md:text-3xl">
                  {post.title}
                </h2>
                {post.description && (
                  <p className="mt-3 max-w-text text-base text-ink-light leading-relaxed">
                    {post.description}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex gap-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="font-mono text-xs text-ink-lighter uppercase tracking-wider"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
