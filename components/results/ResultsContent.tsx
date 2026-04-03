"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type { AchievementCategory, AchievementMilestone } from "@/lib/achievements-data";
import type { ParsedResultsParams } from "@/lib/results/search";
import {
  ACHIEVEMENTS_BY_CATEGORY,
  CATEGORY_MAXES,
  RESULT_STATS,
} from "@/lib/results/stats";
import { greedyRandomFill } from "@/lib/results/utils";
import BgGrid from "@/components/results/BgGrid";
import AllocatorScreen from "@/components/results/AllocatorScreen";
import BreakdownScreen from "@/components/results/BreakdownScreen";
import RevealScreen from "@/components/results/RevealScreen";

interface ResultsContentProps {
  initialResults: ParsedResultsParams;
}

export default function ResultsContent({ initialResults }: ResultsContentProps) {
  const { hours, gameCount, source, topGames } = initialResults;

  const autoSkills = useMemo(() => greedyRandomFill(hours), [hours]);
  const [screen, setScreen] = useState(0);
  const [unlocked, setUnlocked] = useState<AchievementMilestone[]>([]);
  const [lastAdded, setLastAdded] = useState<string | null>(null);
  const [selectedStat, setSelectedStat] = useState("str");

  const unlockedIds = useMemo(() => new Set(unlocked.map((skill) => skill.id)), [unlocked]);
  const remaining = hours - unlocked.reduce((sum, skill) => sum + skill.hoursRequired, 0);
  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const skill of unlocked) counts[skill.category] = (counts[skill.category] ?? 0) + 1;
    return counts;
  }, [unlocked]);

  const toggleSkill = useCallback((skill: AchievementMilestone) => {
    if (unlockedIds.has(skill.id)) {
      setUnlocked((current) => current.filter((item) => item.id !== skill.id));
      return;
    }
    if (skill.hoursRequired > remaining) return;
    setUnlocked((current) => [...current, skill]);
    setLastAdded(skill.id);
  }, [remaining, unlockedIds]);

  const addRandomFromCategory = useCallback((category: AchievementCategory) => {
    const pool = ACHIEVEMENTS_BY_CATEGORY[category].filter(
      (skill) => !unlockedIds.has(skill.id) && skill.hoursRequired <= remaining
    );
    if (!pool.length) return;
    const pick = pool[Math.floor(Math.random() * pool.length)];
    setUnlocked((current) => [...current, pick]);
    setLastAdded(pick.id);
  }, [remaining, unlockedIds]);

  if (hours < 1) return <ResultsErrorState />;

  return (
    <div className="overflow-hidden">
      {screen === 0 && <BreakdownScreen hours={hours} gameCount={gameCount} source={source} topGames={topGames} onNext={() => setScreen(1)} />}
      {screen === 1 && <RevealScreen hours={hours} autoSkills={autoSkills} onPrev={() => setScreen(0)} onBuild={() => setScreen(2)} />}
      {screen === 2 && (
        <AllocatorScreen
          hours={hours}
          unlocked={unlocked}
          unlockedIds={unlockedIds}
          remaining={remaining}
          catCounts={catCounts}
          selectedStat={selectedStat}
          setSelectedStat={setSelectedStat}
          toggleSkill={toggleSkill}
          addRandomFromCategory={addRandomFromCategory}
          randomAll={() => { setUnlocked(greedyRandomFill(hours)); setLastAdded(null); }}
          clearAll={() => { setUnlocked([]); setLastAdded(null); }}
          lastAdded={lastAdded}
          onPrev={() => setScreen(1)}
          stats={RESULT_STATS}
          catMaxes={CATEGORY_MAXES}
          byCategory={ACHIEVEMENTS_BY_CATEGORY}
        />
      )}
    </div>
  );
}

function ResultsErrorState() {
  return (
    <div className="viewport-shell items-center justify-center px-6 text-center">
      <BgGrid />
      <div className="relative z-10 max-w-md">
        <p className="mb-6 font-display text-[12px] text-pink glow-text">ERROR</p>
        <p className="mb-3 font-body text-xl font-bold text-foreground">NO HOURS TO SPEND</p>
        <p className="mb-8 font-body text-base readable-muted">
          Nothing to work with here. Head to the start and drop in your hours or Steam profile.
        </p>
        <Link href="/" className="touch-action inline-flex bg-accent px-6 py-3 font-display text-[10px] tracking-[0.24em] text-background transition-colors hover:bg-[#e6c200]">
          {"<<"} GO BACK
        </Link>
      </div>
    </div>
  );
}
