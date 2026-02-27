"use client";

import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

const DISCOUNTS = [
  { brand: "CeraVe", code: "NEWFACE10", off: "10% off", note: "Selected cleansers & moisturizers" },
  { brand: "La Roche-Posay", code: "GOLD15", off: "15% off", note: "Sensitive skin range" },
  { brand: "Cosrx", code: "GLOW20", off: "20% off", note: "Essences + serums" },
];

export default function GoldDiscountsPage() {
  return (
    <>
      <Screen title="Exclusive Discounts" subtitle="Gold perk: partner-only deals (prototype).">
        <div className="flex flex-col gap-3 pb-24">
          {DISCOUNTS.map((d) => (
            <div key={d.code} className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{d.brand}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>{d.note}</div>
                </div>
                <span
                  className="rounded-full border px-2 py-1 text-xs font-semibold"
                  style={{ background: "linear-gradient(90deg, rgba(200,162,74,0.12), rgba(232,166,187,0.14))", borderColor: "var(--border)" }}
                >
                  {d.off}
                </span>
              </div>

              <div className="mt-3 rounded-2xl border px-3 py-3 text-sm font-semibold flex items-center justify-between"
                style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
              >
                <span>Code: {d.code}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(d.code)}
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{ background: "rgba(255,255,255,0.85)", borderColor: "var(--border)" }}
                >
                  Copy
                </button>
              </div>
            </div>
          ))}

          <div className="rounded-2xl border px-4 py-3 text-xs" style={{ borderColor: "var(--border)", background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))", color: "var(--muted)" }}>
            Codes are prototype examples — connect these to real partner integrations later.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}