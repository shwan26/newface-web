// app/home/_components/PlanGate.ts
export function normalizePlan(plan?: string) {
  const p = (plan ?? "Free plan").toLowerCase();
  const isFree = p.includes("free");
  const hasSkincare = p.includes("skincare") || p.includes("nutrition") || p.includes("gold");
  const hasNutrition = p.includes("nutrition") || p.includes("gold");
  const isGold = p.includes("gold");
  return { isFree, hasSkincare, hasNutrition, isGold };
}