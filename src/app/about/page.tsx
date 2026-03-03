import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About Parallax Practice — architecture, software, and AI through shifting perspectives.",
};

/**
 * About page — personal introduction and biography.
 */
export default function AboutPage() {
  return (
    <div className="mx-auto max-w-content px-5">
      <section className="py-24">
        <h1 className="text-4xl font-light text-ink md:text-5xl">About</h1>
        <div className="mt-12 max-w-text">
          <p className="text-lg text-ink-light leading-relaxed">
            This page will hold a personal introduction — bridging architecture
            practice and software/AI practice into a unified identity.
          </p>
        </div>
      </section>
    </div>
  );
}
