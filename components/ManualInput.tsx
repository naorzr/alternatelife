"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualInput() {
  const router = useRouter();
  const [hours, setHours] = useState("");
  const [expanded, setExpanded] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const h = parseInt(hours, 10);
    if (!h || h < 1) return;
    router.push(`/results?hours=${h}&source=manual`);
  }

  if (!expanded) {
    return (
      <div className="animate-fade-up delay-900">
        <button
          onClick={() => setExpanded(true)}
          className="group font-body text-xl text-muted/70 hover:text-muted transition-colors text-left"
        >
          <span className="text-neon/40 group-hover:text-neon transition-colors">
            {">"}{" "}
          </span>
          I know my hours — let me type them
          <span className="text-accent/30 group-hover:text-accent ml-2 transition-colors">
            →
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 md:gap-4">
        <label className="font-display text-[9px] md:text-[10px] text-accent tracking-wider">
          MANUAL ENTRY
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Total hours played"
              min="1"
              max="100000"
              className="w-full h-11 md:h-14 px-4 bg-surface border border-border text-foreground placeholder:text-muted/50 font-body text-lg md:text-2xl focus:outline-none input-glow transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-lg text-muted/20">
              HRS
            </span>
          </div>

          <button
            type="submit"
            disabled={!hours || parseInt(hours, 10) < 1}
            className="h-11 md:h-14 px-6 bg-foreground/8 border border-border text-foreground font-display text-[9px] md:text-[10px] tracking-wider transition-all hover:bg-foreground/12 hover:border-foreground/15 active:scale-[0.97] disabled:opacity-25 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {">> GO"}
          </button>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="hidden md:block font-body text-base text-muted/50 hover:text-muted transition-colors self-start"
        >
          {"<"} back to Steam
        </button>
      </form>
    </div>
  );
}
