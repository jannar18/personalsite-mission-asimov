import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllArchitectureProjects,
  getArchitectureProject,
} from "@/lib/content";

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
    <div className="mx-auto max-w-content px-5">
      <article className="py-24">
        <header className="mb-16">
          <h1 className="text-4xl font-light text-ink md:text-5xl">
            {project.title}
          </h1>
          {project.description && (
            <p className="mt-4 max-w-text text-lg text-ink-light">
              {project.description}
            </p>
          )}
          <div className="mt-4 flex gap-4 text-sm text-ink-lighter">
            {project.location && <span>{project.location}</span>}
            {project.typology && <span>{project.typology}</span>}
          </div>
        </header>
        <div className="prose max-w-text">
          <MDXRemote source={project.content} />
        </div>
      </article>
    </div>
  );
}
