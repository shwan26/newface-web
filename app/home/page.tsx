"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import { useAuth } from "@/app/context/AuthContext";
import { lifestyleRoutines, partnerPicks } from "../../lib/data";
import RoutineCard from "@/components/RoutineCard";

// ── New-user onboarding: collect skin type & concerns ─────────────────────────

const SKIN_TYPES = ["Normal", "Oily", "Dry", "Combination", "Sensitive"];
const CONCERN_OPTIONS = [
  "Acne",
  "Dark spots",
  "Dry patches",
  "Redness",
  "Oiliness",
  "Fine lines",
  "Uneven tone",
  "Large pores",
];

function OnboardingModal({
  onDone,
}: {
  onDone: (skinType: string, concerns: string[]) => void;
}) {
  const [step, setStep] = useState<"skin" | "concerns">("skin");
  const [skinType, setSkinType] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);

  function toggleConcern(c: string) {
    setConcerns((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
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
              What's your skin type? ✨
            </div>
            <div className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              We'll personalise your routine around it.
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {SKIN_TYPES.map((s) => (
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
                    borderColor:
                      skinType === s ? "transparent" : "var(--border)",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              disabled={!skinType}
              onClick={() => setStep("concerns")}
              className="w-full rounded-2xl py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
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
            <div className="text-base font-semibold mb-1">
              Any skin concerns? 🌿
            </div>
            <div className="text-sm mb-4" style={{ color: "var(--muted)" }}>
              Pick all that apply — you can change this anytime.
            </div>
            <div className="grid grid-cols-2 gap-2 mb-5">
              {CONCERN_OPTIONS.map((c) => (
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
                  background:
                    "linear-gradient(90deg, var(--gold), var(--rose))",
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

// ── Profile modal ─────────────────────────────────────────────────────────────

function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(21,19,22,0.40)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl p-6"
        style={{
          background: "var(--card)",
          boxShadow: "0 -10px 40px rgba(21,19,22,0.14)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="mx-auto mb-5 h-1 w-10 rounded-full"
          style={{ background: "var(--border)" }}
        />

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--gold), var(--rose))",
            }}
          >
            {user.avatar ?? user.username[0].toUpperCase()}
          </div>
          <div className="text-lg font-semibold">{user.username}</div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            {user.email}
          </div>
          <span
            className="rounded-full border px-3 py-0.5 text-xs font-semibold"
            style={{
              background:
                "linear-gradient(90deg, rgba(200,162,74,0.12), rgba(232,166,187,0.14))",
              borderColor: "var(--border)",
            }}
          >
            {user.plan ?? "Free plan"}
          </span>
        </div>

        {/* Details */}
        <div
          className="rounded-2xl border p-4 text-sm flex flex-col gap-2"
          style={{
            background: "rgba(255,255,255,0.70)",
            borderColor: "var(--border)",
          }}
        >
          <div>
            <span className="font-semibold">Skin Type: </span>
            {user.skinType ?? (
              <span style={{ color: "var(--muted)" }}>Not set yet</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Concerns: </span>
            {user.concerns && user.concerns.length > 0 ? (
              user.concerns.join(", ")
            ) : (
              <span style={{ color: "var(--muted)" }}>None added yet</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Account: </span>
            {user.isDefault ? "Default account" : "Member"}
          </div>
        </div>

        <button
          className="mt-4 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
          style={{
            background: "rgba(255,255,255,0.75)",
            borderColor: "var(--border)",
            color: "var(--fg)",
          }}
        >
          Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
          style={{
            background: "rgba(232,100,100,0.08)",
            borderColor: "rgba(232,100,100,0.25)",
            color: "#C0392B",
          }}
        >
          Log Out
        </button>

        <button
          className="mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(90deg, var(--gold), var(--rose))",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

// ── Personalised partner picks for non-default users ─────────────────────────

function getPersonalisedPicks(concerns: string[]) {
  const c = concerns.map((x) => x.toLowerCase());

  const pool = [
    {
      brand: "CeraVe",
      name: "Hydrating Cleanser",
      tag: "Dry",
      note: "Barrier repair",
      concern: "dry patches",
    },
    {
      brand: "Paula's Choice",
      name: "BHA 2% Exfoliant",
      tag: "Acne",
      note: "Pore clearing",
      concern: "acne",
    },
    {
      brand: "The Ordinary",
      name: "Niacinamide 10%",
      tag: "Oily",
      note: "Oil control",
      concern: "oiliness",
    },
    {
      brand: "La Roche-Posay",
      name: "Toleriane Fluid",
      tag: "Sensitive",
      note: "Calming",
      concern: "redness",
    },
    {
      brand: "SkinCeuticals",
      name: "C E Ferulic",
      tag: "Brightening",
      note: "Vitamin C",
      concern: "dark spots",
    },
    {
      brand: "Neutrogena",
      name: "Retinol 0.1%",
      tag: "Anti-age",
      note: "Night repair",
      concern: "fine lines",
    },
    {
      brand: "Cosrx",
      name: "Snail Mucin Serum",
      tag: "Repair",
      note: "Regenerating",
      concern: "uneven tone",
    },
    {
      brand: "Innisfree",
      name: "Pore Blur SPF50",
      tag: "SPF",
      note: "Mattifying",
      concern: "large pores",
    },
  ];

  // Filter to matching concerns first, then fill
  const matched = pool.filter((p) => c.some((x) => p.concern.includes(x)));
  const rest = pool.filter((p) => !matched.includes(p));
  return [...matched, ...rest].slice(0, 3);
}

// ── Main HomePage ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (user === null) {
      // Give context a moment to hydrate from localStorage
      const t = setTimeout(() => {
        if (!user) router.push("/login");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [user]); // eslint-disable-line

  // Show onboarding for new (non-default) users with no skin type set
  useEffect(() => {
    if (user && !user.isDefault && !user.skinType) {
      setShowOnboarding(true);
    }
  }, [user]);

  const h = new Date().getHours();
  const greeting =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  // Picks: default user gets static partnerPicks, new users get personalised
  const picks = user?.isDefault
    ? partnerPicks
    : getPersonalisedPicks(user?.concerns ?? []);

  if (!user) return null;

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          onDone={(skinType, concerns) => {
            updateProfile({ skinType, concerns });
            setShowOnboarding(false);
          }}
        />
      )}

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}

      <Screen title="Home" subtitle="Your routine, picks & progress.">
        <div className="flex flex-col gap-4 pb-24">
          {/* Greeting row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold">
                {greeting}, {user.username} 🌷
              </div>
              <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                {user.skinType
                  ? `${user.skinType} skin · Let's keep your routine on track.`
                  : "Let's keep your routine on track."}
              </div>
            </div>

            {/* Profile avatar button */}
            <button
              onClick={() => setProfileOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-white transition active:scale-95"
              style={{
                background: "linear-gradient(135deg, var(--gold), var(--rose))",
                boxShadow: "0 4px 14px rgba(232,166,187,0.35)",
              }}
              aria-label="Open profile"
            >
              {user.avatar ?? user.username[0].toUpperCase()}
              <span
                className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2"
                style={{ background: "#4ade80", borderColor: "var(--card)" }}
              />
            </button>
          </div>

          {/* New user skin info banner (if not default + has skin type) */}
          {!user.isDefault && user.skinType && (
            <div
              className="rounded-2xl border px-4 py-3 text-sm"
              style={{
                background:
                  "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.08))",
                borderColor: "rgba(200,162,74,0.22)",
              }}
            >
              <span className="font-semibold">Your profile: </span>
              {user.skinType} skin
              {user.concerns && user.concerns.length > 0
                ? ` · ${user.concerns.join(", ")}`
                : ""}
              <span
                className="ml-2 cursor-pointer text-xs font-semibold"
                style={{ color: "var(--gold)" }}
                onClick={() => setProfileOpen(true)}
              >
                Edit
              </span>
            </div>
          )}

          {/* Partner recommendations */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-base font-semibold">Recommended for you</h2>
              <span className="text-xs" style={{ color: "var(--muted)" }}>
                {user.isDefault ? "Partner picks" : "Based on your skin"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {picks.map((p) => (
                <div
                  key={p.name}
                  className="rounded-2xl border p-2"
                  style={{
                    background: "var(--card)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div
                    className="aspect-square rounded-xl border overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(232,166,187,0.18), rgba(200,162,74,0.10))",
                      borderColor: "rgba(21,19,22,0.08)",
                    }}
                  >
                    {"image" in p && p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="mt-2 text-xs font-semibold leading-tight">
                    {p.brand}
                  </div>
                  <div
                    className="text-[11px] leading-tight"
                    style={{ color: "var(--muted)" }}
                  >
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
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--muted)" }}
                    >
                      {"note" in p ? (p as { note: string }).note : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Routine checklist — interactive with game progress */}
          <RoutineCard />

          {/* Lifestyle routines */}
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
                      <div
                        className="mt-1 text-sm"
                        style={{ color: "var(--muted)" }}
                      >
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
