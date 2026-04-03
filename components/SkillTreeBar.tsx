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
      className="z-40 border-t bg-background/95 safe-pad-bottom backdrop-blur-xl"
      data-testid="skill-tree-bar"
      style={{
        borderColor: "rgba(255, 204, 0, 0.08)",
      }}
    >
      <div className="viewport-frame py-2">
        <div className="grid grid-cols-7 gap-0.5">
          {stats.map((stat) => {
            const isSelected = stat.key === selectedKey;
            const level = catCounts[stat.category] || 0;
            const max = catMaxes[stat.category] || 1;
            const pct = Math.round((level / max) * 100);

            return (
              <button
                key={stat.key}
                onClick={() => onSelect(stat.key)}
                data-testid={`stat-tab-${stat.key}`}
                className={`touch-action relative flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 px-1 py-2 transition-all duration-200 ${
                  isSelected ? "scale-105" : "hover:bg-white/[0.02]"
                }`}
              >
                {isSelected && (
                  <div
                    className="absolute top-0 inset-x-1 h-[2px]"
                    style={{
                      background: stat.color,
                      boxShadow: `0 0 12px ${stat.color}60, 0 4px 20px ${stat.color}20`,
                    }}
                  />
                )}

                {isSelected && (
                  <div
                    className="absolute top-[2px] left-1/2 -translate-x-1/2 w-0 h-0"
                    style={{
                      borderLeft: "4px solid transparent",
                      borderRight: "4px solid transparent",
                      borderTop: `4px solid ${stat.color}`,
                    }}
                  />
                )}

                <span
                  className={`font-display text-[8px] md:text-[11px] tracking-wider transition-all duration-200 ${
                    isSelected ? "glow-text" : ""
                  }`}
                  style={{
                    color: isSelected ? stat.color : `${stat.color}80`,
                  }}
                >
                  {stat.key.toUpperCase()}
                </span>

                <span
                  className="font-display text-[6px] md:text-[8px] tabular-nums tracking-wider"
                  style={{
                    color: isSelected
                      ? "rgba(255,255,255,0.8)"
                      : "rgba(255,255,255,0.4)",
                  }}
                >
                  LV.{level}
                </span>

                <div
                  className="mt-0.5 h-[2px] w-6 md:w-8 overflow-hidden"
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
