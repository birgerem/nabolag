// ============================================================
// AboutSection – "Om Edvard"-seksjon med 60/30/10-palett
// Tekst hentes fra Supabase settings.page_content (med fallback)
// ============================================================

import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const DEFAULT_P1 =
  "Jeg er 13 år og bor på Brekka på Tromøya. Jeg går på Roligheden skole, og på fritiden spiller jeg håndball og fotball – og er veldig glad i snowboard!";
const DEFAULT_P2 =
  "Jeg har to yngre søsken og er vant til å hjelpe til hjemme. Jeg liker å være til nytte for andre, og det er derfor jeg har startet Nabolagshjelpen. Jeg tilbyr hjelp med alt fra gressklipping og snømåking til å bære handleposer og annet enkelt arbeid i hjemmet.";
const DEFAULT_P3 =
  "Foreldrene mine støtter meg i dette, og du kan alltid ta kontakt med dem hvis du har spørsmål. Det skal alltid være trygt å be om hjelp i nabolaget!";

export default async function AboutSection() {
  let p1 = DEFAULT_P1;
  let p2 = DEFAULT_P2;
  let p3 = DEFAULT_P3;

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("page_content")
      .eq("id", 1)
      .single();

    if (data?.page_content) {
      p1 = data.page_content.about_paragraph1 || DEFAULT_P1;
      p2 = data.page_content.about_paragraph2 || DEFAULT_P2;
      p3 = data.page_content.about_paragraph3 || DEFAULT_P3;
    }
  } catch {
    // Bruk fallback-tekst hvis DB ikke er tilgjengelig
  }

  return (
    <section className="section bg-surface-warm">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-1 bg-accent mx-auto mb-4 rounded-full" />

          <h2 className="text-3xl font-bold text-primary mb-8 text-center">
            Om meg
          </h2>

          <div className="bg-surface rounded-3xl p-8 md:p-10 card-soft border border-border-light">
            {/* Bilde av Edvard */}
            <div className="w-44 h-44 mx-auto mb-8 rounded-full bg-surface-warm overflow-hidden relative ring-4 ring-accent/30 ring-offset-4 ring-offset-surface">
              <Image
                src="/images/edvard-bruk.jpeg"
                alt="Edvard – Nabolagshjelpen på Tromøya"
                fill
                className="object-cover"
                style={{ objectPosition: "center 18%" }}
                sizes="176px"
                priority
              />
            </div>

            <h3 className="text-2xl font-bold text-primary text-center mb-5">
              Hei, jeg heter Edvard!
            </h3>

            <div className="text-center space-y-5">
              <p className="text-lg leading-relaxed">{p1}</p>
              <p className="text-lg leading-relaxed">{p2}</p>
              <p className="text-lg leading-relaxed">{p3}</p>

              {/* Tillitsindikatorer */}
              <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-5">
                <div className="flex items-center gap-3 bg-secondary-light/15 px-5 py-3 rounded-2xl border border-secondary-light/25">
                  <span className="text-secondary text-xl font-bold">&#10003;</span>
                  <span className="font-medium text-text">Foreldrestøtte</span>
                </div>
                <div className="flex items-center gap-3 bg-secondary-light/15 px-5 py-3 rounded-2xl border border-secondary-light/25">
                  <span className="text-secondary text-xl font-bold">&#10003;</span>
                  <span className="font-medium text-text">Lokal gutt fra Tromøya</span>
                </div>
                <div className="flex items-center gap-3 bg-secondary-light/15 px-5 py-3 rounded-2xl border border-secondary-light/25">
                  <span className="text-secondary text-xl font-bold">&#10003;</span>
                  <span className="font-medium text-text">Pålitelig og punktlig</span>
                </div>
              </div>

              {/* Sommerjobb-oppfordring */}
              <div className="mt-8 pt-6 border-t border-border-light">
                <div className="bg-accent/8 rounded-2xl px-6 py-5 border border-accent/20 text-center">
                  <p className="text-base text-text leading-relaxed mb-4">
                    <span className="font-semibold text-accent">Til sommeren fyller jeg 14 år</span> og søker sommerjobb!
                    Jeg har prøvd å finne sommerjobb, men det er ikke alltid like lett når man er ung.
                    Har du eller bedriften din en jobb til meg?
                  </p>
                  <Link
                    href="/sommerjobb"
                    className="inline-flex items-center gap-2 bg-accent text-white font-bold px-6 py-3 rounded-xl no-underline hover:bg-accent-dark transition-colors text-base"
                  >
                    Les søknaden min og ta kontakt →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
