"use client";

import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Cpu, ShieldCheck, Globe, CheckCircle2, Zap, Lock, Terminal, Activity } from "lucide-react";
import { CryptographicCube } from "@/components/ui/cryptographic-cube";
import { BorderBeam } from "@/components/ui/border-beam";
import { ParticleMesh } from "@/components/ui/particle-mesh";

export function FeaturesBentoSection() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-16 md:py-24 border-t border-zinc-800">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[11px] font-mono uppercase text-zinc-400 mb-3">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
          <span>Core Architectural Innovations</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white font-sans">
          Reimagining the Browser Stack
        </h2>
        <p className="text-sm md:text-base text-zinc-400 max-w-xl mt-3 font-sans">
          Four foundational breakthroughs replacing manual human clicks with verified cryptographic autonomous execution.
        </p>
      </div>

      <BentoGrid>
        {/* Tile 1: 4-Tier Reasoning Cascade */}
        <BentoGridItem
          colSpan={8}
          title="4-Tier AI Reasoning Cascade"
          subtitle="Sub-50ms intent extraction without vendor lock-in or single points of failure"
          badge="450 TOKENS/SEC"
          icon={<Cpu className="w-5 h-5 text-emerald-400" />}
          description="GhostBrowser automatically cascades natural language queries across high-octane hardware. Tier 1 harnesses SambaNova SN40L RDUs for sub-second planning, cascading gracefully to Gemini 3.8 Flash, Groq LPU, and deterministic heuristics."
          header={
            <div className="w-full p-4 rounded-xl bg-[#07090e] border border-zinc-800 flex flex-col gap-2 font-mono text-xs">
              <div className="flex items-center justify-between text-zinc-500 text-[11px] pb-1 border-b border-zinc-800">
                <span>CASCADE TIER</span>
                <span>INFERENCE ENGINE</span>
                <span>LATENCY / STATUS</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-200 font-bold">Tier 1</span>
                <span className="text-zinc-400">SambaNova SN40L (DeepSeek-R1 / Llama 3.3)</span>
                <span className="text-emerald-400 font-semibold">~38ms TTFT</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-200 font-bold">Tier 2</span>
                <span className="text-zinc-400">Gemini 3.8 Flash Multimodal</span>
                <span className="text-cyan-400 font-semibold">Multimodal Fallback</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-zinc-200 font-bold">Tier 3</span>
                <span className="text-zinc-400">Groq LPU (GPT-OSS 120B / Llama 3.1)</span>
                <span className="text-cyan-400 font-semibold">Ultra-Fast LPU</span>
              </div>
            </div>
          }
        />

        {/* Tile 2: Cryptographic Merkle Engine with Interactive 3D Cube & Border Beam */}
        <BentoGridItem
          colSpan={4}
          title="Cryptographic Proof Engine"
          subtitle="Interactive 3D W3C C14N Merkle Cube"
          badge="3D SHA-256 TREE"
          icon={<ShieldCheck className="w-5 h-5 text-emerald-400" />}
          description="GhostBrowser scrubs volatile scripts, whitespace, and session trackers with a deterministic W3C C14N parser, constructing a 4-Leaf Merkle Tree verified client-side. Move your mouse to rotate the 3D proof cube."
          header={
            <div className="w-full py-2 flex flex-col items-center justify-center relative overflow-hidden rounded-xl bg-[#07090e] border border-zinc-800">
              <CryptographicCube size={120} />
              <span className="text-[10px] font-mono text-zinc-400 tracking-wider uppercase mt-1">
                Move cursor to inspect 3D Merkle faces
              </span>
            </div>
          }
        >
          <BorderBeam size={180} duration={6} colorFrom="#10b981" colorTo="#06b6d4" />
        </BentoGridItem>

        {/* Tile 3: Anti-Bot Stealth Fleet with Particle Mesh Background */}
        <BentoGridItem
          colSpan={4}
          title="Steel.dev Cloud CDP Fleet"
          subtitle="Anti-Fingerprint Browser Fleet"
          badge="STEALTH CDP"
          icon={<Globe className="w-5 h-5 text-cyan-400" />}
          description="High-concurrency headless Chromium contexts connected via Chrome DevTools Protocol WebSocket. Bypasses Cloudflare, DataDome, and CAPTCHAs with human cursor emulation."
          header={
            <div className="w-full p-3.5 rounded-xl bg-[#07090e] border border-zinc-800 flex flex-col gap-1.5 font-mono text-[11px] relative overflow-hidden">
              <ParticleMesh particleCount={18} className="pointer-events-none absolute inset-0 z-0 opacity-40" />
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-zinc-500">CDP WebSocket:</span>
                <span className="text-emerald-400 font-bold">CONNECTED</span>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-zinc-500">Worker Concurrency:</span>
                <span className="text-white font-bold">3 Contexts</span>
              </div>
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-zinc-500">Fingerprint Spoof:</span>
                <span className="text-white font-bold">macOS Chromium 133</span>
              </div>
            </div>
          }
        />

        {/* Tile 4: 1-Action Approval Safety */}
        <BentoGridItem
          colSpan={8}
          title="1-Action Approval Safety Boundary"
          subtitle="Zero-click autofill with mandatory human financial oversight"
          badge="FINANCIAL SAFETY"
          icon={<Lock className="w-5 h-5 text-emerald-400" />}
          description="Autonomous AI must never possess unsupervised credit card charging authority. GhostBrowser executes the 47 complex steps of filtering, seating, and baggage checks, but halts at the payment gateway with a 1-click armed handoff."
          header={
            <div className="w-full p-4 rounded-xl bg-[#07090e] border border-zinc-800 flex items-center justify-between gap-4 font-sans text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-white">Form Automation Complete</div>
                  <div className="text-zinc-400 text-[11px]">47 fields populated • Zero clicks taken by user</div>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs tracking-tight shadow-sm">
                Armed for 1-Click Approval
              </div>
            </div>
          }
        />
      </BentoGrid>
    </section>
  );
}
