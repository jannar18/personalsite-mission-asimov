import type { Metadata } from "next";
import Link from "next/link";
import { getAllArchitectureProjects } from "@/lib/content";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Architecture",
  description: "Architecture portfolio — built work, competitions, and speculative projects.",
};

/**
 * Architecture portfolio listing.
 *
 * Each project gets its own page with intentional sequencing (PRD §9).
 * Not an image grid — project cards with context.
 */
export default function ArchitecturePage() {
  const projects = getAllArchitectureProjects();

  return (
    <PageSection>
      <ContentContainer>
        <PageHeader title="Architecture" />
        <div className="flex flex-col gap-16">
          {projects.length === 0 ? (
            <p className="text-ink-light">Projects coming soon.</p>
          ) : (
            projects.map((project) => (
              <Link
                key={project.slug}
                href={`/work/architecture/${project.slug}`}
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
                {project.location && (
                  <p className="mt-1 font-mono text-xs tracking-wider text-ink-lighter">
                    {project.location}
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
