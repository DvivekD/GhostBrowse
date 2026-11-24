import React from "react";
import { cn } from "@/lib/utils";

export function BentoGrid({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-12 gap-4 max-w-6xl mx-auto w-full",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className,
  title,
  subtitle,
  description,
  header,
  icon,
  badge,
  colSpan = 6,
  children,
}: {
  className?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  description: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string | React.ReactNode;
  colSpan?: 3 | 4 | 6 | 8 | 12;
  children?: React.ReactNode;
}) {
  const colSpanClasses = {
    3: "md:col-span-3",
    4: "md:col-span-4",
    6: "md:col-span-6",
    8: "md:col-span-8",
    12: "md:col-span-12",
  };

  return (
    <div
      className={cn(
        "group/bento relative rounded-2xl bg-zinc-950/75 border border-zinc-800/80 backdrop-blur-md p-6 flex flex-col justify-between overflow-hidden shadow-xl hover:border-emerald-500/40 transition-all duration-300",
        colSpanClasses[colSpan],
        className
      )}
    >
      {/* Top Header / Visual Element */}
      {header && <div className="w-full mb-4">{header}</div>}

      <div className="flex flex-col gap-2 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon && <div className="text-zinc-200">{icon}</div>}
            <h4 className="font-sans font-bold text-base md:text-lg text-white tracking-tight">
              {title}
            </h4>
          </div>
          {badge && (
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-emerald-400 font-semibold">
              {badge}
            </span>
          )}
        </div>

        {subtitle && (
          <div className="text-xs font-medium text-zinc-400">
            {subtitle}
          </div>
        )}

        <p className="font-sans text-xs md:text-sm text-zinc-300 leading-relaxed mt-1">
          {description}
        </p>

        {children}
      </div>

      {/* Subtle corner light accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-emerald-500/10 via-cyan-500/5 to-transparent pointer-events-none rounded-bl-full" />
    </div>
  );
}
