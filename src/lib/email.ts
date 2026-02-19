// ============================================================
// E-postvarsling — sender bookingbekreftelse via Resend
// Gratis opptil 100 e-poster/dag med Resend
// ============================================================

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFICATION_EMAIL = "birgere@gmail.com";

interface BookingEmailData {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  total_price: number;
  is_flexible: boolean;
  customer_comment?: string;
  week_number?: number;
}

export async function sendBookingNotification(data: BookingEmailData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY mangler — e-postvarsling hoppet over");
    return false;
  }

  const isFlexible = data.is_flexible;
  const dateDisplay = isFlexible
    ? `Uke ${data.week_number || "—"} (fleksibel — avtaler tid senere)`
    : `${formatNorwegianDate(data.booking_date)} kl. ${data.booking_time}`;

  const htmlBody = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #F5EDE3; padding: 30px; border-radius: 16px;">
      <div style="background: #3D5A47; color: white; padding: 20px 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 22px;">Ny bestilling fra Nabolagshjelpen</h1>
      </div>
      <div style="background: white; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #D4CBBD;">
        <table style="width: 100%; border-collapse: collapse; font-size: 16px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold; width: 40%;">Kunde:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">${escapeHtml(data.customer_name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold;">Telefon:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">
              <a href="tel:${data.customer_phone}" style="color: #3D5A47;">${escapeHtml(data.customer_phone)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold;">Adresse:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">${escapeHtml(data.customer_address)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold;">Tjeneste:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">${escapeHtml(data.service_name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold;">Når:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">${dateDisplay}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2; font-weight: bold;">Varighet:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #E5DDD2;">${data.duration_hours} ${data.duration_hours === 1 ? "time" : "timer"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; font-size: 18px;">Pris:</td>
            <td style="padding: 10px 0; font-size: 18px; color: #3D5A47; font-weight: bold;">${data.total_price} kr</td>
          </tr>
        </table>
        ${data.customer_comment ? `
          <div style="margin-top: 16px; padding: 12px 16px; background: #F5EDE3; border-radius: 8px; border-left: 4px solid #C27435;">
            <strong>Kommentar:</strong><br>${escapeHtml(data.customer_comment)}
          </div>
        ` : ""}
      </div>
      <p style="text-align: center; color: #6B5E4F; font-size: 13px; margin-top: 16px;">
        ${isFlexible ? "Ring kunden for å avtale nøyaktig tid." : "Bekreft bestillingen ved å ringe kunden."}
      </p>
    </div>
  `;

  const textBody = [
    "NY BESTILLING — Nabolagshjelpen",
    "================================",
    `Kunde: ${data.customer_name}`,
    `Telefon: ${data.customer_phone}`,
    `Adresse: ${data.customer_address}`,
    `Tjeneste: ${data.service_name}`,
    `Når: ${dateDisplay}`,
    `Varighet: ${data.duration_hours} ${data.duration_hours === 1 ? "time" : "timer"}`,
    `Pris: ${data.total_price} kr`,
    data.customer_comment ? `Kommentar: ${data.customer_comment}` : "",
    "================================",
    isFlexible ? "Ring kunden for å avtale nøyaktig tid." : "Bekreft bestillingen ved å ringe kunden.",
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Nabolagshjelpen <onboarding@resend.dev>",
        to: [NOTIFICATION_EMAIL],
        subject: `Nabolagshjelpen: Ny bestilling fra ${data.customer_name}`,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend API feil:", res.status, err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("E-post sending feilet:", err);
    return false;
  }
}

// Hjelpefunksjoner
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatNorwegianDate(dateStr: string): string {
  const days = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
  const months = [
    "januar", "februar", "mars", "april", "mai", "juni",
    "juli", "august", "september", "oktober", "november", "desember",
  ];
  const d = new Date(dateStr + "T00:00:00");
  return `${days[d.getDay()]} ${d.getDate()}. ${months[d.getMonth()]} ${d.getFullYear()}`;
}
