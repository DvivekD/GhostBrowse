"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { RetroGrid } from "@/components/ui/retro-grid";
import { ContainerScroll } from "@/components/ui/container-scroll";
import { HeroSection } from "@/components/sections/hero-section";
import { CommandCenter } from "@/components/sections/command-center";
import { FeaturesBentoSection } from "@/components/sections/features-bento";
import { VerticalsSection } from "@/components/sections/verticals-section";
import { BenchmarksSection } from "@/components/sections/benchmarks-section";
import { FooterSection } from "@/components/sections/footer-section";

export default function GhostBrowserLandingPage() {
  const [query, setQuery] = useState(
    "Find a flight from Bangalore to Kochi tomorrow under ₹3,500 with dinner"
  );
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const scrollToCommandCenter = () => {
    const el = document.getElementById("command-center");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExecuteFromHero = (newQuery: string) => {
    setQuery(newQuery);
    scrollToCommandCenter();
  };

  const handleSelectFromVerticals = (newQuery: string) => {
    setQuery(newQuery);
    scrollToCommandCenter();
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#09090b] dark:text-[#fafafa] flex flex-col justify-between selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Monochromatic Animated Retro Grid Background */}
      <RetroGrid />

      {/* Sticky Swiss Glass Navbar */}
      <Navbar
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        onScrollToEngine={scrollToCommandCenter}
      />

      {/* Hero Section with 3D Perspective Container Scroll */}
      <main className="flex-1 flex flex-col relative z-10">
        <ContainerScroll
          titleComponent={
            <HeroSection
              query={query}
              setQuery={setQuery}
              onExecuteQuery={handleExecuteFromHero}
              onMicToggle={() => setIsRecording(!isRecording)}
              isRecording={isRecording}
            />
          }
        >
          <CommandCenter
            initialQuery={query}
            audioEnabled={audioEnabled}
          />
        </ContainerScroll>

        {/* 4 Core Innovations: 12-Column Bento Grid */}
        <FeaturesBentoSection />

        {/* Multi-Vertical Live Demonstrator */}
        <VerticalsSection onSelectPrompt={handleSelectFromVerticals} />

        {/* Performance & Latency Benchmarks */}
        <BenchmarksSection />
      </main>

      {/* Minimalist Swiss Footer */}
      <FooterSection />
    </div>
  );
}
