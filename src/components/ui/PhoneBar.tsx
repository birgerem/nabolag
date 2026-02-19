"use client";

// PhoneBar – fjernet, erstattet med sticky "Bestill hjelp"-knapp
// Telefonnummer er tonet ned til fordel for bookingskjemaet

interface PhoneBarProps {
  phoneNumber: string;
}

export default function PhoneBar({ phoneNumber: _phoneNumber }: PhoneBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <a
        href="/bestill"
        className="
          flex items-center justify-center gap-3
          w-full py-4 px-6
          bg-accent text-white
          text-lg font-bold
          shadow-[0_-2px_10px_rgba(0,0,0,0.15)]
          no-underline
          hover:bg-accent-dark
          active:bg-accent-dark
        "
      >
        Bestill hjelp →
      </a>
    </div>
  );
}
