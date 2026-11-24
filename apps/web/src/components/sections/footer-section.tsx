"use client";

import React from "react";
import { ArrowUpRight, ShieldCheck, Heart } from "lucide-react";
import { GithubIcon } from "@/components/ui/github-icon";

export function FooterSection() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 py-12 px-4 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-sans">
        {/* Left: Branding & Tagline */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <div className="w-7 h-7 rounded-lg bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-xs">
            GB
          </div>
          <div>
            <div className="font-bold text-black dark:text-white text-sm">
              GhostBrowser
            </div>
            <div className="text-[11px] text-zinc-400">
              Autonomous Zero-Click Web Execution Engine • wHACKiest 2026 (Track 2)
            </div>
          </div>
        </div>

        {/* Center: Tech Stack Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-mono">
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            Steel.dev CDP
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            W3C C14N
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            Next.js 16
          </span>
          <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            FastAPI
          </span>
        </div>

        {/* Right: GitHub & Live Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/DvivekD/GhostBrowse"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </a>
          <a
            href="https://ghostbrowse-blush.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-black dark:hover:text-white transition"
          >
            <span>Live Vercel</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
