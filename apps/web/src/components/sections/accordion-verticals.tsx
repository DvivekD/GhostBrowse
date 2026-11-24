"use client";

import React, { useState } from "react";
import { 
  Plane, 
  Utensils, 
  ShoppingBag, 
  BookOpen, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  ExternalLink,
  Sparkles,
  Zap
} from "lucide-react";

interface AccordionVerticalsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function AccordionVerticals({ onSelectPrompt }: AccordionVerticalsProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  const verticals = [
    {
      id: 0,
      number: "01",
      title: "Flights & Travel",
      tagline: "Airfare Arbitrage & Direct PNR Lock",
      icon: Plane,
      merchant: "IndiGo Airlines 6E-243",
      route: "Bangalore (BLR) → Kochi (COK)",
      fare: "₹2,850",
      savings: "Saved ₹650 vs target",
      prompt: "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner",
      perks: [
        "Complimentary Hot Dinner Confirmed",
        "15kg Check-in + 7kg Cabin Baggage",
        "Direct PNR Hold with Zero Form Filling"
      ],
      color: "from-emerald-500/15 via-teal-950/20 to-black/60",
      accent: "text-emerald-400",
      borderGlow: "border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
    },
    {
      id: 1,
      number: "02",
      title: "Food Delivery",
      tagline: "Live Kitchen Dispatch & Real-time ETA",
      icon: Utensils,
      merchant: "Swiggy • Meghana Foods",
      route: "Special Biryani + 2 Butter Naans",
      fare: "₹340",
      savings: "Free Delivery via SuperPass",
      prompt: "Top-rated Hyderabadi Biryani under ₹350 on Swiggy vs Zomato in 30 mins",
      perks: [
        "Courier Ramesh K. on EV (24 Min ETA)",
        "Live Delivery OTP Authorization (4829)",
        "Biodegradable Thermal Sealed Packaging"
      ],
      color: "from-cyan-500/15 via-teal-950/20 to-black/60",
      accent: "text-cyan-400",
      borderGlow: "border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
    },
    {
      id: 2,
      number: "03",
      title: "E-Commerce Sniper",
      tagline: "Multi-Store Price Matching & Instant Coupons",
      icon: ShoppingBag,
      merchant: "Flipkart Assured • SuperComNet",
      route: "Apple MacBook Air M3 (16GB/256GB)",
      fare: "₹92,990",
      savings: "Saved ₹11,910 vs MRP",
      prompt: "Track M3 MacBook Air 16GB under ₹95,000 on Flipkart Assured",
      perks: [
        "Instant HDFC Bank Credit Discount (-₹7,000)",
        "BlueDart AWB Express (BD-849201948IN)",
        "1-Year Official Apple India Warranty"
      ],
      color: "from-emerald-500/15 via-zinc-900 to-black/60",
      accent: "text-emerald-400",
      borderGlow: "border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
    },
    {
      id: 3,
      number: "04",
      title: "AI Research",
      tagline: "Academic Pre-Print Extraction & Verified PDFs",
      icon: BookOpen,
      merchant: "arXiv.org • DeepMind Fleet",
      route: "arXiv:2501.12948 [cs.AI] GUI Web Agents",
      fare: "Free Ground Truth",
      savings: "Open Access Ground Truth",
      prompt: "Top 3 arXiv papers this week on GUI web agents with verified PDF links",
      perks: [
        "Cryptographically Verified LaTeX PDF (4.8 MB)",
        "Deterministic W3C C14N DOM Normalized",
        "Zero Paywalls & Zero CAPTCHA Bottlenecks"
      ],
      color: "from-cyan-500/15 via-zinc-900 to-black/60",
      accent: "text-cyan-400",
      borderGlow: "border-cyan-500/70 shadow-[0_0_25px_rgba(6,182,212,0.25)]"
    },
    {
      id: 4,
      number: "05",
      title: "Careers & Jobs",
      tagline: "Autonomous ATS Resume Dispatch & Verification",
      icon: Briefcase,
      merchant: "Greenhouse • GhostBrowser Labs",
      route: "Staff AI Engineer ($185,000/yr)",
      fare: "$185k / yr",
      savings: "Direct Hiring Lead Routing",
      prompt: "Remote React 19 / AI Engineer roles > $130k on Y Combinator",
      perks: [
        "32/32 Candidate Form Fields Auto-Filled",
        "Encrypted Resume Digest Attachment",
        "Zero Candidate Application Fees"
      ],
      color: "from-emerald-500/15 via-teal-950/20 to-black/60",
      accent: "text-emerald-400",
      borderGlow: "border-emerald-500/70 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
    }
  ];

  return (
    <section className="relative w-full max-w-6xl mx-auto px-4 py-16 md:py-24 z-10 border-t border-zinc-800/80">
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-emerald-500/30 text-[11px] font-mono uppercase text-emerald-400 mb-3 shadow-xs">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Pick a Vertical // 5 Autonomous Scopes</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
          Five High-Impact Execution Scopes
        </h2>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mt-3 font-sans">
          Hover or click any scope to inspect authentic autonomous web workflows and trigger immediate execution.
        </p>
      </div>

      {/* Interactive Horizontal Accordion Container */}
      <div className="flex flex-col lg:flex-row gap-3 w-full min-h-[460px]">
        {verticals.map((v, idx) => {
          const isActive = activeTab === idx;
          const Icon = v.icon;

          return (
            <div
              key={v.id}
              onClick={() => setActiveTab(idx)}
              onMouseEnter={() => setActiveTab(idx)}
              className={`relative rounded-2xl overflow-hidden transition-all duration-500 flex flex-col justify-between cursor-pointer border ${
                isActive 
                  ? `lg:flex-[2.6] bg-gradient-to-b ${v.color} ${v.borderGlow} p-6` 
                  : "lg:flex-[1] bg-zinc-950/70 border-zinc-800 hover:border-zinc-700 p-5"
              }`}
            >
              {/* Top Bar: Number & Icon */}
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold font-mono tracking-tighter ${isActive ? v.accent : "text-zinc-600"}`}>
                    {v.number}
                  </span>
                  <div className={`p-2.5 rounded-xl border transition ${
                    isActive 
                      ? "bg-zinc-900/90 border-white/20 text-white" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-500"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title */}
                <div className="mt-4">
                  <h3 className="text-lg md:text-xl font-bold text-white font-sans">
                    {v.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                    {v.tagline}
                  </p>
                </div>
              </div>

              {/* Expanded Content Details */}
              {isActive ? (
                <div className="mt-6 space-y-4 font-sans animate-fade-in">
                  
                  {/* Target Merchant & Price Highlight */}
                  <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Selected Target</span>
                      <span className="text-sm font-bold text-white font-sans">{v.merchant}</span>
                      <span className="text-xs text-zinc-400 block">{v.route}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block">Verified Value</span>
                      <span className="text-xl font-bold font-mono text-emerald-400">{v.fare}</span>
                      <span className="text-[10px] font-mono text-zinc-400 block">{v.savings}</span>
                    </div>
                  </div>

                  {/* Perks List */}
                  <div className="space-y-1.5 text-xs text-zinc-300">
                    {v.perks.map((p, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{p}</span>
                      </div>
                    ))}
                  </div>

                  {/* Execute Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPrompt(v.prompt);
                    }}
                    className="w-full mt-2 py-3 px-4 rounded-xl bg-white text-black hover:bg-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-md font-mono"
                  >
                    <span>Execute Autonomous {v.title} Mission</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Collapsed Hint for Desktop */
                <div className="hidden lg:flex flex-col items-center justify-center py-6 text-zinc-500 font-mono text-xs">
                  <span className="[writing-mode:vertical-lr] tracking-widest uppercase text-[11px]">
                    Inspect Scope
                  </span>
                </div>
              )}

              {/* Bottom Subtle Status Pip */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-800/80 text-[10px] font-mono text-zinc-500 mt-4">
                <span>W3C C14N COMPLIANT</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-400 font-semibold">ONLINE</span>
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
