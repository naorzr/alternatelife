"use client";

import { formatNumber } from "@/lib/formatting";

interface GameInfo {
  name: string;
  hours: number;
  appid: number;
  iconUrl?: string;
}

interface GameBreakdownProps {
  games: GameInfo[];
  totalHours: number;
}

export default function GameBreakdown({
  games,
  totalHours,
}: GameBreakdownProps) {
  if (!games.length) return null;

  const maxHours = games[0]?.hours ?? 1;

  return (
    <div className="animate-fade-up delay-300">
      <div className="flex items-center gap-3 mb-5">
        <span className="font-display text-[8px] md:text-[9px] text-accent tracking-[0.24em] glow-accent">
          TOP GAMES
        </span>
        <div className="flex-1 retro-divider" />
      </div>

      <div className="retro-panel p-4 md:p-5">
        <div className="flex flex-col gap-3">
          {games.map((game, i) => {
            const blocks = 15;
            const filled = Math.round((game.hours / maxHours) * blocks);
            const pctOfTotal = ((game.hours / totalHours) * 100).toFixed(1);

            return (
              <div
                key={game.appid}
                data-testid="game-breakdown-row"
                style={{
                  animation: `fade-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${250 + i * 70}ms forwards`,
                  opacity: 0,
                }}
              >
                <div className="mb-1 grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-2">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="mt-0.5 font-display text-[8px] text-muted/50 tabular-nums w-4 text-right">
                      {i + 1}
                    </span>
                    <span
                      className="break-safe font-body text-base md:text-lg text-foreground leading-snug"
                      data-testid="game-title"
                    >
                      {game.name}
                    </span>
                  </div>
                  <div />
                  <div className="flex items-baseline gap-2 shrink-0 ml-2">
                    <span className="font-display text-[10px] md:text-[11px] text-foreground tabular-nums tracking-[0.18em]">
                      {formatNumber(game.hours)}H
                    </span>
                    <span className="font-body text-sm readable-muted">
                      {pctOfTotal}%
                    </span>
                  </div>
                </div>

                <div className="flex gap-[2px] ml-6">
                  {Array.from({ length: blocks }).map((_, j) => (
                    <div
                      key={j}
                      className="h-2 flex-1"
                      style={{
                        background:
                          j < filled
                            ? i === 0
                              ? "#ffcc00"
                              : `rgba(255, 204, 0, ${Math.max(0.2, 0.6 - i * 0.08)})`
                            : "rgba(255, 255, 255, 0.03)",
                        boxShadow:
                          j < filled && i === 0
                            ? "0 0 6px rgba(255,204,0,0.15)"
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-accent/8 flex items-baseline justify-between">
          <span className="font-display text-[8px] text-muted/40 tracking-[0.22em]">
            TOTAL
          </span>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[13px] md:text-[15px] text-accent tabular-nums tracking-[0.18em] glow-accent">
              {formatNumber(totalHours)}H
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
