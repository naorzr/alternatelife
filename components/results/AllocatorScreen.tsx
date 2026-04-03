import type { AchievementCategory, AchievementMilestone } from "@/lib/achievements-data";
import type { ResultStat } from "@/lib/results/stats";
import SkillConstellation from "@/components/SkillConstellation";
import SkillTreeBar from "@/components/SkillTreeBar";
import BgGrid from "@/components/results/BgGrid";

interface AllocatorScreenProps {
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
  stats: ResultStat[];
  catMaxes: Record<string, number>;
  byCategory: Record<AchievementCategory, AchievementMilestone[]>;
}

export default function AllocatorScreen({
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
  stats,
  catMaxes,
  byCategory,
}: AllocatorScreenProps) {
  const budgetPct = Math.max(0, (remaining / hours) * 100);
  const budgetColor = remaining < hours * 0.1 ? "#ff3333" : remaining < hours * 0.3 ? "#ff9933" : "#ffcc00";
  const currentStat = stats.find((stat) => stat.key === selectedStat) ?? stats[0];
  const currentSkills = byCategory[currentStat.category] ?? [];
  const currentLevel = catCounts[currentStat.category] ?? 0;
  const currentMax = catMaxes[currentStat.category] ?? 0;
  const canLevelUp = currentSkills.some((skill) => !unlockedIds.has(skill.id) && skill.hoursRequired <= remaining);

  return (
    <div className="relative flex h-dvh flex-col overflow-hidden" data-testid="results-allocator">
      <BgGrid />
      <div className="z-40 shrink-0 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="viewport-frame flex flex-col gap-2 py-2 md:py-3">
          <div className="flex items-center justify-between gap-2">
            <button onClick={onPrev} data-testid="allocator-back-button" className="touch-action inline-flex items-center gap-1.5 border border-white/15 bg-white/[0.06] px-3 py-1.5 font-display text-[7px] tracking-[0.22em] text-foreground/70 transition-all hover:bg-white/[0.1] hover:text-foreground active:scale-95 md:py-2 md:text-[8px]"><span className="text-accent">{"<"}</span>BACK</button>
            <div className="flex items-center gap-2">
              <button onClick={randomAll} data-testid="allocator-random" className="touch-action border border-accent/25 bg-accent/10 px-3 py-1.5 font-display text-[7px] tracking-[0.22em] text-accent transition-all hover:border-accent/40 hover:bg-accent/20 active:scale-95 md:py-2 md:text-[8px]">RNG FILL</button>
              <button onClick={clearAll} disabled={unlocked.length === 0} data-testid="allocator-reset" className="touch-action border border-white/15 bg-white/[0.06] px-3 py-1.5 font-display text-[7px] tracking-[0.22em] text-foreground/60 transition-all hover:border-white/25 hover:text-foreground active:scale-95 disabled:cursor-not-allowed disabled:opacity-25 md:py-2 md:text-[8px]">RESET</button>
            </div>
          </div>

          <div className="retro-panel flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 md:px-4 md:py-3">
            <div className="flex items-baseline gap-2 min-w-0">
              <p className="font-display text-[clamp(1.1rem,3vw,1.9rem)] tabular-nums" data-testid="remaining-hours" style={{ color: budgetColor, textShadow: `0 0 8px ${budgetColor}40` }}>
                {Math.max(0, Math.round(remaining)).toLocaleString("en-US")}
              </p>
              <p className="font-body text-xs readable-muted shrink-0">/ {hours.toLocaleString("en-US")}H</p>
            </div>

            <div className="flex gap-[2px] flex-1 min-w-[120px]" data-testid="allocator-budget-bar">
              {Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="h-2.5 md:h-3 min-w-0 flex-1 transition-colors duration-300" style={{ background: index < Math.round((budgetPct / 100) * 20) ? budgetColor : "rgba(255, 255, 255, 0.08)" }} />
              ))}
            </div>

            <span className="font-display text-[9px] tabular-nums text-muted/65 md:text-[10px]">
              <span className="text-neon" data-testid="unlocked-count" style={{ textShadow: "0 0 6px rgba(0,255,136,0.3)" }}>{unlocked.length}</span> SKILLS
            </span>
          </div>
        </div>
      </div>

      <div className="viewport-scroll relative z-10" tabIndex={0} aria-label="Build your own alternate life">
        <div className="viewport-frame safe-pad-bottom py-4 md:py-6">
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
            canLevelUp={canLevelUp}
          />
        </div>
      </div>

      <SkillTreeBar stats={stats} selectedKey={selectedStat} catCounts={catCounts} catMaxes={catMaxes} onSelect={setSelectedStat} />
    </div>
  );
}
