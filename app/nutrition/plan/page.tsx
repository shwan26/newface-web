"use client";

import { useMemo, useState } from "react";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

const GOALS = ["Acne Control", "Glow", "Hydration", "Anti-aging"] as const;

export default function NutritionPlanPage() {
  const [goal, setGoal] = useState<(typeof GOALS)[number]>("Glow");

  const plan = useMemo(() => {
    switch (goal) {
      case "Acne Control":
        return {
          focus: ["Low-GI meals", "Omega-3", "Zinc foods", "Less sugary drinks"],
          foods: ["Salmon", "Pumpkin seeds", "Greek yogurt", "Leafy greens", "Berries"],
          avoid: ["Sugary snacks", "High-GI snacks", "Too much dairy (if triggers you)"],
        };
      case "Hydration":
        return {
          focus: ["Water-rich foods", "Electrolytes", "Healthy fats"],
          foods: ["Cucumber", "Watermelon", "Avocado", "Chia seeds", "Soup/broth"],
          avoid: ["Too much alcohol", "Very salty snacks"],
        };
      case "Anti-aging":
        return {
          focus: ["Antioxidants", "Protein", "Healthy fats"],
          foods: ["Blueberries", "Green tea", "Eggs", "Olive oil", "Tomatoes"],
          avoid: ["Ultra-processed foods", "Too much fried food"],
        };
      default:
        return {
          focus: ["Vitamin C foods", "Antioxidants", "Protein"],
          foods: ["Citrus", "Berries", "Bell peppers", "Eggs", "Nuts"],
          avoid: ["Excess sugary drinks"],
        };
    }
  }, [goal]);

  return (
    <>
      <Screen title="Nutrition Plan" subtitle="Personalized plan to support your skin goals.">
        <div className="flex flex-col gap-4 pb-24">
          <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold">Choose your focus</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  className="rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
                  style={{
                    background: goal === g ? "linear-gradient(90deg, var(--gold), var(--rose))" : "rgba(255,255,255,0.75)",
                    color: goal === g ? "white" : "var(--fg)",
                    borderColor: goal === g ? "transparent" : "var(--border)",
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold">Your plan for: {goal}</div>

            <div className="mt-3 rounded-2xl border p-3 text-sm" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}>
              <div className="font-semibold">Daily focus</div>
              <ul className="mt-2 text-xs list-disc pl-4" style={{ color: "var(--muted)" }}>
                {plan.focus.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}>
                <div className="text-xs font-semibold">Foods to add</div>
                <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  {plan.foods.join(", ")}
                </div>
              </div>

              <div className="rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}>
                <div className="text-xs font-semibold">Foods to limit</div>
                <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                  {plan.avoid.join(", ")}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border px-4 py-3 text-xs" style={{ borderColor: "var(--border)", background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))", color: "var(--muted)" }}>
            Tips are general guidance — adjust to allergies and personal triggers.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}