"use client";

import { useEffect, useMemo, useState } from "react";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

const KEY = "newface.checker.history.v2";

type Finding = {
  key: string;
  label: string;
  severity: "high" | "medium" | "info";
  reason: string;
  matched?: string[]; // what we detected in text
};

type ScanResult = {
  id: string;
  name: string;
  ingredientText: string;
  findings: Finding[];
  createdAt: string;
};

function loadHistory(): ScanResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ScanResult[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(items: ScanResult[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
}

function normalize(s: string) {
  return s.toLowerCase().replace(/\s+/g, " ").trim();
}

/**
 * Watchlist: Toxic-Free Cosmetics (California AB 2762) — common names + variants
 * We match by substring for prototype simplicity.
 */
const TOXIC_FREE_WATCHLIST: Array<{
  key: string;
  label: string;
  severity: Finding["severity"];
  reason: string;
  patterns: string[];
}> = [
  {
    key: "formaldehyde",
    label: "Formaldehyde",
    severity: "high",
    reason: "Known carcinogen; some ingredients may release formaldehyde over time.",
    patterns: ["formaldehyde"],
  },
  {
    key: "paraformaldehyde",
    label: "Paraformaldehyde",
    severity: "high",
    reason: "A type of formaldehyde; potential carcinogenic concern.",
    patterns: ["paraformaldehyde"],
  },
  {
    key: "methylene_glycol",
    label: "Methylene glycol",
    severity: "high",
    reason: "A type of formaldehyde; may release formaldehyde.",
    patterns: ["methylene glycol"],
  },
  {
    key: "quaternium_15",
    label: "Quaternium-15",
    severity: "high",
    reason: "Formaldehyde-releasing preservative; sensitization concern.",
    patterns: ["quaternium-15", "quaternium 15"],
  },
  {
    key: "mercury",
    label: "Mercury",
    severity: "high",
    reason: "Can harm kidneys and nervous system; heavily restricted/banned in many products.",
    patterns: ["mercury", "mercuric", "hg"],
  },
  {
    key: "phthalates",
    label: "Phthalates (DBP / DEHP)",
    severity: "high",
    reason: "Hormone disruption / reproductive toxicity concerns (e.g., dibutyl phthalate, diethylhexyl phthalate).",
    patterns: [
      "dibutyl phthalate",
      "dbp",
      "diethylhexyl phthalate",
      "dehp",
      "phthalate",
      "phthalates",
    ],
  },
  {
    key: "parabens_isobutyl_isopropyl",
    label: "Parabens (isobutyl / isopropyl)",
    severity: "high",
    reason: "Hormone disruption / reproductive harm concerns (specific parabens).",
    patterns: ["isobutylparaben", "isobutyl paraben", "isopropylparaben", "isopropyl paraben"],
  },
  {
    key: "pfas",
    label: "PFAS (long-chain per- & polyfluoroalkyl substances)",
    severity: "high",
    reason: "Persistent chemicals; some PFAS have been linked to cancer in research and are under regulation.",
    patterns: [
      "pfas",
      "ptfe",
      "perfluoro",
      "polyfluoro",
      "fluoropolymer",
      "c9-15 fluoroalcohol phosphate",
      "c9-15 fluoroalcohol phosphate ester",
      "perfluorononyl",
      "perfluorooctyl",
      "pfoa",
      "pfos",
    ],
  },
  {
    key: "phenylenediamine",
    label: "m- & o-Phenylenediamine (hair dye)",
    severity: "high",
    reason: "Irritation/sensitization concerns; DNA damage/cancer concerns reported in research.",
    patterns: ["m-phenylenediamine", "o-phenylenediamine", "phenylenediamine", "ppd"],
  },
];

/**
 * Optional: common irritant/fragrance flags (not AB 2762 list, but useful)
 */
const IRRITANT_FLAGS: Array<{
  key: string;
  label: string;
  severity: Finding["severity"];
  reason: string;
  patterns: string[];
}> = [
  {
    key: "fragrance",
    label: "Fragrance / Parfum",
    severity: "medium",
    reason: "Common irritant/sensitizer for some people (especially sensitive skin).",
    patterns: ["fragrance", "parfum"],
  },
  {
    key: "essential_oils",
    label: "Essential oils / terpenes",
    severity: "medium",
    reason: "Can irritate/sensitize some skin types.",
    patterns: ["essential oil", "limonene", "linalool", "citral", "eugenol", "geraniol"],
  },
  {
    key: "alcohol_denat",
    label: "Alcohol denat.",
    severity: "info",
    reason: "Can feel drying/irritating for some, depends on formula and skin type.",
    patterns: ["alcohol denat", "denatured alcohol"],
  },
  {
    key: "sls",
    label: "Sodium Lauryl Sulfate (SLS)",
    severity: "info",
    reason: "Can be drying/irritating in some cleansers.",
    patterns: ["sodium lauryl sulfate", "sls"],
  },
];

/**
 * Actives recognition (positive signals)
 */
const GOOD_ACTIVES: Array<{ key: string; label: string; patterns: string[] }> = [
  { key: "niacinamide", label: "Niacinamide", patterns: ["niacinamide"] },
  { key: "bha", label: "Salicylic acid (BHA)", patterns: ["salicylic acid", "bha"] },
  { key: "aha", label: "AHA (glycolic/lactic)", patterns: ["glycolic acid", "lactic acid", "aha"] },
  { key: "retinoids", label: "Retinol/retinoids", patterns: ["retinol", "retinal", "retinoate"] },
  { key: "vitc", label: "Vitamin C", patterns: ["ascorbic acid", "vitamin c", "ethyl ascorbic"] },
  { key: "ceramides", label: "Ceramides", patterns: ["ceramide"] },
  { key: "ha", label: "Hyaluronic acid", patterns: ["hyaluronic acid", "sodium hyaluronate"] },
  { key: "panthenol", label: "Panthenol", patterns: ["panthenol"] },
  { key: "azelaic", label: "Azelaic acid", patterns: ["azelaic acid"] },
  { key: "zinc", label: "Zinc", patterns: ["zinc pca", "zinc oxide", "zinc"] },
];

function matchPatterns(text: string, patterns: string[]) {
  const hits = patterns.filter((p) => text.includes(p));
  return hits.length ? hits : null;
}

export default function checkerPage() {
  const [name, setName] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [history, setHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const analysis = useMemo(() => {
    const text = normalize(ingredients);
    if (!text) {
      return {
        watchlistFindings: [] as Finding[],
        irritantFindings: [] as Finding[],
        actives: [] as string[],
      };
    }

    const watchlistFindings: Finding[] = [];
    for (const item of TOXIC_FREE_WATCHLIST) {
      const hits = matchPatterns(text, item.patterns);
      if (hits) {
        watchlistFindings.push({
          key: item.key,
          label: item.label,
          severity: item.severity,
          reason: item.reason,
          matched: hits,
        });
      }
    }

    const irritantFindings: Finding[] = [];
    for (const item of IRRITANT_FLAGS) {
      const hits = matchPatterns(text, item.patterns);
      if (hits) {
        irritantFindings.push({
          key: item.key,
          label: item.label,
          severity: item.severity,
          reason: item.reason,
          matched: hits,
        });
      }
    }

    const actives: string[] = [];
    for (const a of GOOD_ACTIVES) {
      if (matchPatterns(text, a.patterns)) actives.push(a.label);
    }

    return { watchlistFindings, irritantFindings, actives };
  }, [ingredients]);

  function onSaveScan() {
    if (!ingredients.trim()) return;

    const allFindings = [...analysis.watchlistFindings, ...analysis.irritantFindings];

    const item: ScanResult = {
      id: crypto.randomUUID(),
      name: name.trim() || "Unnamed product",
      ingredientText: ingredients.trim(),
      findings: allFindings,
      createdAt: new Date().toISOString(),
    };

    const next = [item, ...history].slice(0, 20);
    setHistory(next);
    saveHistory(next);
  }

  function clearHistory() {
    setHistory([]);
    saveHistory([]);
  }

  function badgeStyle(sev: Finding["severity"]) {
    if (sev === "high") {
      return {
        background: "rgba(232,166,187,0.14)",
        borderColor: "rgba(232,166,187,0.35)",
        color: "#E8A6BB",
      };
    }
    if (sev === "medium") {
      return {
        background: "rgba(200,162,74,0.12)",
        borderColor: "rgba(200,162,74,0.28)",
        color: "var(--gold)",
      };
    }
    return {
      background: "rgba(21,19,22,0.06)",
      borderColor: "rgba(21,19,22,0.10)",
      color: "var(--muted)",
    };
  }

  return (
    <>
      <Screen
        title="Ingredient checker"
        subtitle="Prototype checker: flags AB 2762 watchlist + common irritants, and highlights actives."
      >
        <div className="flex flex-col gap-4 pb-24">
          {/* Input */}
          <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="text-sm font-semibold">Scan a product</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              Paste the ingredient list exactly as shown on packaging.
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name (optional)"
                className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
              />

              <textarea
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                placeholder="Paste ingredients here…"
                rows={7}
                className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
              />
            </div>

            {/* Results */}
            <div className="mt-3 rounded-2xl border p-3" style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}>
              <div className="text-sm font-semibold">Quick result</div>

              <div className="mt-3">
                <div className="text-xs font-semibold" style={{ color: "var(--fg)" }}>
                  AB 2762 “Toxic-Free Cosmetics” watchlist
                </div>

                {analysis.watchlistFindings.length === 0 ? (
                  <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    No watchlist matches detected.
                  </div>
                ) : (
                  <div className="mt-2 flex flex-col gap-2">
                    {analysis.watchlistFindings.map((f) => (
                      <div
                        key={f.key}
                        className="rounded-2xl border p-3"
                        style={{ borderColor: "var(--border)", background: "rgba(255,255,255,0.65)" }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-semibold">{f.label}</div>
                          <span
                            className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                            style={badgeStyle(f.severity)}
                          >
                            {f.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px]" style={{ color: "var(--muted)", lineHeight: 1.5 }}>
                          {f.reason}
                        </div>
                        {f.matched?.length ? (
                          <div className="mt-2 text-[11px]" style={{ color: "var(--muted)" }}>
                            Matched: <span style={{ color: "var(--fg)", fontWeight: 600 }}>{f.matched.join(", ")}</span>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold" style={{ color: "var(--fg)" }}>
                  Common irritant flags (extra)
                </div>
                {analysis.irritantFindings.length === 0 ? (
                  <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                    No common irritant flags detected.
                  </div>
                ) : (
                  <div className="mt-2 flex flex-col gap-2">
                    {analysis.irritantFindings.map((f) => (
                      <div key={f.key} className="rounded-2xl border p-3" style={{ borderColor: "var(--border)" }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="text-xs font-semibold">{f.label}</div>
                          <span className="rounded-full border px-2 py-0.5 text-[10px] font-semibold" style={badgeStyle(f.severity)}>
                            {f.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px]" style={{ color: "var(--muted)", lineHeight: 1.5 }}>
                          {f.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold" style={{ color: "var(--fg)" }}>
                  Recognized actives
                </div>
                <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  {analysis.actives.length ? analysis.actives.join(", ") : "No common actives found."}
                </div>
              </div>
            </div>

            <button
              onClick={onSaveScan}
              className="mt-3 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
              style={{
                background: "linear-gradient(90deg, var(--gold), var(--rose))",
                boxShadow: "0 12px 30px rgba(232,166,187,0.18)",
              }}
            >
              Save scan result
            </button>
          </div>

          {/* History */}
          <div className="rounded-2xl border p-4" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">Recent scans</div>
              <button
                onClick={clearHistory}
                className="rounded-full border px-3 py-1 text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
              >
                Clear
              </button>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              {history.length === 0 ? (
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  No scans yet.
                </div>
              ) : (
                history.map((h) => {
                  const highs = h.findings.filter((f) => f.severity === "high").length;
                  return (
                    <div
                      key={h.id}
                      className="rounded-2xl border p-3"
                      style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="text-sm font-semibold">{h.name}</div>
                          <div className="text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                            {new Date(h.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <span
                          className="rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: highs ? "rgba(232,166,187,0.14)" : "rgba(21,19,22,0.06)",
                            borderColor: highs ? "rgba(232,166,187,0.35)" : "rgba(21,19,22,0.10)",
                            color: highs ? "#E8A6BB" : "var(--muted)",
                          }}
                        >
                          {highs ? `${highs} high-risk flag(s)` : "No high-risk flags"}
                        </span>
                      </div>

                      {h.findings.length ? (
                        <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                          Flags:{" "}
                          <span style={{ color: "var(--fg)", fontWeight: 600 }}>
                            {h.findings.map((f) => f.label).join(", ")}
                          </span>
                        </div>
                      ) : (
                        <div className="mt-2 text-xs" style={{ color: "var(--muted)" }}>
                          No flags detected.
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-2xl border px-4 py-3 text-xs"
            style={{
              borderColor: "var(--border)",
              background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))",
              color: "var(--muted)",
              lineHeight: 1.6,
            }}
          >
            <span className="font-semibold" style={{ color: "var(--fg)" }}>
              Disclaimer:{" "}
            </span>
            Prototype only — not medical advice. “Flagged” means matched keywords; verify ingredients and consult a professional for concerns.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}