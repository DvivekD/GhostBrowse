"use client";

import React from "react";
import { Check, X, ShieldCheck, Zap, Clock, MousePointerClick } from "lucide-react";

export function BenchmarksSection() {
  const comparisonRows = [
    {
      feature: "Task Completion Time",
      manual: "8.5 minutes (450s)",
      chatbot: "45 seconds",
      ghost: "2.4 seconds (99.5% faster)",
      ghostHighlight: true,
    },
    {
      feature: "Manual Form Fields Required",
      manual: "47 tedious form inputs",
      chatbot: "Manual typing on target site",
      ghost: "0 manual fields (Zero-Click)",
      ghostHighlight: true,
    },
    {
      feature: "Cryptographic Ground-Truth Proof",
      manual: "None (human visual scan)",
      chatbot: "Frequent hallucinations",
      ghost: "100% W3C C14N Merkle SHA-256",
      ghostHighlight: true,
    },
    {
      feature: "Payment Gateway Handoff",
      manual: "Manual checkout flow",
      chatbot: "No booking capability",
      ghost: "1-Action Pre-Armed Gateway",
      ghostHighlight: true,
    },
    {
      feature: "Anti-Bot & CAPTCHA Bypass",
      manual: "Manual puzzle solving",
      chatbot: "Blocked by Cloudflare/DataDome",
      ghost: "Steel.dev Stealth Chromium CDP",
      ghostHighlight: true,
    },
    {
      feature: "Voice Input & Audio Synthesis",
      manual: "No voice capabilities",
      chatbot: "Generic text response",
      ghost: "Deepgram Nova-3 + Cartesia Sonic",
      ghostHighlight: true,
    },
  ];

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24 border-t border-zinc-200 dark:border-zinc-800">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-[11px] font-mono uppercase text-zinc-600 dark:text-zinc-400 mb-3 border border-zinc-200 dark:border-zinc-700">
          <Clock className="w-3.5 h-3.5 text-blue-500" />
          <span>Real-World Benchmark</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-black dark:text-white font-sans">
          GhostBrowser vs Legacy Web
        </h2>
        <p className="text-sm md:text-base text-zinc-500 max-w-xl mt-3 font-sans">
          Why zero-click autonomous execution with verified cryptographic proof renders traditional web browsing obsolete.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-x-auto rounded-2xl border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
        <table className="w-full text-left border-collapse text-xs md:text-sm font-sans">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-950/70">
              <th className="py-4 px-5 font-bold text-zinc-600 dark:text-zinc-300 uppercase tracking-wider text-[11px]">
                Execution Metric
              </th>
              <th className="py-4 px-5 font-medium text-zinc-500 text-[11px] uppercase tracking-wider">
                Traditional Browsing
              </th>
              <th className="py-4 px-5 font-medium text-zinc-500 text-[11px] uppercase tracking-wider">
                Generic AI Chatbots
              </th>
              <th className="py-4 px-5 font-bold text-black dark:text-white text-[11px] uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800/60">
                GhostBrowser Engine
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {comparisonRows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
              >
                <td className="py-4 px-5 font-bold text-black dark:text-white">
                  {row.feature}
                </td>
                <td className="py-4 px-5 text-zinc-500">
                  {row.manual}
                </td>
                <td className="py-4 px-5 text-zinc-500">
                  {row.chatbot}
                </td>
                <td className="py-4 px-5 font-bold text-black dark:text-white bg-zinc-50/60 dark:bg-zinc-800/40">
                  <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                    <Check className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    <span>{row.ghost}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
