import { ACHIEVEMENTS } from "@/lib/achievements-data";
import type {
  AchievementCategory,
  AchievementMilestone,
} from "@/lib/achievements-data";

export interface ResultStat {
  key: string;
  label: string;
  desc: string;
  category: AchievementCategory;
  color: string;
}

export const RESULT_STATS: ResultStat[] = [
  { key: "str", label: "Strength", desc: "Physical fitness, gym, combat sports", category: "fitness", color: "#ff3333" },
  { key: "dex", label: "Dexterity", desc: "Hands-on skills, crafts, instruments", category: "skills", color: "#3399ff" },
  { key: "int", label: "Intelligence", desc: "Languages, science, deep knowledge", category: "education", color: "#cc44ff" },
  { key: "wis", label: "Wisdom", desc: "Career, business, making money", category: "career", color: "#33ff66" },
  { key: "cha", label: "Charisma", desc: "Social skills, dating, community", category: "social", color: "#ff3399" },
  { key: "cre", label: "Creativity", desc: "Art, music, cooking, design", category: "creative", color: "#ff9933" },
  { key: "end", label: "Endurance", desc: "Adventure, travel, extreme sports", category: "adventure", color: "#00cccc" },
];

const grouped = {} as Record<AchievementCategory, AchievementMilestone[]>;
for (const achievement of ACHIEVEMENTS) {
  (grouped[achievement.category] ??= []).push(achievement);
}

export const ACHIEVEMENTS_BY_CATEGORY = grouped;

export const CATEGORY_MAXES = RESULT_STATS.reduce<Record<string, number>>(
  (maxes, stat) => {
    maxes[stat.category] = ACHIEVEMENTS_BY_CATEGORY[stat.category]?.length ?? 0;
    return maxes;
  },
  {}
);
