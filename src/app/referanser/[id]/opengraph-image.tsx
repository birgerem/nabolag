// ============================================================
// Delekort (Open Graph-bilde) per referanse – 1200×630
// Vises når en referanse deles på Facebook. Vakkert og anbefalende.
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

  const quote = t ? truncate(t.quote, 190) : "Trygg og pålitelig hjelp på Tromøya";
  const name = t?.name || "Nabolagshjelpen";
  const service = t?.service || "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #F5EDE3 0%, #EAF2E4 100%)",
          fontFamily: "serif",
          padding: "70px 80px",
          position: "relative",
        }}
      >
        {/* Accent-stripe øverst */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "10px",
          background: "linear-gradient(90deg, #3E8E2B, #6E4A34, #3E8E2B)",
          display: "flex",
        }} />

        {/* Stort anførselstegn + sitat */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{
            display: "flex",
            color: "#3E8E2B",
            fontSize: "150px",
            fontWeight: "700",
            lineHeight: 0.8,
            height: "90px",
          }}>
            &ldquo;
          </div>
          <div style={{
            display: "flex",
            color: "#2C2418",
            fontSize: quote.length > 130 ? "40px" : "48px",
            fontWeight: "500",
            lineHeight: 1.35,
            marginTop: "16px",
            maxWidth: "1040px",
          }}>
            {quote}
          </div>
        </div>

        {/* Bunn: navn/tjeneste + merkevare */}
        <div style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          borderTop: "3px solid rgba(62,142,43,0.25)",
          paddingTop: "28px",
        }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", color: "#3E8E2B", fontSize: "38px", fontWeight: "700" }}>
              {name}
            </div>
            {service ? (
              <div style={{ display: "flex", color: "#6E4A34", fontSize: "28px", marginTop: "4px" }}>
                {service}
              </div>
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%",
                background: "#3E8E2B",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "white", fontSize: "34px", fontWeight: "700" }}>N</span>
              </div>
              <span style={{ color: "#3E8E2B", fontSize: "34px", fontWeight: "700" }}>
                Nabolagshjelpen
              </span>
            </div>
            <div style={{ display: "flex", color: "#6E4A34", fontSize: "24px", marginTop: "8px" }}>
              Trygg hjelp på Tromøya
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
