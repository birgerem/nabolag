"use server";

// ============================================================
// Server Action: Send sommerjobb-henvendelse til Edvard
// Brukes fra JobApplicationForm på /sommerjobb-siden
// ============================================================

import { z } from "zod";

const jobApplicationSchema = z.object({
  employer_name: z
    .string()
    .min(2, "Navnet må være minst 2 tegn")
    .max(100, "Navnet kan ikke være mer enn 100 tegn"),
  company: z
    .string()
    .min(2, "Bedriftsnavnet må være minst 2 tegn")
    .max(100, "Bedriftsnavnet kan ikke være mer enn 100 tegn"),
  employer_email: z
    .string()
    .email("Ugyldig e-postadresse")
    .max(200, "E-postadressen er for lang"),
  message: z
    .string()
    .min(10, "Meldingen må være minst 10 tegn")
    .max(1000, "Meldingen kan ikke være mer enn 1000 tegn"),
});

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = "birgere@gmail.com";

export async function sendJobApplication(formData: {
  employer_name: string;
  company: string;
  employer_email: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = jobApplicationSchema.parse(formData);

    if (!RESEND_API_KEY) {
      console.warn("RESEND_API_KEY mangler — sommerjobb-henvendelse ikke sendt");
      return { success: false, error: "E-posttjenesten er ikke konfigurert. Prøv igjen senere." };
    }

    const htmlBody = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #F5EDE3; padding: 30px; border-radius: 16px;">
        <div style="background: #3D5A47; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="margin: 0; font-size: 22px;">Ny sommerjobb-henvendelse!</h1>
          <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.85;">Via nabolag-rho.vercel.app/sommerjobb</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #D4CBBD;">
          <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold; width: 40%;">Navn:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">${escapeHtml(validated.employer_name)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold;">Bedrift:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">${escapeHtml(validated.company)}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold;">E-post:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">
                <a href="mailto:${escapeHtml(validated.employer_email)}" style="color: #3D5A47;">${escapeHtml(validated.employer_email)}</a>
              </td>
            </tr>
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #F5EDE3; border-radius: 8px; border-left: 4px solid #C27435;">
            <strong style="display: block; margin-bottom: 8px;">Melding:</strong>
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(validated.message)}</p>
          </div>
        </div>
        <p style="text-align: center; color: #6B5E4F; font-size: 13px; margin-top: 16px;">
          Svar direkte til <a href="mailto:${escapeHtml(validated.employer_email)}" style="color: #3D5A47;">${escapeHtml(validated.employer_email)}</a>
        </p>
      </div>
    `;

    const textBody = [
      "NY SOMMERJOBB-HENVENDELSE — Nabolagshjelpen",
      "============================================",
      `Navn: ${validated.employer_name}`,
      `Bedrift: ${validated.company}`,
      `E-post: ${validated.employer_email}`,
      "",
      "Melding:",
      validated.message,
      "",
      `Svar til: ${validated.employer_email}`,
    ].join("\n");

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Nabolagshjelpen <onboarding@resend.dev>",
        to: [NOTIFICATION_EMAIL],
        reply_to: validated.employer_email,
        subject: `Sommerjobb-henvendelse fra ${validated.company || validated.employer_name}`,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend sommerjobb-feil:", res.status, err);
      return { success: false, error: "Kunne ikke sende henvendelsen. Prøv igjen eller ta kontakt på telefon." };
    }

    return { success: true };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.errors[0]?.message || "Ugyldig skjemadata." };
    }
    console.error("Sommerjobb-henvendelse feil:", err);
    return { success: false, error: "Noe gikk galt. Prøv igjen." };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
