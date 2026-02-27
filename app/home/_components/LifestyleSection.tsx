"use client";

export default function LifestyleSection({ lifestyleRoutines }: { lifestyleRoutines: any[] }) {
  return (
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
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
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
                  background: "linear-gradient(90deg, rgba(232,166,187,0.14), rgba(200,162,74,0.10))",
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
  );
}