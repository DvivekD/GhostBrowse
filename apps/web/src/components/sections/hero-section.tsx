"use client";

import React from "react";
import { 
  ArrowUpRight, 
  Mic, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Layers, 
  Radio, 
  Zap, 
  Terminal, 
  CheckCircle2 
} from "lucide-react";

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
    <section className="relative w-full max-w-6xl mx-auto px-4 pt-16 md:pt-24 pb-12 flex flex-col items-center text-center z-10">
      
      {/* 1. GhostBrowser Fleet Active Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-emerald-500/40 backdrop-blur-md shadow-[0_0_20px_rgba(16,185,129,0.2)] mb-6 transition-transform hover:scale-[1.02]">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-300">
          Steel.dev Cloud CDP Fleet: Connected
        </span>
        <span className="text-zinc-600">|</span>
        <span className="text-[11px] font-mono uppercase text-zinc-400 tracking-wider">
          Zero-Click Engine
        </span>
      </div>

      {/* 2. Main Hero Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white font-sans max-w-4xl leading-[1.06] mb-6">
        Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-200 to-cyan-400">Zero-Click</span> Web Execution.
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-zinc-400 font-sans max-w-2xl leading-relaxed mb-8">
        Convert natural language intent into cryptographically sealed <strong className="text-white font-semibold">1-Action Approval Cards</strong> with W3C C14N DOM proofs. Bypassing 47 tedious form fields with human-in-the-loop financial safety.
      </p>

      {/* 3. Reference-Inspired 4-Tile Live Metric HUD Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl w-full mb-8 font-mono text-xs">
        {/* Metric 1: Cascade Speed */}
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-emerald-500/30 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span>Cascade Speed</span>
          </div>
          <span className="text-lg md:text-xl font-bold text-white tracking-tight font-mono">
            450 t/s
          </span>
          <span className="text-[9px] text-zinc-500 uppercase mt-0.5">SambaNova SN40L RDU</span>
        </div>

        {/* Metric 2: Merkle Proof Seal */}
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-emerald-500/30 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Integrity Seal</span>
          </div>
          <span className="text-lg md:text-xl font-bold text-white tracking-tight font-mono">
            W3C C14N
          </span>
          <span className="text-[9px] text-zinc-500 uppercase mt-0.5">4-Leaf SHA-256 Proof</span>
        </div>

        {/* Metric 3: Zero-Click Form Fields */}
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-cyan-500/30 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Form Automation</span>
          </div>
          <span className="text-lg md:text-xl font-bold text-white tracking-tight font-mono">
            47 → 0
          </span>
          <span className="text-[9px] text-zinc-500 uppercase mt-0.5">Zero Manual Fields</span>
        </div>

        {/* Metric 4: Live Payment Gateway */}
        <div className="p-3 rounded-xl bg-zinc-950/70 border border-cyan-500/30 backdrop-blur-md flex flex-col items-center justify-center text-center shadow-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5" />
            <span>Merchant Gateway</span>
          </div>
          <span className="text-lg md:text-xl font-bold text-white tracking-tight font-mono">
            1-Action
          </span>
          <span className="text-[9px] text-zinc-500 uppercase mt-0.5">Armed /pay Portal</span>
        </div>
      </div>

      {/* 4. Sleek Cyber Intent Prompt Bar */}
      <div className="w-full max-w-2xl bg-zinc-950/80 border border-zinc-800 focus-within:border-emerald-500/60 rounded-2xl p-2.5 shadow-[0_0_25px_rgba(16,185,129,0.15)] mb-4 backdrop-blur-md transition-colors">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Instruct GhostBrowser, e.g. Find flight BLR to COK tomorrow under ₹3,500..."
            className="w-full bg-transparent px-4 py-3 text-sm md:text-base text-white placeholder:text-zinc-500 focus:outline-none font-sans pr-28"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              onClick={onMicToggle}
              className={`p-2 rounded-lg border transition cursor-pointer ${
                isRecording
                  ? "bg-red-950/80 border-red-500 text-red-400 animate-pulse"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              }`}
              title="Speak instruction (Deepgram Nova-3)"
            >
              <Mic className="w-4 h-4" />
            </button>
            <button
              onClick={() => onExecuteQuery(query)}
              className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs md:text-sm flex items-center gap-1.5 transition shadow-sm cursor-pointer"
            >
              <span>Execute</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-8">
        <span className="text-zinc-500 font-mono text-[11px] uppercase">Quick Demos:</span>
        <button
          onClick={() => {
            const q = "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner";
            setQuery(q);
            onExecuteQuery(q);
          }}
          className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 text-zinc-300 hover:text-emerald-300 transition text-[11px] font-mono cursor-pointer"
        >
          ✈️ BLR → COK (Meal &amp; Baggage)
        </button>
        <button
          onClick={() => {
            const q = "Top-rated Hyderabadi Biryani under ₹350 on Swiggy vs Zomato in 30 mins";
            setQuery(q);
            onExecuteQuery(q);
          }}
          className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 text-zinc-300 hover:text-emerald-300 transition text-[11px] font-mono cursor-pointer"
        >
          🍔 Swiggy Biryani (ETA 24m)
        </button>
        <button
          onClick={() => {
            const q = "Track M3 MacBook Air 16GB under ₹95,000 on Flipkart Assured";
            setQuery(q);
            onExecuteQuery(q);
          }}
          className="px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 text-zinc-300 hover:text-emerald-300 transition text-[11px] font-mono cursor-pointer hidden sm:inline-block"
        >
          🛍️ MacBook M3 Sniper (-₹7,000)
        </button>
      </div>

    </section>
  );
}
