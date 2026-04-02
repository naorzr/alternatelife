"use client";

import { useRef } from "react";
import type { AchievementMilestone } from "@/lib/achievements-data";
import { formatNumber } from "@/lib/formatting";

interface StatLevel {
  label: string;
  color: string;
  level: number;
  max: number;
}

interface ShareCardProps {
  hours: number;
  skillCount: number;
  hoursRemaining: number;
  statLevels: StatLevel[];
  topSkills: AchievementMilestone[];
}

export default function ShareCard({
  hours,
  skillCount,
  hoursRemaining,
  statLevels,
  topSkills,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  async function downloadCard() {
    if (!cardRef.current) return;
    const html2canvas = (await import("html2canvas-pro")).default;
    const canvas = await html2canvas(cardRef.current, {
      backgroundColor: "#0a0a12",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = "my-alternate-life.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        ref={cardRef}
        className="w-full max-w-[600px] aspect-[1200/630] relative overflow-hidden"
        style={{
          background:
            "linear-gradient(145deg, #0e0e1a 0%, #0a0a12 50%, #0c0c18 100%)",
        }}
      >
        {/* Scanline effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            background:
              "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
          }}
        />

        {/* Border glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: "1px solid rgba(255, 204, 0, 0.12)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex gap-5 p-6 md:p-7">
          {/* Left column */}
          <div className="flex flex-col flex-1 justify-between min-w-0">
            {/* Header */}
            <div>
              <div
                className="text-[#ffcc00] text-[8px] font-bold tracking-[0.3em] uppercase mb-3"
                style={{
                  fontFamily:
                    "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                  textShadow: "0 0 10px rgba(255,204,0,0.3)",
                }}
              >
                {">>>"} ALTERNATE LIFE {"<<<"}
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-[#ffcc00] text-2xl tracking-wider leading-none"
                  style={{
                    fontFamily:
                      "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                    textShadow: "0 0 12px rgba(255,204,0,0.3)",
                  }}
                >
                  {formatNumber(hours)}H
                </span>
                <span
                  className="text-[#e0e0ec]/20 text-base"
                  style={{
                    fontFamily:
                      "var(--font-terminal), VT323, 'Courier New', monospace",
                  }}
                >
                  GAMING → LIFE
                </span>
              </div>
            </div>

            {/* Stat block bars */}
            <div className="space-y-[5px] my-2">
              {statLevels.map((stat) => {
                const blocks = 8;
                const filled =
                  stat.max > 0
                    ? Math.round((stat.level / stat.max) * blocks)
                    : 0;
                return (
                  <div key={stat.label} className="flex items-center gap-1.5">
                    <span
                      className="text-[8px] w-[52px] text-right shrink-0 truncate tracking-wider"
                      style={{
                        fontFamily:
                          "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                        color: stat.color,
                        textShadow: `0 0 6px ${stat.color}30`,
                      }}
                    >
                      {stat.label.substring(0, 3).toUpperCase()}
                    </span>
                    <div className="flex gap-[2px] flex-1">
                      {Array.from({ length: blocks }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[7px] flex-1"
                          style={{
                            background:
                              i < filled
                                ? stat.color
                                : "rgba(255,255,255,0.04)",
                            boxShadow:
                              i < filled
                                ? `0 0 4px ${stat.color}20`
                                : "none",
                          }}
                        />
                      ))}
                    </div>
                    <span
                      className="text-[9px] w-3 text-center tabular-nums"
                      style={{
                        fontFamily:
                          "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                        color:
                          stat.level > 0
                            ? "#e0e0ec"
                            : "rgba(90, 90, 122, 0.3)",
                      }}
                    >
                      {stat.level}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom stats */}
            <div className="flex items-center gap-3">
              <div>
                <span
                  className="text-[#00ff88] text-lg block leading-none"
                  style={{
                    fontFamily:
                      "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                    textShadow: "0 0 8px rgba(0,255,136,0.3)",
                  }}
                >
                  {skillCount}
                </span>
                <span
                  className="text-[#5a5a7a] text-[7px] uppercase tracking-wider"
                  style={{
                    fontFamily:
                      "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                  }}
                >
                  SKILLS
                </span>
              </div>
              <div className="w-px h-5 bg-[#ffcc00]/10" />
              <div>
                <span
                  className="text-[#ffcc00] text-lg block leading-none"
                  style={{
                    fontFamily:
                      "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                    textShadow: "0 0 8px rgba(255,204,0,0.3)",
                  }}
                >
                  {formatNumber(hoursRemaining)}H
                </span>
                <span
                  className="text-[#5a5a7a] text-[7px] uppercase tracking-wider"
                  style={{
                    fontFamily:
                      "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                  }}
                >
                  LEFT
                </span>
              </div>
            </div>
          </div>

          {/* Right column: top skills */}
          <div className="w-[44%] shrink-0 flex flex-col justify-center">
            <span
              className="text-[#5a5a7a]/50 text-[7px] uppercase tracking-[0.2em] mb-2 block"
              style={{
                fontFamily:
                  "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
              }}
            >
              UNLOCKED
            </span>
            <div className="space-y-[4px]">
              {topSkills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-1.5">
                  <span className="text-[10px] leading-none shrink-0">
                    {skill.icon}
                  </span>
                  <span
                    className="text-[#e0e0ec]/60 text-[13px] flex-1 min-w-0 truncate leading-tight"
                    style={{
                      fontFamily:
                        "var(--font-terminal), VT323, 'Courier New', monospace",
                    }}
                  >
                    {skill.title}
                  </span>
                  <span
                    className="text-[#ffcc00]/50 text-[7px] tabular-nums shrink-0 tracking-wider"
                    style={{
                      fontFamily:
                        "var(--font-pixel), 'Press Start 2P', 'Courier New', monospace",
                    }}
                  >
                    {skill.hoursRequired}H
                  </span>
                </div>
              ))}
              {skillCount > topSkills.length && (
                <span
                  className="text-[#5a5a7a]/30 text-[11px] block"
                  style={{
                    fontFamily:
                      "var(--font-terminal), VT323, 'Courier New', monospace",
                  }}
                >
                  +{skillCount - topSkills.length} MORE
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={downloadCard}
        className="px-6 py-3 bg-white/[0.04] border border-border font-display text-[8px] md:text-[9px] text-foreground/60 tracking-wider hover:bg-white/[0.07] transition-colors active:scale-95 flex items-center gap-2"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          className="opacity-40"
        >
          <path
            d="M8 1v10M4 7l4 4 4-4M2 13h12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        DOWNLOAD
      </button>
    </div>
  );
}
