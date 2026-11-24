"use client";

import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Navbar } from "@/components/navigation/navbar";
import { GhostParallaxCanvas } from "@/components/ui/ghost-parallax-canvas";
import { HeroSection } from "@/components/sections/hero-section";
import { PipelineMilestones } from "@/components/sections/pipeline-milestones";
import { AccordionVerticals } from "@/components/sections/accordion-verticals";
import { ThreeDIsometricBrowser } from "@/components/ui/three-d-isometric-browser";
import { CommandCenter } from "@/components/sections/command-center";
import { FeaturesBentoSection } from "@/components/sections/features-bento";
import { BenchmarksSection } from "@/components/sections/benchmarks-section";
import { FooterSection } from "@/components/sections/footer-section";
import { ExecutionFlowScrubber } from "@/components/navigation/execution-flow-scrubber";
import { BottomHud } from "@/components/navigation/bottom-hud";

export default function GhostBrowserLandingPage() {
  const [query, setQuery] = useState(
    "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner"
  );
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [autoExecuteSignal, setAutoExecuteSignal] = useState(0);

  // Smooth scroll progress tracking for Three.js 3D camera controller & HUD
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(window.scrollY / totalScroll);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Motion useScroll hook for hardware-accelerated parallax and atmospheric crossfades
  const { scrollYProgress } = useScroll();

  // 1. Dynamic atmospheric lighting crossfades based on scroll depth
  const heroAtmosphereOpacity = useTransform(scrollYProgress, [0, 0.15, 0.28], [1, 0.8, 0]);
  const pipelineAtmosphereOpacity = useTransform(scrollYProgress, [0.15, 0.28, 0.45], [0, 1, 0]);
  const scopesAtmosphereOpacity = useTransform(scrollYProgress, [0.35, 0.5, 0.65], [0, 1, 0]);
  const engineAtmosphereOpacity = useTransform(scrollYProgress, [0.55, 0.72, 0.88], [0, 1, 0]);
  const benchmarkAtmosphereOpacity = useTransform(scrollYProgress, [0.75, 0.9, 1.0], [0, 0.9, 1]);

  // 2. Parallax depth transforms for section layers
  const heroParallaxY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.96]);

  const pipelineParallaxY = useTransform(scrollYProgress, [0.1, 0.35], [40, -30]);
  const pipelineScale = useTransform(scrollYProgress, [0.1, 0.25, 0.4], [0.96, 1, 0.98]);

  const verticalsParallaxY = useTransform(scrollYProgress, [0.25, 0.55], [50, -30]);
  const verticalsScale = useTransform(scrollYProgress, [0.25, 0.42, 0.6], [0.96, 1, 0.98]);

  const explodedParallaxY = useTransform(scrollYProgress, [0.38, 0.65], [60, -30]);
  const explodedScale = useTransform(scrollYProgress, [0.38, 0.52, 0.65], [0.95, 1, 0.98]);

  const commandCenterParallaxY = useTransform(scrollYProgress, [0.52, 0.8], [40, -20]);

  const benchmarksParallaxY = useTransform(scrollYProgress, [0.7, 0.98], [40, -10]);

  const scrollToCommandCenter = () => {
    const el = document.getElementById("command-center");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExecuteFromHero = (newQuery: string) => {
    setQuery(newQuery);
    setAutoExecuteSignal(Date.now());
    scrollToCommandCenter();
  };

  const handleSelectFromVerticals = (newQuery: string) => {
    setQuery(newQuery);
    setAutoExecuteSignal(Date.now());
    scrollToCommandCenter();
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] text-[#fafafa] flex flex-col justify-between selection:bg-emerald-400 selection:text-black overflow-x-hidden">
      
      {/* 1. GhostBrowser 3D Three.js Parallax Canvas with Dynamic Camera Controller */}
      <GhostParallaxCanvas scrollProgress={scrollProgress} />

      {/* 2. Dynamic Scroll-Driven Atmospheric Backdrop (Crossfading Radial Glow Gradients) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Layer 1: Hero Emerald/Zinc Aurora */}
        <motion.div
          style={{ opacity: heroAtmosphereOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(16,185,129,0.18),transparent_65%)]"
        />
        {/* Layer 2: Pipeline Milestones Cyan CDP WebSocket Pulse */}
        <motion.div
          style={{ opacity: pipelineAtmosphereOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(6,182,212,0.20),transparent_60%)]"
        />
        {/* Layer 3: Scopes & 3D Core Teal/Emerald Vortex */}
        <motion.div
          style={{ opacity: scopesAtmosphereOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_35%_50%,rgba(20,184,166,0.18),transparent_60%)]"
        />
        {/* Layer 4: Autonomous Engine Onyx/Emerald Vault Spotlight */}
        <motion.div
          style={{ opacity: engineAtmosphereOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_65%,rgba(16,185,129,0.22),transparent_65%)]"
        />
        {/* Layer 5: Benchmarks Slate/Cyan Horizon */}
        <motion.div
          style={{ opacity: benchmarkAtmosphereOpacity }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_85%,rgba(6,182,212,0.16),transparent_60%)]"
        />
      </div>

      {/* 3. Cyber Grid Subtle Backdrop Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-20 cyber-grid z-0" />

      {/* 4. Sticky Navigation Bar */}
      <Navbar
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        onScrollToEngine={scrollToCommandCenter}
      />

      {/* 5. Right-side Execution Flow Scrubber Track */}
      <ExecutionFlowScrubber scrollProgress={scrollProgress} />

      {/* 6. Main Hero & Sequential Architectural Flow with Parallax Layers */}
      <main className="flex-1 flex flex-col relative z-10 pb-16">
        
        {/* PHASE 01: Hero Section & 4-Tile Live Metric HUD */}
        <motion.div
          id="hero-section"
          style={{ y: heroParallaxY, scale: heroScale }}
          className="relative z-10"
        >
          <HeroSection
            query={query}
            setQuery={setQuery}
            onExecuteQuery={handleExecuteFromHero}
            onMicToggle={() => setIsRecording(!isRecording)}
            isRecording={isRecording}
          />
        </motion.div>

        {/* PHASE 02: Horizontal 5-Step Architecture Milestones */}
        <motion.div
          id="pipeline-milestones"
          style={{ y: pipelineParallaxY, scale: pipelineScale }}
          className="relative z-10"
        >
          <PipelineMilestones />
        </motion.div>

        {/* PHASE 03: Interactive Accordion Vertical Scope Selector */}
        <motion.div
          id="verticals-scope"
          style={{ y: verticalsParallaxY, scale: verticalsScale }}
          className="relative z-10"
        >
          <AccordionVerticals onSelectPrompt={handleSelectFromVerticals} />
        </motion.div>

        {/* Live Headless Browser Exploded Canvas */}
        <motion.section
          id="exploded-browser"
          style={{ y: explodedParallaxY, scale: explodedScale }}
          className="w-full max-w-5xl mx-auto px-4 my-8 relative z-20"
        >
          <div className="text-center mb-6">
            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">
              Exploded Headless Viewport
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white font-sans mt-0.5">
              Multi-Layer Headless Architecture
            </h3>
          </div>
          <ThreeDIsometricBrowser />
        </motion.section>

        {/* PHASE 04: Autonomous AI Command Center (Steel.dev CDP & W3C C14N Merkle Proofs) */}
        <motion.section
          id="command-center"
          style={{ y: commandCenterParallaxY }}
          className="w-full max-w-6xl mx-auto px-4 py-16 border-t border-zinc-800 relative z-20"
        >
          <CommandCenter
            initialQuery={query}
            autoExecuteSignal={autoExecuteSignal}
            audioEnabled={audioEnabled}
          />
        </motion.section>

        {/* 4 Core Innovations: 12-Column Bento Grid */}
        <div className="relative z-10">
          <FeaturesBentoSection />
        </div>

        {/* Performance Benchmarks vs Legacy Browsing */}
        <motion.div
          id="benchmarks-section"
          style={{ y: benchmarksParallaxY }}
          className="relative z-10"
        >
          <BenchmarksSection />
        </motion.div>

      </main>

      {/* 7. Bottom Technical HUD Status Ticker */}
      <BottomHud scrollProgress={scrollProgress} />

      {/* 8. Minimalist Obsidian Footer */}
      <FooterSection />

    </div>
  );
}
