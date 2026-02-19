// ============================================================
// Footer – Mørk mose-grønn bunn, rav-aksent
// ============================================================

import Link from "next/link";

interface FooterProps {
  phoneNumber: string;
}

export default function Footer({ phoneNumber }: FooterProps) {
  const telLink = `tel:${phoneNumber.replace(/\s/g, "")}`;

  return (
    <footer className="bg-primary-dark text-white pb-24 md:pb-0">
      {/* Dekorativ farge-stripe */}
      <div className="h-1 bg-gradient-to-r from-accent via-secondary-light to-primary-light" />

      <div className="container py-12">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Kontaktinfo */}
          <div>
            <h3 className="text-2xl font-bold mb-3">
              <span className="text-secondary-light">Nabolags</span>hjelpen
            </h3>
            <p className="text-white mb-5 leading-relaxed">
              Trygg og pålitelig hjelp på Tromøya.
              <br />
              Drevet av Edvard (13) med foreldrestøtte.
            </p>
            <a
              href={telLink}
              className="inline-flex items-center gap-2 text-accent font-semibold text-lg no-underline hover:underline"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              {phoneNumber}
            </a>
          </div>

          {/* Lenker */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Sider</h3>
            <ul className="list-none m-0 p-0 space-y-3">
              <li>
                <Link href="/tjenester" className="text-white hover:text-white underline underline-offset-2 decoration-white/50 hover:decoration-white transition-colors">
                  Tjenester
                </Link>
              </li>
              <li>
                <Link href="/priser" className="text-white hover:text-white underline underline-offset-2 decoration-white/50 hover:decoration-white transition-colors">
                  Priser
                </Link>
              </li>
              <li>
                <Link href="/bestill" className="text-white hover:text-white underline underline-offset-2 decoration-white/50 hover:decoration-white transition-colors">
                  Bestill hjelp
                </Link>
              </li>
              <li>
                <Link href="/personvern" className="text-white hover:text-white underline underline-offset-2 decoration-white/50 hover:decoration-white transition-colors">
                  Personvernerklæring
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/30 text-center text-white text-sm">
          <p>&copy; {new Date().getFullYear()} Nabolagshjelpen, Tromøya. Alle rettigheter forbeholdt.</p>
        </div>
      </div>
    </footer>
  );
}
