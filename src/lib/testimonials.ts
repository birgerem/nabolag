// ============================================================
// Delt henting av publiserte kundereferanser
// Brukes av /referanser, /referanser/[id] og delekort (OG-bilde)
// ============================================================

import { createAdminClient, isAdminConfigured } from "@/lib/supabase/admin";
import { FALLBACK_TESTIMONIALS, stableTestimonialId } from "@/lib/constants";
import type { Testimonial } from "@/lib/types";

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
      // Ta med alle gyldige referanser. Eldre referanser mangler ID –
      // de får en stabil, utledet ID her så de vises og kan deles.
      const list = ((data?.testimonials as Testimonial[]) || [])
        .filter((t) => t && t.quote && t.name)
        .map((t) => ({
          ...t,
          id: t.id || stableTestimonialId(t.name, t.quote),
        }));
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
