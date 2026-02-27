"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";

type Gender = "Male" | "Female";
type SkinTone = "Fair" | "Medium" | "Olive" | "Deep";
type Goal = "Acne Control" | "Glow" | "Hydration" | "Anti-aging";
type Condition = "Clear" | "Acne" | "Dry" | "Oily";
type SkincareFreq = "Once a day" | "Twice a day" | "Rarely";
type Sleep = "< 6 hrs" | "6–7 hrs" | "7–8 hrs" | "8+ hrs";
type Water = "< 1 L" | "1–2 L" | "2–3 L" | "3+ L";

export type UserProfile = {
  name: string;

  gender: Gender | "";
  skinTone: SkinTone | "";
  goal: Goal | "";
  condition: Condition | "";

  birthYear: string; // simple (YYYY)
  heightCm: string; // "170"
  weightKg: string; // "55"

  skincareFreq: SkincareFreq | "";
  sleep: Sleep | "";
  water: Water | "";
};

const PROFILE_KEY = "blushai_profile_v1";

const DEFAULT_PROFILE: UserProfile = {
  name: "Tulip",
  gender: "",
  skinTone: "",
  goal: "",
  condition: "",
  birthYear: "",
  heightCm: "",
  weightKg: "",
  skincareFreq: "",
  sleep: "",
  water: "",
};

function loadProfile(): UserProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(PROFILE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

function saveProfile(p: UserProfile) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
}

function PillChoice({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl border px-4 py-4 text-sm font-semibold transition active:scale-[0.99]"
      style={{
        background: active
          ? "linear-gradient(90deg, rgba(200,162,74,0.18), rgba(232,166,187,0.20))"
          : "rgba(255,255,255,0.72)",
        borderColor: active ? "rgba(232,166,187,0.45)" : "var(--border)",
        boxShadow: active ? "0 14px 34px rgba(232,166,187,0.14)" : "none",
        color: "var(--fg)",
      }}
    >
      {label}
    </button>
  );
}

function NavButtons({
  canNext,
  onBack,
  onNext,
  nextLabel,
}: {
  canNext: boolean;
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button
        onClick={onBack}
        className="w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
        style={{
          background: "rgba(255,255,255,0.75)",
          borderColor: "var(--border)",
          color: "var(--fg)",
        }}
      >
        Back
      </button>
      <button
        disabled={!canNext}
        onClick={onNext}
        className="w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.99] disabled:opacity-50"
        style={{
          background: "linear-gradient(90deg, var(--gold), var(--rose))",
          boxShadow: "0 12px 30px rgba(232,166,187,0.18)",
        }}
      >
        {nextLabel ?? "Next"}
      </button>
    </div>
  );
}

export default function EditProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [p, setP] = useState<UserProfile>(DEFAULT_PROFILE);

  useEffect(() => {
    setP(loadProfile());
  }, []);

  const steps = useMemo(
    () => [
      { title: "What’s your gender?", key: "gender" },
      { title: "What’s your skin tone?", key: "skinTone" },
      { title: "What’s your main goal?", key: "goal" },
      { title: "What’s your current condition?", key: "condition" },
      { title: "What’s your birth year?", key: "birthYear" },
      { title: "Your height (cm)", key: "heightCm" },
      { title: "Your weight (kg)", key: "weightKg" },
      { title: "How often do you do skincare?", key: "skincareFreq" },
      { title: "How often do you sleep a day?", key: "sleep" },
      { title: "How much do you drink a day?", key: "water" },
    ],
    []
  );

  function goBack() {
    if (step === 0) return router.push("/");
    setStep((s) => Math.max(0, s - 1));
  }

  function goNext() {
    const last = step === steps.length - 1;
    if (last) {
      // Save + return home
      saveProfile(p);
      router.push("/");
      return;
    }
    setStep((s) => Math.min(steps.length - 1, s + 1));
  }

  const progress = Math.round(((step + 1) / steps.length) * 100);

  // ✅ validation per step (simple)
  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return !!p.gender;
      case 1:
        return !!p.skinTone;
      case 2:
        return !!p.goal;
      case 3:
        return !!p.condition;
      case 4:
        return /^\d{4}$/.test(p.birthYear);
      case 5:
        return /^\d{2,3}$/.test(p.heightCm);
      case 6:
        return /^\d{2,3}$/.test(p.weightKg);
      case 7:
        return !!p.skincareFreq;
      case 8:
        return !!p.sleep;
      case 9:
        return !!p.water;
      default:
        return true;
    }
  }, [step, p]);

  return (
    <>
      <Screen title="Edit profile" subtitle="Update your details with the same onboarding flow.">
        <div className="flex flex-col gap-4">
          {/* progress */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{steps[step].title}</div>
              <span
                className="rounded-full border px-2 py-1 text-xs font-semibold"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(200,162,74,0.12), rgba(232,166,187,0.14))",
                  borderColor: "var(--border)",
                }}
              >
                {progress}%
              </span>
            </div>

            <div
              className="mt-3 h-2 w-full rounded-full border"
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
          </div>

          {/* step content */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
            }}
          >
            {/* Step 0: gender */}
            {step === 0 && (
              <div className="grid grid-cols-2 gap-3">
                {(["Male", "Female"] as Gender[]).map((x) => (
                  <PillChoice
                    key={x}
                    label={x}
                    active={p.gender === x}
                    onClick={() => setP((d) => ({ ...d, gender: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 1: skin tone */}
            {step === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {(["Fair", "Medium", "Olive", "Deep"] as SkinTone[]).map((x) => (
                  <PillChoice
                    key={x}
                    label={x}
                    active={p.skinTone === x}
                    onClick={() => setP((d) => ({ ...d, skinTone: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 2: goal */}
            {step === 2 && (
              <div className="flex flex-col gap-3">
                {(["Acne Control", "Glow", "Hydration", "Anti-aging"] as Goal[]).map((x) => (
                  <PillChoice
                    key={x}
                    label={x}
                    active={p.goal === x}
                    onClick={() => setP((d) => ({ ...d, goal: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 3: condition */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-3">
                {(["Clear", "Acne", "Dry", "Oily"] as Condition[]).map((x) => (
                  <PillChoice
                    key={x}
                    label={x}
                    active={p.condition === x}
                    onClick={() => setP((d) => ({ ...d, condition: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 4: birth year */}
            {step === 4 && (
              <div>
                <div className="mb-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Example: 2002
                </div>
                <input
                  inputMode="numeric"
                  value={p.birthYear}
                  onChange={(e) => setP((d) => ({ ...d, birthYear: e.target.value }))}
                  className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  placeholder="YYYY"
                />
              </div>
            )}

            {/* Step 5: height */}
            {step === 5 && (
              <div>
                <div className="mb-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Example: 170
                </div>
                <input
                  inputMode="numeric"
                  value={p.heightCm}
                  onChange={(e) => setP((d) => ({ ...d, heightCm: e.target.value }))}
                  className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  placeholder="cm"
                />
              </div>
            )}

            {/* Step 6: weight */}
            {step === 6 && (
              <div>
                <div className="mb-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Example: 55
                </div>
                <input
                  inputMode="numeric"
                  value={p.weightKg}
                  onChange={(e) => setP((d) => ({ ...d, weightKg: e.target.value }))}
                  className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  placeholder="kg"
                />
              </div>
            )}

            {/* Step 7: skincare */}
            {step === 7 && (
              <div className="flex flex-col gap-3">
                {(["Once a day", "Twice a day", "Rarely"] as SkincareFreq[]).map((x) => (
                  <PillChoice
                    key={x}
                    label={x}
                    active={p.skincareFreq === x}
                    onClick={() => setP((d) => ({ ...d, skincareFreq: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 8: sleep */}
            {step === 8 && (
              <div className="flex flex-col gap-3">
                {(["< 6 hrs", "6–7 hrs", "7–8 hrs", "8+ hrs"] as Sleep[]).map((x) => (
                  <PillChoice
                    key={x}
                    label={x}
                    active={p.sleep === x}
                    onClick={() => setP((d) => ({ ...d, sleep: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 9: water */}
            {step === 9 && (
              <div className="flex flex-col gap-3">
                {(["< 1 L", "1–2 L", "2–3 L", "3+ L"] as Water[]).map((x) => (
                  <PillChoice
                    key={x}
                    label={x}
                    active={p.water === x}
                    onClick={() => setP((d) => ({ ...d, water: x }))}
                  />
                ))}
              </div>
            )}

            <NavButtons
              canNext={canNext}
              onBack={goBack}
              onNext={goNext}
              nextLabel={step === steps.length - 1 ? "Save" : "Next"}
            />
          </div>

          {/* optional: quick preview card */}
          <div
            className="rounded-2xl border p-4 text-sm"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="font-semibold">Preview</div>
            <div className="mt-2" style={{ color: "var(--muted)" }}>
              Gender: <span style={{ color: "var(--fg)" }}>{p.gender || "—"}</span>
              <br />
              Skin tone: <span style={{ color: "var(--fg)" }}>{p.skinTone || "—"}</span>
              <br />
              Goal: <span style={{ color: "var(--fg)" }}>{p.goal || "—"}</span>
              <br />
              Condition: <span style={{ color: "var(--fg)" }}>{p.condition || "—"}</span>
              <br />
              Birth year: <span style={{ color: "var(--fg)" }}>{p.birthYear || "—"}</span>
              <br />
              Height/Weight:{" "}
              <span style={{ color: "var(--fg)" }}>
                {p.heightCm || "—"} / {p.weightKg || "—"}
              </span>
              <br />
              Skincare: <span style={{ color: "var(--fg)" }}>{p.skincareFreq || "—"}</span>
              <br />
              Sleep: <span style={{ color: "var(--fg)" }}>{p.sleep || "—"}</span>
              <br />
              Water: <span style={{ color: "var(--fg)" }}>{p.water || "—"}</span>
            </div>
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}