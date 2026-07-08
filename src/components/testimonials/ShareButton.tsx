"use client";

// ============================================================
// ShareButton – Del en referanse.
// Mobil: bruker telefonens egen delefunksjon (Web Share API),
//   som viser Facebook-appen m.m.
// PC/reserve: åpner Facebook sin deledialog (sharer.php).
// ============================================================

import { SITE_URL, facebookShareUrl } from "@/lib/constants";

interface ShareButtonProps {
  id: string;
  name: string;
  className?: string;
}

export default function ShareButton({ id, name, className }: ShareButtonProps) {
  const url = `${SITE_URL}/referanser/${id}`;

  async function handleShare() {
    // Web Share API finnes på de fleste mobiler – best mot Facebook-appen
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: `${name} anbefaler Nabolagshjelpen`,
          url,
        });
        return;
      } catch (err) {
        // Bruker avbrøt delingen – ikke fall tilbake da
        if (err instanceof Error && err.name === "AbortError") return;
        // Ellers: prøv Facebook-web under
      }
    }
    // Reserve (PC, eller nettleser uten Web Share): Facebook sin deledialog
    window.open(
      facebookShareUrl(id),
      "_blank",
      "noopener,noreferrer,width=600,height=560"
    );
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      className={className}
      aria-label={`Del referansen fra ${name} på Facebook`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z"/>
      </svg>
      Del referanse
    </button>
  );
}
