// ============================================================
// Footer – Mørk mose-grønn bunn, rav-aksent
// ============================================================

import Link from "next/link";

interface FooterProps {
  phoneNumber: string;
}

export default function Footer({ phoneNumber: _phoneNumber }: FooterProps) {
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
            <Link
              href="/bestill"
              className="inline-flex items-center gap-2 bg-accent text-white font-bold px-5 py-3 rounded-xl no-underline hover:bg-accent-dark transition-colors"
            >
              Bestill hjelp →
            </Link>
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
                <Link href="/sommerjobb" className="text-white hover:text-white underline underline-offset-2 decoration-white/50 hover:decoration-white transition-colors">
                  Sommerjobb
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
          <Link
            href="/admin"
            className="inline-block mt-3 text-white/30 hover:text-white/60 text-xs no-underline transition-colors"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
