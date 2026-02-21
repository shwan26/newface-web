import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import { lifestyleRoutines, partnerPicks, routineToday } from "../../lib/data"

export default function HomePage() {
  const completed = routineToday.filter((x) => x.done).length;
  const total = routineToday.length;
  const progress = Math.round((completed / total) * 100);

  return (
    <>
      <Screen title="Home" subtitle="Your profile + partner picks + today’s progress.">
        <div className="flex flex-col gap-4">
          {/* User summary card */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-lg font-semibold">Welcome, Tulip!</div>
                <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                  Quick profile improves your routine accuracy.
                </div>
              </div>

              <button
                className="rounded-full border px-3 py-1 text-xs font-semibold"
                style={{
                  background: "linear-gradient(90deg, rgba(200,162,74,0.12), rgba(232,166,187,0.14))",
                  borderColor: "var(--border)",
                }}
              >
                Edit
              </button>
            </div>

            <div
              className="mt-3 rounded-xl border p-3 text-sm"
              style={{
                background: "rgba(255,255,255,0.70)",
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
            >
              <div><span className="font-semibold">Skin Type:</span> Combination</div>
              <div><span className="font-semibold">Concerns:</span> Acne, Dry patches</div>
              <div><span className="font-semibold">Package:</span> Free plan</div>
            </div>
          </div>

          {/* Partner recommendations (B2B) */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold">Recommend for you</h2>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                B2B: Sponsored / Partner picks
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {partnerPicks.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border p-2"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  {/* Image placeholder (swap to real images later) */}
                  <div
                    className="aspect-square rounded-xl border"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(232,166,187,0.18), rgba(200,162,74,0.10))",
                      borderColor: "rgba(21,19,22,0.08)",
                    }}
                  />
                  <div className="mt-2 text-xs font-semibold leading-tight">{p.brand}</div>
                  <div className="text-[11px] leading-tight" style={{ color: "var(--muted)" }}>
                    {p.name}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-1">
                    <span
                      className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                      style={{
                        background: "rgba(255,255,255,0.75)",
                        borderColor: "var(--border)",
                      }}
                    >
                      {p.tag}
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                      {p.note}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress / routine checklist */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
            }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Check your routine</h2>
              <span
                className="rounded-full border px-2 py-1 text-xs font-semibold"
                style={{
                  background: "linear-gradient(90deg, rgba(200,162,74,0.12), rgba(232,166,187,0.14))",
                  borderColor: "var(--border)",
                }}
              >
                {progress}% today
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-2 w-full rounded-full border"
              style={{ background: "rgba(21,19,22,0.04)", borderColor: "rgba(21,19,22,0.06)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--gold), var(--rose))",
                }}
              />
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {routineToday.map((r) => (
                <label
                  key={r.label}
                  className="flex items-start gap-3 rounded-xl border p-3 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.70)",
                    borderColor: "var(--border)",
                  }}
                >
                  <input type="checkbox" defaultChecked={r.done} className="mt-1 h-4 w-4" />
                  <span>{r.label}</span>
                </label>
              ))}
            </div>

            <button
              className="mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
              style={{
                background: "linear-gradient(90deg, var(--gold), var(--rose))",
                boxShadow: "0 12px 30px rgba(232,166,187,0.18)",
              }}
            >
              Unlock more features
            </button>
          </div>

          {/* Lifestyle routines (Gym / Aesthetics / etc.) */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold">Lifestyle routines</h2>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                Add-ons & partner services
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {lifestyleRoutines.map((x) => (
                <div
                  key={x.title}
                  className="rounded-2xl border p-4"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{x.title}</div>
                      <div className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                        {x.desc}
                      </div>
                    </div>
                    <span
                      className="rounded-full border px-2 py-1 text-xs font-semibold"
                      style={{
                        background:
                          "linear-gradient(90deg, rgba(232,166,187,0.14), rgba(200,162,74,0.10))",
                        borderColor: "var(--border)",
                      }}
                    >
                      {x.tag}
                    </span>
                  </div>

                  <button
                    className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
                    style={{
                      background: "rgba(255,255,255,0.75)",
                      borderColor: "var(--border)",
                      color: "var(--fg)",
                    }}
                  >
                    Add to my routine
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}