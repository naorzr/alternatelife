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
    <section className="relative py-4 md:py-8 lg:py-10">
      {/* Ambient glow */}
      <div className="hero-glow animate-glow-pulse" />

      <div className="relative z-10 max-w-3xl">
        {/* Title */}
        <div className="animate-fade-up mb-3 md:mb-6">
          <h1 className="font-display text-[8px] md:text-[clamp(0.8rem,2vw,1.1rem)] text-accent tracking-[0.24em] glow-accent">
            {">>>"} ALTERNATE LIFE {"<<<"}
          </h1>
        </div>

        {/* Main headline */}
        <div className="animate-fade-up delay-200 mb-3 md:mb-6">
          <p className="balanced-wrap font-body text-[clamp(1.55rem,5.2vw,3.85rem)] text-foreground font-bold leading-[1.08] uppercase">
            What if you spent those hours on{" "}
            <span className="text-accent glow-accent">something real</span>?
          </p>
        </div>

        {/* Rotating text */}
        <div className="animate-fade-up delay-400 mb-4 md:mb-6">
          <p className="pretty-wrap font-body text-[clamp(1rem,2.25vw,1.65rem)] text-foreground/85 leading-relaxed">
            <span className="text-neon glow-neon">{">"}</span>{" "}
            You could be{" "}
            <span
              className={`inline text-neon transition-all duration-250 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              {ALTERNATE_LIVES[index]}
            </span>
            <span className="text-neon animate-blink">_</span>
          </p>
        </div>

        {/* Stats teaser */}
        <div className="animate-fade-up delay-600 flex flex-wrap gap-x-4 gap-y-2 font-body text-sm md:text-lg text-foreground/65">
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
