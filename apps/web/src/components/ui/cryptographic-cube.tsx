"use client";

import React, { useState, useRef } from "react";
import { ShieldCheck, Lock, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

interface CryptographicCubeProps {
  className?: string;
  size?: number;
}

export function CryptographicCube({ className, size = 160 }: CryptographicCubeProps) {
  const [rotation, setRotation] = useState({ x: -18, y: 32 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const halfSize = size / 2;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width - 0.5) * 2;
    const y = ((e.clientY - top) / height - 0.5) * 2;

    setRotation({
      x: -y * 40 - 15,
      y: x * 50 + 25,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotation({ x: -18, y: 32 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex items-center justify-center cursor-grab active:cursor-grabbing",
        className
      )}
      style={{
        perspective: "1000px",
        width: `${size + 40}px`,
        height: `${size + 40}px`,
      }}
    >
      {/* Background Glow */}
      <div className="absolute w-32 h-32 bg-emerald-500/10 dark:bg-emerald-400/20 rounded-full blur-2xl pointer-events-none" />

      {/* Rotating 3D Scene */}
      <div
        className="relative transition-transform duration-200 ease-out"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        }}
      >
        {/* Face 1: FRONT - Merkle Root */}
        <div
          className="absolute inset-0 rounded-xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border border-emerald-500/40 shadow-lg p-3 flex flex-col justify-between text-black dark:text-white"
          style={{
            transform: `translateZ(${halfSize}px)`,
          }}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <ShieldCheck className="w-3 h-3" /> ROOT
            </span>
            <span>SHA-256</span>
          </div>
          <div className="text-center font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400 break-all leading-tight">
            9c3e41...4e3f
          </div>
          <div className="text-[8px] font-mono text-zinc-500 text-center uppercase tracking-wider">
            Canonical Root
          </div>
        </div>

        {/* Face 2: BACK - Composite Proof Token */}
        <div
          className="absolute inset-0 rounded-xl bg-zinc-950/90 text-white backdrop-blur-md border border-zinc-700 shadow-lg p-3 flex flex-col justify-between"
          style={{
            transform: `rotateY(180deg) translateZ(${halfSize}px)`,
          }}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
            <span className="text-blue-400 font-bold">TOKEN</span>
            <span>W3C C14N</span>
          </div>
          <div className="text-center font-mono font-bold text-[10px] text-zinc-200 break-all leading-tight">
            PROOF-6E-243-BLR
          </div>
          <div className="text-[8px] font-mono text-emerald-400 text-center uppercase">
            VERIFIED PREIMAGE
          </div>
        </div>

        {/* Face 3: RIGHT - Leaf 0 Price Claim */}
        <div
          className="absolute inset-0 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-300 dark:border-zinc-700 shadow-lg p-3 flex flex-col justify-between text-black dark:text-white"
          style={{
            transform: `rotateY(90deg) translateZ(${halfSize}px)`,
          }}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
            <span className="font-bold">LEAF 0</span>
            <span className="text-emerald-500">₹2,850</span>
          </div>
          <div className="text-center font-mono font-bold text-xs text-black dark:text-white">
            PRICE_INR: 2850
          </div>
          <div className="text-[8px] font-mono text-zinc-400 text-center uppercase">
            sha256(leaf_0)
          </div>
        </div>

        {/* Face 4: LEFT - Leaf 1 Flight Identity */}
        <div
          className="absolute inset-0 rounded-xl bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-md border border-zinc-300 dark:border-zinc-700 shadow-lg p-3 flex flex-col justify-between text-black dark:text-white"
          style={{
            transform: `rotateY(-90deg) translateZ(${halfSize}px)`,
          }}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
            <span className="font-bold">LEAF 1</span>
            <span>AIRLINE</span>
          </div>
          <div className="text-center font-sans font-bold text-xs text-black dark:text-white">
            IndiGo 6E-243
          </div>
          <div className="text-[8px] font-mono text-zinc-400 text-center uppercase">
            Flight Identifier
          </div>
        </div>

        {/* Face 5: TOP - Leaf 2 Route Itinerary */}
        <div
          className="absolute inset-0 rounded-xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-300 dark:border-zinc-700 shadow-lg p-3 flex flex-col justify-between text-black dark:text-white"
          style={{
            transform: `rotateX(90deg) translateZ(${halfSize}px)`,
          }}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
            <span className="font-bold">LEAF 2</span>
            <span>ROUTE</span>
          </div>
          <div className="text-center font-mono font-bold text-[11px] text-black dark:text-white">
            BLR → COK (06:15)
          </div>
          <div className="text-[8px] font-mono text-zinc-400 text-center uppercase">
            Itinerary Schedule
          </div>
        </div>

        {/* Face 6: BOTTOM - Leaf 3 Canonical DOM */}
        <div
          className="absolute inset-0 rounded-xl bg-zinc-900/95 text-white backdrop-blur-md border border-zinc-800 shadow-lg p-3 flex flex-col justify-between"
          style={{
            transform: `rotateX(-90deg) translateZ(${halfSize}px)`,
          }}
        >
          <div className="flex items-center justify-between text-[9px] font-mono text-zinc-400">
            <span className="font-bold">LEAF 3</span>
            <span className="text-emerald-400">105.5 KB</span>
          </div>
          <div className="text-center font-mono text-[10px] text-zinc-300 truncate">
            &lt;div class=&quot;flight&quot;&gt;
          </div>
          <div className="text-[8px] font-mono text-zinc-500 text-center uppercase">
            Normalized C14N
          </div>
        </div>
      </div>
    </div>
  );
}
