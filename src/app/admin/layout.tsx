// ============================================================
// Admin layout – Enkel wrapper uten header/footer
// Auth-beskyttelse håndteres av middleware
// ============================================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
