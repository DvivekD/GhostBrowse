"use client";

import React, { useState } from "react";
import { 
  Bot, 
  Mic, 
  Cpu, 
  Globe, 
  ShieldCheck, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Activity, 
  Radio, 
  Lock 
} from "lucide-react";

export function PipelineMilestones() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      id: 0,
      stepNumber: "STEP 001",
      badge: "NATURAL LANGUAGE STT",
      title: "Intent & Slot Ingestion",
      engine: "Deepgram Nova-3 Voice Pipeline",
      metric: "<80MS LATENCY",
      status: "STREAMING ACTIVE",
      icon: Mic,
      description: "Captures unconstrained voice or natural language instructions, instantaneously extracting deterministic slot constraints (origin, destination, budget cap, required amenities).",
      details: [
        "Real-time audio streaming tokenization (<80ms TTFT)",
        "Zero-shot constraint extraction (e.g., 'with dinner under ₹3,500')",
        "100% automated parsing with fallback to local text input"
      ],
      accent: "cyan"
    },
    {
      id: 1,
      stepNumber: "STEP 002",
      badge: "4-TIER AI CASCADE",
      title: "4-Tier Cascade Reasoning",
      engine: "SambaNova SN40L + Gemini + Groq",
      metric: "450 TOKENS / SEC",
      status: "38MS TTFT",
      icon: Cpu,
      description: "Tier 1 SambaNova SN40L RDUs synthesize a high-octane multi-worker execution plan, cascading seamlessly to Gemini 3.8 Flash for DOM vision and Groq LPU for JSON validation.",
      details: [
        "SambaNova SN40L Llama-3.3-70B RDU inference",
        "Multimodal layout anchor verification via Gemini 3.8 Flash",
        "Sub-20ms structured JSON schema extraction via Groq LPU"
      ],
      accent: "emerald"
    },
    {
      id: 2,
      stepNumber: "STEP 003",
      badge: "STEALTH CDP FLEET",
      title: "Parallel Browser Navigation",
      engine: "Steel.dev Cloud WebSocket CDP",
      metric: "3 CONTEXTS PARALLEL",
      status: "ANTIBOT CLEARED",
      icon: Globe,
      description: "Spawns 3 isolated headless Chromium contexts across Google Flights, Skyscanner, and Kayak, utilizing C++ engine-level fingerprint spoofing to bypass Cloudflare Turnstile.",
      details: [
        "Native CDP WebSocket sessions with isolated cookies & storage",
        "Camoufox C++ canvas, audio, and navigator spoofing",
        "Humanized cursor trajectory emulation to prevent behavioral flags"
      ],
      accent: "cyan"
    },
    {
      id: 3,
      stepNumber: "STEP 004",
      badge: "W3C C14N MERKLE ENGINE",
      title: "Cryptographic DOM Verification",
      engine: "W3C Canonical DOM + WebCrypto SHA-256",
      metric: "100% CRYPTO PROOF",
      status: "ZERO TAMPERING",
      icon: ShieldCheck,
      description: "Sanitizes raw HTML into deterministic W3C C14N DOM, constructing a 4-Leaf SHA-256 Merkle tree (Price Claim, Identity, Route, and Canonical DOM) verified client-side in WebCrypto.",
      details: [
        "Deterministic stripping of volatile session tokens & scripts",
        "Leaf 0 (Price Claim) + Leaf 1 (Identity) -> Branch H01",
        "Leaf 2 (Route/Spec) + Leaf 3 (Clean DOM) -> Branch H23 -> Root"
      ],
      accent: "emerald"
    },
    {
      id: 4,
      stepNumber: "STEP 005",
      badge: "ARMED 1-ACTION GATEWAY",
      title: "Merchant Payment & Ticket Seal",
      engine: "GhostBrowser /pay Portal & Direct Links",
      metric: "ZERO MANUAL FIELDS",
      status: "PNR ISSUED",
      icon: CreditCard,
      description: "Locks the lowest verified fare or product deal, pre-filling all 47 checkout inputs and armed directly on the authentic /pay portal with UPI Intent (GPay/PhonePe) and instant PNR issuance.",
      details: [
        "Direct pre-filled merchant handoff (IndiGo, Swiggy, Flipkart)",
        "Clickable native UPI Intent (GPay/PhonePe) + dynamic QR code",
        "Downloadable cryptographic invoice JSON with sealed Merkle root"
      ],
      accent: "cyan"
    }
  ];

  const handlePrev = () => {
    setActiveStep(prev => (prev > 0 ? prev - 1 : steps.length - 1));
  };

  const handleNext = () => {
    setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  const active = steps[activeStep];
  const IconComponent = active.icon;

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-24 z-10 border-t border-zinc-800/80">
      
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-emerald-500/30 text-[11px] font-mono uppercase text-emerald-400 mb-3 shadow-xs">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Execution Lifecycle // 5 Autonomous Checkpoints</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
          The Zero-Click Execution Pipeline
        </h2>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mt-3 font-sans">
          From unconstrained natural language intent to cryptographic ground-truth settlement in 2.4 seconds.
        </p>
      </div>

      {/* HORIZONTAL SIGNAL TRACK PROGRESS BAR */}
      <div className="relative w-full mb-8">
        
        {/* Track Line */}
        <div className="w-full h-1 bg-zinc-800 rounded-full relative mb-8">
          <div 
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]"
            style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* 5 Step Indicator Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map((s, idx) => {
            const isSelected = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-left transition-all duration-300 font-mono text-xs cursor-pointer flex flex-col justify-between gap-1.5 ${
                  isSelected
                    ? "bg-zinc-900 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.25)]"
                    : isCompleted
                      ? "bg-zinc-950/70 border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60"
                      : "bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between text-[10px]">
                  <span className={isSelected ? "text-emerald-400 font-bold" : isCompleted ? "text-emerald-500" : "text-zinc-500"}>
                    {s.stepNumber}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  ) : isSelected ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                  )}
                </div>
                <div className={`font-sans font-bold text-xs truncate ${isSelected ? "text-white" : "text-zinc-300"}`}>
                  {s.title}
                </div>
                <div className="text-[10px] text-zinc-500 truncate">
                  {s.metric}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE STEP SPOTLIGHT CARD */}
      <div className="relative rounded-2xl bg-zinc-950/80 border border-zinc-800 p-6 md:p-8 backdrop-blur-md shadow-2xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        
        {/* Left Side: Step Overview & Visual */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-xs">
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  {active.stepNumber} // {active.badge}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400">
                  {active.status}
                </span>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-white font-sans mt-0.5">
                {active.title}
              </h3>
              <p className="text-xs text-zinc-400 font-mono">
                Engine: {active.engine}
              </p>
            </div>
          </div>

          <p className="text-sm text-zinc-300 font-sans leading-relaxed">
            {active.description}
          </p>

          {/* Details Bullet List */}
          <div className="space-y-2 pt-2 border-t border-zinc-800/80 text-xs font-sans text-zinc-300">
            {active.details.map((d, dIdx) => (
              <div key={dIdx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{d}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Navigation & Key Metrics Pill */}
        <div className="flex flex-col items-center lg:items-end justify-between gap-4 w-full lg:w-auto shrink-0">
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center lg:items-end text-right font-mono min-w-[200px]">
            <span className="text-[10px] text-zinc-500 uppercase">Hardware Metric</span>
            <span className="text-xl font-bold text-emerald-400 mt-0.5">{active.metric}</span>
            <span className="text-[10px] text-zinc-400 mt-1">Autonomous Execution</span>
          </div>

          {/* Prev / Next Controls */}
          <div className="flex items-center gap-2 w-full justify-between lg:justify-end">
            <button
              onClick={handlePrev}
              className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition flex items-center gap-1.5 text-xs font-mono cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition flex items-center gap-1.5 text-xs font-mono cursor-pointer shadow-xs"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

    </section>
  );
}
