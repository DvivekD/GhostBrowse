"use client";

import React, { useState } from "react";
import { Plane, ShoppingBag, Briefcase, Utensils, BookOpen, Zap, ArrowUpRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VerticalsSectionProps {
  onSelectPrompt: (prompt: string) => void;
}

interface DomainData {
  id: string;
  name: string;
  icon: React.ReactNode;
  prompt: string;
  headline: string;
  targetSites: string[];
  metrics: { label: string; value: string }[];
  resultTitle: string;
  resultPrice: string;
  resultDetail: string;
  savings: string;
}

const DOMAINS: DomainData[] = [
  {
    id: "travel",
    name: "Travel & Flights",
    icon: <Plane className="w-4 h-4" />,
    prompt: "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner",
    headline: "Autonomous Travel Concierge",
    targetSites: ["Google Flights", "Skyscanner", "Kayak", "MakeMyTrip"],
    metrics: [
      { label: "Sites Scraped", value: "3 Cloud Fleets" },
      { label: "Baggage Checked", value: "15kg Cabin+Checkin" },
      { label: "Price Proof", value: "W3C C14N DOM Valid" }
    ],
    resultTitle: "IndiGo 6E-243 (BLR → COK)",
    resultPrice: "₹2,850",
    resultDetail: "Direct 1h 15m • Free Meal & 15kg Baggage Included",
    savings: "Saved ₹650"
  },
  {
    id: "shopping",
    name: "E-Commerce Sniper",
    icon: <ShoppingBag className="w-4 h-4" />,
    prompt: "Track M3 MacBook Air 16GB lowest price on Amazon vs Flipkart with card discount",
    headline: "Real-Time Price Arbitrage Engine",
    targetSites: ["Amazon India", "Flipkart Super", "Croma Online", "Reliance Digital"],
    metrics: [
      { label: "Coupons Tested", value: "8 Auto-Applied" },
      { label: "Bank Offer", value: "₹5,000 Instant HDFC" },
      { label: "Price Proof", value: "DOM Price Verified" }
    ],
    resultTitle: "Apple MacBook Air 13\" M3 (16GB/512GB)",
    resultPrice: "₹94,990",
    resultDetail: "Midnight Finish • Delivery by Tomorrow 10 AM",
    savings: "Saved ₹19,910"
  },
  {
    id: "jobs",
    name: "1-Click Job Apply",
    icon: <Briefcase className="w-4 h-4" />,
    prompt: "Apply to Senior Fullstack AI Engineer on Greenhouse & Lever with resume & GitHub",
    headline: "Autonomous Application Submitter",
    targetSites: ["Greenhouse.io", "Lever.co", "AshbyHQ", "Workday"],
    metrics: [
      { label: "Fields Auto-Filled", value: "32 Form Inputs" },
      { label: "PDF Resume Parsed", value: "100% Match" },
      { label: "Submission Safe", value: "1-Action Human Gate" }
    ],
    resultTitle: "Staff AI Engineer — Autonomous Systems",
    resultPrice: "$185,000 / yr",
    resultDetail: "Greenhouse Form Prepared • Zero Manual Typing Required",
    savings: "100% Automated"
  },
  {
    id: "food",
    name: "Hyperlocal Food",
    icon: <Utensils className="w-4 h-4" />,
    prompt: "Order Hyderabadi Mutton Biryani under ₹450 with fastest 30-min delivery",
    headline: "Multi-Cart Food Optimizer",
    targetSites: ["Swiggy Gourmet", "Zomato Gold", "Blinkit", "Zepto Cafe"],
    metrics: [
      { label: "Restaurants Compared", value: "14 Local Portals" },
      { label: "ETA Checked", value: "24 Minutes" },
      { label: "Coupon Stacked", value: "FLAT150 Applied" }
    ],
    resultTitle: "Meghana Special Biryani + Raita",
    resultPrice: "₹349",
    resultDetail: "Delivered in 28 mins • Free Delivery Armed",
    savings: "Saved ₹120"
  },
  {
    id: "research",
    name: "AI Research",
    icon: <BookOpen className="w-4 h-4" />,
    prompt: "Extract top 3 arXiv papers on Web GUI Autonomous Agents with verified PDF extracts",
    headline: "Autonomous Scholarly Pipeline",
    targetSites: ["arXiv.org", "Semantic Scholar", "Papers With Code", "GitHub"],
    metrics: [
      { label: "Papers Ingested", value: "3 Preprints" },
      { label: "Code Repos Found", value: "2 Open Source" },
      { label: "Abstract Summary", value: "Synthesized in 2.1s" }
    ],
    resultTitle: "WebAgent-V: Grounded Browser Execution",
    resultPrice: "Open Access",
    resultDetail: "arXiv:2602.04812 • Verified Abstract & Code Link Captured",
    savings: "Zero Paywalls"
  },
  {
    id: "utilities",
    name: "Civic Utilities",
    icon: <Zap className="w-4 h-4" />,
    prompt: "Check FASTag balance & find earliest tatkal passport renewal slot in Bangalore",
    headline: "Government & Utility Portal Automation",
    targetSites: ["Passport Seva", "NETC FASTag", "Parivahan", "UIDAI"],
    metrics: [
      { label: "CAPTCHA Handled", value: "Audio Decoded" },
      { label: "Slots Monitored", value: "Every 60 Seconds" },
      { label: "Security State", value: "Zero Credential Storage" }
    ],
    resultTitle: "PSK Lalbagh — Normal Appointment",
    resultPrice: "Slot Confirmed",
    resultDetail: "Earliest Slot: Friday 10:15 AM • Form Pre-Validated",
    savings: "No Agents Fee"
  }
];

export function VerticalsSection({ onSelectPrompt }: VerticalsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("travel");
  const selectedDomain = DOMAINS.find((d) => d.id === activeTab) || DOMAINS[0];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-3 border border-zinc-200 dark:border-zinc-700">
          <span>Universal Web Scope</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white font-sans">
          Beyond Flights: Any Web Domain
        </h2>
        <p className="text-sm md:text-base text-zinc-500 max-w-xl mt-3 font-sans">
          GhostBrowser is a polymorphic engine. From flights and e-commerce arbitrage to job applications and civic utilities, the 1-Action Approval Card works universally.
        </p>
      </div>

      {/* Domain Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {DOMAINS.map((domain) => {
          const isActive = domain.id === activeTab;
          return (
            <button
              key={domain.id}
              onClick={() => setActiveTab(domain.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold font-sans transition-all relative ${
                isActive
                  ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                  : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              {domain.icon}
              <span>{domain.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Interactive Demonstration Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-300 dark:border-zinc-800 p-6 md:p-8 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDomain.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left: Domain Info & Prompt Execution */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
                  {selectedDomain.name}
                </span>
                <span className="text-xs text-zinc-400 font-sans">• Steel.dev Contexts Armed</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-black dark:text-white font-sans tracking-tight">
                {selectedDomain.headline}
              </h3>

              {/* Sample Prompt Box */}
              <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                  Autonomous Instruction Prompt
                </span>
                <p className="text-sm font-medium text-black dark:text-white font-sans">
                  "{selectedDomain.prompt}"
                </p>
              </div>

              {/* Target Sites List */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="text-zinc-400 font-medium">Navigates Parallel Sites:</span>
                {selectedDomain.targetSites.map((site, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono text-[11px] border border-zinc-200 dark:border-zinc-700"
                  >
                    {site}
                  </span>
                ))}
              </div>

              {/* Trigger Button */}
              <div className="pt-2">
                <button
                  onClick={() => onSelectPrompt(selectedDomain.prompt)}
                  className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs md:text-sm flex items-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-xs"
                >
                  <span>Load & Run in Autonomous Command Center</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right: Mock Verified Approval Card Preview */}
            <div className="lg:col-span-5 flex flex-col gap-3 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <span className="font-bold text-zinc-500 uppercase tracking-wider text-[10px] font-sans">
                  Simulated 1-Action Card
                </span>
                <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED PROOF
                </span>
              </div>

              <div>
                <span className="text-2xl font-bold text-black dark:text-white font-sans">
                  {selectedDomain.resultPrice}
                </span>
                <h4 className="text-sm font-bold text-black dark:text-white mt-0.5 font-sans">
                  {selectedDomain.resultTitle}
                </h4>
                <p className="text-xs text-zinc-500 font-sans mt-0.5">
                  {selectedDomain.resultDetail}
                </p>
              </div>

              {/* Metrics Pills */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-zinc-200 dark:border-zinc-800 text-center font-sans">
                {selectedDomain.metrics.map((m, i) => (
                  <div key={i}>
                    <span className="text-[10px] text-zinc-400 block font-mono">{m.label}</span>
                    <span className="text-xs font-bold text-black dark:text-white">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold font-sans">
                ✓ {selectedDomain.savings} • Direct Checkout Gateway Armed
              </div>

              <div className="w-full py-2.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-semibold text-xs text-center font-sans shadow-xs">
                1-Click Approve (Hold & Execute)
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
