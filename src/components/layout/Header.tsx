"use client";

// ============================================================
// Header – Tromøya-natur: mose-grønn nav, rav-aksent CTA
// ============================================================

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface HeaderProps {
  phoneNumber: string;
}

const navLinks = [
  { href: "/", label: "Hjem" },
  { href: "/tjenester", label: "Tjenester" },
  { href: "/priser", label: "Priser" },
  { href: "/bestill", label: "Bestill hjelp" },
];

export default function Header({ phoneNumber }: HeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const telLink = `tel:${phoneNumber.replace(/\s/g, "")}`;

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm shadow-sm">
      {/* Telefonnummer-linje */}
      <div className="bg-primary text-white py-3 px-4 text-center">
        <a
          href={telLink}
          className="text-white no-underline font-bold text-lg tracking-wide hover:underline"
        >
          📞 Ring oss gjerne:{" "}
          <span className="underline underline-offset-2 decoration-white/60">
            {phoneNumber}
          </span>
        </a>
      </div>

      {/* Navigasjon */}
      <nav className="container flex items-center justify-between py-4">
        <Link
          href="/"
          className="text-xl font-bold text-primary no-underline hover:text-primary-dark transition-colors"
        >
          <span className="text-secondary">Nabolags</span>hjelpen
        </Link>

        {/* Desktop-meny */}
        <ul className="hidden md:flex items-center gap-1 list-none m-0 p-0">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isBooking = link.href === "/bestill";

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`
                    block px-5 py-2.5 rounded-full text-base font-medium no-underline
                    transition-all duration-300
                    ${
                      isBooking && !isActive
                        ? "bg-accent text-white hover:bg-accent-dark shadow-sm"
                        : isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-text-muted hover:text-text hover:bg-surface-warm"
                    }
                  `}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobil hamburger */}
        <button
          className="md:hidden p-3 min-h-[48px] min-w-[48px] flex items-center justify-center rounded-xl hover:bg-surface-warm transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meny"
          aria-expanded={menuOpen}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {menuOpen ? (
              <>
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobil-meny */}
      {menuOpen && (
        <div className="md:hidden border-t border-border-light bg-surface">
          <ul className="list-none m-0 p-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const isBooking = link.href === "/bestill";

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`
                      block px-5 py-3.5 rounded-xl text-lg font-medium no-underline
                      transition-all duration-300
                      ${
                        isBooking && !isActive
                          ? "bg-accent text-white hover:bg-accent-dark"
                          : isActive
                            ? "bg-primary/10 text-primary font-semibold"
                            : "text-text hover:bg-surface-warm"
                      }
                    `}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
