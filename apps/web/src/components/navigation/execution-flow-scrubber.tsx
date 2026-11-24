"use client";

import React, { useState, useEffect } from "react";

interface ExecutionFlowScrubberProps {
  scrollProgress: number; // 0 to 1
}

export function ExecutionFlowScrubber({ scrollProgress }: ExecutionFlowScrubberProps) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    { id: 0, label: "01. HERO", targetId: "hero-section" },
    { id: 1, label: "02. PIPELINE", targetId: "pipeline-milestones" },
    { id: 2, label: "03. SCOPES", targetId: "verticals-scope" },
    { id: 3, label: "04. 3D CORE", targetId: "exploded-browser" },
    { id: 4, label: "05. ENGINE", targetId: "command-center" },
    { id: 5, label: "06. BENCHMARKS", targetId: "benchmarks-section" },
  ];

  useEffect(() => {
    const stepIndex = Math.min(Math.floor(scrollProgress * steps.length), steps.length - 1);
    setActiveStep(stepIndex);
  }, [scrollProgress, steps.length]);

  const scrollToTarget = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-3 pointer-events-auto select-none">
      
      {/* Top Heading */}
      <span className="text-[9px] font-mono tracking-widest text-emerald-400 uppercase font-bold [writing-mode:vertical-lr] rotate-180">
        EXECUTION FLOW
      </span>

      {/* Vertical Track Line */}
      <div className="relative w-0.5 h-56 bg-zinc-800 rounded-full my-2 overflow-hidden">
        {/* Glowing Emerald Runner Bead */}
        <div
          className="absolute left-0 right-0 bg-gradient-to-b from-emerald-400 via-teal-300 to-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
          style={{
            top: `${Math.min(Math.max(scrollProgress * 100, 0), 92)}%`,
            height: "18px",
          }}
        />
      </div>

      {/* Clickable Step Pips */}
      <div className="flex flex-col items-center gap-2.5">
        {steps.map((step, idx) => {
          const isActive = activeStep === idx;
          return (
            <button
              key={step.id}
              onClick={() => scrollToTarget(step.targetId)}
              className="group relative flex items-center justify-center p-1 focus:outline-none cursor-pointer"
              title={step.label}
            >
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-emerald-400 scale-125 shadow-[0_0_12px_rgba(16,185,129,0.9)]"
                    : "bg-zinc-700 hover:bg-zinc-500"
                }`}
              />

              {/* Tooltip on Hover */}
              <span className="absolute right-6 px-2.5 py-1 rounded-lg bg-zinc-950/95 border border-zinc-800 text-zinc-300 text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                {step.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Percentage read-out */}
      <span className="text-[10px] font-mono text-zinc-500 mt-2 font-bold">
        {Math.round(scrollProgress * 100)}%
      </span>
    </aside>
  );
}
