import { ACHIEVEMENTS } from "@/lib/achievements-data";
import type { AchievementMilestone } from "@/lib/achievements-data";
import { formatNumber } from "@/lib/formatting";

export interface MasteryEstimate {
  percentile: string;
  label: string;
  description: string;
}

export function greedyRandomFill(hours: number): AchievementMilestone[] {
  let budget = hours;
  const picked: AchievementMilestone[] = [];
  const pickedIds = new Set<string>();
  const shuffled = [...ACHIEVEMENTS].sort(() => Math.random() - 0.5);

  for (const achievement of shuffled) {
    if (budget < achievement.hoursRequired || pickedIds.has(achievement.id)) {
      continue;
    }

    picked.push(achievement);
    pickedIds.add(achievement.id);
    budget -= achievement.hoursRequired;
  }

  return picked;
}

export function getMasteryEstimate(hours: number): MasteryEstimate {
  if (hours >= 10000) return { percentile: "0.1%", label: "WORLD CLASS", description: "You'd be among the best in the world. 10,000+ hours is elite mastery." };
  if (hours >= 5000) return { percentile: "1%", label: "EXPERT", description: "Top 1% — you'd be better than 99 out of 100 people who ever tried." };
  if (hours >= 3000) return { percentile: "2%", label: "HIGHLY SKILLED", description: "Professional-level ability. People would pay for your expertise." };
  if (hours >= 2000) return { percentile: "5%", label: "ADVANCED", description: "Years ahead of most. You'd teach classes on this." };
  if (hours >= 1000) return { percentile: "10%", label: "PROFICIENT", description: "Solidly skilled. You'd impress anyone watching." };
  if (hours >= 500) return { percentile: "15%", label: "COMPETENT", description: "Beyond the basics. Real, noticeable ability." };
  if (hours >= 200) return { percentile: "25%", label: "CAPABLE", description: "Past the beginner stage. You'd surprise yourself." };
  return { percentile: "30%", label: "STARTED", description: "Enough to build real foundations in any skill." };
}

export function buildShareText(
  hours: number,
  skillCount: number,
  remaining: number,
  percentile: string
): string {
  return `I spent ${formatNumber(hours)} hours gaming.\n\nThat's enough to learn ${skillCount} real-world skills — and still have ${formatNumber(Math.max(0, remaining))}h left over.\n\nOr I'd be in the top ${percentile} at any single skill.\n\nWhat would YOUR hours buy?`;
}
