/**
 * Home page — the landing experience.
 *
 * Will evolve into: hero section, now preview, work highlights.
 * Currently minimal scaffolding with the design system applied.
 */
export default function HomePage() {
  return (
    <div className="mx-auto max-w-content px-5">
      <section className="py-32">
        <h1
          className="text-5xl font-light tracking-tighter text-ink md:text-6xl lg:text-7xl"
          style={{ letterSpacing: "var(--tracking-tight)" }}
        >
          Parallax
        </h1>
        <p className="mt-6 max-w-text text-lg text-ink-light leading-relaxed">
          Depth revealed through perspective.
        </p>
      </section>
    </div>
  );
}
