"use client";

import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Moon, Sun, ArrowUpRight, ShieldCheck, Terminal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GithubIcon } from "@/components/ui/github-icon";

interface NavbarProps {
  audioEnabled: boolean;
  onToggleAudio: () => void;
  onScrollToEngine?: () => void;
}

export function Navbar({ audioEnabled, onToggleAudio, onScrollToEngine }: NavbarProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial dark mode from document or system
    if (typeof window !== "undefined") {
      const isDarkMode = document.documentElement.classList.contains("dark");
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const scrollToCommandCenter = () => {
    if (onScrollToEngine) {
      onScrollToEngine();
    } else {
      const el = document.getElementById("command-center");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-[#fafafa]/80 dark:bg-[#09090b]/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Track Info */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
            GB
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-black dark:text-white text-base tracking-tight font-sans">
                GhostBrowser
              </span>
              <Badge variant="outline" className="hidden sm:inline-flex text-[10px] py-0 px-1.5 font-mono">
                v1.0 • wHACKiest
              </Badge>
            </div>
            <span className="text-[10px] text-zinc-500 font-sans hidden sm:block">
              Track 2: Beyond the Browser
            </span>
          </div>
        </div>

        {/* Live System Fleet Indicators */}
        <div className="hidden lg:flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300 text-[11px]">
              Steel.dev CDP Fleet: ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-medium text-zinc-700 dark:text-zinc-300 text-[11px]">
              W3C C14N Merkle Proof
            </span>
          </div>
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex items-center gap-2">
          {/* Audio Commentary Toggle */}
          <button
            onClick={onToggleAudio}
            className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-xs"
            title={audioEnabled ? "Voice Commentary Enabled" : "Voice Commentary Muted"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <VolumeX className="w-4 h-4 text-zinc-400" />}
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition shadow-xs"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* GitHub Repo */}
          <a
            href="https://github.com/DvivekD/GhostBrowse"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition shadow-xs"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Direct CTA */}
          <button
            onClick={scrollToCommandCenter}
            className="px-3.5 py-1.5 rounded-lg bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-black font-semibold text-xs tracking-tight transition flex items-center gap-1 shadow-xs"
          >
            <span>Launch Engine</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
