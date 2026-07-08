"use server";

// ============================================================
// Server Actions for innstillinger (admin)
// ============================================================

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Testimonial, TestimonialSubmission } from "@/lib/types";
import { testimonialSubmissionSchema } from "@/lib/validation";

// Oppdater timepris og telefonnummer
export async function updateSettings(data: {
  price_per_hour: number;
  phone_number: string;
}) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("settings")
      .update({
        price_per_hour: data.price_per_hour,
        phone_number: data.phone_number,
      })
      .eq("id", 1);

    if (error) {
      return { success: false, error: "Kunne ikke oppdatere innstillinger." };
    }

    revalidatePath("/");
    revalidatePath("/priser");
    revalidatePath("/bestill");
    revalidatePath("/admin");

    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Oppdater forsidestekst (hero + om meg)
export async function updatePageContent(data: {
  hero_heading: string;
  hero_subheading: string;
  about_paragraph1: string;
  about_paragraph2: string;
  about_paragraph3: string;
}) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("settings")
      .update({ page_content: data })
      .eq("id", 1);

    if (error) {
      return { success: false, error: "Kunne ikke oppdatere teksten." };
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Oppdater kundereferanser (vises på /referanser). Tildeler ID til nye.
export async function updateTestimonials(
  testimonials: { id?: string; quote: string; name: string; service: string }[]
) {
  try {
    // Rens bort tomme rader, trim tekst, gi ID til de som mangler
    const cleaned: Testimonial[] = testimonials
      .map((t) => ({
        id: t.id || crypto.randomUUID(),
        quote: t.quote.trim(),
        name: t.name.trim(),
        service: t.service.trim(),
      }))
      .filter((t) => t.quote && t.name);

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("settings")
      .update({ testimonials: cleaned })
      .eq("id", 1);

    if (error) {
      return { success: false, error: "Kunne ikke lagre referansene." };
    }

    revalidatePath("/");
    revalidatePath("/referanser");
    revalidatePath("/admin");

    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Kunde sender inn referanse fra nettsiden (havner til godkjenning)
export async function submitTestimonial(data: {
  quote: string;
  name: string;
  service?: string;
}) {
  try {
    const validated = testimonialSubmissionSchema.parse(data);

    const supabase = createAdminClient();
    const { error } = await supabase.from("testimonial_submissions").insert({
      quote: validated.quote,
      name: validated.name,
      service: validated.service || null,
    });

    if (error) {
      return { success: false, error: "Kunne ikke sende inn referansen. Prøv igjen." };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: "Sjekk at du har fylt ut navn og en referanse på minst 10 tegn.",
    };
  }
}

// Hent innsendte referanser som venter på godkjenning (admin)
export async function fetchTestimonialSubmissions(): Promise<TestimonialSubmission[]> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("testimonial_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    return (data as TestimonialSubmission[]) || [];
  } catch {
    return [];
  }
}

// Godkjenn innsendt referanse: legg til i publiserte + fjern fra kø (admin)
export async function approveTestimonialSubmission(id: string) {
  try {
    const supabase = createAdminClient();

    const { data: submission } = await supabase
      .from("testimonial_submissions")
      .select("*")
      .eq("id", id)
      .single();

    if (!submission) {
      return { success: false, error: "Fant ikke referansen." };
    }

    const { data: settingsRow } = await supabase
      .from("settings")
      .select("testimonials")
      .eq("id", 1)
      .single();

    const current: Testimonial[] = settingsRow?.testimonials || [];
    const approved: Testimonial = {
      id: crypto.randomUUID(),
      quote: submission.quote,
      name: submission.name,
      service: submission.service || "",
    };
    // Nyeste øverst
    const updated = [approved, ...current];

    const { error: updateError } = await supabase
      .from("settings")
      .update({ testimonials: updated })
      .eq("id", 1);

    if (updateError) {
      return { success: false, error: "Kunne ikke publisere referansen." };
    }

    await supabase.from("testimonial_submissions").delete().eq("id", id);

    revalidatePath("/");
    revalidatePath("/referanser");
    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Avvis (slett) innsendt referanse (admin)
export async function rejectTestimonialSubmission(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("testimonial_submissions")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: "Kunne ikke avvise referansen." };
    }

    revalidatePath("/admin");
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Legg til blokkert dato
export async function addBlockedDate(date: string, reason?: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("blocked_dates").insert({
      blocked_date: date,
      reason: reason || null,
    });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "Denne uka er allerede blokkert." };
      }
      return { success: false, error: "Kunne ikke blokkere uka." };
    }

    revalidatePath("/admin");
    revalidatePath("/bestill");
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}

// Fjern blokkert dato
export async function removeBlockedDate(id: string) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, error: "Kunne ikke fjerne blokkeringen." };
    }

    revalidatePath("/admin");
    revalidatePath("/bestill");
    return { success: true };
  } catch {
    return { success: false, error: "Noe gikk galt." };
  }
}
