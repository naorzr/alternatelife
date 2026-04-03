"use client";

import { useMemo, useState } from "react";
import type { AchievementMilestone } from "@/lib/achievements-data";
import { formatNumber } from "@/lib/formatting";
import { FOCUS_SKILLS } from "@/lib/results/focus-skills";
import { RESULT_STATS } from "@/lib/results/stats";
import { buildShareText, getMasteryEstimate, getTimeComparisons } from "@/lib/results/utils";
import BgGrid from "@/components/results/BgGrid";
import BottomNav from "@/components/results/BottomNav";

interface RevealScreenProps {
  hours: number;
  autoSkills: AchievementMilestone[];
  onPrev: () => void;
  onBuild: () => void;
}

export default function RevealScreen({
  hours,
  autoSkills,
  onPrev,
  onBuild,
}: RevealScreenProps) {
  const totalSpent = autoSkills.reduce((sum, skill) => sum + skill.hoursRequired, 0);
  const remaining = hours - totalSpent;
  const mastery = getMasteryEstimate(hours);
  const [focusSkill] = useState(
    () => FOCUS_SKILLS[Math.floor(Math.random() * FOCUS_SKILLS.length)]
  );
  const comparisons = useMemo(() => getTimeComparisons(hours), [hours]);

  const grouped = useMemo(() => {
    const groups = new Map<string, { color: string; skills: AchievementMilestone[] }>();
    for (const skill of autoSkills) {
      const stat = RESULT_STATS.find((item) => item.category === skill.category);
      const key = stat?.label ?? skill.category;
      const current = groups.get(key) ?? { color: stat?.color ?? "#ffcc00", skills: [] };
      current.skills.push(skill);
      groups.set(key, current);
    }
    return Array.from(groups.entries());
  }, [autoSkills]);

  const share = () => {
    const text = buildShareText(hours, autoSkills.length, remaining, mastery.percentile);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden" data-testid="results-reveal">
      <BgGrid />
      <div className="viewport-scroll relative z-10" tabIndex={0} aria-label="Alternate life reveal">
        <div className="viewport-frame flex flex-col gap-6 py-5 md:py-8">
          <div className="animate-fade-up text-center md:text-left">
            <p className="font-display text-[9px] tracking-[0.3em] text-accent glow-accent md:text-[10px]">
              WITH {formatNumber(hours)} HOURS YOU COULD HAVE
            </p>
          </div>

          <div className="retro-panel animate-fade-up delay-200 p-5 md:p-6" style={{ borderColor: "rgba(0, 255, 136, 0.15)" }}>
            <p className="font-display text-[8px] tracking-[0.2em] text-neon glow-neon md:text-[9px]">
              IF YOU FOCUSED ON ONE THING
            </p>
            <div className="mt-4 flex items-start gap-4">
              <span className="text-3xl md:text-4xl">{focusSkill.icon}</span>
              <div className="min-w-0">
                <p className="break-safe font-body text-lg font-bold leading-tight text-foreground md:text-xl">
                  {formatNumber(hours)} hours of {focusSkill.name}
                </p>
                <p className="mt-1 font-body text-sm readable-muted">would put you in the</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-end gap-3">
              <span className="font-display text-[clamp(2rem,6vw,3.5rem)] leading-none text-neon glow-neon">
                TOP {mastery.percentile}
              </span>
              <span className="pb-1 font-display text-[10px] tracking-[0.24em] text-foreground/75 md:text-[12px]">
                {mastery.label}
              </span>
            </div>
            <p className="mt-3 pretty-wrap font-body text-base text-foreground/75">
              {focusSkill.hook(hours)}
            </p>
            <p className="mt-2 font-body text-sm readable-muted">{mastery.description}</p>
          </div>

          <div className="animate-fade-up delay-300">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-accent/25" />
              <p className="font-display text-[9px] tracking-[0.3em] text-accent glow-accent md:text-[10px]">
                OR PUT ANOTHER WAY
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/25" />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
              {comparisons.map((c) => (
                <div key={c.label} className="retro-panel p-3 text-center">
                  <span className="text-xl">{c.icon}</span>
                  <p className="mt-1 font-display text-[clamp(1rem,2.5vw,1.5rem)] text-foreground/85">{c.value}</p>
                  <p className="font-display text-[7px] tracking-[0.2em] text-accent">{c.label}</p>
                  <p className="mt-1 font-body text-xs readable-muted">{c.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-fade-up delay-400">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-neon/25" />
              <p className="font-display text-[9px] tracking-[0.3em] text-neon glow-neon md:text-[10px]">
                OR ACQUIRE {autoSkills.length} DIFFERENT SKILLS
              </p>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-neon/25" />
            </div>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.8fr)] xl:items-start">
            <div className="space-y-4">
              {grouped.map(([label, group], index) => (
                <section key={label} className="animate-fade-up" style={{ animationDelay: `${150 + index * 80}ms` }} data-testid="reveal-skill-group">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-display text-[8px] tracking-[0.2em] md:text-[9px]" style={{ color: group.color }}>
                      {label.toUpperCase()}
                    </span>
                    <div className="h-px flex-1" style={{ background: `${group.color}20` }} />
                    <span className="font-display text-[7px] tabular-nums tracking-[0.2em] md:text-[8px]" style={{ color: `${group.color}90` }}>
                      {group.skills.length} SKILL{group.skills.length > 1 ? "S" : ""}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-[1px] bg-transparent md:grid-cols-2" style={{ background: `${group.color}08` }}>
                    {group.skills.map((skill) => (
                      <div key={skill.id} className="grid min-h-16 grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3 bg-[rgba(19,18,29,0.9)] px-3 py-2.5 md:px-4">
                        <span className="shrink-0 pt-0.5 text-base leading-none">{skill.icon}</span>
                        <span className="break-safe font-body text-sm leading-snug text-foreground/90 md:text-[15px]" data-testid="reveal-skill-title">
                          {skill.title}
                        </span>
                        <span className="shrink-0 pt-0.5 font-display text-[7px] tabular-nums tracking-[0.2em] md:text-[8px]" style={{ color: group.color }}>
                          {skill.hoursRequired}H
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="space-y-4">
              {remaining > 0 && (
                <div className="retro-panel animate-fade-up delay-500 p-5 text-center xl:text-left">
                  <p className="font-body text-sm readable-muted">And you&apos;d still have</p>
                  <p className="mt-2 font-display text-[clamp(1.75rem,5vw,2.8rem)] leading-none text-accent glow-accent">
                    {formatNumber(remaining)}H LEFT
                  </p>
                  <p className="mt-2 font-body text-sm readable-muted">
                    Another {(remaining / 24).toFixed(0)} days to spend somewhere else.
                  </p>
                </div>
              )}

              <button onClick={share} className="touch-action animate-fade-up delay-700 w-full border border-accent/40 bg-accent/15 px-5 py-3 font-display text-[8px] tracking-[0.24em] text-accent transition-all hover:border-accent/60 hover:bg-accent/25 active:scale-95 md:text-[9px]">
                SHARE ON X
              </button>
            </aside>
          </div>
        </div>
      </div>

      <BottomNav
        left={<button onClick={onPrev} data-testid="reveal-back-button" className="touch-action flex items-center gap-2 border border-white/15 bg-white/[0.06] px-4 py-2.5 font-display text-[8px] tracking-[0.24em] text-foreground/70 transition-all hover:border-white/25 hover:bg-white/[0.1] hover:text-foreground active:scale-95 md:text-[9px]"><span className="text-accent">{"<"}</span>BACK</button>}
        right={<button onClick={onBuild} data-testid="build-your-own-button" className="touch-action flex items-center gap-2 border border-white/20 bg-white/[0.06] px-5 py-2.5 font-display text-[8px] tracking-[0.22em] text-foreground/80 transition-all hover:border-white/30 hover:bg-white/[0.1] hover:text-foreground active:scale-95 md:text-[9px]">BUILD YOUR OWN<span className="text-accent">{">"}</span></button>}
      />
    </div>
  );
}
