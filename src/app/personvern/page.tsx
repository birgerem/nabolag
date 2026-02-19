// ============================================================
// Personvernerklæring – GDPR-samsvar
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description: "Personvernerklæring for Nabolagshjelpen på Tromøya.",
};

export default function PersonvernPage() {
  return (
    <div className="section">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-text mb-8">
          Personvernerklæring
        </h1>

        <div className="space-y-6 text-lg leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-text mb-3">
              Hvem er vi?
            </h2>
            <p>
              Nabolagshjelpen er en lokal ungdomsbedrift på Tromøya som tilbyr
              småjobber og hjelp til eldre. Denne nettsiden brukes til å
              informere om tjenestene våre og ta imot bestillinger.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-3">
              Hvilke opplysninger samler vi inn?
            </h2>
            <p>Når du bestiller en tjeneste, ber vi om følgende:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Navn</li>
              <li>Adresse (for å vite hvor oppdraget er)</li>
              <li>Telefonnummer (for å kontakte deg)</li>
              <li>Eventuell kommentar du skriver</li>
            </ul>
            <p className="mt-2">
              Vi samler ikke inn mer enn dette. Vi bruker ingen
              sporingscookies eller analysetjenester som samler
              personopplysninger.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-3">
              Hvorfor samler vi inn disse opplysningene?
            </h2>
            <p>
              Vi trenger opplysningene for å kunne utføre tjenesten du har
              bestilt, og for å ta kontakt med deg for å bekrefte avtalen.
              Vi bruker ikke opplysningene til noe annet formål.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-3">
              Hvor lenge lagrer vi dataene?
            </h2>
            <p>
              Bestillingene dine lagres så lenge det er nødvendig for å
              gjennomføre oppdraget. Etter at oppdraget er fullført, slettes
              opplysningene innen 90 dager.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-3">
              Hvor lagres dataene?
            </h2>
            <p>
              Dataene lagres sikkert i en database hos Supabase, med servere
              i EU. Dataene deles ikke med tredjeparter.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-3">
              Dine rettigheter
            </h2>
            <p>Du har rett til å:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Be om innsyn i opplysningene vi har om deg</li>
              <li>Be om at opplysningene dine slettes</li>
              <li>Be om at opplysningene dine rettes</li>
            </ul>
            <p className="mt-2">
              For å bruke disse rettighetene, ta kontakt med oss på telefon.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-3">
              Cookies
            </h2>
            <p>
              Denne nettsiden bruker kun tekniske cookies som er nødvendige
              for at nettsiden skal fungere (for eksempel for admin-innlogging).
              Vi bruker ingen sporingscookies eller reklamecookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text mb-3">
              Kontakt
            </h2>
            <p>
              Har du spørsmål om personvern? Ring oss, så hjelper vi deg.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
