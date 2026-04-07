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
  if (hours >= 10000) return { percentile: "0.1%", label: "WORLD CLASS", description: "10,000 hours of anything. That's a full career of practice." };
  if (hours >= 5000) return { percentile: "1%", label: "EXPERT", description: "Better than 99 out of 100 people who ever picked this up." };
  if (hours >= 3000) return { percentile: "2%", label: "HIGHLY SKILLED", description: "Good enough that strangers would pay you for it." };
  if (hours >= 2000) return { percentile: "5%", label: "ADVANCED", description: "Years ahead of most. You could teach a class on this." };
  if (hours >= 1000) return { percentile: "10%", label: "PROFICIENT", description: "Good enough that people stop what they're doing to watch." };
  if (hours >= 500) return { percentile: "15%", label: "COMPETENT", description: "You know what you're doing and it shows." };
  if (hours >= 200) return { percentile: "25%", label: "CAPABLE", description: "Past the awkward phase. Starting to surprise yourself." };
  return { percentile: "30%", label: "STARTED", description: "Early days, but you showed up. Most people never do." };
}

export interface TimeComparison {
  icon: string;
  value: string;
  label: string;
  detail: string;
}

export function getTimeComparisons(hours: number): TimeComparison[] {
  const items: TimeComparison[] = [];

  const earned = Math.round(hours * 35);
  items.push({ icon: "💰", value: `$${formatNumber(earned)}`, label: "EARNED", detail: "freelancing at $35/hr" });

  const books = Math.floor(hours / 7);
  if (books >= 1) items.push({ icon: "📚", value: formatNumber(books), label: "BOOKS READ", detail: "cover to cover" });

  const countries = Math.floor(hours / 72);
  if (countries >= 1) {
    const detail = countries >= 195 ? "every country on Earth" : "spending 3 days each";
    items.push({ icon: "🌍", value: formatNumber(countries), label: countries === 1 ? "COUNTRY VISITED" : "COUNTRIES VISITED", detail });
  }

  const gymMonths = Math.floor(hours / 30);
  if (gymMonths >= 1) {
    const gymYears = Math.floor(hours / 365);
    if (gymYears >= 1) {
      items.push({ icon: "🏋️", value: String(gymYears), label: gymYears === 1 ? "YEAR" : "YEARS", detail: "of daily workouts" });
    } else {
      items.push({ icon: "🏋️", value: String(gymMonths), label: gymMonths === 1 ? "MONTH" : "MONTHS", detail: "of daily workouts" });
    }
  }

  const langs = Math.floor(hours / 600);
  if (langs >= 1) items.push({ icon: "🗣️", value: String(langs), label: langs === 1 ? "LANGUAGE" : "LANGUAGES", detail: "to conversational fluency" });

  const careers = Math.floor(hours / 1000);
  if (careers >= 1) items.push({ icon: "💻", value: String(careers), label: careers === 1 ? "NEW CAREER" : "NEW CAREERS", detail: "from zero to job-ready" });

  const instruments = Math.floor(hours / 2000);
  if (instruments >= 1) items.push({ icon: "🎵", value: String(instruments), label: instruments === 1 ? "INSTRUMENT" : "INSTRUMENTS", detail: "to performance level" });

  const degrees = Math.floor(hours / 1800);
  if (degrees >= 1) items.push({ icon: "🎓", value: String(degrees), label: degrees === 1 ? "DEGREE" : "DEGREES", detail: "worth of college study" });

  return items.slice(0, 8);
}

export function buildShareText(
  hours: number,
  skillCount: number,
  remaining: number,
  percentile: string
): string {
  return `I spent ${formatNumber(hours)} hours gaming.\n\n${skillCount} real-world skills with ${formatNumber(Math.max(0, remaining))}h to spare.\n\nOr top ${percentile} at any single skill.\n\nWhat would yours look like?`;
}
