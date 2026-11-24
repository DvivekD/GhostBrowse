"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import {
  Mic,
  Terminal,
  Cpu,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Plane,
  Sparkles,
  Lock,
  Layers,
} from "lucide-react";

interface ScrollStep {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
}

const STEPS: ScrollStep[] = [
  {
    id: "intent",
    stepNumber: "01",
    title: "Zero-Click Natural Intent Ingestion",
    subtitle: "Raw Audio & Text Capture",
    description: "Speak or type high-level human goals with ambiguous constraints. GhostBrowser eliminates 47 tedious form fields with instant multimodal intent ingestion.",
    badge: "DEEPGRAM NOVA-3 STT",
  },
  {
    id: "reasoning",
    stepNumber: "02",
    title: "4-Tier Multi-Brain Reasoning Cascade",
    subtitle: "Sub-50ms Hardware Acceleration",
    description: "SambaNova SN40L RDUs run full 671B reasoning at 450 t/s, decomposing intent into structured parameters (origin, destination, date, meal, budget) before cascading to Gemini 3.8 and Groq.",
    badge: "SAMBANOVA RDU @ 450 T/S",
  },
  {
    id: "execution",
    stepNumber: "03",
    title: "Steel.dev Cloud Stealth Fleet",
    subtitle: "Parallel Anti-Bot CDP Execution",
    description: "Spins up 3 parallel headless Chromium sessions over WebSocket CDP. Bypasses Cloudflare Turnstile and DataDome, extracting live DOM structures across target airlines.",
    badge: "3 PARALLEL CONTEXTS",
  },
  {
    id: "merkle",
    stepNumber: "04",
    title: "Cryptographic C14N Merkle Proof",
    subtitle: "Deterministic Ground Truth & 1-Click Pay",
    description: "W3C C14N normalizes HTML into a 4-leaf SHA-256 Merkle Tree verified client-side. The 1-Action Approval Card locks in the verified price with live airline checkout pre-armed.",
    badge: "W3C C14N MERKLE ROOT",
  },
];

export function ScrollDrivenDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) {
      setActiveStep(0);
    } else if (latest < 0.52) {
      setActiveStep(1);
    } else if (latest < 0.78) {
      setActiveStep(2);
    } else {
      setActiveStep(3);
    }
  });

  const jumpToInteractive = () => {
    const el = document.getElementById("command-center");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className="relative h-[320vh] bg-[#fafafa] dark:bg-[#09090b] text-[#09090b] dark:text-[#fafafa]">
      {/* Sticky Full-Viewport Stage */}
      <div className="sticky top-0 h-screen flex flex-col justify-center px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Section Pre-Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-zinc-500">
              Scroll-Driven Execution Lifecycle
            </span>
          </div>
          <button
            onClick={jumpToInteractive}
            className="text-xs font-sans text-zinc-500 hover:text-black dark:hover:text-white flex items-center gap-1 transition"
          >
            <span>Skip to Live Playground</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-Column Scrollytelling Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Progress Steps (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {STEPS.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.id}
                  className={`transition-all duration-300 pl-4 border-l-2 ${
                    isActive
                      ? "border-black dark:border-white opacity-100 translate-x-1"
                      : "border-zinc-200 dark:border-zinc-800 opacity-40 hover:opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-zinc-400">
                      {step.stepNumber}
                    </span>
                    <span className="font-mono text-[10px] uppercase px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                      {step.badge}
                    </span>
                  </div>
                  <h3 className="text-lg md:text-xl font-bold font-sans tracking-tight text-black dark:text-white">
                    {step.title}
                  </h3>
                  {isActive && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-zinc-500 dark:text-zinc-400 font-sans mt-1.5 leading-relaxed"
                    >
                      {step.description}
                    </motion.p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Dynamically Updating Browser Mockup (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative w-full rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xl overflow-hidden p-2 md:p-4">
              {/* Browser Header Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 px-2 font-mono text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                </div>
                <div className="flex items-center gap-2 px-3 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px]">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>ghostbrowser://execution-stream/{STEPS[activeStep].id}</span>
                </div>
                <div className="text-[10px] font-bold text-zinc-500">
                  STEP 0{activeStep + 1} / 04
                </div>
              </div>

              {/* Dynamic Screen States Cross-Faded on Scroll */}
              <div className="relative min-h-[340px] md:min-h-[380px] p-4 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {/* State 1: Natural Intent Ingestion */}
                  {activeStep === 0 && (
                    <motion.div
                      key="step-0"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-zinc-400 uppercase font-mono text-[10px]">Natural Voice / Text Prompt</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                          <Mic className="w-3 h-3 animate-pulse" /> LISTENING (NOVA-3)
                        </span>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-inner flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                        <span className="font-sans text-sm md:text-base font-semibold text-black dark:text-white">
                          "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner"
                        </span>
                      </div>

                      {/* Waveform Visualization */}
                      <div className="flex items-center justify-center gap-1.5 py-4">
                        {[40, 75, 20, 90, 60, 30, 85, 45, 95, 65, 35, 80, 50, 70, 40].map((h, i) => (
                          <div
                            key={i}
                            className="w-1.5 bg-black dark:bg-white rounded-full transition-all duration-300"
                            style={{ height: `${h * 0.4}px` }}
                          />
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          Route: Bangalore (BLR) → Kochi (COK)
                        </div>
                        <div className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                          Constraint: Under ₹3,500 + Hot Meal
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* State 2: 4-Tier Reasoning Cascade */}
                  {activeStep === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-3 font-mono"
                    >
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
                          <Terminal className="w-3.5 h-3.5" />
                          <span>4-Tier Reasoning Trace</span>
                        </div>
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px]">
                          ~38ms TTFT
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-50 dark:bg-zinc-950 p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                        <div className="text-zinc-400">› [Tier 1 SambaNova RDU] Parsing prompt intent...</div>
                        <div className="text-emerald-600 dark:text-emerald-400">
                          › Intent Decomposed: Origin=BLR, Destination=COK, Date=Tomorrow
                        </div>
                        <div className="text-zinc-500">
                          › Preferences: [meal_included=true, budget=3500, class=Economy]
                        </div>
                        <div className="text-blue-500">
                          › [Gemini 3.8 / Groq Cascade] Strategy: Dispatched 3 parallel stealth browser contexts.
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center text-emerald-800 dark:text-emerald-300 font-bold">
                          SambaNova SN40L
                        </div>
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center text-blue-800 dark:text-blue-300 font-bold">
                          Gemini 3.8 Flash
                        </div>
                        <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-center text-purple-800 dark:text-purple-300 font-bold">
                          Groq LPU 120B
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* State 3: Steel.dev CDP Stealth Fleet */}
                  {activeStep === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-3 font-sans"
                    >
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-1.5 font-bold text-black dark:text-white">
                          <Globe className="w-3.5 h-3.5 text-blue-500" />
                          <span>Steel.dev Cloud CDP WebSocket Live Extraction</span>
                        </div>
                        <span className="font-mono text-[10px] text-zinc-400">3 ACTIVE SESSIONS</span>
                      </div>

                      {/* 3 Live Worker Bars */}
                      <div className="space-y-2.5">
                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Google Flights (Stealth Context 1)</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px]">100% Extracted</span>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-1.5 rounded-full w-full" />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Found IndiGo 6E-243 @ ₹2,850 • Meal & Baggage Verified • 105.5 KB DOM
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Skyscanner (Stealth Context 2)</span>
                            <span className="text-blue-600 dark:text-blue-400 font-mono text-[11px]">Bypassed Bot Gate</span>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-1.5 rounded-full w-[85%]" />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Akasa Air QP-1382 @ ₹3,120 (₹270 higher than Google Flights)
                          </span>
                        </div>

                        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span>Kayak (Stealth Context 3)</span>
                            <span className="text-zinc-500 font-mono text-[11px]">Complete</span>
                          </div>
                          <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-zinc-400 h-1.5 rounded-full w-full" />
                          </div>
                          <span className="text-[10px] font-mono text-zinc-500">
                            Air India Express @ ₹3,350 • Synthesizing winner
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* State 4: Cryptographic Proof & 1-Action Approval Card */}
                  {activeStep === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-3 font-sans"
                    >
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-zinc-100 dark:border-zinc-800">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> 4-LEAF MERKLE ROOT VALID
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400">100% CRYPTOGRAPHIC GROUND TRUTH</span>
                      </div>

                      {/* Verified 1-Action Approval Card */}
                      <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border-2 border-black dark:border-white shadow-md flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-black dark:text-white">
                            ₹2,850
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300">
                            SAVED ₹650
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-black dark:text-white">
                            IndiGo 6E-243 • Bangalore (BLR) → Kochi (COK)
                          </h4>
                          <p className="text-xs text-zinc-500 mt-0.5">
                            06:15 AM - 07:30 AM (1h 15m) • Hot Meal & 15kg Baggage Included
                          </p>
                        </div>

                        {/* Merkle Leaf Digest Preview */}
                        <div className="p-2.5 rounded-lg bg-zinc-900 text-white font-mono text-[10px] flex flex-col gap-1">
                          <div className="flex justify-between text-zinc-400">
                            <span>W3C C14N MERKLE ROOT</span>
                            <span className="text-emerald-400">9c3e...4e3f</span>
                          </div>
                          <div className="text-zinc-500 truncate">
                            Leaves: [Price: ₹2,850] [IndiGo 6E-243] [BLR-COK] [DOM: 105,502 bytes]
                          </div>
                        </div>

                        {/* Armed 1-Action Approval Trigger */}
                        <a
                          href="https://www.google.com/travel/flights?q=flights+from+BLR+to+COK"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs tracking-tight transition flex items-center justify-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
                        >
                          <span>1-Click Approve (Hold Seat & Open Checkout)</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
