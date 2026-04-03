"use client";

import type { AchievementCategory } from "@/lib/achievements-data";

interface StatDef {
  key: string;
  label: string;
  desc: string;
  category: AchievementCategory;
  color: string;
}

interface SkillTreeBarProps {
  stats: StatDef[];
  selectedKey: string;
  catCounts: Record<string, number>;
  catMaxes: Record<string, number>;
  onSelect: (key: string) => void;
}

export default function SkillTreeBar({
  stats,
  selectedKey,
  catCounts,
  catMaxes,
  onSelect,
}: SkillTreeBarProps) {
  return (
    <div
      className="sticky bottom-0 z-40 border-t"
      style={{
        background: "rgba(19, 18, 29, 0.97)",
        backdropFilter: "blur(16px)",
        borderColor: "rgba(255, 204, 0, 0.08)",
      }}
    >
      <div className="max-w-3xl mx-auto px-2 md:px-4">
        <div className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory">
          {stats.map((stat) => {
            const isSelected = stat.key === selectedKey;
            const level = catCounts[stat.category] || 0;
            const max = catMaxes[stat.category] || 1;
            const pct = Math.round((level / max) * 100);

            return (
              <button
                key={stat.key}
                onClick={() => onSelect(stat.key)}
                className={`relative flex-1 min-w-[72px] snap-center flex flex-col items-center py-3 md:py-4 transition-all duration-200 ${
                  isSelected ? "scale-105" : "hover:bg-white/[0.02]"
                }`}
              >
                {/* Selection indicator — top glow bar */}
                {isSelected && (
                  <div
                    className="absolute top-0 inset-x-2 h-[3px]"
                    style={{
                      background: stat.color,
                      boxShadow: `0 0 12px ${stat.color}60, 0 4px 20px ${stat.color}20`,
                    }}
                  />
                )}

                {/* Caret */}
                {isSelected && (
                  <div
                    className="absolute top-[3px] left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: "5px solid transparent",
                      borderRight: "5px solid transparent",
                      borderTop: `5px solid ${stat.color}`,
                    }}
                  />
                )}

                {/* Stat abbreviation */}
                <span
                  className={`font-display text-[10px] md:text-[11px] tracking-wider transition-all duration-200 ${
                    isSelected ? "glow-text" : ""
                  }`}
                  style={{
                    color: isSelected ? stat.color : `${stat.color}80`,
                  }}
                >
                  {stat.key.toUpperCase()}
                </span>

                {/* Level */}
                <span
                  className="font-display text-[7px] md:text-[8px] tabular-nums tracking-wider mt-1"
                  style={{
                    color: isSelected
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.4)",
                  }}
                >
                  LV.{level}
                </span>

                {/* Mini progress bar */}
                <div
                  className="w-5 h-[3px] md:w-6 mt-1.5 overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: isSelected ? stat.color : `${stat.color}60`,
                      boxShadow: isSelected
                        ? `0 0 6px ${stat.color}40`
                        : "none",
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
