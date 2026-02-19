// ============================================================
// 404-side – Egendefinert "ikke funnet"-side på norsk
// ============================================================

import BigButton from "@/components/ui/BigButton";

export default function NotFound() {
  return (
    <div className="section min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-3xl font-bold text-text mb-4">
          Siden ble ikke funnet
        </h1>
        <p className="text-xl text-text-muted mb-8">
          Beklager, men denne siden finnes ikke.
          Kanskje du finner det du leter etter her?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <BigButton href="/" variant="primary">
            Gå til forsiden
          </BigButton>
          <BigButton href="/bestill" variant="secondary">
            Bestill hjelp
          </BigButton>
        </div>
      </div>
    </div>
  );
}
