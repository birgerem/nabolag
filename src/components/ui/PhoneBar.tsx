"use client";

// ============================================================
// PhoneBar – Sticky "Ring nå" i varm rav-aksent
// ============================================================

interface PhoneBarProps {
  phoneNumber: string;
}

export default function PhoneBar({ phoneNumber }: PhoneBarProps) {
  const telLink = `tel:${phoneNumber.replace(/\s/g, "")}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <a
        href={telLink}
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
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        Ring nå: {phoneNumber}
      </a>
    </div>
  );
}
