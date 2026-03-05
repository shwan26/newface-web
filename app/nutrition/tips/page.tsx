"use client";

import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

export default function NutritionTipsPage() {
  const tips = [
    { title: "Acne & sugar spikes", body: "High-GI snacks can worsen breakouts for some people. Try balancing meals with protein + fiber." },
    { title: "Dairy sensitivity", body: "Some notice acne flare-ups with certain dairy products. If you suspect it, test reducing for 2–3 weeks." },
    { title: "Omega-3 support", body: "Fatty fish, flax, and chia may help reduce inflammation and support the skin barrier." },
    { title: "Vitamin C + antioxidants", body: "Citrus, berries, and peppers support collagen and reduce oxidative stress." },
    { title: "Hydration basics", body: "Hydration affects glow and dryness. Consistent water + electrolyte balance helps." },
  ];

  return (
    <>
      <Screen title="Skin-Food Tips" subtitle="Understand how diet can affect skin.">
        <div className="flex flex-col gap-3 pb-24">
          {tips.map((t) => (
            <div key={t.title} className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="text-sm font-semibold">{t.title}</div>
              <div className="text-xs mt-1" style={{ color: "var(--muted)", lineHeight: 1.6 }}>
                {t.body}
              </div>
            </div>
          ))}

          <div className="rounded-2xl border px-4 py-3 text-xs" style={{ borderColor: "var(--border)", background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))", color: "var(--muted)" }}>
            Keep a simple diary: food + sleep + stress + skin changes. Patterns show up fast.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}