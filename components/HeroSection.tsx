"use client";

import { useEffect, useState } from "react";

const ALTERNATE_LIVES = [
  "fluent in Japanese",
  "absolutely jacked",
  "a licensed pilot",
  "a published author",
  "a guitar player",
  "a marathon runner",
  "a confident speaker",
  "a great cook",
  "a chess master",
  "a rock climber",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % ALTERNATE_LIVES.length);
        setVisible(true);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="pt-6 pb-4 md:pt-20 md:pb-12 relative">
      {/* Ambient glow */}
      <div className="hero-glow animate-glow-pulse" />

      <div className="relative z-10 max-w-3xl">
        {/* Title */}
        <div className="animate-fade-up mb-3 md:mb-10">
          <h1 className="font-display text-[8px] md:text-[clamp(0.8rem,2.5vw,1.3rem)] text-accent tracking-wider glow-accent">
            {">>>"} ALTERNATE LIFE {"<<<"}
          </h1>
        </div>

        {/* Main headline */}
        <div className="animate-fade-up delay-200 mb-3 md:mb-8">
          <p className="font-body text-[clamp(1.4rem,5vw,3.5rem)] text-foreground font-bold leading-[1.15] uppercase">
            What if you spent those hours on{" "}
            <span className="text-accent glow-accent">something real</span>?
          </p>
        </div>

        {/* Rotating text */}
        <div className="animate-fade-up delay-400 mb-3 md:mb-10">
          <p className="font-body text-[clamp(1rem,2.5vw,1.8rem)] text-foreground/80">
            <span className="text-neon glow-neon">{">"}</span>{" "}
            You could be{" "}
            <span
              className={`inline-block text-neon transition-all duration-250 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              {ALTERNATE_LIVES[index]}
            </span>
            <span className="text-neon animate-blink">_</span>
          </p>
        </div>

        {/* Stats teaser */}
        <div className="animate-fade-up delay-600 flex gap-4 md:gap-10 font-body text-sm md:text-[clamp(1.1rem,1.8vw,1.3rem)] text-foreground/50">
          <span>70+ skills</span>
          <span className="text-accent/30">·</span>
          <span>7 life stats</span>
          <span className="text-accent/30">·</span>
          <span>∞ timelines</span>
        </div>
      </div>
    </section>
  );
}
