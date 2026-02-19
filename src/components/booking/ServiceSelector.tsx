"use client";

// ============================================================
// ServiceSelector – Velg tjeneste med store knapper (ikke dropdown)
// ============================================================

import type { Service } from "@/lib/types";
import { CATEGORY_LABELS } from "@/lib/constants";

interface ServiceSelectorProps {
  services: Service[];
  selectedId: string | null;
  onSelect: (service: Service) => void;
}

export default function ServiceSelector({
  services,
  selectedId,
  onSelect,
}: ServiceSelectorProps) {
  // Grupper etter kategori
  const grouped: Record<string, Service[]> = {};
  services.forEach((s) => {
    if (!grouped[s.category]) grouped[s.category] = [];
    grouped[s.category].push(s);
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-text mb-4">
        1. Hva trenger du hjelp med?
      </h2>

      {Object.entries(grouped).map(([category, categoryServices]) => (
        <div key={category} className="mb-6">
          <h3 className="text-lg font-semibold text-text-muted mb-3">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoryServices.map((service) => (
              <button
                key={service.id}
                onClick={() => onSelect(service)}
                className={`
                  text-left p-4 rounded-xl border-2 transition-all duration-200
                  min-h-[48px] cursor-pointer
                  ${
                    selectedId === service.id
                      ? "border-primary bg-primary text-white shadow-md"
                      : "border-border-light bg-surface hover:border-primary hover:bg-surface-warm"
                  }
                `}
              >
                <span className={`block text-lg font-semibold ${selectedId === service.id ? "text-white" : "text-text"}`}>
                  {selectedId === service.id && "✓ "}
                  {service.name}
                </span>
                <span className={`block text-sm mt-1 ${selectedId === service.id ? "text-white/80" : "text-text-muted"}`}>
                  {service.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
