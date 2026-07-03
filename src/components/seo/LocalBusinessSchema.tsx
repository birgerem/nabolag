// ============================================================
// LocalBusinessSchema – schema.org JSON-LD for Google
// Hjelper søkemotorer forstå at dette er en lokal bedrift
// Kan gi rike søkeresultater (adresse, tlf, åpningstider)
// ============================================================

export default function LocalBusinessSchema({
  phoneNumber,
}: {
  phoneNumber: string;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Nabolagshjelpen",
    description:
      "Lokal ungdomsbedrift på Tromøya drevet av Edvard (13). Vi tilbyr gressklipping, snømåking, handling, matlaging, rydding og annen praktisk hjelp. 160 kr/time.",
    url: "https://nabolagshjelpen.com",
    telephone: phoneNumber,
    priceRange: "160 kr/time",
    areaServed: {
      "@type": "Place",
      name: "Tromøya, Arendal, Norge",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tromøya",
      addressRegion: "Agder",
      addressCountry: "NO",
    },
    founder: {
      "@type": "Person",
      name: "Edvard Flåm Emanuelsen",
      age: 13,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Tjenester fra Nabolagshjelpen",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Gressklipping",
            description: "Klipping av plen og gressplener på Tromøya",
          },
          price: "160",
          priceCurrency: "NOK",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Snømåking",
            description: "Rydding av snø fra innkjørsel og gangstier",
          },
          price: "160",
          priceCurrency: "NOK",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Handling",
            description: "Handlehjelp og ærender for eldre og andre",
          },
          price: "160",
          priceCurrency: "NOK",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Matlaging",
            description: "Hjelp til matlaging og matleveranse",
          },
          price: "160",
          priceCurrency: "NOK",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Rydding",
            description: "Rydding og organisering hjemme",
          },
          price: "160",
          priceCurrency: "NOK",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Teknisk hjelp",
            description: "Hjelp med mobil, nettbrett, PC og annet digitalt utstyr",
          },
          price: "160",
          priceCurrency: "NOK",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
