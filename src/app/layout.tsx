// ============================================================
// Root Layout – Wrapper for hele appen
// Header, Footer og PhoneBar vises på alle sider
// ============================================================

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PhoneBar from "@/components/ui/PhoneBar";
import LocalBusinessSchema from "@/components/seo/LocalBusinessSchema";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_PHONE } from "@/lib/constants";

export const metadata: Metadata = {
  title: {
    default: "Nabolagshjelpen – Trygg hjelp på Tromøya",
    template: "%s | Nabolagshjelpen",
  },
  verification: {
    google: "JZo_fZ-XNiQI-NTySocyS7caoc-IxHr-d2t3DXjASHY",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  description:
    "Lokal ungdomsbedrift på Tromøya som tilbyr småjobber og hjelp til eldre. Gressklipping, snømåking, teknisk hjelp og mer. 160 kr/time.",
  keywords: [
    "Tromøya småjobber",
    "hjelp til eldre Tromøya",
    "nabolagshjelpen",
    "gressklipping Tromøya",
    "snømåking Tromøya",
    "ungdomsbedrift Tromøya",
    "hjelp i hagen Arendal",
  ],
  openGraph: {
    title: "Nabolagshjelpen – Trygg hjelp på Tromøya",
    description:
      "Lokal ungdomsbedrift som tilbyr småjobber og hjelp til eldre. 160 kr/time.",
    url: "https://www.nabolagshjelpen.com",
    siteName: "Nabolagshjelpen",
    locale: "nb_NO",
    type: "website",
  },
  metadataBase: new URL("https://www.nabolagshjelpen.com"),
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Hent telefonnummer fra databasen (med fallback)
  let phoneNumber = DEFAULT_PHONE;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("settings")
      .select("phone_number")
      .eq("id", 1)
      .single();
    if (data?.phone_number) {
      phoneNumber = data.phone_number;
    }
  } catch {
    // Bruk standard telefonnummer hvis DB ikke er tilgjengelig
  }

  return (
    <html lang="nb">
      <head>
        <LocalBusinessSchema phoneNumber={phoneNumber} />
      </head>
      <body>
        <Header phoneNumber={phoneNumber} />
        <main className="min-h-screen">{children}</main>
        <Footer phoneNumber={phoneNumber} />
        <PhoneBar phoneNumber={phoneNumber} />
      </body>
    </html>
  );
}
