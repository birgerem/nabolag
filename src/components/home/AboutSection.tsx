// ============================================================
// AboutSection – "Om Edvard"-seksjon med 60/30/10-palett
// ============================================================

import Image from "next/image";

export default function AboutSection() {
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
                src="/images/edvard2.PNG"
                alt="Edvard – Nabolagshjelpen på Tromøya"
                fill
                className="object-cover object-top"
                sizes="176px"
                priority
              />
            </div>

            <h3 className="text-2xl font-bold text-primary text-center mb-5">
              Hei, jeg heter Edvard!
            </h3>

            <div className="text-center space-y-5">
              <p className="text-lg leading-relaxed">
                Jeg er 13 år og bor på Brekka på Tromøya. Jeg går på
                Roligheden skole, og på fritiden spiller jeg håndball
                og fotball &ndash; og er veldig glad i snowboard!
              </p>

              <p className="text-lg leading-relaxed">
                Jeg har to yngre søsken og er vant til å hjelpe til hjemme.
                Jeg liker å være til nytte for andre, og det er derfor jeg
                har startet Nabolagshjelpen. Jeg tilbyr hjelp med alt fra
                gressklipping og snømåking til å bære handleposer og
                annet enkelt arbeid i hjemmet.
              </p>

              <p className="text-lg leading-relaxed">
                Foreldrene mine støtter meg i dette, og du kan alltid
                ta kontakt med dem hvis du har spørsmål. Det skal alltid være trygt å be om hjelp i nabolaget!
              </p>

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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
