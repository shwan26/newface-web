"use client";

import { useEffect, useState } from "react";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

const KEY = "newface.hydration.v1";

export default function HydrationGuidePage() {
  const [goal, setGoal] = useState(2000); // ml
  const [today, setToday] = useState(0);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setGoal(parsed.goal ?? 2000);
        setToday(parsed.today ?? 0);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify({ goal, today }));
  }, [goal, today]);

  const pct = Math.min(100, Math.round((today / goal) * 100));

  return (
    <>
      <Screen title="Hydration & Supplements" subtitle="Simple daily water tracking + supplement guidance.">
        <div className="flex flex-col gap-4 pb-24">
          <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Water goal</div>
              <div className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                {pct}% today
              </div>
            </div>

            <div className="mt-3 h-2 w-full rounded-full border" style={{ background: "rgba(21,19,22,0.04)", borderColor: "rgba(21,19,22,0.06)" }}>
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--gold), var(--rose))" }} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => setToday((t) => Math.max(0, t - 250))}
                className="rounded-2xl border px-3 py-3 text-sm font-semibold"
                style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
              >
                -250 ml
              </button>
              <button
                onClick={() => setToday((t) => t + 250)}
                className="rounded-2xl px-3 py-3 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(90deg, var(--gold), var(--rose))" }}
              >
                +250 ml
              </button>
            </div>

            <div className="mt-3 text-xs" style={{ color: "var(--muted)" }}>
              Today: <span style={{ color: "var(--fg)", fontWeight: 600 }}>{today} ml</span> / {goal} ml
            </div>

            <div className="mt-3">
              <div className="text-xs font-semibold" style={{ color: "var(--muted)" }}>
                Set goal (ml)
              </div>
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(Number(e.target.value || 0))}
                className="mt-2 w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
              />
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold">Supplement guide (prototype)</div>
            <div className="text-xs mt-2" style={{ color: "var(--muted)", lineHeight: 1.6 }}>
              Common skin-related supplements people ask about:
              <ul className="list-disc pl-4 mt-2">
                <li>Zinc (acne support)</li>
                <li>Omega-3 (inflammation support)</li>
                <li>Vitamin D (if deficient)</li>
                <li>Collagen peptides (elasticity support)</li>
              </ul>
              Always check allergies/conditions and consult a professional if unsure.
            </div>
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}