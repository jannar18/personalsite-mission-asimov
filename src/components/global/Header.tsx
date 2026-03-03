"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

/**
 * Header — Minimal site navigation.
 *
 * Features:
 * - Hide-on-scroll-down, show-on-scroll-up (Asimov pattern)
 * - Simple horizontal nav links
 * - Will receive logo/wordmark slot from ASMV-4 brand identity
 */

const navLinks = [
  { href: "/", label: "Home" },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-5 py-4 font-sans">
        <Link
          href="/"
          className="text-lg font-medium tracking-wide text-ink no-underline"
          style={{ letterSpacing: "var(--tracking-wide)" }}
        >
          Parallax
        </Link>

        <nav className="flex gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-normal tracking-wide text-ink-light transition-colors hover:text-ink"
              style={{ letterSpacing: "var(--tracking-wide)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
