"use client";

import React, { useState, useEffect } from "react";
import { Activity, Radio, Cpu, ShieldCheck, Terminal } from "lucide-react";

interface BottomHudProps {
  scrollProgress: number; // 0 to 1
}

export function BottomHud({ scrollProgress }: BottomHudProps) {
  const [signalQuality, setSignalQuality] = useState(64);
  const [fps, setFps] = useState(120);

  useEffect(() => {
    // Subtle signal jitter simulation
    const interval = setInterval(() => {
      setSignalQuality(60 + Math.floor(Math.random() * 8));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkpointsPassed = Math.min(Math.floor(scrollProgress * 5) + 1, 5);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800/80 px-4 py-2 flex items-center justify-between font-mono text-[10px] md:text-[11px] text-zinc-400 select-none shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
      
      {/* Left HUD Segment: Signal & Checkpoints */}
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold">SIGNAL 002:</span>
          <span>{signalQuality}%</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-zinc-300">
          <Terminal className="w-3 h-3 text-cyan-400" />
          <span>CHECKPOINT:</span>
          <span className="text-white font-bold">0{checkpointsPassed} / 05</span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
          <span className="text-zinc-600">•</span>
          <span>CDP PROTOCOL:</span>
          <span className="text-emerald-400 font-bold">STEALTH CONNECTED</span>
        </div>
      </div>

      {/* Center Segment: Engine Label */}
      <div className="hidden lg:flex items-center gap-2 text-zinc-400 uppercase tracking-widest text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-white font-semibold">GhostBrowser</span>
        <span>•</span>
        <span className="text-emerald-400 font-bold">Zero-Click Autonomous Execution Engine</span>
      </div>

      {/* Right HUD Segment: FPS & W3C C14N Engine */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
          <Cpu className="w-3 h-3 text-cyan-400" />
          <span>{fps} FPS WebGL</span>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">W3C C14N MERKLE ARMED</span>
          <span className="sm:hidden">MERKLE OK</span>
        </div>
      </div>

    </footer>
  );
}
