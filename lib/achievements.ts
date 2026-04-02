import { ACHIEVEMENTS, type AchievementMilestone } from "./achievements-data";

export interface BudgetItem {
  milestone: AchievementMilestone;
  hoursSpent: number;
  budgetRemaining: number;
}

export interface BudgetResult {
  totalHours: number;
  items: BudgetItem[];
  hoursRemaining: number;
  totalItemsBought: number;
}

/**
 * "Shop" with your gaming hours — greedily pick achievements
 * from most expensive to least, fitting as many as possible.
 * This shows the maximum number of real things you could've done.
 */
export function calculateBudget(totalMinutes: number): BudgetResult {
  const totalHours = totalMinutes / 60;
  let remaining = totalHours;

  // Sort by hours descending — buy the big stuff first
  const sorted = [...ACHIEVEMENTS].sort(
    (a, b) => b.hoursRequired - a.hoursRequired
  );

  const items: BudgetItem[] = [];

  for (const milestone of sorted) {
    if (remaining >= milestone.hoursRequired) {
      remaining -= milestone.hoursRequired;
      items.push({
        milestone,
        hoursSpent: milestone.hoursRequired,
        budgetRemaining: Math.round(remaining),
      });
    }
  }

  return {
    totalHours,
    items,
    hoursRemaining: Math.round(remaining),
    totalItemsBought: items.length,
  };
}

/**
 * Get top N most impactful items for the share card
 */
export function getTopRoasts(budget: BudgetResult, count: number = 5): BudgetItem[] {
  return budget.items.slice(0, count);
}
