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

const MAX_BLOCKS = 12;

/* ── Achievements grouped by category ── */
const BY_CATEGORY: Record<AchievementCategory, AchievementMilestone[]> =
  {} as never;
for (const a of ACHIEVEMENTS) {
  if (!BY_CATEGORY[a.category]) BY_CATEGORY[a.category] = [];
  BY_CATEGORY[a.category].push(a);
}

function getVerdict(count: number, remaining: number, total: number): string {
  const pct = remaining / total;
  if (pct > 0.7) return "YOU WOULDN'T EVEN HAVE TO STOP GAMING.";
  if (pct > 0.4) return "ALL OF THIS. AND YOU'D STILL GAME PLENTY.";
  if (count > 25) return "A WHOLE LIFETIME OF SKILLS. FROM GAMING HOURS.";
  if (count > 15) return "THAT'S A DIFFERENT PERSON ENTIRELY.";
  if (count > 5) return "NOT BAD. NOT BAD AT ALL.";
  return "AND THAT'S JUST THE START.";
}

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

  const [unlocked, setUnlocked] = useState<AchievementMilestone[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);

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
    setUnlocked(picked);
    setLastAdded(null);
  }, [hours]);

  const clearAll = useCallback(() => {
    setUnlocked([]);
    setLastAdded(null);
  }, []);

  const removeSkill = useCallback((id: string) => {
    setUnlocked((prev) => prev.filter((a) => a.id !== id));
  }, []);

  if (hours < 1) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-32">
        <p className="font-display text-[12px] text-pink mb-6 glow-text">
          ERROR
        </p>
        <p className="font-body text-2xl text-foreground mb-3">
          NO HOURS TO SPEND
        </p>
        <p className="font-body text-lg text-muted/50 mb-8 max-w-sm">
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

  const budgetPct = Math.max(0, (remaining / hours) * 100);
  const budgetColor =
    remaining < hours * 0.1
      ? "#ff3333"
      : remaining < hours * 0.3
        ? "#ff9933"
        : "#ffcc00";

  return (
    <div className="flex flex-col flex-1 relative">
      {/* Background grid */}
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

      {/* ═══ HUD BAR ═══ */}
      <div className="sticky top-0 z-40 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="font-body text-xl text-muted/40 hover:text-foreground transition-colors"
          >
            {"<"}
          </Link>

          <div className="flex items-center gap-3 flex-1 justify-center">
            <span
              className="font-display text-[11px] md:text-[13px] tabular-nums transition-colors duration-300"
              style={{ color: budgetColor, textShadow: `0 0 8px ${budgetColor}40` }}
            >
              {formatNumber(Math.max(0, Math.round(remaining)))}H
            </span>

            {/* Discrete block bar */}
            <div className="flex gap-[2px]">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-3 md:w-2.5 md:h-3.5 transition-colors duration-300"
                  style={{
                    background:
                      i < Math.round((budgetPct / 100) * 20)
                        ? budgetColor
                        : "rgba(255, 255, 255, 0.05)",
                  }}
                />
              ))}
            </div>

            <span className="font-body text-sm text-muted/30 hidden sm:inline">
              / {formatNumber(hours)}H
            </span>
          </div>

          <span className="font-display text-[9px] md:text-[10px] text-muted/60 tabular-nums">
            <span className="text-neon" style={{ textShadow: "0 0 6px rgba(0,255,136,0.3)" }}>
              {unlocked.length}
            </span>{" "}
            SK
          </span>
        </div>
      </div>

      <main className="relative z-10 flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 py-8 md:py-14">
        {/* ═══ HERO ═══ */}
        <section className="mb-12 animate-fade-up">
          <div className="flex items-center gap-3 mb-6">
            <span className="font-display text-[8px] md:text-[9px] text-accent tracking-wider glow-accent">
              {source === "steam"
                ? `${gameCount > 0 ? `${gameCount} GAMES //` : ""} STEAM`
                : "MANUAL ENTRY"}
            </span>
          </div>

          <div className="flex items-baseline gap-3 md:gap-4 flex-wrap mb-4">
            <AnimatedNumber
              value={hours}
              duration={1500}
              className="font-display text-[clamp(1.8rem,6vw,3.5rem)] text-accent leading-none tracking-wider glow-accent"
            />
            <span className="font-body text-[clamp(1.2rem,2vw,1.6rem)] text-foreground/25 uppercase">
              hours to spend
            </span>
          </div>

          <p className="font-body text-xl md:text-2xl text-foreground/50 max-w-lg">
            That&apos;s{" "}
            <span className="text-foreground/80">
              {(hours / 24).toFixed(0)} full days
            </span>
            . Click + on any stat to unlock a random skill, or hit RANDOMIZE.
          </p>
        </section>

        {/* Game breakdown (Steam only) */}
        {source === "steam" && topGames.length > 0 && (
          <section className="mb-12">
            <GameBreakdown games={topGames} totalHours={hours} />
          </section>
        )}

        {/* ═══ STAT ALLOCATOR ═══ */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <span className="font-display text-[8px] md:text-[9px] text-muted/40 tracking-wider">
              BUILD YOUR STATS
            </span>
            <div className="flex gap-2">
              <button
                onClick={randomAll}
                className="px-4 py-2 bg-accent/10 border border-accent/25 font-display text-[8px] md:text-[9px] text-accent tracking-wider hover:bg-accent/20 hover:border-accent/40 transition-all active:scale-95"
              >
                ⚡ RANDOMIZE
              </button>
              {unlocked.length > 0 && (
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-white/[0.03] border border-border font-display text-[8px] md:text-[9px] text-muted/50 tracking-wider hover:text-foreground/60 hover:border-white/10 transition-all active:scale-95"
                >
                  RESET
                </button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {STATS.map((stat, statIdx) => {
              const level = catCounts[stat.category] || 0;
              const maxInCat = BY_CATEGORY[stat.category]?.length || 0;
              const filledBlocks =
                maxInCat > 0 ? Math.round((level / maxInCat) * MAX_BLOCKS) : 0;
              const hasAffordable = BY_CATEGORY[stat.category]?.some(
                (a) => !unlockedIds.has(a.id) && a.hoursRequired <= remaining
              );
              const isFull = level >= maxInCat;
              const disabled = isFull || !hasAffordable;
              const catSkills = unlocked.filter(
                (a) => a.category === stat.category
              );
              const hasSkills = catSkills.length > 0;

              return (
                <div
                  key={stat.key}
                  className={`retro-panel p-4 md:p-5 ${hasSkills ? "retro-panel-active" : ""}`}
                  style={{
                    animation: `fade-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${150 + statIdx * 60}ms forwards`,
                    opacity: 0,
                  }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="min-w-0">
                      <h3
                        className="font-display text-[11px] md:text-[13px] tracking-wider leading-tight"
                        style={{
                          color: stat.color,
                          textShadow: `0 0 10px ${stat.color}40`,
                        }}
                      >
                        {stat.label.toUpperCase()}
                      </h3>
                      <p className="font-body text-lg md:text-xl text-foreground/30 mt-0.5 leading-tight">
                        {stat.desc}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="font-display text-[10px] md:text-[11px] tabular-nums text-foreground tracking-wider">
                        LV.{level}
                        <span className="text-muted/25">/{maxInCat}</span>
                      </span>

                      <button
                        onClick={() => addRandomFromCategory(stat.category)}
                        disabled={disabled}
                        className={`w-10 h-10 md:w-11 md:h-11 border-2 font-display text-base flex items-center justify-center transition-all duration-150 ${
                          disabled
                            ? "border-white/[0.06] text-white/10 cursor-not-allowed"
                            : "cursor-pointer hover:scale-110 active:scale-90"
                        }`}
                        style={
                          !disabled
                            ? {
                                borderColor: `${stat.color}50`,
                                color: stat.color,
                                textShadow: `0 0 8px ${stat.color}40`,
                              }
                            : undefined
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Discrete block bar */}
                  <div className="flex gap-[3px] mb-1">
                    {Array.from({ length: MAX_BLOCKS }).map((_, i) => (
                      <div
                        key={i}
                        className="h-3 md:h-4 flex-1 transition-all duration-300"
                        style={{
                          background:
                            i < filledBlocks
                              ? stat.color
                              : "rgba(255, 255, 255, 0.04)",
                          boxShadow:
                            i < filledBlocks
                              ? `0 0 8px ${stat.color}25`
                              : "none",
                        }}
                      />
                    ))}
                  </div>

                  {/* Unlocked skills */}
                  {catSkills.length > 0 && (
                    <div className="mt-3 space-y-0.5">
                      {catSkills.map((skill) => {
                        const isNew = skill.id === lastAdded;
                        return (
                          <div
                            key={skill.id}
                            className={`group flex items-center gap-2 py-1.5 px-2 -mx-2 hover:bg-white/[0.02] transition-colors ${
                              isNew ? "skill-new" : ""
                            }`}
                          >
                            <span className="text-base shrink-0 leading-none">
                              {skill.icon}
                            </span>
                            <span className="font-body text-xl text-foreground/70 flex-1 min-w-0 truncate">
                              {skill.title}
                            </span>
                            <span
                              className="font-display text-[8px] md:text-[9px] tabular-nums shrink-0 tracking-wider"
                              style={{ color: stat.color }}
                            >
                              -{skill.hoursRequired}H
                            </span>
                            <button
                              onClick={() => removeSkill(skill.id)}
                              className="font-body text-lg text-muted/10 hover:text-pink hover:bg-pink/10 w-6 h-6 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0"
                            >
                              x
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Empty hint */}
                  {catSkills.length === 0 && !disabled && (
                    <p className="mt-2 font-body text-lg text-foreground/15">
                      {">"} Press + to unlock a {stat.label.toLowerCase()} skill
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ═══ THE VERDICT ═══ */}
        {unlocked.length > 0 && (
          <section className="mb-14 animate-fade-in">
            <div className="py-14 md:py-20 text-center relative">
              <div className="retro-divider absolute inset-x-0 top-0" />
              <div className="retro-divider absolute inset-x-0 bottom-0" />

              {/* Stars */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <span className="text-accent glow-accent text-lg">★</span>
                <span className="text-accent glow-accent text-lg">★</span>
                <span className="text-accent glow-accent text-lg">★</span>
              </div>

              <p className="font-display text-[9px] md:text-[10px] text-accent tracking-[0.4em] mb-8 glow-accent">
                RESULTS
              </p>

              <p className="font-display text-[clamp(2rem,8vw,4rem)] text-neon leading-none mb-2 glow-neon">
                {unlocked.length}
              </p>
              <p className="font-body text-2xl text-foreground/40 uppercase mb-12">
                SKILLS UNLOCKED
              </p>

              <p className="font-body text-xl text-foreground/25 uppercase mb-3">
                HOURS REMAINING
              </p>
              <p
                className="font-display text-[clamp(1.5rem,6vw,3rem)] text-accent leading-none mb-3 glow-accent"
              >
                {formatNumber(Math.max(0, Math.round(remaining)))}H
              </p>
              <p className="font-body text-xl text-foreground/25 uppercase mb-10">
                LEFT TO GAME WITH
              </p>

              <p className="font-body text-2xl md:text-3xl text-foreground/40 max-w-lg mx-auto leading-relaxed">
                &quot;{getVerdict(unlocked.length, remaining, hours)}&quot;
              </p>
            </div>
          </section>
        )}

        {/* ═══ SHARE ═══ */}
        {unlocked.length > 0 && (
          <section className="mb-14">
            <div className="text-center mb-8">
              <p className="font-display text-[9px] md:text-[10px] text-accent tracking-wider mb-3 glow-accent">
                SHARE YOUR BUILD
              </p>
              <p className="font-body text-lg text-muted/30">
                Show the world the life you could&apos;ve had.
              </p>
            </div>

            <ShareCard
              hours={hours}
              skillCount={unlocked.length}
              hoursRemaining={Math.max(0, Math.round(remaining))}
              statLevels={STATS.map((s) => ({
                label: s.label,
                color: s.color,
                level: catCounts[s.category] || 0,
                max: BY_CATEGORY[s.category]?.length || 0,
              }))}
              topSkills={unlocked.slice(0, 6)}
            />

            <div className="flex justify-center mt-6">
              <button
                onClick={() => {
                  const statStr = STATS.map(
                    (s) => `${s.label}: ${catCounts[s.category] || 0}`
                  )
                    .filter(
                      (_, i) => (catCounts[STATS[i].category] || 0) > 0
                    )
                    .join(" / ");
                  const text = `I spent ${formatNumber(hours)} hours gaming.\n\nI built an alternate life: ${unlocked.length} real skills, ${formatNumber(Math.max(0, remaining))}h left over.\n\n${statStr}\n\nWhat would YOUR build look like?`;
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                    "_blank"
                  );
                }}
                className="px-5 py-2.5 bg-white/[0.04] border border-border font-display text-[8px] md:text-[9px] text-foreground/60 tracking-wider hover:bg-white/[0.07] hover:border-white/10 transition-all active:scale-95"
              >
                SHARE ON X
              </button>
            </div>
          </section>
        )}

        {/* Back link */}
        <div className="text-center pb-8">
          <Link
            href="/"
            className="font-body text-lg text-muted/25 hover:text-accent transition-colors"
          >
            {"<"} TRY DIFFERENT HOURS
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-5 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-display text-[7px] md:text-[8px] text-muted/20 tracking-wider">
            ALTERNATE LIFE
          </span>
          <span className="hidden sm:inline font-body text-sm text-muted/15 uppercase">
            Your hours. Your build. Your call.
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center">
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
