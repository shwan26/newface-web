"use client";

import { useRouter } from "next/navigation";

export default function GoldSection() {
  const router = useRouter();

  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        background: "linear-gradient(135deg, rgba(200,162,74,0.10), rgba(232,166,187,0.10))",
        borderColor: "rgba(200,162,74,0.25)",
      }}
    >
      <div className="text-sm font-semibold">Gold Package perks</div>
      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
        All features + monthly clinic consultation + exclusive discounts + events.
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.78)", borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold">1-on-1 expert consultation</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Book a monthly appointment with partner aesthetic clinic.
          </div>
          <button
            onClick={() => router.push("/gold/consultation")}
            className="mt-2 w-full rounded-xl px-3 py-2 text-[11px] font-semibold text-white"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--rose))" }}
          >
            Book appointment
          </button>
        </div>

        <div className="rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.78)", borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold">Exclusive partner discounts</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Special codes + offers from partner brands.
          </div>
          <button
            onClick={() => router.push("/gold/discounts")}
            className="mt-2 w-full rounded-xl px-3 py-2 text-[11px] font-semibold"
            style={{ background: "rgba(255,255,255,0.9)", border: "1px solid var(--border)", color: "var(--fg)" }}
          >
            View discounts
          </button>
        </div>

        <div className="rounded-2xl border p-3 col-span-2" style={{ background: "rgba(255,255,255,0.78)", borderColor: "var(--border)" }}>
          <div className="text-xs font-semibold">Lifestyle & aesthetic routines + events</div>
          <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
            Premium routines and partner events curated monthly.
          </div>
          <button
            onClick={() => router.push("/gold/events")}
            className="mt-2 w-full rounded-xl px-3 py-2 text-[11px] font-semibold text-white"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--rose))" }}
          >
            Explore events
          </button>
        </div>
      </div>
    </div>
  );
}