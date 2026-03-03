"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Header — Minimal site navigation.
 *
 * Features:
 * - Hide-on-scroll-down, show-on-scroll-up (Asimov pattern)
 * - Wordmark: "Parallax" in Futura PT (Jost stand-in) at medium weight
 * - Nav: uppercase labels, wide tracking, quiet color hierarchy
 * - Subtle bottom border for definition against cream background
 */

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/now", label: "Now" },
];

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 80) {
        // Always show header near top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down — hide
        setIsVisible(false);
      } else {
        // Scrolling up — show
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-border/50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-5 font-sans">
        <Link
          href="/"
          className="text-base font-medium uppercase tracking-wide text-ink no-underline transition-colors hover:text-terracotta"
        >
          Parallax
        </Link>

        <nav className="flex gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-normal uppercase tracking-wider text-ink-light transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
