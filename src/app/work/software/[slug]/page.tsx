import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllSoftwareProjects,
  getSoftwareProject,
} from "@/lib/content";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

/**
 * Software project detail page.
 *
 * Renders a single software project from MDX content.
 */

export function generateStaticParams() {
  const projects = getAllSoftwareProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getSoftwareProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function SoftwareProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getSoftwareProject(slug);
  if (!project) notFound();

  return (
    <PageSection>
      <ContentContainer as="article">
        <PageHeader
          title={project.title}
          subtitle={project.description}
          metadata={
            project.stack && (
              <span className="font-mono text-xs uppercase tracking-wider">
                {project.stack.join(" · ")}
              </span>
            )
          }
        />
        <div className="prose max-w-text">
          <MDXRemote source={project.content} />
        </div>
      </ContentContainer>
    </PageSection>
  );
}
