// ============================================================
// ServiceCard – Viser én tjeneste med mykt, varmt design
// ============================================================

import BigButton from "@/components/ui/BigButton";
import { formatPrice } from "@/lib/constants";
import type { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-surface rounded-2xl p-6 card-soft border border-border-light flex flex-col hover:shadow-md transition-shadow duration-300">
      <h3 className="text-xl font-bold text-text mb-2">{service.name}</h3>
      <p className="text-text-muted mb-4 flex-1 leading-relaxed">{service.description}</p>
      <p className="text-lg font-semibold text-primary mb-4">
        Fra {formatPrice(service.price_per_hour)}/time
      </p>
      <BigButton
        href={`/bestill?tjeneste=${service.id}`}
        variant="secondary"
        fullWidth
      >
        Bestill
      </BigButton>
    </div>
  );
}
