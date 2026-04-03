"use client";

import { useState, useRef, useEffect } from "react";
import type { AchievementMilestone } from "@/lib/achievements-data";

interface SkillNodeProps {
  skill: AchievementMilestone;
  isUnlocked: boolean;
  isAffordable: boolean;
  statColor: string;
  onToggle: (skill: AchievementMilestone) => void;
  isNew?: boolean;
}

export default function SkillNode({
  skill,
  isUnlocked,
  isAffordable,
  statColor,
  onToggle,
  isNew,
}: SkillNodeProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [floatText, setFloatText] = useState<string | null>(null);
  const nodeRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const canInteract = isUnlocked || isAffordable;

  useEffect(() => {
    if (isNew && isUnlocked) {
      setJustUnlocked(true);
      setFloatText(`-${skill.hoursRequired}H`);
      const t = setTimeout(() => {
        setJustUnlocked(false);
        setFloatText(null);
      }, 800);
      return () => clearTimeout(t);
    }
  }, [isNew, isUnlocked, skill.hoursRequired]);

  // Close tooltip on outside click
  useEffect(() => {
    if (!showTooltip) return;
    function handleClick(e: MouseEvent) {
      if (
        nodeRef.current &&
        !nodeRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        setShowTooltip(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showTooltip]);

  function handleClick() {
    if (!canInteract) return;
    if (isUnlocked) {
      // Show tooltip with remove option
      setShowTooltip((v) => !v);
    } else {
      // Unlock
      onToggle(skill);
    }
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Float text animation */}
      {floatText && (
        <span
          className="absolute -top-2 font-display text-[10px] tracking-wider pointer-events-none"
          style={{
            color: statColor,
            animation: "float-up-fade 0.8s ease-out forwards",
          }}
        >
          {floatText}
        </span>
      )}

      {/* The node */}
      <button
        ref={nodeRef}
        onClick={handleClick}
        onMouseEnter={() => !showTooltip && setShowTooltip(true)}
        onMouseLeave={() => !isUnlocked && setShowTooltip(false)}
        className={`relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center transition-all duration-300 ${
          canInteract ? "cursor-pointer" : "cursor-default"
        } ${justUnlocked ? "node-unlock" : ""}`}
        style={{
          border: isUnlocked
            ? `2px solid ${statColor}`
            : isAffordable
              ? `2px solid ${statColor}40`
              : "2px solid rgba(255,255,255,0.06)",
          background: isUnlocked
            ? `${statColor}15`
            : "rgba(255,255,255,0.02)",
          boxShadow: isUnlocked
            ? `0 0 20px ${statColor}30, inset 0 0 12px ${statColor}10`
            : isAffordable
              ? `0 0 12px ${statColor}10`
              : "none",
        }}
      >
        <span
          className={`text-xl md:text-2xl leading-none transition-all duration-300 ${
            isUnlocked
              ? ""
              : isAffordable
                ? "opacity-40"
                : "opacity-15 grayscale"
          }`}
          style={
            isAffordable && !isUnlocked
              ? { animation: "node-pulse 2s ease-in-out infinite" }
              : undefined
          }
        >
          {skill.icon}
        </span>

        {/* Unlocked check indicator */}
        {isUnlocked && (
          <span
            className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center font-display text-[6px]"
            style={{
              background: statColor,
              color: "#0a0a12",
            }}
          >
            ✓
          </span>
        )}
      </button>

      {/* Skill title below node */}
      <span
        className={`mt-1.5 font-body text-xs md:text-sm text-center max-w-[80px] md:max-w-[100px] leading-tight truncate transition-opacity duration-300 ${
          isUnlocked
            ? "text-foreground/70"
            : isAffordable
              ? "text-foreground/30"
              : "text-foreground/10"
        }`}
      >
        {skill.title}
      </span>

      {/* Hour cost */}
      <span
        className="font-display text-[7px] md:text-[8px] tabular-nums tracking-wider mt-0.5"
        style={{
          color: isUnlocked
            ? statColor
            : isAffordable
              ? `${statColor}80`
              : "rgba(255,255,255,0.1)",
        }}
      >
        {skill.hoursRequired}H
      </span>

      {/* Tooltip */}
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute bottom-full mb-3 z-50 w-56 md:w-64 p-3 md:p-4 animate-fade-in"
          style={{
            background: "rgba(12, 12, 24, 0.97)",
            border: `1px solid ${statColor}30`,
            boxShadow: `0 0 30px rgba(0,0,0,0.5), 0 0 15px ${statColor}10`,
          }}
        >
          <div className="flex items-start gap-2 mb-2">
            <span className="text-lg leading-none">{skill.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="font-body text-base md:text-lg text-foreground/90 leading-tight">
                {skill.title}
              </p>
              <p
                className="font-display text-[9px] tabular-nums tracking-wider mt-1"
                style={{ color: statColor }}
              >
                {skill.hoursRequired}H
              </p>
            </div>
          </div>

          <p className="font-body text-sm text-foreground/25 leading-snug mb-3">
            &quot;{skill.roastLine}&quot;
          </p>

          {isUnlocked ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggle(skill);
                setShowTooltip(false);
              }}
              className="w-full py-1.5 border font-display text-[8px] tracking-wider transition-all hover:bg-pink/10"
              style={{
                borderColor: "rgba(255,51,102,0.3)",
                color: "#ff3366",
              }}
            >
              REMOVE SKILL
            </button>
          ) : isAffordable ? (
            <p
              className="font-display text-[8px] tracking-wider text-center"
              style={{ color: statColor }}
            >
              CLICK TO UNLOCK
            </p>
          ) : (
            <p className="font-display text-[8px] tracking-wider text-center text-foreground/15">
              NOT ENOUGH HOURS
            </p>
          )}
        </div>
      )}
    </div>
  );
}
