"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ACHIEVEMENTS } from "@/lib/achievements-data";
import type {
  AchievementCategory,
  AchievementMilestone,
} from "@/lib/achievements-data";
import { formatNumber } from "@/lib/formatting";
import AnimatedNumber from "@/components/AnimatedNumber";
import GameBreakdown from "@/components/GameBreakdown";
import ShareCard from "@/components/ShareCard";
import SkillTreeBar from "@/components/SkillTreeBar";
import SkillConstellation from "@/components/SkillConstellation";

/* ── RPG stat definitions ── */
const STATS: {
  key: string;
  label: string;
  desc: string;
  category: AchievementCategory;
  color: string;
}[] = [
  { key: "str", label: "Strength", desc: "Physical fitness, gym, combat sports", category: "fitness", color: "#ff3333" },
  { key: "dex", label: "Dexterity", desc: "Hands-on skills, crafts, instruments", category: "skills", color: "#3399ff" },
  { key: "int", label: "Intelligence", desc: "Languages, science, deep knowledge", category: "education", color: "#cc44ff" },
  { key: "wis", label: "Wisdom", desc: "Career, business, making money", category: "career", color: "#33ff66" },
  { key: "cha", label: "Charisma", desc: "Social skills, dating, community", category: "social", color: "#ff3399" },
  { key: "cre", label: "Creativity", desc: "Art, music, cooking, design", category: "creative", color: "#ff9933" },
  { key: "end", label: "Endurance", desc: "Adventure, travel, extreme sports", category: "adventure", color: "#00cccc" },
];

/* ── Achievements grouped by category ── */
const BY_CATEGORY: Record<AchievementCategory, AchievementMilestone[]> =
  {} as never;
for (const a of ACHIEVEMENTS) {
  if (!BY_CATEGORY[a.category]) BY_CATEGORY[a.category] = [];
  BY_CATEGORY[a.category].push(a);
}

const CAT_MAXES: Record<string, number> = {};
for (const s of STATS) {
  CAT_MAXES[s.category] = BY_CATEGORY[s.category]?.length || 0;
}

/* ── Greedy random fill ── */
function greedyRandomFill(hours: number): AchievementMilestone[] {
  let budget = hours;
  const picked: AchievementMilestone[] = [];
  const pickedIds = new Set<string>();
  const shuffled = [...ACHIEVEMENTS].sort(() => Math.random() - 0.5);
  for (const a of shuffled) {
    if (budget >= a.hoursRequired && !pickedIds.has(a.id)) {
      picked.push(a);
      pickedIds.add(a.id);
      budget -= a.hoursRequired;
    }
  }
  return picked;
}

/* ── "Top X%" mastery estimate based on deliberate practice research ── */
function getMasteryEstimate(hours: number): { percentile: string; label: string; description: string } {
  if (hours >= 10000) return { percentile: "0.1%", label: "WORLD CLASS", description: "You'd be among the best in the world. 10,000+ hours is elite mastery." };
  if (hours >= 5000) return { percentile: "1%", label: "EXPERT", description: "Top 1% — you'd be better than 99 out of 100 people who ever tried." };
  if (hours >= 3000) return { percentile: "2%", label: "HIGHLY SKILLED", description: "Professional-level ability. People would pay for your expertise." };
  if (hours >= 2000) return { percentile: "5%", label: "ADVANCED", description: "Years ahead of most. You'd teach classes on this." };
  if (hours >= 1000) return { percentile: "10%", label: "PROFICIENT", description: "Solidly skilled. You'd impress anyone watching." };
  if (hours >= 500) return { percentile: "15%", label: "COMPETENT", description: "Beyond the basics. Real, noticeable ability." };
  if (hours >= 200) return { percentile: "25%", label: "CAPABLE", description: "Past the beginner stage. You'd surprise yourself." };
  return { percentile: "30%", label: "STARTED", description: "Enough to build real foundations in any skill." };
}

/* ── Focus skill examples with hour-aware hooks ── */
const FOCUS_SKILLS: { name: string; icon: string; hook: (h: number) => string }[] = [
  { name: "Olympic Weightlifting", icon: "🏋️", hook: (h) =>
    h >= 10000 ? "That's more than most Olympic athletes log before qualifying."
    : h >= 5000 ? "Olympic lifters train ~15,000 hours over a career. You'd be a serious competitive lifter."
    : h >= 2000 ? "That's roughly 2 years of dedicated training. You'd be winning local competitions."
    : h >= 500 ? "That's about 6 months of daily training. You'd have solid form and real strength."
    : "That's enough to learn proper technique and start building serious strength." },
  { name: "Boxing", icon: "🥊", hook: (h) =>
    h >= 10000 ? "Floyd Mayweather trained ~6 hours a day for decades. You'd be in that league."
    : h >= 5000 ? "That's ~4 years of serious daily training. You'd be a dangerous fighter."
    : h >= 2000 ? "That's about 2 years of daily training. You'd hold your own in amateur bouts."
    : h >= 500 ? "That's enough to develop sharp fundamentals and real ring awareness."
    : "You'd have solid basics — footwork, jab, and defense that actually work." },
  { name: "Marathon Running", icon: "🏃", hook: (h) =>
    h >= 10000 ? "Elite Kenyan runners train ~3-4 hours daily for decades. You'd match their volume."
    : h >= 5000 ? "That's ~5 years of daily running. You'd be qualifying for Boston."
    : h >= 2000 ? "That's ~2 years of consistent training. You'd be running sub-3:30 marathons."
    : h >= 500 ? "That's enough to comfortably finish a marathon and set a solid personal record."
    : "You'd go from couch to confident half-marathon runner." },
  { name: "Competitive Swimming", icon: "🏊", hook: (h) =>
    h >= 10000 ? "Michael Phelps trained ~6 hours a day for 20 years. You're approaching that ballpark."
    : h >= 5000 ? "That's ~5 years of daily pool time. You'd be competing at a national level."
    : h >= 2000 ? "That's enough to dominate local meets and develop elite-level technique."
    : h >= 500 ? "That's about a year of daily practice. You'd be one of the fastest at your local pool."
    : "You'd have clean strokes and real endurance in the water." },
  { name: "Chess", icon: "♟️", hook: (h) =>
    h >= 10000 ? "Magnus Carlsen became a grandmaster with roughly this much study. You'd be titled."
    : h >= 5000 ? "That's enough study to reach ~2000 Elo. You'd beat 95% of club players."
    : h >= 2000 ? "That's serious study. You'd be a strong club player rated around 1600-1800."
    : h >= 500 ? "That's enough to develop real tactical vision and beat most casual players easily."
    : "You'd understand openings, tactics, and strategy well beyond the average player." },
  { name: "Classical Piano", icon: "🎹", hook: (h) =>
    h >= 10000 ? "Concert pianists typically need 10,000+ hours. You'd be performing publicly."
    : h >= 5000 ? "That's enough to tackle advanced repertoire — Chopin, Liszt, the big pieces."
    : h >= 2000 ? "You'd play intermediate-advanced pieces confidently. People would stop and listen."
    : h >= 500 ? "That's enough to play real music — not just exercises, but pieces you'd be proud of."
    : "You'd read music fluently and play simple pieces with genuine expression." },
  { name: "Surgery", icon: "🔬", hook: (h) =>
    h >= 10000 ? "A surgeon's residency is ~10,000 hours. You'd be board-certified."
    : h >= 5000 ? "That's halfway through a surgical residency. You'd be assisting in real operations."
    : h >= 2000 ? "That's roughly a year of medical training. You'd understand anatomy deeply."
    : h >= 500 ? "That's enough to master foundational anatomy and basic procedural skills."
    : "You'd have a solid grasp of human anatomy that most people never get." },
  { name: "Martial Arts", icon: "🥋", hook: (h) =>
    h >= 10000 ? "A BJJ black belt takes ~3,000-5,000 hours. You'd be a multiple-degree black belt."
    : h >= 5000 ? "That's beyond black belt level in most martial arts. You'd be teaching and competing."
    : h >= 2000 ? "That's brown/black belt territory. You'd submit most people who walk into a gym."
    : h >= 500 ? "That's about a year of daily training — solid blue belt level in BJJ."
    : "You'd have real grappling fundamentals and be dangerous for your experience level." },
  { name: "Competitive Archery", icon: "🏹", hook: (h) =>
    h >= 10000 ? "Olympic archers train ~4 hours daily for a decade. You'd be on the national team."
    : h >= 5000 ? "That's ~5 years of dedicated practice. You'd be competing at a high regional level."
    : h >= 2000 ? "That's enough to be a serious competitive archer winning local tournaments."
    : h >= 500 ? "That's about a year of daily practice. You'd be grouping arrows with real precision."
    : "You'd have consistent form and be hitting targets most beginners can't." },
  { name: "Figure Skating", icon: "⛸️", hook: (h) =>
    h >= 10000 ? "Olympic figure skaters peak at around 10,000 hours of ice time. You'd be there."
    : h >= 5000 ? "That's enough for double and triple jumps. You'd be competing at a national level."
    : h >= 2000 ? "That's serious ice time. You'd be landing single jumps and complex footwork."
    : h >= 500 ? "That's about a year of daily rink time. You'd be doing spins and basic jumps."
    : "You'd glide with confidence and pull off moves that impress anyone watching." },
  { name: "Guitar", icon: "🎸", hook: (h) =>
    h >= 10000 ? "You'd be at the level of professional touring musicians. Truly elite."
    : h >= 5000 ? "That's enough to master complex styles — jazz, classical, shredding. You'd be gigging."
    : h >= 2000 ? "You'd play confidently in a band and improvise solos that actually sound good."
    : h >= 500 ? "That's enough to play full songs, barre chords, and start improvising."
    : "You'd know your chords, strum patterns, and be the person who plays at the campfire." },
  { name: "Fencing", icon: "🤺", hook: (h) =>
    h >= 10000 ? "Olympic fencers train ~5 hours a day for years. You'd be competing internationally."
    : h >= 5000 ? "That's ~4 years of daily training. You'd be a nationally ranked fencer."
    : h >= 2000 ? "That's enough to be a strong competitive fencer winning regional bouts."
    : h >= 500 ? "That's about a year of dedicated practice. You'd be dangerous in local competitions."
    : "You'd have sharp footwork and blade control that surprises more experienced fencers." },
];

/* ══════════════════════════════════════
   SHARED: Background grid
   ══════════════════════════════════════ */
function BgGrid() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 204, 0, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 204, 0, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 1 — Breakdown / Budget Overview
   ══════════════════════════════════════ */
function ScreenBreakdown({
  hours,
  gameCount,
  source,
  topGames,
  onNext,
}: {
  hours: number;
  gameCount: number;
  source: string;
  topGames: { name: string; hours: number; appid: number }[];
  onNext: () => void;
}) {
  return (
    <div className="h-screen flex flex-col relative">
      <BgGrid />

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="min-h-full flex flex-col justify-center max-w-3xl mx-auto w-full px-6 md:px-8 py-8">
          {/* Source badge */}
          <div className="mb-4 animate-fade-up">
            <span className="font-display text-[8px] md:text-[9px] text-accent tracking-wider glow-accent">
              {source === "steam"
                ? `${gameCount > 0 ? `${gameCount} GAMES //` : ""} STEAM PROFILE`
                : "MANUAL ENTRY"}
            </span>
          </div>

          {/* Big number */}
          <div className="animate-fade-up delay-200 mb-4">
            <div className="flex items-baseline gap-3 md:gap-4 flex-wrap">
              <AnimatedNumber
                value={hours}
                duration={1500}
                className="font-display text-[clamp(2rem,7vw,4rem)] text-accent leading-none tracking-wider glow-accent"
              />
              <span className="font-body text-[clamp(0.9rem,1.8vw,1.3rem)] text-foreground/60 uppercase font-bold">
                hours gaming
              </span>
            </div>
          </div>

          {/* Context stats */}
          <div className="animate-fade-up delay-300 flex flex-wrap gap-4 md:gap-8 mb-6">
            <div>
              <span className="font-display text-[clamp(1rem,2.5vw,1.6rem)] text-foreground/80">
                {(hours / 24).toFixed(0)}
              </span>
              <span className="font-body text-sm text-foreground/50 ml-2 uppercase">days</span>
            </div>
            <div>
              <span className="font-display text-[clamp(1rem,2.5vw,1.6rem)] text-foreground/80">
                {(hours / 24 / 7).toFixed(1)}
              </span>
              <span className="font-body text-sm text-foreground/50 ml-2 uppercase">weeks</span>
            </div>
            {gameCount > 0 && (
              <div>
                <span className="font-display text-[clamp(1rem,2.5vw,1.6rem)] text-foreground/80">
                  {gameCount}
                </span>
                <span className="font-body text-sm text-foreground/50 ml-2 uppercase">games</span>
              </div>
            )}
          </div>

          {/* Game breakdown (Steam only) */}
          {source === "steam" && topGames.length > 0 && (
            <div className="animate-fade-up delay-400 mb-6">
              <GameBreakdown games={topGames} totalHours={hours} />
            </div>
          )}

          {/* Prompt */}
          <p className="animate-fade-up delay-500 font-body text-base text-foreground/50">
            {source === "steam"
              ? "That's a lot of hours. Let's see what you could've done instead."
              : "What could you have done with all that time?"}
          </p>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 border-t border-border py-4 px-6 relative z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] border border-white/15 font-display text-[8px] md:text-[9px] text-foreground/60 tracking-wider hover:bg-white/[0.1] hover:border-white/25 hover:text-foreground transition-all active:scale-95"
          >
            <span className="text-accent">{"<"}</span>
            BACK
          </Link>
          <button
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2.5 bg-accent/15 border border-accent/40 font-display text-[9px] md:text-[10px] text-accent tracking-wider hover:bg-accent/25 hover:border-accent/60 transition-all active:scale-95"
          >
            SHOW ME
            <span>{">"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 2 — The Reveal
   ══════════════════════════════════════ */
function ScreenReveal({
  hours,
  autoSkills,
  onPrev,
  onBuild,
}: {
  hours: number;
  autoSkills: AchievementMilestone[];
  onPrev: () => void;
  onBuild: () => void;
}) {
  const totalSpent = autoSkills.reduce((s, a) => s + a.hoursRequired, 0);
  const remaining = hours - totalSpent;
  const mastery = getMasteryEstimate(hours);
  const [focusSkill] = useState(
    () => FOCUS_SKILLS[Math.floor(Math.random() * FOCUS_SKILLS.length)]
  );

  // Group skills by category for display
  const grouped = useMemo(() => {
    const map = new Map<string, AchievementMilestone[]>();
    for (const skill of autoSkills) {
      const stat = STATS.find((s) => s.category === skill.category);
      const key = stat?.label || skill.category;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(skill);
    }
    return Array.from(map.entries());
  }, [autoSkills]);

  return (
    <div className="h-screen flex flex-col relative">
      <BgGrid />

      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-4xl mx-auto w-full px-5 md:px-8 py-6 md:py-10">

          {/* ── Header ── */}
          <div className="text-center mb-8 animate-fade-up">
            <p className="font-display text-[9px] md:text-[10px] text-accent tracking-[0.3em] mb-4 glow-accent">
              WITH {formatNumber(hours)} HOURS YOU COULD HAVE
            </p>
          </div>

          {/* ── Skills list grouped by category ── */}
          <div className="space-y-5 mb-10">
            {grouped.map(([catLabel, skills], gi) => {
              const stat = STATS.find((s) => s.label === catLabel);
              const color = stat?.color || "#ffcc00";
              return (
                <div
                  key={catLabel}
                  className="animate-fade-up"
                  style={{ animationDelay: `${150 + gi * 80}ms` }}
                >
                  {/* Category label */}
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="font-display text-[8px] md:text-[9px] tracking-wider"
                      style={{ color }}
                    >
                      {catLabel.toUpperCase()}
                    </span>
                    <div className="flex-1 h-px" style={{ background: `${color}20` }} />
                    <span
                      className="font-display text-[7px] md:text-[8px] tabular-nums tracking-wider"
                      style={{ color: `${color}80` }}
                    >
                      {skills.length} SKILL{skills.length > 1 ? "S" : ""}
                    </span>
                  </div>

                  {/* Skills rows */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px]" style={{ background: `${color}08` }}>
                    {skills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-3 px-3 py-2 md:px-4 md:py-2.5"
                        style={{ background: "rgba(19, 18, 29, 0.9)" }}
                      >
                        <span className="text-base leading-none shrink-0">{skill.icon}</span>
                        <span className="font-body text-sm md:text-base text-foreground/90 flex-1 min-w-0 truncate">
                          {skill.title}
                        </span>
                        <span
                          className="font-display text-[7px] md:text-[8px] tabular-nums tracking-wider shrink-0"
                          style={{ color }}
                        >
                          {skill.hoursRequired}H
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Remaining hours callout ── */}
          {remaining > 0 && (
            <div className="text-center mb-10 animate-fade-up delay-500">
              <div className="retro-divider mb-5" />
              <p className="font-body text-base text-foreground/50 mb-2">
                And you&apos;d still have
              </p>
              <p className="font-display text-[clamp(1.5rem,5vw,2.5rem)] text-accent leading-none glow-accent mb-2">
                {formatNumber(remaining)}H LEFT OVER
              </p>
              <p className="font-body text-sm text-foreground/40">
                That&apos;s another {(remaining / 24).toFixed(0)} days of gaming.
              </p>
              <div className="retro-divider mt-5" />
            </div>
          )}

          {/* ── Mastery insight ── */}
          <div
            className="retro-panel p-5 md:p-6 mb-10 animate-fade-up delay-600"
            style={{ borderColor: `rgba(0, 255, 136, 0.15)` }}
          >
            <p className="font-display text-[8px] md:text-[9px] text-neon tracking-wider mb-4 glow-neon">
              OR — IF YOU FOCUSED ON JUST ONE THING
            </p>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl md:text-4xl">{focusSkill.icon}</span>
              <div>
                <p className="font-body text-lg md:text-xl text-foreground font-bold">
                  {formatNumber(hours)} hours of {focusSkill.name}
                </p>
                <p className="font-body text-sm text-foreground/50 mt-1">
                  would put you in the
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-display text-[clamp(2rem,6vw,3.5rem)] text-neon leading-none glow-neon">
                TOP {mastery.percentile}
              </span>
              <span className="font-display text-[10px] md:text-[12px] text-foreground/60 tracking-wider">
                {mastery.label}
              </span>
            </div>

            <p className="font-body text-base text-foreground/60 mb-2">
              {focusSkill.hook(hours)}
            </p>
            <p className="font-body text-sm text-foreground/35">
              {mastery.description}
            </p>
          </div>

          {/* ── Share ── */}
          <div className="text-center animate-fade-up delay-700 mb-6">
            <button
              onClick={() => {
                const text = `I spent ${formatNumber(hours)} hours gaming.\n\nThat's enough to learn ${autoSkills.length} real-world skills — and still have ${formatNumber(Math.max(0, remaining))}h left over.\n\nOr I'd be in the top ${mastery.percentile} at any single skill.\n\nWhat would YOUR hours buy?`;
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                  "_blank"
                );
              }}
              className="px-5 py-2.5 bg-accent/15 border border-accent/40 font-display text-[8px] md:text-[9px] text-accent tracking-wider hover:bg-accent/25 hover:border-accent/60 transition-all active:scale-95"
            >
              SHARE ON X
            </button>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="shrink-0 border-t border-border py-3 px-6 relative z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onPrev}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] border border-white/15 font-display text-[8px] md:text-[9px] text-foreground/60 tracking-wider hover:bg-white/[0.1] hover:border-white/25 hover:text-foreground transition-all active:scale-95"
          >
            <span className="text-accent">{"<"}</span>
            BACK
          </button>
          <button
            onClick={onBuild}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/[0.06] border border-white/20 font-display text-[8px] md:text-[9px] text-foreground/70 tracking-wider hover:bg-white/[0.1] hover:border-white/30 hover:text-foreground transition-all active:scale-95"
          >
            BUILD YOUR OWN
            <span className="text-accent">{">"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   SCREEN 3 — Build Your Own (optional)
   ══════════════════════════════════════ */
function ScreenAllocator({
  hours,
  unlocked,
  unlockedIds,
  remaining,
  catCounts,
  selectedStat,
  setSelectedStat,
  toggleSkill,
  addRandomFromCategory,
  randomAll,
  clearAll,
  lastAdded,
  onPrev,
}: {
  hours: number;
  unlocked: AchievementMilestone[];
  unlockedIds: Set<string>;
  remaining: number;
  catCounts: Record<string, number>;
  selectedStat: string;
  setSelectedStat: (key: string) => void;
  toggleSkill: (skill: AchievementMilestone) => void;
  addRandomFromCategory: (category: AchievementCategory) => void;
  randomAll: () => void;
  clearAll: () => void;
  lastAdded: string | null;
  onPrev: () => void;
}) {
  const budgetPct = Math.max(0, (remaining / hours) * 100);
  const budgetColor =
    remaining < hours * 0.1
      ? "#ff3333"
      : remaining < hours * 0.3
        ? "#ff9933"
        : "#ffcc00";

  const currentStat = STATS.find((s) => s.key === selectedStat) || STATS[0];
  const currentSkills = BY_CATEGORY[currentStat.category] || [];
  const currentLevel = catCounts[currentStat.category] || 0;
  const currentMax = CAT_MAXES[currentStat.category] || 0;
  const currentCanLevelUp = currentSkills.some(
    (a) => !unlockedIds.has(a.id) && a.hoursRequired <= remaining
  );

  return (
    <div className="h-screen flex flex-col relative">
      <BgGrid />

      {/* ═══ TOP HUD ═══ */}
      <div className="shrink-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-2">
          <button
            onClick={onPrev}
            className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.06] border border-white/15 font-display text-[7px] md:text-[8px] text-foreground/60 tracking-wider hover:bg-white/[0.1] hover:text-foreground transition-all active:scale-95"
          >
            <span className="text-accent">{"<"}</span>
            <span className="hidden sm:inline">BACK</span>
          </button>

          <div className="flex items-center gap-2 md:gap-3 flex-1 justify-center min-w-0">
            <AnimatedNumber
              value={Math.max(0, Math.round(remaining))}
              duration={300}
              className="font-display text-[11px] md:text-[14px] tabular-nums shrink-0"
              style={{ color: budgetColor, textShadow: `0 0 8px ${budgetColor}40` }}
            />

            <div className="flex gap-[2px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-2.5 md:w-2 md:h-3 transition-colors duration-300"
                  style={{
                    background:
                      i < Math.round((budgetPct / 100) * 20)
                        ? budgetColor
                        : "rgba(255, 255, 255, 0.08)",
                  }}
                />
              ))}
            </div>

            <span className="font-body text-xs text-foreground/40 hidden sm:inline shrink-0">
              / {formatNumber(hours)}H
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={randomAll}
              className="px-3 py-1.5 bg-accent/10 border border-accent/25 font-display text-[7px] md:text-[8px] text-accent tracking-wider hover:bg-accent/20 hover:border-accent/40 transition-all active:scale-95"
            >
              ⚡ RNG
            </button>
            {unlocked.length > 0 && (
              <button
                onClick={clearAll}
                className="hidden sm:block px-3 py-1.5 bg-white/[0.06] border border-white/15 font-display text-[7px] md:text-[8px] text-foreground/50 tracking-wider hover:text-foreground hover:border-white/25 transition-all active:scale-95"
              >
                RST
              </button>
            )}
            <span className="font-display text-[9px] md:text-[10px] text-muted/60 tabular-nums ml-1">
              <span className="text-neon" style={{ textShadow: "0 0 6px rgba(0,255,136,0.3)" }}>
                {unlocked.length}
              </span>{" "}
              SK
            </span>
          </div>
        </div>
      </div>

      {/* ═══ SKILL TREE CONTENT ═══ */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="max-w-5xl mx-auto w-full px-4 md:px-6 py-4 md:py-6">
          <SkillConstellation
            key={currentStat.key}
            skills={currentSkills}
            unlockedIds={unlockedIds}
            remaining={remaining}
            statColor={currentStat.color}
            statLabel={currentStat.label}
            statDesc={currentStat.desc}
            level={currentLevel}
            maxLevel={currentMax}
            lastAdded={lastAdded}
            onToggle={toggleSkill}
            onLevelUp={() => addRandomFromCategory(currentStat.category)}
            canLevelUp={currentCanLevelUp}
          />
        </div>
      </div>

      {/* ═══ BOTTOM STAT BAR ═══ */}
      <SkillTreeBar
        stats={STATS}
        selectedKey={selectedStat}
        catCounts={catCounts}
        catMaxes={CAT_MAXES}
        onSelect={setSelectedStat}
      />
    </div>
  );
}

/* ══════════════════════════════════════
   MAIN ORCHESTRATOR
   ══════════════════════════════════════ */
function ResultsContent() {
  const searchParams = useSearchParams();

  const hours = parseInt(searchParams.get("hours") ?? "0", 10);
  const gameCount = parseInt(searchParams.get("games") ?? "0", 10);
  const source = searchParams.get("source") ?? "manual";

  let topGames: { name: string; hours: number; appid: number }[] = [];
  try {
    const raw = searchParams.get("topGames");
    if (raw) topGames = JSON.parse(raw);
  } catch {
    // ignore
  }

  // Auto-generated skills for the reveal screen (useState to avoid hydration mismatch)
  const [autoSkills] = useState(() => greedyRandomFill(hours));

  const [screen, setScreen] = useState(0); // 0=breakdown, 1=reveal, 2=build-your-own
  const [unlocked, setUnlocked] = useState<AchievementMilestone[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [selectedStat, setSelectedStat] = useState<string>("str");

  const unlockedIds = useMemo(
    () => new Set(unlocked.map((a) => a.id)),
    [unlocked]
  );

  const totalSpent = useMemo(
    () => unlocked.reduce((s, a) => s + a.hoursRequired, 0),
    [unlocked]
  );
  const remaining = hours - totalSpent;

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const a of unlocked) {
      counts[a.category] = (counts[a.category] || 0) + 1;
    }
    return counts;
  }, [unlocked]);

  const toggleSkill = useCallback(
    (skill: AchievementMilestone) => {
      if (unlockedIds.has(skill.id)) {
        setUnlocked((prev) => prev.filter((a) => a.id !== skill.id));
      } else if (skill.hoursRequired <= remaining) {
        setUnlocked((prev) => [...prev, skill]);
        setLastAdded(skill.id);
      }
    },
    [unlockedIds, remaining]
  );

  const addRandomFromCategory = useCallback(
    (category: AchievementCategory) => {
      const pool = BY_CATEGORY[category].filter(
        (a) => !unlockedIds.has(a.id) && a.hoursRequired <= remaining
      );
      if (pool.length === 0) return;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      setUnlocked((prev) => [...prev, pick]);
      setLastAdded(pick.id);
    },
    [unlockedIds, remaining]
  );

  const randomAll = useCallback(() => {
    const picked = greedyRandomFill(hours);
    setUnlocked(picked);
    setLastAdded(null);
  }, [hours]);

  const clearAll = useCallback(() => {
    setUnlocked([]);
    setLastAdded(null);
  }, []);

  if (hours < 1) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="font-display text-[12px] text-pink mb-6 glow-text">
          ERROR
        </p>
        <p className="font-body text-xl text-foreground mb-3 font-bold">
          NO HOURS TO SPEND
        </p>
        <p className="font-body text-base text-muted/60 mb-8 max-w-sm">
          We need some gaming hours to work with. Head back and enter your
          profile or hours.
        </p>
        <Link
          href="/"
          className="font-display text-[10px] px-6 py-3 bg-accent text-background tracking-wider hover:bg-[#e6c200] transition-colors"
        >
          {"<<"} GO BACK
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {screen === 0 && (
        <ScreenBreakdown
          hours={hours}
          gameCount={gameCount}
          source={source}
          topGames={topGames}
          onNext={() => setScreen(1)}
        />
      )}

      {screen === 1 && (
        <ScreenReveal
          hours={hours}
          autoSkills={autoSkills}
          onPrev={() => setScreen(0)}
          onBuild={() => setScreen(2)}
        />
      )}

      {screen === 2 && (
        <ScreenAllocator
          hours={hours}
          unlocked={unlocked}
          unlockedIds={unlockedIds}
          remaining={remaining}
          catCounts={catCounts}
          selectedStat={selectedStat}
          setSelectedStat={setSelectedStat}
          toggleSkill={toggleSkill}
          addRandomFromCategory={addRandomFromCategory}
          randomAll={randomAll}
          clearAll={clearAll}
          lastAdded={lastAdded}
          onPrev={() => setScreen(1)}
        />
      )}
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-6 w-6 border-2 border-accent border-t-transparent mx-auto mb-4" />
            <p className="font-display text-[9px] text-accent tracking-wider animate-text-flicker glow-accent">
              LOADING...
            </p>
          </div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
