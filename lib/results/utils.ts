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
  if (hours >= 10000) return { percentile: "0.1%", label: "WORLD CLASS", description: "10,000+ hours. People dedicate entire lives and don't always get here." };
  if (hours >= 5000) return { percentile: "1%", label: "EXPERT", description: "Better than 99 out of 100 people who ever tried. Not a typo." };
  if (hours >= 3000) return { percentile: "2%", label: "HIGHLY SKILLED", description: "Good enough that people would pay you for it." };
  if (hours >= 2000) return { percentile: "5%", label: "ADVANCED", description: "Years ahead of most. Teaching-level, not student-level." };
  if (hours >= 1000) return { percentile: "10%", label: "PROFICIENT", description: "The kind of skilled where people stop and watch." };
  if (hours >= 500) return { percentile: "15%", label: "COMPETENT", description: "Not beginner luck, not natural talent. Earned." };
  if (hours >= 200) return { percentile: "25%", label: "CAPABLE", description: "Past the awkward phase. Enough to surprise yourself." };
  return { percentile: "30%", label: "STARTED", description: "The boring-but-important foundations most people skip." };
}

export function buildShareText(
  hours: number,
  skillCount: number,
  remaining: number,
  percentile: string
): string {
  return `I spent ${formatNumber(hours)} hours gaming.\n\n${skillCount} real-world skills with ${formatNumber(Math.max(0, remaining))}h to spare.\n\nOr top ${percentile} at any single skill.\n\nWhat would yours look like?`;
}
