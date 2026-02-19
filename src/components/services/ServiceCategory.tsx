// ============================================================
// ServiceCategory – Grupperer tjenester under en kategori
// Mykt, varmt design
// ============================================================

import ServiceCard from "./ServiceCard";
import type { Service } from "@/lib/types";

interface ServiceCategoryProps {
  title: string;
  description: string;
  services: Service[];
}

export default function ServiceCategory({
  title,
  description,
  services,
}: ServiceCategoryProps) {
  return (
    <div className="mb-14">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-text mb-2">{title}</h2>
        <p className="text-text-muted leading-relaxed">{description}</p>
        <div className="w-10 h-0.5 bg-accent-warm mt-3 rounded-full" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </div>
  );
}
