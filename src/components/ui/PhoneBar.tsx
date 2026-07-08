"use client";

// PhoneBar – fast knapperad nederst på mobil.
// To valg: "Enkel bestilling" (legg igjen nummer) og full "Bestill hjelp".

interface PhoneBarProps {
  phoneNumber: string;
}

export default function PhoneBar({ phoneNumber: _phoneNumber }: PhoneBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex shadow-[0_-2px_10px_rgba(0,0,0,0.15)]">
      <a
        href="/enkel-bestilling"
        className="flex-1 flex items-center justify-center gap-2 py-4 px-2 bg-accent text-white text-base font-bold no-underline hover:bg-accent-dark active:bg-accent-dark"
      >
        📞 Enkel bestilling
      </a>
      <a
        href="/bestill"
        className="flex-1 flex items-center justify-center gap-2 py-4 px-2 bg-primary text-white text-base font-bold no-underline hover:bg-primary-dark active:bg-primary-dark border-l border-white/20"
      >
        Bestill hjelp →
      </a>
    </div>
  );
}
