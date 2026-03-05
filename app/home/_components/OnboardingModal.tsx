"use client";

import { useState } from "react";

const SKIN_TYPES: string[] = ["Normal", "Oily", "Dry", "Combination", "Sensitive"];

const CONCERN_OPTIONS: string[] = [
  "Acne",
  "Dark spots",
  "Dry patches",
  "Redness",
  "Oiliness",
  "Fine lines",
  "Uneven tone",
  "Large pores",
];

export default function OnboardingModal({
  onDone,
}: {
  onDone: (skinType: string, concerns: string[]) => void;
}) {
  const [step, setStep] = useState<"skin" | "concerns">("skin");
  const [skinType, setSkinType] = useState<string>("");
  const [concerns, setConcerns] = useState<string[]>([]);

  function toggleConcern(c: string) {
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(21,19,22,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-md rounded-t-3xl p-6"
        style={{
          background: "var(--card)",
          boxShadow: "0 -10px 40px rgba(21,19,22,0.14)",
        }}
      >
        <div
          className="mx-auto mb-5 h-1 w-10 rounded-full"
          style={{ background: "var(--border)" }}
        />

        {step === "skin" ? (
          <>
            <div className="text-base font-semibold mb-1">
              What&apos;s your skin type? ✨
            </div>
            <div className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              We&apos;ll personalise your routine around it.
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {SKIN_TYPES.map((s: string) => (
                <button
                  key={s}
                  onClick={() => setSkinType(s)}
                  className="rounded-2xl border px-4 py-3 text-sm font-medium transition active:scale-[0.99]"
                  style={{
                    background:
                      skinType === s
                        ? "linear-gradient(90deg, var(--gold), var(--rose))"
                        : "rgba(255,255,255,0.75)",
                    color: skinType === s ? "white" : "var(--fg)",
                    borderColor: skinType === s ? "transparent" : "var(--border)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <button
              disabled={!skinType}
              onClick={() => setStep("concerns")}
              className="w-full rounded-2xl py-3 text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-60"
              style={{
                background: skinType
                  ? "linear-gradient(90deg, var(--gold), var(--rose))"
                  : "rgba(200,162,74,0.3)",
              }}
            >
              Next →
            </button>
          </>
        ) : (
          <>
            <div className="text-base font-semibold mb-1">Any skin concerns? 🌿</div>
            <div className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Pick all that apply — you can change this anytime.
            </div>

            <div className="grid grid-cols-2 gap-2 mb-5">
              {CONCERN_OPTIONS.map((c: string) => (
                <button
                  key={c}
                  onClick={() => toggleConcern(c)}
                  className="rounded-2xl border px-4 py-3 text-sm font-medium transition active:scale-[0.99]"
                  style={{
                    background: concerns.includes(c)
                      ? "linear-gradient(90deg, var(--gold), var(--rose))"
                      : "rgba(255,255,255,0.75)",
                    color: concerns.includes(c) ? "white" : "var(--fg)",
                    borderColor: concerns.includes(c)
                      ? "transparent"
                      : "var(--border)",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep("skin")}
                className="flex-1 rounded-2xl border py-3 text-sm font-semibold transition"
                style={{
                  background: "rgba(255,255,255,0.75)",
                  borderColor: "var(--border)",
                }}
              >
                ← Back
              </button>

              <button
                onClick={() => onDone(skinType, concerns)}
                className="flex-[2] rounded-2xl py-3 text-sm font-semibold text-white"
                style={{
                  background: "linear-gradient(90deg, var(--gold), var(--rose))",
                }}
              >
                Get my routine ✨
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}