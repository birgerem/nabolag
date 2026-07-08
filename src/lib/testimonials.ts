// ============================================================
// Delt henting av publiserte kundereferanser
// Brukes av /referanser, /referanser/[id] og delekort (OG-bilde)
// ============================================================

import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { FALLBACK_TESTIMONIALS } from "@/lib/constants";
import type { Testimonial } from "@/lib/types";

// Nettsidens offisielle adresse (brukes til delelenker)
export const SITE_URL = "https://www.nabolagshjelpen.com";

/** Hent publiserte referanser. Faller tilbake til eksempler når ingen finnes. */
export async function getPublicTestimonials(): Promise<Testimonial[]> {
  if (isAdminConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("settings")
        .select("testimonials")
        .eq("id", 1)
        .single();
      const list = ((data?.testimonials as Testimonial[]) || []).filter(
        (t) => t && t.id && t.quote && t.name
      );
      if (list.length > 0) return list;
    } catch {
      // faller til eksempler
    }
  }
  return FALLBACK_TESTIMONIALS;
}

/** Finn én referanse på ID (også blant eksemplene). */
export async function findTestimonial(id: string): Promise<Testimonial | null> {
  const list = await getPublicTestimonials();
  return (
    list.find((t) => t.id === id) ||
    FALLBACK_TESTIMONIALS.find((t) => t.id === id) ||
    null
  );
}

/** Facebook-delelenke for en gitt referanse-ID. */
export function facebookShareUrl(id: string): string {
  const target = `${SITE_URL}/referanser/${id}`;
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(target)}`;
}
