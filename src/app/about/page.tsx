import type { Metadata } from "next";
import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "About",
  description: "About Parallax — architecture, software, and AI through shifting perspectives.",
};

/**
 * About page — personal introduction and biography.
 */
export default function AboutPage() {
  return (
    <PageSection>
      <ContentContainer>
        <PageHeader title="About" />
        <div className="max-w-text">
          <p className="text-lg leading-relaxed text-ink-light">
            This page will hold a personal introduction — bridging architecture
            practice and software/AI practice into a unified identity.
          </p>
        </div>
      </ContentContainer>
    </PageSection>
  );
}
