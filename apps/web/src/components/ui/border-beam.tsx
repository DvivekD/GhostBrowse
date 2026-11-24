"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
}

export function BorderBeam({
  className,
  size = 140,
  duration = 8,
  borderWidth = 1.5,
  colorFrom = "#10b981",
  colorTo = "#00f0ff",
  delay = 0,
}: BorderBeamProps) {
  return (
    <div
      style={
        {
          "--size": `${size}px`,
          "--duration": `${duration}s`,
          "--delay": `-${delay}s`,
          "--color-from": colorFrom,
          "--color-to": colorTo,
          "--border-width": `${borderWidth}px`,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute inset-0 rounded-[inherit] [border:calc(var(--border-width)*1px)_solid_transparent]",
        // Mask to clip only to border
        "[mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]",
        className
      )}
    >
      <div
        className={cn(
          "absolute aspect-square animate-border-beam bg-gradient-to-l from-[var(--color-from)] via-[var(--color-to)] to-transparent"
        )}
        style={{
          width: "var(--size)",
          offsetPath: "rect(0 auto auto 0 round calc(var(--size) * 1px))",
        }}
      />
    </div>
  );
}
