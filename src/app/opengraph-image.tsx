// ============================================================
// Open Graph-bilde – genereres automatisk av Next.js
// Vises når nettsiden deles på sosiale medier (1200×630 px)
// ============================================================

import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #3D5A47 0%, #2D4235 60%, #1E2E24 100%)",
          fontFamily: "serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dekorativt bakgrunnsmønster – store, lyse sirkler */}
        <div style={{
          position: "absolute", top: "-120px", right: "-120px",
          width: "500px", height: "500px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", left: "-80px",
          width: "350px", height: "350px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.03)",
          display: "flex",
        }} />

        {/* Accent-stripe øverst */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "6px",
          background: "linear-gradient(90deg, #C27435, #4A7E8A, #3D5A47)",
          display: "flex",
        }} />

        {/* Logo-sirkel */}
        <div style={{
          width: "110px", height: "110px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.15)",
          border: "3px solid rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "28px",
        }}>
          <span style={{
            color: "white",
            fontSize: "64px",
            fontWeight: "900",
            lineHeight: 1,
          }}>N</span>
        </div>

        {/* Hovedtittel */}
        <div style={{
          color: "white",
          fontSize: "72px",
          fontWeight: "900",
          letterSpacing: "-1px",
          marginBottom: "16px",
          display: "flex",
        }}>
          Nabolagshjelpen
        </div>

        {/* Undertittel */}
        <div style={{
          color: "rgba(255,255,255,0.80)",
          fontSize: "32px",
          fontWeight: "400",
          marginBottom: "48px",
          display: "flex",
        }}>
          Trygg og pålitelig hjelp på Tromøya
        </div>

        {/* Tjenestepunkter */}
        <div style={{
          display: "flex",
          gap: "24px",
          marginBottom: "40px",
        }}>
          {["Gressklipping", "Matlaging", "Rydding", "Handling"].map((item) => (
            <div key={item} style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.18)",
              borderRadius: "40px",
              padding: "10px 20px",
            }}>
              <span style={{ color: "#C27435", fontSize: "20px", fontWeight: "bold" }}>✓</span>
              <span style={{ color: "rgba(255,255,255,0.90)", fontSize: "22px" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Pris-badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "#C27435",
          borderRadius: "40px",
          padding: "12px 32px",
        }}>
          <span style={{ color: "white", fontSize: "26px", fontWeight: "bold" }}>
            160 kr/time · Tromøya
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
