import ContentContainer from "@/components/ui/ContentContainer";
import PageSection from "@/components/ui/PageSection";

/**
 * Home page — the landing experience.
 *
 * Will evolve into: hero section, now preview, work highlights.
 * Currently minimal scaffolding with the design system applied.
 */
export default function HomePage() {
  return (
    <PageSection spacing="lg">
      <ContentContainer>
        <h1 className="text-5xl font-light tracking-tighter text-ink md:text-6xl lg:text-7xl">
          Parallax
        </h1>
        <p className="mt-6 max-w-text text-lg leading-relaxed text-ink-light">
          Depth revealed through perspective.
        </p>
      </ContentContainer>
    </PageSection>
  );
}
