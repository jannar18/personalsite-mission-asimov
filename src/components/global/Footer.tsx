import Link from "next/link";

/**
 * Footer — Minimal site footer.
 *
 * Restrained, typographic. Matches Asimov pattern:
 * quiet, generous whitespace, no visual clutter.
 * Uppercase nav labels with wide tracking to match header treatment.
 */

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/now", label: "Now" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border pt-12 pb-16">
      <div className="mx-auto max-w-content px-5 font-sans">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs uppercase tracking-wider text-ink-lighter">
            &copy; {currentYear} Parallax
          </p>

          <nav className="flex gap-8">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-wider text-ink-lighter transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
