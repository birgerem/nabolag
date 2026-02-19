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

// ============================================================
// Send kvittering til kunde etter fullført oppdrag
// ============================================================

interface ReceiptEmailData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  service_name: string;
  booking_date: string;
  booking_time: string;
  duration_hours: number;
  total_price: number;
  is_flexible: boolean;
  vipps_number: string;
  admin_message?: string;
}

export async function sendReceiptEmail(data: ReceiptEmailData): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.warn("RESEND_API_KEY mangler — kvittering hoppet over");
    return false;
  }

  const dateDisplay = data.is_flexible
    ? "Fleksibelt tidspunkt (avtalt)"
    : `${formatNorwegianDate(data.booking_date)} kl. ${data.booking_time.substring(0, 5)}`;

  // Generer et enkelt kvitteringsnummer basert på dato + telefon
  const receiptRef = `NB-${data.booking_date.replace(/-/g, "")}-${data.customer_phone.replace(/\s/g, "").slice(-4)}`;

  const htmlBody = `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #F5EDE3; padding: 30px; border-radius: 16px;">

      <!-- Header -->
      <div style="background: #3D5A47; color: white; padding: 24px; border-radius: 12px 12px 0 0; text-align: center;">
        <p style="margin: 0 0 4px 0; font-size: 13px; opacity: 0.8; letter-spacing: 1px; text-transform: uppercase;">Kvittering</p>
        <h1 style="margin: 0; font-size: 24px;">Nabolagshjelpen</h1>
        <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.75;">Tromøya · ${receiptRef}</p>
      </div>

      <!-- Innhold -->
      <div style="background: white; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #D4CBBD;">

        <p style="font-size: 17px; color: #3D5A47; margin: 0 0 20px 0;">
          Hei ${escapeHtml(data.customer_name)}! 👋
        </p>
        <p style="color: #6B5E4F; margin: 0 0 24px 0; line-height: 1.6;">
          ${data.admin_message
            ? escapeHtml(data.admin_message)
            : `Tusen takk for at du brukte Nabolagshjelpen! Det var hyggelig å hjelpe deg. Her er kvitteringen for oppdraget.`
          }
        </p>

        <!-- Oppdragsdetaljer -->
        <div style="background: #F5EDE3; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
          <h2 style="margin: 0 0 14px 0; font-size: 15px; color: #3D5A47; text-transform: uppercase; letter-spacing: 0.5px;">Oppdragsdetaljer</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #D4CBBD; color: #6B5E4F; width: 45%;">Tjeneste</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #D4CBBD; font-weight: bold; color: #2C2C2C;">${escapeHtml(data.service_name)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #D4CBBD; color: #6B5E4F;">Tidspunkt</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #D4CBBD; color: #2C2C2C;">${dateDisplay}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #D4CBBD; color: #6B5E4F;">Varighet</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #D4CBBD; color: #2C2C2C;">${data.duration_hours} ${data.duration_hours === 1 ? "time" : "timer"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6B5E4F;">Adresse</td>
              <td style="padding: 8px 0; color: #2C2C2C;">${escapeHtml(data.customer_address)}</td>
            </tr>
          </table>
        </div>

        <!-- Totalbeløp -->
        <div style="background: #3D5A47; border-radius: 10px; padding: 16px 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: center;">
          <span style="color: white; font-size: 17px; font-weight: bold;">Totalt å betale</span>
          <span style="color: white; font-size: 26px; font-weight: 900;">${data.total_price} kr</span>
        </div>

        <!-- Vipps -->
        <div style="background: #FF5B24; border-radius: 10px; padding: 20px; margin-bottom: 24px; text-align: center;">
          <div style="background: white; display: inline-block; border-radius: 8px; padding: 4px 12px; margin-bottom: 12px;">
            <span style="color: #FF5B24; font-weight: 900; font-size: 18px; letter-spacing: -0.5px;">vipps</span>
          </div>
          <p style="color: white; margin: 0 0 8px 0; font-size: 15px;">Betal på Vipps til:</p>
          <p style="color: white; font-size: 28px; font-weight: 900; margin: 0 0 4px 0; letter-spacing: 2px;">${escapeHtml(data.vipps_number)}</p>
          <p style="color: rgba(255,255,255,0.8); font-size: 13px; margin: 0;">Edvard – Nabolagshjelpen</p>
          <p style="color: rgba(255,255,255,0.7); font-size: 12px; margin: 8px 0 0 0;">Merk betalingen med &quot;${escapeHtml(data.service_name)}&quot;</p>
        </div>

        <p style="color: #6B5E4F; font-size: 14px; text-align: center; margin: 0;">
          Spørsmål? Ring eller send melding til Edvard: <strong>${escapeHtml(data.vipps_number)}</strong>
        </p>
      </div>

      <p style="text-align: center; color: #9E8E7E; font-size: 12px; margin-top: 16px;">
        Nabolagshjelpen · Tromøya · Ref: ${receiptRef}
      </p>
    </div>
  `;

  const textBody = [
    "KVITTERING — Nabolagshjelpen",
    `Ref: ${receiptRef}`,
    "================================",
    `Hei ${data.customer_name}!`,
    "",
    data.admin_message || "Tusen takk for at du brukte Nabolagshjelpen!",
    "",
    "OPPDRAGSDETALJER",
    `Tjeneste: ${data.service_name}`,
    `Tidspunkt: ${dateDisplay}`,
    `Varighet: ${data.duration_hours} ${data.duration_hours === 1 ? "time" : "timer"}`,
    `Adresse: ${data.customer_address}`,
    "",
    `Totalt: ${data.total_price} kr`,
    "",
    "BETAL MED VIPPS",
    `Vipps-nummer: ${data.vipps_number}`,
    `Merk: ${data.service_name}`,
    "",
    `Spørsmål? Ring ${data.vipps_number}`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Edvard – Nabolagshjelpen <onboarding@resend.dev>",
        to: [data.customer_email],
        subject: `Kvittering fra Nabolagshjelpen – ${data.service_name}`,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend kvittering feil:", res.status, err);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Kvittering sending feilet:", err);
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
