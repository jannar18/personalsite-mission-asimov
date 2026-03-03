import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllArchitectureProjects,
  getArchitectureProject,
} from "@/lib/content";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

/**
 * Architecture project detail page.
 *
 * Renders a single architecture project from MDX content.
 * Follows PRD §9: project pages (not image grids), mixed media,
 * brief context, generous whitespace.
 */

export function generateStaticParams() {
  const projects = getAllArchitectureProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getArchitectureProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
  };
}

export default async function ArchitectureProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getArchitectureProject(slug);
  if (!project) notFound();

  return (
    <PageSection>
      <ContentContainer as="article">
        <PageHeader
          title={project.title}
          subtitle={project.description}
          metadata={
            <span className="flex gap-4 font-mono text-xs uppercase tracking-wider">
              {project.location && <span>{project.location}</span>}
              {project.typology && <span>{project.typology}</span>}
            </span>
          }
        />
        <div className="prose max-w-text">
          <MDXRemote source={project.content} />
        </div>
      </ContentContainer>
    </PageSection>
  );
}
