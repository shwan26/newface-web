"use client";

import { useRouter } from "next/navigation";

export default function SkincareSection({
  skinType,
  concerns,
  onOpenScanner,
}: {
  skinType?: string | null;
  concerns?: string[] | null;
  onOpenScanner?: () => void; // optional hook if you later add a modal
}) {
  const router = useRouter();

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="text-sm font-semibold">Skincare Package tools</div>
      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
        Personalized routine, ingredient scan, and progress rewards.
      </div>

      <div className="mt-3 rounded-2xl border p-3 text-sm"
        style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
      >
        <div className="font-semibold">Your routine summary</div>
        <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
          {skinType ? `${skinType} skin` : "Skin type not set"}
          {concerns?.length ? ` · ${concerns.join(", ")}` : ""}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {/* Ingredient scanner */}
        <div
          className="rounded-2xl border px-3 py-3"
          style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
        >
          <div className="text-xs font-semibold">Ingredient scanner</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Scan a label to flag irritants + actives for your skin.
          </div>
          <button
            onClick={() => (onOpenScanner ? onOpenScanner() : router.push("/scanner"))}
            className="mt-2 w-full rounded-xl px-3 py-2 text-[11px] font-semibold text-white"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--rose))" }}
          >
            Scan ingredients
          </button>
        </div>

        {/* Progress + streak */}
        <div
          className="rounded-2xl border px-3 py-3"
          style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
        >
          <div className="text-xs font-semibold">Progress & streak rewards</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Track completion and earn streak badges.
          </div>
          <div
            className="mt-2 rounded-xl border px-2 py-1 text-[11px] font-semibold"
            style={{
              borderColor: "rgba(200,162,74,0.3)",
              color: "var(--gold)",
              background: "rgba(200,162,74,0.08)",
            }}
          >
            Streak tracking active
          </div>
        </div>
      </div>

      <div
        className="mt-3 rounded-2xl border p-3 text-xs"
        style={{
          background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.08))",
          borderColor: "rgba(200,162,74,0.22)",
          color: "var(--muted)",
        }}
      >
        Partner product recommendations will adapt to your concerns automatically.
      </div>
    </div>
  );
}