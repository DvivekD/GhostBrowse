"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent, motion, AnimatePresence } from "motion/react";
import { 
  Bot, 
  Mic, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  CheckCircle2, 
  Lock, 
  Layers, 
  ArrowRight, 
  Radio, 
  Activity, 
  Shield, 
  Fingerprint, 
  Check, 
  ExternalLink,
  ChevronRight,
  Plane,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PhaseData {
  id: number;
  label: string;
  badge: string;
  title: string;
  description: string;
}

const PHASES: PhaseData[] = [
  {
    id: 1,
    label: "01. INGEST",
    badge: "Natural Language STT",
    title: "Intent Ingestion & Slot Extraction",
    description: "Deepgram Nova-3 transcribes voice audio in <80ms. GhostBrowser parses unconstrained intent into strict cryptographic execution constraints."
  },
  {
    id: 2,
    label: "02. REASON",
    badge: "4-Tier Cascade",
    title: "SambaNova SN40L Cascade Reasoning",
    description: "Llama-3.3-70B running at 450 tokens/sec on Reconfigurable Dataflow Units (RDU) plans 3 parallel browser execution vectors with 0 human intervention."
  },
  {
    id: 3,
    label: "03. NAVIGATE",
    badge: "Steel.dev CDP Fleet",
    title: "Parallel Stealth Browser Execution",
    description: "Three isolated headless Chrome sessions navigate Google Flights, Skyscanner, and Kayak, bypassing Cloudflare Turnstile with native C++ fingerprint spoofing."
  },
  {
    id: 4,
    label: "04. VERIFY & APPROVE",
    badge: "W3C C14N Merkle Proof",
    title: "4-Leaf Merkle Proof & 1-Action Approval",
    description: "W3C C14N DOM normalization strips volatile artifacts, computing a tamper-proof 4-leaf SHA-256 Merkle root. One click confirms the action without 47 form fields."
  }
];

export function ScrollDrivenDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activePhase, setActivePhase] = useState<number>(0);
  const [seatHeld, setSeatHeld] = useState<boolean>(false);
  const [scrollPercent, setScrollPercent] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setScrollPercent(Math.round(latest * 100));
    if (latest < 0.25) {
      setActivePhase(0);
    } else if (latest < 0.50) {
      setActivePhase(1);
    } else if (latest < 0.75) {
      setActivePhase(2);
    } else {
      setActivePhase(3);
    }
  });

  const scrollToPhase = (phaseIndex: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const targetScroll = containerTop + (phaseIndex / 3.5) * (containerHeight - window.innerHeight);
    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  const currentPhase = PHASES[activePhase];

  return (
    <section 
      ref={containerRef} 
      id="how-it-works"
      className="relative h-[320vh] md:h-[380vh] w-full bg-[#fafafa] dark:bg-[#09090b] transition-colors"
    >
      {/* Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-between py-6 md:py-10 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Top Header & Phase Navigation Stepper */}
        <div className="flex flex-col items-center gap-3 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span className="font-semibold text-black dark:text-white uppercase tracking-wider">
              Scroll-Driven Autonomous Pipeline
            </span>
            <span className="text-zinc-400 dark:text-zinc-600">•</span>
            <span>{scrollPercent}% Scrolled</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-black dark:text-white text-center font-sans">
            How GhostBrowser Executes <span className="underline decoration-cyan-500 decoration-2">Beyond the Browser</span>
          </h2>

          {/* Stepper Tabs Bar (Clickable) */}
          <div className="flex items-center gap-1.5 md:gap-3 p-1.5 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 backdrop-blur-md max-w-2xl w-full justify-between">
            {PHASES.map((p, idx) => {
              const isActive = activePhase === idx;
              const isPast = activePhase > idx;
              return (
                <button
                  key={p.id}
                  onClick={() => scrollToPhase(idx)}
                  className={cn(
                    "flex-1 py-1.5 md:py-2 px-2 rounded-lg text-center font-mono text-[10px] md:text-xs transition-all relative cursor-pointer",
                    isActive 
                      ? "bg-white dark:bg-black text-black dark:text-white shadow-xs font-bold border border-zinc-300 dark:border-zinc-700" 
                      : isPast
                        ? "text-emerald-600 dark:text-emerald-400 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                        : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  )}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    {isPast && <Check className="w-3 h-3 text-emerald-500" />}
                    <span>{p.label}</span>
                  </div>
                  {isActive && (
                    <motion.div 
                      layoutId="active-scroll-tab"
                      className="absolute -bottom-1.5 left-2 right-2 h-0.5 bg-cyan-500 rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Center: Dynamic Browser Viewport Mockup */}
        <div className="w-full max-w-5xl mx-auto my-auto z-10 flex flex-col">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden transition-all duration-300">
            
            {/* Browser Bezel Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900/80 border-b border-zinc-200 dark:border-zinc-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-400/80 inline-block" />
                </div>
                <div className="hidden sm:flex items-center gap-1.5 pl-2 text-[11px] text-zinc-400 border-l border-zinc-300 dark:border-zinc-700">
                  <Bot className="w-3.5 h-3.5 text-cyan-500" />
                  <span>GhostBrowser Kernel v1.0</span>
                </div>
              </div>

              {/* Dynamic URL Bar */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-300 font-mono shadow-2xs max-w-md w-full justify-center">
                <Lock className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="truncate">
                  ghostbrowser://pipeline/{currentPhase.badge.toLowerCase().replace(/\s+/g, "-")}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-400 uppercase">
                  TLS 1.3
                </span>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline">Steel.dev Live</span>
              </div>
            </div>

            {/* Dynamic Stage Content Area */}
            <div className="p-4 sm:p-6 md:p-8 min-h-[380px] sm:min-h-[420px] flex flex-col justify-center bg-zinc-50/50 dark:bg-zinc-950/50">
              <AnimatePresence mode="wait">
                
                {/* PHASE 1: INTENT INGESTION */}
                {activePhase === 0 && (
                  <motion.div
                    key="phase-1"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-wider">
                          Phase 01 // Voice & Natural Language Ingestion
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mt-0.5">
                          Deepgram Nova-3 Audio Token Streaming
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500">
                        <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                        <span>Latency: 76ms • Word Error Rate &lt; 2.8%</span>
                      </div>
                    </div>

                    {/* Simulated Audio Waveform Bar */}
                    <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500 animate-pulse">
                          <Mic className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-mono text-zinc-400">Captured Audio Stream</div>
                          <div className="text-sm md:text-base font-semibold text-black dark:text-white">
                            &quot;Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner&quot;
                          </div>
                        </div>
                      </div>

                      {/* Equalizer Visualizer Bars */}
                      <div className="hidden md:flex items-center gap-1">
                        {[40, 75, 100, 60, 85, 30, 95, 50, 70, 90, 45, 65].map((h, i) => (
                          <motion.span
                            key={i}
                            animate={{ height: [`${h * 0.3}px`, `${h * 0.4}px`, `${h * 0.2}px`] }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.08 }}
                            className="w-1 bg-cyan-500 rounded-full inline-block"
                            style={{ height: `${h * 0.35}px` }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Extracted Slots Breakdown */}
                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
                        Extracted Cryptographic Execution Constraints
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Route</span>
                          <span className="text-sm font-bold text-black dark:text-white">BLR → COK</span>
                        </div>
                        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Departure</span>
                          <span className="text-sm font-bold text-black dark:text-white">Tomorrow</span>
                        </div>
                        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Budget Cap</span>
                          <span className="text-sm font-bold text-emerald-500">≤ ₹3,500</span>
                        </div>
                        <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase block">Mandatory Perk</span>
                          <span className="text-sm font-bold text-cyan-500">Meal Included</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PHASE 2: 4-TIER REASONING CASCADE */}
                {activePhase === 1 && (
                  <motion.div
                    key="phase-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
                      <div>
                        <span className="text-xs font-mono font-bold text-emerald-500 uppercase tracking-wider">
                          Phase 02 // 4-Tier Reasoning Cascade
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mt-0.5">
                          SambaNova Cloud SN40L Execution Plan (450 t/s)
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-mono text-xs">
                        <Zap className="w-3.5 h-3.5" />
                        <span>38ms Time-To-First-Token</span>
                      </div>
                    </div>

                    {/* 4-Tier Cascade Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* Tier 1 */}
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 flex flex-col justify-between gap-2">
                        <div>
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-500">
                            <span>TIER 1 (ACTIVE)</span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                          </div>
                          <div className="text-sm font-bold text-black dark:text-white mt-1">SambaNova SN40L</div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Llama-3.3-70B RDU Engine</div>
                        </div>
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 pt-2 border-t border-emerald-500/20">
                          Speed: 450 tokens/s
                        </div>
                      </div>

                      {/* Tier 2 */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-2">
                        <div>
                          <div className="text-xs font-mono font-bold text-zinc-400">TIER 2 (READY)</div>
                          <div className="text-sm font-bold text-black dark:text-white mt-1">Gemini 3.8 Flash</div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Multimodal DOM Vision</div>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                          Zero-Shot Layout Parsing
                        </div>
                      </div>

                      {/* Tier 3 */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-2">
                        <div>
                          <div className="text-xs font-mono font-bold text-zinc-400">TIER 3 (READY)</div>
                          <div className="text-sm font-bold text-black dark:text-white mt-1">Groq LPU</div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Deterministic JSON Output</div>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                          Latency: &lt; 20ms
                        </div>
                      </div>

                      {/* Tier 4 */}
                      <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between gap-2">
                        <div>
                          <div className="text-xs font-mono font-bold text-zinc-400">TIER 4 (DETERMINISTIC)</div>
                          <div className="text-sm font-bold text-black dark:text-white mt-1">W3C C14N Engine</div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">Deterministic DOM Normalizer</div>
                        </div>
                        <div className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                          100% Cryptographic Parity
                        </div>
                      </div>
                    </div>

                    {/* Real-time Thought Console */}
                    <div className="p-3 rounded-lg bg-black text-zinc-300 font-mono text-xs flex items-center gap-2 border border-zinc-800 overflow-x-auto">
                      <Terminal className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-cyan-400 font-bold select-none">[CASCADE PLAN]</span>
                      <span className="truncate">
                        Dispatched 3 parallel CDP contexts: Google Flights, Skyscanner, Kayak. Target fare: BLR→COK &lt;= 3500.
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* PHASE 3: STEEL.DEV CDP NAVIGATION */}
                {activePhase === 2 && (
                  <motion.div
                    key="phase-3"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
                      <div>
                        <span className="text-xs font-mono font-bold text-cyan-500 uppercase tracking-wider">
                          Phase 03 // Steel.dev Cloud Stealth Fleet
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-black dark:text-white mt-0.5">
                          Multi-Worker CDP Parallel Navigation
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono text-emerald-500">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Cloudflare Turnstile Cleared via Camoufox C++</span>
                      </div>
                    </div>

                    {/* 3 Active Browser Workers */}
                    <div className="space-y-2.5">
                      {/* Worker 1 */}
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-emerald-500/40 shadow-xs flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-bold text-black dark:text-white flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Worker 01: Google Flights (Steel.dev Session #082)
                          </span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-semibold text-[10px] uppercase">
                            Extracted &amp; Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono">
                          Verified fare: IndiGo 6E-243 @ ₹2,850 • Departure 06:15 AM • Hot Dinner &amp; 15kg baggage verified.
                        </p>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-500 h-full w-full" />
                        </div>
                      </div>

                      {/* Worker 2 */}
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-500" />
                            Worker 02: Skyscanner Search
                          </span>
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 font-semibold text-[10px] uppercase">
                            Scraped
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          Found Akasa Air QP-1382 at ₹3,120 • 08:30 AM • No dinner included.
                        </p>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-500 h-full w-[88%]" />
                        </div>
                      </div>

                      {/* Worker 3 */}
                      <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-zinc-400" />
                            Worker 03: Kayak Morning Scan
                          </span>
                          <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 font-semibold text-[10px] uppercase">
                            Scraped
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-mono">
                          Found Air India Express at ₹3,350 • Exceeds target fare threshold.
                        </p>
                        <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-zinc-500 h-full w-[78%]" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* PHASE 4: MERKLE PROOF & 1-ACTION APPROVAL */}
                {activePhase === 3 && (
                  <motion.div
                    key="phase-4"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-5"
                  >
                    {/* Left: 4-Leaf Merkle Tree Visualizer (6 cols) */}
                    <div className="lg:col-span-6 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-emerald-500 uppercase flex items-center gap-1.5">
                          <Fingerprint className="w-3.5 h-3.5" /> 4-Leaf SHA-256 Merkle Proof
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                          ✓ Cryptographically Verified
                        </span>
                      </div>

                      {/* Merkle Root Box */}
                      <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-700 text-white font-mono text-[11px]">
                        <div className="text-[9px] text-zinc-400 uppercase tracking-wider flex items-center justify-between">
                          <span>Merkle Root (Level 2)</span>
                          <span className="text-emerald-400">SHA-256</span>
                        </div>
                        <div className="font-bold text-emerald-400 truncate mt-0.5">
                          a0e7c84c04cd88de1a6d604cc754b7bf7096...
                        </div>
                      </div>

                      {/* 4 Leaves (Level 0) */}
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                        <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-zinc-400 block font-bold">Leaf 0: Price Claim</span>
                          <span className="text-emerald-500 font-semibold block mt-0.5">CLAIM_PRICE: ₹2,850</span>
                          <span className="text-zinc-500 text-[9px] truncate block">55bbe6b9...</span>
                        </div>

                        <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-zinc-400 block font-bold">Leaf 1: Flight Identity</span>
                          <span className="text-cyan-500 font-semibold block mt-0.5">IndiGo 6E-243</span>
                          <span className="text-zinc-500 text-[9px] truncate block">9433901d...</span>
                        </div>

                        <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-zinc-400 block font-bold">Leaf 2: Route &amp; Perk</span>
                          <span className="text-black dark:text-white font-semibold block mt-0.5">BLR→COK (Dinner)</span>
                          <span className="text-zinc-500 text-[9px] truncate block">17f002b8...</span>
                        </div>

                        <div className="p-2 rounded bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                          <span className="text-zinc-400 block font-bold">Leaf 3: Canonical DOM</span>
                          <span className="text-fuchsia-400 font-semibold block mt-0.5">W3C C14N Clean DOM</span>
                          <span className="text-zinc-500 text-[9px] truncate block">772c456e...</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Polymorphic 1-Action Approval Card (6 cols) */}
                    <div className="lg:col-span-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-md flex flex-col justify-between gap-3">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-cyan-500 font-bold uppercase tracking-wider">
                            1-Action Approval Card
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            Saved ₹650 vs Budget
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <h4 className="text-base font-bold text-black dark:text-white flex items-center gap-1.5">
                              <Plane className="w-4 h-4 text-cyan-500" /> IndiGo 6E-243
                            </h4>
                            <p className="text-xs text-zinc-500 font-mono">
                              BLR → COK • Departs 06:15 AM (1h 15m)
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-zinc-400 block font-mono">Verified Fare</span>
                            <span className="text-xl font-bold text-emerald-500 font-mono">₹2,850</span>
                          </div>
                        </div>

                        <div className="mt-3 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1 text-xs">
                          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Complimentary Hot Dinner Confirmed</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                            <span>15kg Check-in + 7kg Cabin Baggage Included</span>
                          </div>
                        </div>
                      </div>

                      {/* 1-Action Hold Seat Button */}
                      {seatHeld ? (
                        <div className="py-2.5 px-3 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" /> Seat Held! Deep-Link Pre-Filled. Zero Forms.
                        </div>
                      ) : (
                        <button
                          onClick={() => setSeatHeld(true)}
                          className="w-full py-2.5 px-3 rounded-lg bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md"
                        >
                          <span>Hold Seat at ₹2,850 (1-Click)</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Bottom Status Bar */}
            <div className="px-4 py-2 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-black dark:text-white">{currentPhase.title}</span>
                <span className="hidden md:inline text-zinc-400">• {currentPhase.description}</span>
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400 flex-shrink-0">
                <span className="hidden sm:inline">Scroll to progress</span>
                <ChevronRight className="w-3 h-3 text-cyan-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Hint */}
        <div className="text-center text-xs font-mono text-zinc-400 z-10">
          Linear/Apple Scroll Experience • 4 Autonomous Execution Phases • Track 2: Beyond the Browser
        </div>
      </div>
    </section>
  );
}
