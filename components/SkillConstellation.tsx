"use client";

import { useMemo } from "react";
import type { AchievementMilestone } from "@/lib/achievements-data";

interface SkillConstellationProps {
  skills: AchievementMilestone[];
  unlockedIds: Set<string>;
  remaining: number;
  statColor: string;
  statLabel: string;
  statDesc: string;
  level: number;
  maxLevel: number;
  lastAdded: string | null;
  onToggle: (skill: AchievementMilestone) => void;
  onLevelUp: () => void;
  canLevelUp: boolean;
}

export default function SkillConstellation({
  skills,
  unlockedIds,
  remaining,
  statColor,
  statLabel,
  statDesc,
  level,
  maxLevel,
  lastAdded,
  onToggle,
  onLevelUp,
  canLevelUp,
}: SkillConstellationProps) {
  const sorted = useMemo(
    () => [...skills].sort((a, b) => a.hoursRequired - b.hoursRequired),
    [skills]
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <h2
            className="font-display text-[14px] md:text-[18px] tracking-[0.22em] glow-text"
            style={{ color: statColor }}
          >
            {statLabel.toUpperCase()}
          </h2>
          <p className="mt-1 break-safe font-body text-sm md:text-base readable-muted">
            {statDesc}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="font-display text-[10px] md:text-[12px] tabular-nums tracking-[0.18em]"
            style={{ color: `${statColor}90` }}
          >
            LV.{level}
            <span style={{ color: `${statColor}40` }}>/{maxLevel}</span>
          </span>
          <button
            onClick={onLevelUp}
            disabled={!canLevelUp}
            data-testid="allocator-level-up"
            className={`touch-action px-4 py-2 border font-display text-[8px] md:text-[9px] tracking-[0.2em] transition-all duration-200 ${
              canLevelUp
                ? "cursor-pointer hover:scale-105 active:scale-95"
                : "opacity-20 cursor-not-allowed"
            }`}
            style={
              canLevelUp
                ? {
                    borderColor: `${statColor}40`,
                    color: statColor,
                    textShadow: `0 0 8px ${statColor}40`,
                  }
                : {
                    borderColor: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.15)",
                  }
            }
          >
            ⚡ LEVEL UP
          </button>
        </div>
      </div>

      <div
        className="grid grid-cols-1 gap-[1px] md:grid-cols-2"
        style={{ background: `${statColor}08` }}
      >
        {sorted.map((skill) => {
          const isUnlocked = unlockedIds.has(skill.id);
          const isAffordable = !isUnlocked && skill.hoursRequired <= remaining;
          const isLocked = !isUnlocked && !isAffordable;
          const isNew = skill.id === lastAdded;

          return (
            <button
              key={skill.id}
              onClick={() => {
                if (isUnlocked || isAffordable) onToggle(skill);
              }}
              disabled={isLocked}
              data-testid="allocator-skill-button"
              className={`group grid min-h-18 grid-cols-[auto_minmax(0,1fr)_auto_auto] items-start gap-3 px-3 py-3 md:px-4 text-left transition-all duration-200 ${
                isUnlocked
                  ? "cursor-pointer"
                  : isAffordable
                    ? "cursor-pointer hover:brightness-125"
                    : "cursor-not-allowed"
              } ${isNew ? "skill-new" : ""}`}
              style={{
                background: isUnlocked
                  ? `${statColor}12`
                  : "rgba(19, 18, 29, 0.9)",
              }}
            >
              <span
                className={`text-lg md:text-xl leading-none shrink-0 transition-all duration-300 ${
                  isUnlocked
                    ? ""
                    : isAffordable
                      ? "opacity-70"
                      : "opacity-25 grayscale"
                }`}
              >
                {skill.icon}
              </span>

              <div className="flex-1 min-w-0">
                <span
                  className={`break-safe font-body text-base md:text-lg leading-tight block transition-colors duration-200 ${
                    isUnlocked
                      ? "text-foreground"
                      : isAffordable
                        ? "text-foreground/70"
                        : "text-foreground/25"
                  }`}
                  data-testid="allocator-skill-title"
                >
                  {skill.title}
                </span>
                {isUnlocked && (
                  <span className="mt-1 block break-safe font-body text-xs md:text-sm readable-muted">
                    &quot;{skill.roastLine}&quot;
                  </span>
                )}
              </div>

              <span
                className="pt-0.5 font-display text-[8px] md:text-[9px] tabular-nums tracking-[0.18em] shrink-0"
                style={{
                  color: isUnlocked
                    ? statColor
                    : isAffordable
                      ? `${statColor}70`
                      : "rgba(255,255,255,0.08)",
                }}
              >
                {skill.hoursRequired}H
              </span>

              <span className="w-5 pt-0.5 text-center shrink-0">
                {isUnlocked ? (
                  <span
                    className="font-display text-[8px]"
                    style={{ color: statColor }}
                  >
                    ✓
                  </span>
                ) : isAffordable ? (
                  <span
                    className="font-display text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: statColor }}
                  >
                    +
                  </span>
                ) : (
                  <span className="font-display text-[7px] text-foreground/10">
                    ✕
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
