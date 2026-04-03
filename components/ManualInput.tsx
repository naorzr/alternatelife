"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualInput() {
  const router = useRouter();
  const [hours, setHours] = useState("");
  const [expanded, setExpanded] = useState(true);
  const inputId = "manual-hours-input";

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
          className="group touch-action font-body text-base md:text-lg readable-muted hover:text-muted transition-colors text-left break-safe"
          data-testid="manual-expand"
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
      <form
        onSubmit={handleSubmit}
        className="retro-panel flex flex-col gap-3 p-4 md:gap-4 md:p-5"
      >
        <label
          htmlFor={inputId}
          className="font-display text-[9px] md:text-[10px] text-accent tracking-[0.28em]"
        >
          MANUAL ENTRY
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              id={inputId}
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              placeholder="Total hours played"
              min="1"
              max="100000"
              aria-describedby="manual-hours-help"
              data-testid="manual-hours-input"
              className="touch-action w-full h-12 md:h-14 px-4 pr-16 bg-surface border border-border text-foreground placeholder:text-muted/70 font-body text-base md:text-xl focus:outline-none input-glow transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 font-body text-sm md:text-base readable-muted">
              HRS
            </span>
          </div>

          <button
            type="submit"
            disabled={!hours || parseInt(hours, 10) < 1}
            data-testid="manual-submit"
            className="touch-action h-12 md:h-14 px-5 md:px-6 bg-foreground/8 border border-border text-foreground font-display text-[9px] md:text-[10px] tracking-[0.22em] transition-all hover:bg-foreground/12 hover:border-foreground/15 active:scale-[0.97] disabled:opacity-25 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {">> GO"}
          </button>
        </div>

        <p id="manual-hours-help" className="font-body text-sm readable-muted">
          Enter the total hours you want to convert into an alternate build.
        </p>

        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="hidden md:block touch-action font-body text-sm readable-muted hover:text-muted transition-colors self-start"
        >
          {"<"} back to Steam
        </button>
      </form>
    </div>
  );
}
