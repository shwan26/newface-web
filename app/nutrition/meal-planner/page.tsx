"use client";

import { useMemo, useState } from "react";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MEALS = {
  breakfast: ["Greek yogurt + berries", "Oats + banana + chia", "Eggs + toast + tomatoes", "Smoothie (spinach + berries)"],
  lunch: ["Salmon bowl + greens", "Chicken salad + olive oil", "Tofu stir fry + rice", "Tuna wrap + veggies"],
  dinner: ["Soup + avocado toast", "Lean protein + veggies", "Soba noodles + veg", "Shrimp + salad"],
};

export default function MealPlannerPage() {
  const [style, setStyle] = useState<"Balanced" | "Low sugar" | "High protein">("Balanced");

  const plan = useMemo(() => {
    function pick(arr: string[], i: number) {
      return arr[i % arr.length];
    }
    return DAYS.map((d, i) => ({
      day: d,
      breakfast: pick(MEALS.breakfast, i),
      lunch: pick(MEALS.lunch, i + 1),
      dinner: pick(MEALS.dinner, i + 2),
    }));
  }, [style]);

  return (
    <>
      <Screen title="Meal Planner" subtitle="Weekly plan assistant (prototype).">
        <div className="flex flex-col gap-4 pb-24">
          <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold">Choose plan style</div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {(["Balanced", "Low sugar", "High protein"] as const).map((x) => (
                <button
                  key={x}
                  onClick={() => setStyle(x)}
                  className="rounded-2xl border px-2 py-3 text-xs font-semibold"
                  style={{
                    background: style === x ? "linear-gradient(90deg, var(--gold), var(--rose))" : "rgba(255,255,255,0.75)",
                    color: style === x ? "white" : "var(--fg)",
                    borderColor: style === x ? "transparent" : "var(--border)",
                  }}
                >
                  {x}
                </button>
              ))}
            </div>
          </div>

          {plan.map((d) => (
            <div key={d.day} className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="text-sm font-semibold">{d.day}</div>
              <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                <div><span className="font-semibold" style={{ color: "var(--fg)" }}>Breakfast:</span> {d.breakfast}</div>
                <div className="mt-1"><span className="font-semibold" style={{ color: "var(--fg)" }}>Lunch:</span> {d.lunch}</div>
                <div className="mt-1"><span className="font-semibold" style={{ color: "var(--fg)" }}>Dinner:</span> {d.dinner}</div>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border px-4 py-3 text-xs" style={{ borderColor: "var(--border)", background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))", color: "var(--muted)" }}>
            Next step: connect this planner to your goals + groceries list.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}