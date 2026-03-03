import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import {
  getAllSoftwareProjects,
  getSoftwareProject,
} from "@/lib/content";

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
          {project.stack && (
            <p className="mt-4 text-sm text-ink-lighter">
              {project.stack.join(" · ")}
            </p>
          )}
        </header>
        <div className="prose max-w-text">
          <MDXRemote source={project.content} />
        </div>
      </article>
    </div>
  );
}
