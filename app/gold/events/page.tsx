"use client";

import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

const EVENTS = [
  { title: "Gold Skin Check Day", when: "Every month", where: "Partner Clinic", tag: "Consultation" },
  { title: "Aesthetic Workshop: Glow Routine", when: "Saturday 2pm", where: "Bangkok", tag: "Workshop" },
  { title: "Nutrition x Skin Live Q&A", when: "Friday 7pm", where: "Online", tag: "Live" },
];

export default function GoldEventsPage() {
  return (
    <>
      <Screen title="Gold Events" subtitle="Premium events & routines curated monthly.">
        <div className="flex flex-col gap-3 pb-24">
          {EVENTS.map((e) => (
            <div key={e.title} className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold">{e.title}</div>
                  <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                    {e.when} · {e.where}
                  </div>
                </div>
                <span
                  className="rounded-full border px-2 py-1 text-xs font-semibold"
                  style={{ background: "linear-gradient(90deg, rgba(232,166,187,0.14), rgba(200,162,74,0.10))", borderColor: "var(--border)" }}
                >
                  {e.tag}
                </span>
              </div>

              <button
                className="mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
                style={{ background: "linear-gradient(90deg, var(--gold), var(--rose))" }}
              >
                RSVP (prototype)
              </button>
            </div>
          ))}

          <div className="rounded-2xl border px-4 py-3 text-xs" style={{ borderColor: "var(--border)", background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))", color: "var(--muted)" }}>
            Next step: connect events to partner calendar + ticketing.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}