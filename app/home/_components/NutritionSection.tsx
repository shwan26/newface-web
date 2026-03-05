"use client";

import { useRouter } from "next/navigation";

export default function NutritionSection() {
  const router = useRouter();

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="text-sm font-semibold">Nutrition Package tools</div>
      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
        Nutrition plan + skin-food connection + hydration & supplements.
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold">Personalized nutrition plan</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Food suggestions based on your skin goals.
          </div>
          <button
            onClick={() => router.push("/nutrition/plan")}
            className="mt-2 w-full rounded-xl px-3 py-2 text-[11px] font-semibold text-white"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--rose))" }}
          >
            View my plan
          </button>
        </div>

        <div className="rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold">Skin-food connection tips</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Learn triggers and supportive nutrients.
          </div>
          <button
            onClick={() => router.push("/nutrition/tips")}
            className="mt-2 w-full rounded-xl px-3 py-2 text-[11px] font-semibold"
            style={{ background: "rgba(255,255,255,0.85)", border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            Read tips
          </button>
        </div>

        <div className="rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold">Hydration & supplements</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Daily water goals + supplement guide.
          </div>
          <button
            onClick={() => router.push("/nutrition/hydration")}
            className="mt-2 w-full rounded-xl px-3 py-2 text-[11px] font-semibold"
            style={{ background: "rgba(255,255,255,0.85)", border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            Open guide
          </button>
        </div>

        <div className="rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold">Weekly meal planning assistant</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Auto-generate weekly meal plans.
          </div>
          <button
            onClick={() => router.push("/nutrition/meal-planner")}
            className="mt-2 w-full rounded-xl px-3 py-2 text-[11px] font-semibold text-white"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--rose))" }}
          >
            Plan this week
          </button>
        </div>
      </div>
    </div>
  );
}