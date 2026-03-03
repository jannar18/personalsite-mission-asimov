import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllWritingPosts, getWritingPost } from "@/lib/content";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

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
    <PageSection>
      <ContentContainer as="article">
        <PageHeader
          title={post.title}
          subtitle={post.description}
          metadata={
            <time className="font-mono text-xs uppercase tracking-wider">
              {post.date}
            </time>
          }
        />
        <div className="prose max-w-text">
          <MDXRemote source={post.content} />
        </div>
      </ContentContainer>
    </PageSection>
  );
}
