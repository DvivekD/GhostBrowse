"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

interface ContainerScrollProps {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ContainerScroll({
  titleComponent,
  children,
  className,
}: ContainerScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const scaleDimensions = () => (isMobile ? [0.8, 0.95] : [1.05, 1]);

  const rotate = useTransform(scrollYProgress, [0, 0.75], [16, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.75], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 0.75], [0, -30]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "min-h-[110vh] md:min-h-[135vh] flex items-center justify-center relative p-2 md:p-10",
        className
      )}
    >
      <div
        className="py-10 md:py-20 w-full relative"
        style={{
          perspective: "1200px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
}

function Header({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        translateY: translate,
      }}
      className="max-w-5xl mx-auto text-center px-4 mb-6 md:mb-12"
    >
      {titleComponent}
    </motion.div>
  );
}

function Card({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        transformStyle: "preserve-3d",
      }}
      className="max-w-6xl mx-auto w-full border border-zinc-300 dark:border-zinc-800 p-2 md:p-3.5 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl md:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500"
    >
      {/* Chrome Browser Top Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-black/70 rounded-t-xl text-xs text-zinc-500 font-mono">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <div className="flex items-center gap-2 px-3 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>ghostbrowser://cdp.steel.dev/verified-session</span>
        </div>
        <div className="text-[10px] tracking-wider uppercase text-zinc-400">
          W3C C14N
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-b-xl bg-white dark:bg-zinc-950 p-2 md:p-6 border-t border-zinc-100 dark:border-zinc-900">
        {children}
      </div>
    </motion.div>
  );
}
