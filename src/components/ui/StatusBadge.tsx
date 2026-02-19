// ============================================================
// StatusBadge – Viser booking-status med farge
// ============================================================

import { STATUS_LABELS } from "@/lib/constants";

interface StatusBadgeProps {
  status: string;
}

const statusColors: Record<string, string> = {
  ny: "bg-warning-light text-warning border-warning",
  bekreftet: "bg-primary/10 text-primary border-primary",
  fullfort: "bg-success-light text-success border-success",
  avlyst: "bg-error-light text-error border-error",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1
        text-sm font-semibold
        rounded-full
        border
        ${statusColors[status] || "bg-surface-warm text-text-muted border-border"}
      `}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
