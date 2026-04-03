import Link from "next/link";
import GameBreakdown from "@/components/GameBreakdown";
import type { TopGame } from "@/lib/results/search";
import BgGrid from "@/components/results/BgGrid";
import BottomNav from "@/components/results/BottomNav";

interface BreakdownScreenProps {
  hours: number;
  gameCount: number;
  source: "manual" | "steam";
  topGames: TopGame[];
  onNext: () => void;
}

export default function BreakdownScreen({
  hours,
  gameCount,
  source,
  topGames,
  onNext,
}: BreakdownScreenProps) {
  return (
    <div className="relative flex h-dvh flex-col overflow-hidden" data-testid="results-breakdown">
      <BgGrid />
      <div className="viewport-scroll relative z-10" tabIndex={0} aria-label="Results breakdown">
        <div className="viewport-frame-narrow flex min-h-full flex-col justify-center gap-6 py-6 md:py-10">
          <div className="animate-fade-up">
            <span className="font-display text-[8px] text-accent tracking-[0.28em] glow-accent md:text-[9px]">
              {source === "steam" ? `${gameCount > 0 ? `${gameCount} GAMES //` : ""} STEAM PROFILE` : "MANUAL ENTRY"}
            </span>
          </div>

          <div className="animate-fade-up delay-200">
            <div className="flex flex-wrap items-end gap-3 md:gap-4">
              <span className="font-display text-[clamp(2.35rem,8vw,4.85rem)] leading-none tracking-wider text-accent glow-accent">
                {hours.toLocaleString("en-US")}
              </span>
              <span className="font-body text-[clamp(1rem,2vw,1.4rem)] font-bold uppercase text-foreground/75">
                hours gaming
              </span>
            </div>
          </div>

          <div className="animate-fade-up delay-300 grid gap-3 sm:grid-cols-3">
            <StatCard label="days" value={(hours / 24).toFixed(0)} />
            <StatCard label="weeks" value={(hours / 24 / 7).toFixed(1)} />
            {gameCount > 0 && <StatCard label="games" value={String(gameCount)} />}
          </div>

          {source === "steam" && topGames.length > 0 && (
            <div className="animate-fade-up delay-400">
              <GameBreakdown games={topGames} totalHours={hours} />
            </div>
          )}

          <p className="animate-fade-up delay-500 pretty-wrap font-body text-base readable-muted md:text-lg">
            {source === "steam"
              ? "That's a lot of hours. Let's see what you could've done instead."
              : "What could you have done with all that time?"}
          </p>
        </div>
      </div>

      <BottomNav
        left={<Link href="/" className="touch-action flex items-center gap-2 border border-white/15 bg-white/[0.06] px-4 py-2.5 font-display text-[8px] tracking-[0.24em] text-foreground/70 transition-all hover:border-white/25 hover:bg-white/[0.1] hover:text-foreground active:scale-95 md:text-[9px]"><span className="text-accent">{"<"}</span>BACK</Link>}
        right={<button onClick={onNext} data-testid="show-me-button" className="touch-action flex items-center gap-2 border border-accent/40 bg-accent/15 px-6 py-2.5 font-display text-[9px] tracking-[0.24em] text-accent transition-all hover:border-accent/60 hover:bg-accent/25 active:scale-95 md:text-[10px]">SHOW ME<span>{">"}</span></button>}
      />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="retro-panel p-4">
      <span className="font-display text-[clamp(1.1rem,2.8vw,1.75rem)] text-foreground/85">{value}</span>
      <p className="mt-1 font-body text-sm uppercase readable-muted">{label}</p>
    </div>
  );
}
