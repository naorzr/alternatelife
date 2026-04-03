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
      {/* Stat header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2
            className="font-display text-[14px] md:text-[18px] tracking-wider glow-text"
            style={{ color: statColor }}
          >
            {statLabel.toUpperCase()}
          </h2>
          <p className="font-body text-base md:text-lg text-foreground/55 mt-0.5">
            {statDesc}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="font-display text-[10px] md:text-[12px] tabular-nums tracking-wider"
            style={{ color: `${statColor}90` }}
          >
            LV.{level}
            <span style={{ color: `${statColor}40` }}>/{maxLevel}</span>
          </span>
          <button
            onClick={onLevelUp}
            disabled={!canLevelUp}
            className={`px-4 py-2 border font-display text-[8px] md:text-[9px] tracking-wider transition-all duration-200 ${
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

      {/* Skills grid — multi-column rows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px]" style={{ background: `${statColor}08` }}>
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
              className={`group flex items-center gap-3 px-3 py-2.5 md:px-4 md:py-3 text-left transition-all duration-200 ${
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
              {/* Icon */}
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

              {/* Title + roast */}
              <div className="flex-1 min-w-0">
                <span
                  className={`font-body text-base md:text-lg leading-tight block truncate transition-colors duration-200 ${
                    isUnlocked
                      ? "text-foreground"
                      : isAffordable
                        ? "text-foreground/70"
                        : "text-foreground/25"
                  }`}
                >
                  {skill.title}
                </span>
                {isUnlocked && (
                  <span className="font-body text-xs md:text-sm text-foreground/35 block truncate mt-0.5">
                    &quot;{skill.roastLine}&quot;
                  </span>
                )}
              </div>

              {/* Cost */}
              <span
                className="font-display text-[8px] md:text-[9px] tabular-nums tracking-wider shrink-0"
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

              {/* Status indicator */}
              <span className="w-5 text-center shrink-0">
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
