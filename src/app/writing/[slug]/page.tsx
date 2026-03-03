import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllWritingPosts, getWritingPost } from "@/lib/content";

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
        <header className="mb-16">
          <h1 className="text-4xl font-light text-ink md:text-5xl">
            {post.title}
          </h1>
          {post.description && (
            <p className="mt-4 max-w-text text-lg text-ink-light">
              {post.description}
            </p>
          )}
          <p className="mt-4 text-sm text-ink-lighter">{post.date}</p>
        </header>
        <div className="prose max-w-text">
          <MDXRemote source={post.content} />
        </div>
      </article>
    </div>
  );
}
