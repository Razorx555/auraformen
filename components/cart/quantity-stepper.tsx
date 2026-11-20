"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/format";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
  label = "item",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const btn = size === "sm" ? "size-9" : "size-12";
  return (
    <div
      role="group"
      aria-label={`Quantidade de ${label}`}
      className={cn(
        "inline-flex items-center rounded-full border border-white/15",
        size === "sm" ? "h-9" : "h-12",
      )}
    >
      <button
        type="button"
        className={cn(btn, "grid place-items-center rounded-full text-chrome hover:text-paper disabled:opacity-30")}
        onClick={() => onChange(value - 1)}
        disabled={value <= (size === "sm" ? 0 : min)}
        aria-label="Diminuir quantidade"
      >
        <Minus className="size-3.5" />
      </button>
      <output aria-live="polite" className={cn("min-w-8 text-center font-display tabular-nums", size === "sm" ? "text-sm" : "text-base")}>
        {value}
      </output>
      <button
        type="button"
        className={cn(btn, "grid place-items-center rounded-full text-chrome hover:text-paper disabled:opacity-30")}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Aumentar quantidade"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
