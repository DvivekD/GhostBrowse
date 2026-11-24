import { cn } from "@/lib/utils";
import React from "react";

interface RetroGridProps {
  className?: string;
  angle?: number;
}

export function RetroGrid({ className, angle = 65 }: RetroGridProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute size-full overflow-hidden opacity-30 [perspective:200px]",
        className
      )}
      style={{ "--grid-angle": `${angle}deg` } as React.CSSProperties}
    >
      {/* Grid */}
      <div className="absolute inset-0 [transform:rotateX(var(--grid-angle))]">
        <div
          className={cn(
            "animate-grid",
            "[background-repeat:repeat] [background-size:60px_60px] [height:300vh] [inset:0%_0px] [margin-left:-50%] [transform-origin:100%_0_0] [width:200vw]",
            "[background-image:linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_0),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_0)]",
            "dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_0),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_0)]"
          )}
        />
      </div>

      {/* Radial vignette mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa] via-transparent to-transparent dark:from-[#09090b]" />
      <div className="absolute inset-0 [background:radial-gradient(circle_at_50%_0%,transparent_0%,#fafafa_75%)] dark:[background:radial-gradient(circle_at_50%_0%,transparent_0%,#09090b_75%)]" />
    </div>
  );
}
