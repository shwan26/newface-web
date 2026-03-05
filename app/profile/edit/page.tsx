"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Screen from "@/components/Screen";
import BottomNav from "@/components/BottomNav";
import { useAuth } from "@/app/context/AuthContext";

type Gender = "Male" | "Female";
type SkinTone = "Fair" | "Medium" | "Olive" | "Deep";
type Goal = "Acne Control" | "Glow" | "Hydration" | "Anti-aging";
type Condition = "Clear" | "Acne" | "Dry" | "Oily";
type SkincareFreq = "Once a day" | "Twice a day" | "Rarely";
type Sleep = "< 6 hrs" | "6–7 hrs" | "7–8 hrs" | "8+ hrs";
type Water = "< 1 L" | "1–2 L" | "2–3 L" | "3+ L";

const SKIN_TYPES = ["Normal", "Oily", "Dry", "Combination", "Sensitive"] as const;

const CONCERN_OPTIONS = [
  "Acne",
  "Dark spots",
  "Dry patches",
  "Redness",
  "Oiliness",
  "Fine lines",
  "Uneven tone",
  "Large pores",
] as const;

type DraftProfile = {
  // ✅ Added
  skinType: (typeof SKIN_TYPES)[number] | "";
  concerns: string[];

  // existing
  gender: Gender | "";
  skinTone: SkinTone | "";
  goal: Goal | "";
  condition: Condition | "";
  birthYear: string;
  heightCm: string;
  weightKg: string;
  skincareFreq: SkincareFreq | "";
  sleep: Sleep | "";
  water: Water | "";
};

function CardChoice({
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

function Chip({
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
      className="rounded-2xl border px-3 py-2 text-xs font-semibold transition active:scale-[0.99]"
      style={{
        background: active
          ? "linear-gradient(90deg, var(--gold), var(--rose))"
          : "rgba(255,255,255,0.75)",
        color: active ? "white" : "var(--fg)",
        borderColor: active ? "transparent" : "var(--border)",
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
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<DraftProfile>({
    skinType: "",
    concerns: [],
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
  });

  // Load existing user values
  useEffect(() => {
    if (!user) return;
    setDraft((d) => ({
      ...d,
      skinType: (user as any).skinType ?? "",
      concerns: (user as any).concerns ?? [],
      gender: (user as any).gender ?? "",
      skinTone: (user as any).skinTone ?? "",
      goal: (user as any).goal ?? "",
      condition: (user as any).condition ?? "",
      birthYear: (user as any).birthYear ?? "",
      heightCm: (user as any).heightCm ?? "",
      weightKg: (user as any).weightKg ?? "",
      skincareFreq: (user as any).skincareFreq ?? "",
      sleep: (user as any).sleep ?? "",
      water: (user as any).water ?? "",
    }));
  }, [user]);

  const steps = useMemo(
    () => [
      { title: "What’s your skin type?", key: "skinType" }, // ✅ NEW
      { title: "Any skin concerns?", key: "concerns" }, // ✅ NEW
      { title: "What’s your gender?", key: "gender" },
      { title: "What’s your skin tone?", key: "skinTone" },
      { title: "What’s your main goal?", key: "goal" },
      { title: "What’s your current condition?", key: "condition" },
      { title: "What’s your birth year?", key: "birthYear" },
      { title: "What’s your height? (cm)", key: "heightCm" },
      { title: "What’s your weight? (kg)", key: "weightKg" },
      { title: "How often do you do skincare?", key: "skincareFreq" },
      { title: "How often do you sleep a day?", key: "sleep" },
      { title: "How much do you drink a day?", key: "water" },
    ],
    []
  );

  const progress = Math.round(((step + 1) / steps.length) * 100);

  function toggleConcern(c: string) {
    setDraft((d) => {
      const exists = d.concerns.includes(c);
      return { ...d, concerns: exists ? d.concerns.filter((x) => x !== c) : [...d.concerns, c] };
    });
  }

  const canNext = useMemo(() => {
    switch (step) {
      case 0:
        return !!draft.skinType;
      case 1:
        return true; // concerns optional
      case 2:
        return !!draft.gender;
      case 3:
        return !!draft.skinTone;
      case 4:
        return !!draft.goal;
      case 5:
        return !!draft.condition;
      case 6:
        return /^\d{4}$/.test(draft.birthYear);
      case 7:
        return /^\d{2,3}$/.test(draft.heightCm);
      case 8:
        return /^\d{2,3}$/.test(draft.weightKg);
      case 9:
        return !!draft.skincareFreq;
      case 10:
        return !!draft.sleep;
      case 11:
        return !!draft.water;
      default:
        return true;
    }
  }, [step, draft]);

  function goBack() {
    if (step === 0) router.back();
    else setStep((s) => s - 1);
  }

  function goNext() {
    if (step === steps.length - 1) {
      updateProfile({ ...(draft as any) });
      router.push("/home");
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <>
      <Screen title="Edit Profile" subtitle="Update your details with the onboarding flow.">
        <div className="flex flex-col gap-4 pb-24">
          {/* Progress */}
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
              style={{
                background: "rgba(21,19,22,0.04)",
                borderColor: "rgba(21,19,22,0.06)",
              }}
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

          {/* Step content */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
            }}
          >
            {/* Step 0: Skin type */}
            {step === 0 && (
              <div className="grid grid-cols-2 gap-3">
                {SKIN_TYPES.map((x) => (
                  <CardChoice
                    key={x}
                    label={x}
                    active={draft.skinType === x}
                    onClick={() => setDraft((d) => ({ ...d, skinType: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 1: Concerns */}
            {step === 1 && (
              <div>
                <div className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                  Select all that apply (optional).
                </div>
                <div className="flex flex-wrap gap-2">
                  {CONCERN_OPTIONS.map((c) => (
                    <Chip
                      key={c}
                      label={c}
                      active={draft.concerns.includes(c)}
                      onClick={() => toggleConcern(c)}
                    />
                  ))}
                </div>

                {draft.concerns.length > 0 && (
                  <div
                    className="mt-4 rounded-2xl border p-3 text-xs"
                    style={{
                      background: "rgba(255,255,255,0.75)",
                      borderColor: "var(--border)",
                      color: "var(--muted)",
                    }}
                  >
                    Selected:{" "}
                    <span style={{ color: "var(--fg)", fontWeight: 600 }}>
                      {draft.concerns.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Gender */}
            {step === 2 && (
              <div className="grid grid-cols-2 gap-3">
                {(["Male", "Female"] as Gender[]).map((x) => (
                  <CardChoice
                    key={x}
                    label={x}
                    active={draft.gender === x}
                    onClick={() => setDraft((d) => ({ ...d, gender: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 3: Skin tone */}
            {step === 3 && (
              <div className="grid grid-cols-2 gap-3">
                {(["Fair", "Medium", "Olive", "Deep"] as SkinTone[]).map((x) => (
                  <CardChoice
                    key={x}
                    label={x}
                    active={draft.skinTone === x}
                    onClick={() => setDraft((d) => ({ ...d, skinTone: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 4: Goal */}
            {step === 4 && (
              <div className="flex flex-col gap-3">
                {(["Acne Control", "Glow", "Hydration", "Anti-aging"] as Goal[]).map((x) => (
                  <CardChoice
                    key={x}
                    label={x}
                    active={draft.goal === x}
                    onClick={() => setDraft((d) => ({ ...d, goal: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 5: Condition */}
            {step === 5 && (
              <div className="grid grid-cols-2 gap-3">
                {(["Clear", "Acne", "Dry", "Oily"] as Condition[]).map((x) => (
                  <CardChoice
                    key={x}
                    label={x}
                    active={draft.condition === x}
                    onClick={() => setDraft((d) => ({ ...d, condition: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 6: Birth year */}
            {step === 6 && (
              <div>
                <div className="mb-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Example: 2002
                </div>
                <input
                  inputMode="numeric"
                  value={draft.birthYear}
                  onChange={(e) => setDraft((d) => ({ ...d, birthYear: e.target.value }))}
                  className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  placeholder="YYYY"
                />
              </div>
            )}

            {/* Step 7: Height */}
            {step === 7 && (
              <div>
                <div className="mb-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Example: 170
                </div>
                <input
                  inputMode="numeric"
                  value={draft.heightCm}
                  onChange={(e) => setDraft((d) => ({ ...d, heightCm: e.target.value }))}
                  className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  placeholder="cm"
                />
              </div>
            )}

            {/* Step 8: Weight */}
            {step === 8 && (
              <div>
                <div className="mb-2 text-xs font-semibold" style={{ color: "var(--muted)" }}>
                  Example: 55
                </div>
                <input
                  inputMode="numeric"
                  value={draft.weightKg}
                  onChange={(e) => setDraft((d) => ({ ...d, weightKg: e.target.value }))}
                  className="w-full rounded-2xl border px-3 py-3 text-sm outline-none"
                  style={{ background: "rgba(255,255,255,0.75)", borderColor: "var(--border)" }}
                  placeholder="kg"
                />
              </div>
            )}

            {/* Step 9: Skincare frequency */}
            {step === 9 && (
              <div className="flex flex-col gap-3">
                {(["Once a day", "Twice a day", "Rarely"] as SkincareFreq[]).map((x) => (
                  <CardChoice
                    key={x}
                    label={x}
                    active={draft.skincareFreq === x}
                    onClick={() => setDraft((d) => ({ ...d, skincareFreq: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 10: Sleep */}
            {step === 10 && (
              <div className="flex flex-col gap-3">
                {(["< 6 hrs", "6–7 hrs", "7–8 hrs", "8+ hrs"] as Sleep[]).map((x) => (
                  <CardChoice
                    key={x}
                    label={x}
                    active={draft.sleep === x}
                    onClick={() => setDraft((d) => ({ ...d, sleep: x }))}
                  />
                ))}
              </div>
            )}

            {/* Step 11: Water */}
            {step === 11 && (
              <div className="flex flex-col gap-3">
                {(["< 1 L", "1–2 L", "2–3 L", "3+ L"] as Water[]).map((x) => (
                  <CardChoice
                    key={x}
                    label={x}
                    active={draft.water === x}
                    onClick={() => setDraft((d) => ({ ...d, water: x }))}
                  />
                ))}
              </div>
            )}

            <NavButtons
              canNext={canNext}
              onBack={() => {
                // if leaving edit flow, go back to profile modal page
                if (step === 0) router.back();
                else setStep((s) => s - 1);
              }}
              onNext={() => {
                if (step === steps.length - 1) {
                  updateProfile({ ...(draft as any) });
                  router.push("/home");
                  return;
                }
                setStep((s) => s + 1);
              }}
              nextLabel={step === steps.length - 1 ? "Save" : "Next"}
            />
          </div>

          <div
            className="rounded-2xl border px-4 py-3 text-xs"
            style={{
              borderColor: "var(--border)",
              background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))",
              color: "var(--muted)",
              lineHeight: 1.6,
            }}
          >
            This profile is used to personalize routines, recommendations, and (for nutrition/gold) lifestyle features.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}