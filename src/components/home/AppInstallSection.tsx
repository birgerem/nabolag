// ============================================================
// AppInstallSection – Forklarer hvordan man lagrer siden
// som app på hjemskjermen (iPhone og Android)
// ============================================================

export default function AppInstallSection() {
  return (
    <section className="section bg-surface">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <div className="w-12 h-1 bg-secondary mx-auto mb-4 rounded-full" />

          <h2 className="text-3xl font-bold text-primary mb-3 text-center">
            Lagre Nabolagshjelpen på telefonen
          </h2>
          <p className="text-center text-text-muted text-lg mb-10">
            Du kan legge til denne siden på hjemskjermen — da åpner den seg
            som en app, raskt og enkelt.
          </p>

          <div className="grid md:grid-cols-2 gap-6">

            {/* iPhone */}
            <div className="bg-surface-warm rounded-3xl p-7 border border-border-light card-soft">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl">🍎</span>
                <div>
                  <h3 className="text-xl font-bold text-primary">iPhone</h3>
                  <p className="text-sm text-text-muted">Bruk Safari</p>
                </div>
              </div>

              <ol className="space-y-4">
                {[
                  {
                    steg: "1",
                    tekst: "Åpne denne siden i Safari (ikke Chrome)",
                  },
                  {
                    steg: "2",
                    tekst: 'Trykk på del-ikonet nederst — ser ut som en firkant med en pil opp',
                  },
                  {
                    steg: "3",
                    tekst: 'Scroll ned i menyen og trykk "Legg til på hjem-skjerm"',
                  },
                  {
                    steg: "4",
                    tekst: 'Trykk "Legg til" øverst til høyre',
                  },
                ].map(({ steg, tekst }) => (
                  <li key={steg} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-primary text-white font-bold text-lg flex items-center justify-center">
                      {steg}
                    </span>
                    <span className="text-text leading-snug pt-1">{tekst}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Android */}
            <div className="bg-surface-warm rounded-3xl p-7 border border-border-light card-soft">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-4xl">🤖</span>
                <div>
                  <h3 className="text-xl font-bold text-secondary">Android</h3>
                  <p className="text-sm text-text-muted">Bruk Chrome</p>
                </div>
              </div>

              <ol className="space-y-4">
                {[
                  {
                    steg: "1",
                    tekst: "Åpne denne siden i Chrome",
                  },
                  {
                    steg: "2",
                    tekst: 'Trykk på meny-ikonet øverst til høyre (tre prikker ⋮)',
                  },
                  {
                    steg: "3",
                    tekst: 'Trykk "Legg til på startskjermen"',
                  },
                  {
                    steg: "4",
                    tekst: 'Trykk "Legg til" for å bekrefte',
                  },
                ].map(({ steg, tekst }) => (
                  <li key={steg} className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-9 h-9 rounded-full bg-secondary text-white font-bold text-lg flex items-center justify-center">
                      {steg}
                    </span>
                    <span className="text-text leading-snug pt-1">{tekst}</span>
                  </li>
                ))}
              </ol>
            </div>

          </div>

          <p className="text-center text-text-muted mt-8 text-base">
            Deretter finner du Nabolagshjelpen direkte på hjemskjermen —
            akkurat som en vanlig app! 📱
          </p>
        </div>
      </div>
    </section>
  );
}
