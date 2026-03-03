import Link from "next/link";

/**
 * Footer — Minimal site footer.
 *
 * Restrained, typographic. Matches Asimov pattern:
 * quiet, generous whitespace, no visual clutter.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24 pt-12 pb-16">
      <div className="mx-auto max-w-content px-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p
            className="text-sm text-ink-lighter"
            style={{ letterSpacing: "var(--tracking-wide)" }}
          >
            &copy; {currentYear} Parallax Practice
          </p>

          <nav className="flex gap-6">
            <Link
              href="/about"
              className="text-sm text-ink-lighter transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              About
            </Link>
            <Link
              href="/work"
              className="text-sm text-ink-lighter transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              Work
            </Link>
            <Link
              href="/writing"
              className="text-sm text-ink-lighter transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              Writing
            </Link>
            <Link
              href="/now"
              className="text-sm text-ink-lighter transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              Now
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
