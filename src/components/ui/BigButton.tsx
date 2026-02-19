// ============================================================
// BigButton – Stor, tilgjengelig knapp for eldre brukere
// ALLE varianter: hvit tekst på farget bakgrunn for best kontrast
// primary = mose-grønn, secondary = kyst-teal, accent = varm rav
// light = lys mose-grønn bakgrunn med hvit tekst
// ============================================================

import Link from "next/link";

interface BigButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "light" | "outline" | "danger";
  fullWidth?: boolean;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-dark active:bg-primary-dark shadow-sm hover:shadow-md",
  secondary:
    "bg-secondary text-white hover:bg-secondary-dark active:bg-secondary-dark shadow-sm hover:shadow-md",
  accent:
    "bg-accent text-white hover:bg-accent-dark active:bg-accent-dark shadow-sm hover:shadow-md",
  light:
    "bg-primary-light text-white hover:bg-primary active:bg-primary shadow-sm hover:shadow-md",
  outline:
    "bg-primary-light text-white hover:bg-primary active:bg-primary shadow-sm hover:shadow-md border-2 border-primary-light",
  danger:
    "bg-error text-white hover:brightness-90 active:brightness-80",
};

export default function BigButton({
  children,
  href,
  onClick,
  variant = "primary",
  fullWidth = false,
  type = "button",
  disabled = false,
  className = "",
}: BigButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    min-h-[48px] px-8 py-4
    text-lg font-semibold
    rounded-2xl
    transition-all duration-300 ease-out
    focus-visible:outline-3 focus-visible:outline-accent focus-visible:outline-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    cursor-pointer select-none
    ${fullWidth ? "w-full" : ""}
    ${variantStyles[variant]}
    ${className}
  `.trim();

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
    >
      {children}
    </button>
  );
}
