"use client";

type Pick = {
  brand: string;
  name: string;
  tag: string;
  note?: string;
  image?: string | null;
};

export default function PartnerPicksGrid({
  title,
  subtitleRight,
  picks,
}: {
  title: string;
  subtitleRight?: string;
  picks: Pick[];
}) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        {subtitleRight ? (
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            {subtitleRight}
          </span>
        ) : null}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {picks.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl border p-2"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div
              className="aspect-square rounded-xl border overflow-hidden"
              style={{
                background:
                  "linear-gradient(180deg, rgba(232,166,187,0.18), rgba(200,162,74,0.10))",
                borderColor: "rgba(21,19,22,0.08)",
              }}
            >
              {p.image ? (
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              ) : null}
            </div>

            <div className="mt-2 text-xs font-semibold leading-tight">{p.brand}</div>
            <div className="text-[11px] leading-tight" style={{ color: "var(--muted)" }}>
              {p.name}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-1">
              <span
                className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
              >
                {p.tag}
              </span>
              {p.note ? (
                <span className="text-[10px]" style={{ color: "var(--muted)" }}>
                  {p.note}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}