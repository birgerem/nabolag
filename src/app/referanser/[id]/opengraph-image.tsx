// ============================================================
// Delekort (Open Graph-bilde) per referanse – 1200×630
// Vises når en referanse deles på Facebook. Vakkert og anbefalende,
// med adresse (nabolagshjelpen.com) og oppfordring til å bestille.
// ============================================================

import { ImageResponse } from "next/og";
import { findTestimonial } from "@/lib/testimonials";
import { truncate } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Kundereferanse – Nabolagshjelpen";

interface ImageProps {
  params: Promise<{ id: string }>;
}

export default async function OGImage({ params }: ImageProps) {
  const { id } = await params;
  const t = await findTestimonial(id);

  // Sikkerhetsgrense godt over maks innsendt lengde (500) – vanlige
  // referanser avkortes aldri.
  const quote = t ? truncate(t.quote, 600) : "Trygg og pålitelig hjelp på Tromøya";
  const name = t?.name || "Nabolagshjelpen";
  const service = t?.service || "";

  // Fleksibel skriftstørrelse: hele referansen skal få plass på kortet
  const L = quote.length;
  const quoteFontSize =
    L <= 80 ? 46 :
    L <= 130 ? 40 :
    L <= 190 ? 35 :
    L <= 260 ? 31 :
    L <= 340 ? 27 :
    L <= 440 ? 24 : 21;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #F5EDE3 0%, #EAF2E4 100%)",
          fontFamily: "serif",
          padding: "56px 70px",
          position: "relative",
        }}
      >
        {/* Accent-stripe øverst */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "10px",
          background: "linear-gradient(90deg, #3E8E2B, #6E4A34, #3E8E2B)",
          display: "flex",
        }} />

        {/* Sitat (fyller toppen, vertikalt sentrert) */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "center",
        }}>
          <div style={{
            display: "flex",
            color: "#3E8E2B",
            fontSize: "110px",
            fontWeight: "700",
            lineHeight: 0.8,
            height: "60px",
          }}>
            &ldquo;
          </div>
          <div style={{
            display: "flex",
            color: "#2C2418",
            fontSize: `${quoteFontSize}px`,
            fontWeight: "500",
            lineHeight: 1.32,
            marginTop: "10px",
            maxWidth: "1060px",
          }}>
            {quote}
          </div>
        </div>

        {/* Navn + tjeneste / merkevare */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: "3px solid rgba(62,142,43,0.25)",
          paddingTop: "22px",
          marginBottom: "22px",
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#3E8E2B", fontSize: "36px", fontWeight: "700" }}>
              {name}
            </div>
            {service ? (
              <div style={{ display: "flex", color: "#6E4A34", fontSize: "26px", marginTop: "4px" }}>
                {service}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "50px", height: "50px", borderRadius: "50%",
              background: "#3E8E2B",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ color: "white", fontSize: "30px", fontWeight: "700" }}>N</span>
            </div>
            <span style={{ color: "#3E8E2B", fontSize: "30px", fontWeight: "700" }}>
              Nabolagshjelpen
            </span>
          </div>
        </div>

        {/* Oppfordring + adresse */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3E8E2B",
          borderRadius: "16px",
          padding: "20px",
        }}>
          <span style={{ color: "white", fontSize: "32px", fontWeight: "700" }}>
            Bestill hjelp på nabolagshjelpen.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
