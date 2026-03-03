import type { Metadata } from "next";
import Link from "next/link";
import { getAllSoftwareProjects } from "@/lib/content";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Software",
  description: "Software portfolio — products, tools, and experiments in code and AI.",
};

/**
 * Software portfolio listing.
 *
 * Project cards with context — title, description, stack.
 */
export default function SoftwarePage() {
  const projects = getAllSoftwareProjects();

  return (
    <PageSection>
      <ContentContainer>
        <PageHeader title="Software" />
        <div className="flex flex-col gap-16">
          {projects.length === 0 ? (
            <p className="text-ink-light">Projects coming soon.</p>
          ) : (
            projects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/software/${project.slug}`}
                className="group block"
              >
                <h2 className="text-2xl font-light text-ink transition-colors group-hover:text-terracotta">
                  {project.title}
                </h2>
                {project.description && (
                  <p className="mt-2 max-w-text text-base text-ink-light">
                    {project.description}
                  </p>
                )}
                {project.stack && (
                  <p className="mt-1 font-mono text-xs tracking-wider text-ink-lighter">
                    {project.stack.join(" · ")}
                  </p>
                )}
              </Link>
            ))
          )}
        </div>
      </ContentContainer>
    </PageSection>
  );
}
