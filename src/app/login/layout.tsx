// ============================================================
// Login layout – noindex for å hindre Google-indeksering
// av privat admin-innloggingsside
// ============================================================

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Innlogging",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
