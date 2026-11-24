"use client";

import React from "react";
import { ArrowUpRight, Mic, Sparkles, ShieldCheck, Zap, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BorderBeam } from "@/components/ui/border-beam";
import { ParticleMesh } from "@/components/ui/particle-mesh";

interface HeroSectionProps {
  onExecuteQuery: (query: string) => void;
  query: string;
  setQuery: (q: string) => void;
  onMicToggle: () => void;
  isRecording: boolean;
}

export function HeroSection({
  onExecuteQuery,
  query,
  setQuery,
  onMicToggle,
  isRecording,
}: HeroSectionProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) {
      onExecuteQuery(query);
    }
  };

  return (
    <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto px-4 pt-12 md:pt-20 pb-8 overflow-hidden">
      {/* Interactive Background Particle Mesh */}
      <ParticleMesh particleCount={30} />
      {/* Track & Hackathon Pre-header Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs mb-6 transition-transform hover:scale-[1.02]">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300 font-sans">
          wHACKiest 2026 • Track 2: Beyond the Browser
        </span>
        <span className="text-zinc-300 dark:text-zinc-700">|</span>
        <span className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider">
          Zero-Click Engine
        </span>
      </div>

      {/* Main Hero Display Typography */}
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-black dark:text-white font-sans max-w-4xl leading-[1.08] mb-6">
        Autonomous <span className="underline decoration-zinc-300 dark:decoration-zinc-700 decoration-wavy decoration-2">Zero-Click</span> Web Execution.
      </h1>

      {/* Compelling Value Proposition Subtitle */}
      <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-sans max-w-2xl leading-relaxed mb-8">
        Convert natural language intent into verified <strong className="text-black dark:text-white font-semibold">1-Action Approval Cards</strong> with cryptographic W3C C14N DOM proofs. Bypassing 47 tedious form fields with human-in-the-loop financial safety.
      </p>

      {/* Hero Quick Prompt Bar with Reactive Border Beam */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-2 shadow-lg mb-4 overflow-hidden group">
        <BorderBeam size={160} colorFrom="#10b981" colorTo="#00f0ff" duration={6} />
        <div className="relative flex items-center z-10">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Instruct GhostBrowser, e.g. Find flight BLR to COK tomorrow under ₹3,500..."
            className="w-full bg-transparent px-4 py-3 text-sm md:text-base text-black dark:text-white placeholder:text-zinc-400 focus:outline-none font-sans pr-28"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              onClick={onMicToggle}
              className={`p-2 rounded-lg border transition ${
                isRecording
                  ? "bg-red-50 border-red-300 text-red-600 animate-pulse dark:bg-red-950/50"
                  : "bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white"
              }`}
              title="Speak instruction (Deepgram Nova-3)"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => onExecuteQuery(query)}
              className="px-4 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs md:text-sm flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-xs"
            >
              <span>Execute</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sample Query Quick-Action Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-10">
        <span className="text-zinc-400 font-medium">Quick Prompts:</span>
        <button
          onClick={() => {
            const q = "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner";
            setQuery(q);
            onExecuteQuery(q);
          }}
          className="px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 transition shadow-2xs"
        >
          ✈️ BLR → COK (Meal & Baggage)
        </button>
        <button
          onClick={() => {
            const q = "Find cheapest morning flight from Delhi to Mumbai tomorrow";
            setQuery(q);
            onExecuteQuery(q);
          }}
          className="px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 transition shadow-2xs"
        >
          ⚡ DEL → BOM (Morning Flight)
        </button>
        <button
          onClick={() => {
            const q = "Track M3 MacBook Air 16GB price on Amazon vs Flipkart";
            setQuery(q);
            onExecuteQuery(q);
          }}
          className="px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 transition shadow-2xs hidden sm:inline-block"
        >
          🛍️ MacBook M3 Arbitrage
        </button>
      </div>

      {/* Swiss Monochromatic Metrics Row */}
      <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-xl w-full border-t border-zinc-200 dark:border-zinc-800 pt-6 text-center">
        <div>
          <div className="text-xl sm:text-3xl font-bold font-sans text-black dark:text-white tracking-tight">
            47 → 0
          </div>
          <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider mt-0.5">
            Form Fields Filled
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-3xl font-bold font-sans text-black dark:text-white tracking-tight">
            2.4s
          </div>
          <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider mt-0.5">
            Average Latency
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-3xl font-bold font-sans text-black dark:text-white tracking-tight">
            100%
          </div>
          <div className="text-[11px] font-mono uppercase text-zinc-500 tracking-wider mt-0.5">
            DOM Merkle Proof
          </div>
        </div>
      </div>
    </div>
  );
}
