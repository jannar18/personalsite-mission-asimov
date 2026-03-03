import type { Metadata } from "next";
import Link from "next/link";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected work in architecture and software.",
};

/**
 * Work overview — entry point to both disciplines.
 *
 * Links to architecture and software portfolio sections.
 * Will evolve into featured project highlights with large-format imagery.
 */
export default function WorkPage() {
  return (
    <PageSection>
      <ContentContainer>
        <PageHeader title="Work" />
        <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
          <Link
            href="/work/architecture"
            className="group"
          >
            <h2 className="text-2xl font-light text-ink transition-colors group-hover:text-terracotta">
              Architecture
            </h2>
            <p className="mt-2 text-base text-ink-light">
              Built work, competitions, and speculative projects.
            </p>
          </Link>
          <Link
            href="/work/software"
            className="group"
          >
            <h2 className="text-2xl font-light text-ink transition-colors group-hover:text-terracotta">
              Software
            </h2>
            <p className="mt-2 text-base text-ink-light">
              Products, tools, and experiments in code and AI.
            </p>
          </Link>
        </div>
      </ContentContainer>
    </PageSection>
  );
}
