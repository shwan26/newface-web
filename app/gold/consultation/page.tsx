"use client";

import { useMemo, useState } from "react";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

const CLINICS = ["Glow Clinic Phuket", "Aesthetic Partner Bangkok", "SkinLab Premium"] as const;
const TIMES = ["10:00", "11:30", "13:00", "15:00", "17:00"] as const;

export default function ConsultationPage() {
  const [clinic, setClinic] = useState<(typeof CLINICS)[number]>("Glow Clinic Phuket");
  const [date, setDate] = useState("");
  const [time, setTime] = useState<(typeof TIMES)[number]>("13:00");
  const [note, setNote] = useState("");
  const [booked, setBooked] = useState(false);

  const canBook = useMemo(() => !!date, [date]);

  return (
    <>
      <Screen title="Expert Consultation" subtitle="Gold perk: monthly 1-on-1 appointment (prototype booking).">
        <div className="flex flex-col gap-4 pb-24">
          <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold">Book an appointment</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Prototype only — no real booking is sent.
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <div className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Clinic</div>
              <div className="grid grid-cols-1 gap-2">
                {CLINICS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setClinic(c)}
                    className="rounded-2xl border px-4 py-3 text-sm font-semibold text-left"
                    style={{
                      background: clinic === c ? "linear-gradient(90deg, var(--gold), var(--rose))" : "rgba(255,255,255,0.75)",
                      color: clinic === c ? "white" : "var(--fg)",
                      borderColor: clinic === c ? "transparent" : "var(--border)",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Date</div>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2 w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Time</div>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value as any)}
                    className="mt-2 w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  >
                    {TIMES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-2">
                <div className="text-xs font-semibold" style={{ color: "var(--muted)" }}>Note for the clinic (optional)</div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-2 w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  placeholder="Example: acne flare-up on cheeks, sensitive to fragrance…"
                />
              </div>

              <button
                disabled={!canBook}
                onClick={() => setBooked(true)}
                className="mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
                style={{ background: "linear-gradient(90deg, var(--gold), var(--rose))" }}
              >
                {booked ? "Booked (prototype) ✅" : "Confirm booking"}
              </button>

              {booked && (
                <div className="mt-2 rounded-2xl border p-3 text-xs" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)", color: "var(--muted)" }}>
                  Booking saved (prototype): <b style={{ color: "var(--fg)" }}>{clinic}</b> on <b style={{ color: "var(--fg)" }}>{date}</b> at <b style={{ color: "var(--fg)" }}>{time}</b>.
                </div>
              )}
            </div>
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}