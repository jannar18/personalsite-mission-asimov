import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllWritingPosts, getWritingPost } from "@/lib/content";
import { formatDate } from "@/lib/format";

/**
 * Writing detail page — renders a single essay/post from MDX.
 */

export function generateStaticParams() {
  const posts = getAllWritingPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getWritingPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function WritingDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getWritingPost(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-content px-5">
      <article className="py-24">
        {/* Back link */}
        <Link
          href="/writing"
          className="inline-flex items-center gap-1.5 font-mono text-xs text-ink-lighter uppercase tracking-wider transition-colors hover:text-scarlet"
        >
          &larr; Writing
        </Link>

        <header className="mt-8 mb-16">
          <p className="font-mono text-xs text-ink-lighter uppercase tracking-wider">
            {formatDate(post.date)}
          </p>
          <h1 className="mt-3 text-4xl font-light text-ink md:text-5xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 max-w-text text-lg text-ink-light leading-relaxed">
              {post.description}
            </p>
          )}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex gap-3">
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
        </header>

        <div className="prose max-w-text">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
