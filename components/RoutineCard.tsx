"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

// ── Routine items per skin type ───────────────────────────────────────────────

const routinesByType: Record<string, { am: string[]; pm: string[] }> = {
  Combination: {
    am: [
      "Gentle cleanser",
      "Niacinamide serum",
      "Lightweight moisturiser",
      "SPF 30–50",
    ],
    pm: ["Double cleanse", "BHA toner", "Moisturiser"],
  },
  Oily: {
    am: [
      "Foaming cleanser",
      "Niacinamide 10%",
      "Gel-cream moisturiser",
      "Mattifying SPF",
    ],
    pm: [
      "Oil cleanser → gel cleanser",
      "BHA salicylic acid",
      "Oil-free moisturiser",
    ],
  },
  Dry: {
    am: [
      "Cream cleanser",
      "Hyaluronic acid serum",
      "Rich ceramide moisturiser",
      "SPF (hydrating formula)",
    ],
    pm: [
      "Milk cleanser",
      "Hyaluronic acid serum",
      "Barrier repair cream",
      "Squalane facial oil",
    ],
  },
  Sensitive: {
    am: [
      "Cool water rinse",
      "Ceramide barrier moisturiser",
      "Mineral SPF (zinc oxide)",
    ],
    pm: [
      "Ultra-gentle cleanser",
      "Ceramide moisturiser",
      "Squalane oil (optional)",
    ],
  },
  Normal: {
    am: ["Gentle cleanser", "Vitamin C serum", "Moisturiser", "SPF 30+"],
    pm: ["Gentle cleanser", "Niacinamide serum", "Moisturiser"],
  },
  default: {
    am: [
      "Wash face (morning)",
      "Apply Vitamin C serum",
      "Moisturiser",
      "Apply sunscreen",
    ],
    pm: ["Remove makeup / SPF", "Wash face", "Night moisturiser"],
  },
};

// ── Level system ──────────────────────────────────────────────────────────────

function getLevel(streak: number) {
  if (streak >= 30)
    return {
      level: 5,
      name: "Glow Master",
      color: "#C8A24A",
      glow: "rgba(200,162,74,0.6)",
    };
  if (streak >= 14)
    return {
      level: 4,
      name: "Skin Sage",
      color: "#A78BFA",
      glow: "rgba(167,139,250,0.6)",
    };
  if (streak >= 7)
    return {
      level: 3,
      name: "Routine Pro",
      color: "#34D399",
      glow: "rgba(52,211,153,0.6)",
    };
  if (streak >= 3)
    return {
      level: 2,
      name: "Consistent",
      color: "#60A5FA",
      glow: "rgba(96,165,250,0.6)",
    };
  return {
    level: 1,
    name: "Getting Started",
    color: "#E8A6BB",
    glow: "rgba(232,166,187,0.6)",
  };
}

// ── Circular progress SVG ─────────────────────────────────────────────────────

function CircularProgress({
  percent,
  size = 110,
  stroke = 9,
  color,
  glow,
  level,
  levelName,
}: {
  percent: number;
  size?: number;
  stroke?: number;
  color: string;
  glow: string;
  level: number;
  levelName: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  const cx = size / 2;

  // Animate offset on change
  const [animOffset, setAnimOffset] = useState(circ);
  useEffect(() => {
    const t = setTimeout(() => setAnimOffset(offset), 80);
    return () => clearTimeout(t);
  }, [offset]);

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Glow backdrop */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
            opacity: percent > 0 ? 0.5 : 0,
            transition: "opacity 0.5s ease",
          }}
        />

        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke="rgba(21,19,22,0.07)"
            strokeWidth={stroke}
          />
          {/* Progress arc */}
          <circle
            cx={cx}
            cy={cx}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={animOffset}
            style={{
              transition: "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)",
              filter: `drop-shadow(0 0 6px ${glow})`,
            }}
          />
        </svg>

        {/* Centre text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "rotate(0deg)" }}
        >
          <div className="text-2xl font-bold leading-none" style={{ color }}>
            {percent}%
          </div>
          <div
            className="text-[10px] font-semibold mt-0.5"
            style={{ color: "var(--muted)" }}
          >
            done
          </div>
        </div>
      </div>

      {/* Level badge */}
      <div
        className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
        style={{
          background: `linear-gradient(90deg, ${color}22, ${color}11)`,
          border: `1px solid ${color}44`,
          color,
        }}
      >
        <span>Lv.{level}</span>
        <span>·</span>
        <span>{levelName}</span>
      </div>
    </div>
  );
}

// ── Single check item ─────────────────────────────────────────────────────────

function CheckItem({
  label,
  done,
  onToggle,
  index,
}: {
  label: string;
  done: boolean;
  onToggle: () => void;
  index: number;
}) {
  const [pop, setPop] = useState(false);

  function handle() {
    if (!done) {
      setPop(true);
      setTimeout(() => setPop(false), 400);
    }
    onToggle();
  }

  return (
    <button
      onClick={handle}
      className="flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-sm text-left transition-all active:scale-[0.98]"
      style={{
        background: done
          ? "linear-gradient(90deg, rgba(200,162,74,0.10), rgba(232,166,187,0.10))"
          : "rgba(255,255,255,0.72)",
        borderColor: done ? "rgba(200,162,74,0.30)" : "var(--border)",
        opacity: done ? 0.85 : 1,
        animationName: pop ? "popIn" : "none",
        animationDuration: "0.35s",
        animationTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Custom checkbox */}
      <div
        className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300"
        style={{
          background: done
            ? "linear-gradient(135deg, var(--gold), var(--rose))"
            : "rgba(21,19,22,0.06)",
          border: done ? "none" : "2px solid rgba(21,19,22,0.12)",
          boxShadow: done ? "0 2px 8px rgba(200,162,74,0.35)" : "none",
          transform: pop ? "scale(1.3)" : "scale(1)",
          transition:
            "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s ease",
        }}
      >
        {done && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Step number */}
      <span
        className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          background: "rgba(21,19,22,0.05)",
          color: "var(--muted)",
        }}
      >
        {index + 1}
      </span>

      {/* Label */}
      <span
        className="flex-1 font-medium"
        style={{
          textDecoration: done ? "line-through" : "none",
          color: done ? "var(--muted)" : "var(--fg)",
          transition: "color 0.2s ease",
        }}
      >
        {label}
      </span>

      {/* Done star */}
      {done && (
        <span className="text-base" style={{ lineHeight: 1 }}>
          ⭐
        </span>
      )}
    </button>
  );
}

// ── Main Routine Card ─────────────────────────────────────────────────────────

export default function RoutineCard({
  title,
  subtitle,
  showRewards = true,
}: {
  title?: string;
  subtitle?: string;
  showRewards?: boolean;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const plan = (user?.plan ?? "").toLowerCase();
  const isGold = plan.includes("gold");

  const skinType = user?.skinType ?? "default";
  const routines = routinesByType[skinType] ?? routinesByType.default;

  const [tab, setTab] = useState<"am" | "pm">(() => {
    const h = new Date().getHours();
    return h >= 6 && h < 14 ? "am" : "pm";
  });

  const amKey = `nf_routine_am_${user?.username ?? "guest"}`;
  const pmKey = `nf_routine_pm_${user?.username ?? "guest"}`;
  const streakKey = `nf_streak_${user?.username ?? "guest"}`;

  const makeInitial = (items: string[]) => items.map(() => false);

  const [amDone, setAmDone] = useState<boolean[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(amKey) ?? "null") ??
        makeInitial(routines.am)
      );
    } catch {
      return makeInitial(routines.am);
    }
  });
  const [pmDone, setPmDone] = useState<boolean[]>(() => {
    try {
      return (
        JSON.parse(localStorage.getItem(pmKey) ?? "null") ??
        makeInitial(routines.pm)
      );
    } catch {
      return makeInitial(routines.pm);
    }
  });
  const [streak, setStreak] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem(streakKey) ?? "0");
    } catch {
      return 0;
    }
  });

  const current = tab === "am" ? amDone : pmDone;
  const setCurrentDone = tab === "am" ? setAmDone : setPmDone;
  const items = tab === "am" ? routines.am : routines.pm;

  const completedCount = current.filter(Boolean).length;
  const total = items.length;
  const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;
  const levelInfo = getLevel(streak);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(amKey, JSON.stringify(amDone));
  }, [amDone]);
  useEffect(() => {
    localStorage.setItem(pmKey, JSON.stringify(pmDone));
  }, [pmDone]);

  // Update streak when all done
  useEffect(() => {
    const allAmDone = amDone.every(Boolean);
    const allPmDone = pmDone.every(Boolean);
    if (allAmDone && allPmDone) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem(streakKey, String(newStreak));
    }
  }, [amDone, pmDone]); // eslint-disable-line

  function toggle(i: number) {
    setCurrentDone((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  function resetAll() {
    setAmDone(makeInitial(routines.am));
    setPmDone(makeInitial(routines.pm));
  }

  const allDone = percent === 100;

  return (
    <>
      {/* Keyframe for pop */}
      <style>{`
        @keyframes popIn {
          0% { transform: scale(1); }
          50% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes celebrateBounce {
          0%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
          60% { transform: translateY(-3px); }
        }
      `}</style>

      <div
        className="rounded-3xl border p-4"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-base font-semibold">
              {title ?? (showRewards ? "Today's Routine" : "AM/PM Checklist")}
            </h2>
            <div className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>
              {subtitle ??
                (showRewards
                  ? `🔥 ${streak} day streak`
                  : "Basic daily steps for healthy skin.")}
            </div>
          </div>
          <button
            onClick={resetAll}
            className="text-[11px] font-semibold rounded-full px-2.5 py-1 border transition active:scale-95"
            style={{
              color: "var(--muted)",
              borderColor: "var(--border)",
              background: "rgba(255,255,255,0.7)",
            }}
          >
            Reset
          </button>
        </div>

        {showRewards && (
          <>
            {/* Circle + level */}
            <div className="flex justify-center mb-4">
              <CircularProgress
                percent={percent}
                color={levelInfo.color}
                glow={levelInfo.glow}
                level={levelInfo.level}
                levelName={levelInfo.name}
              />
            </div>

            {/* All done celebration */}
            {allDone && (
              <div
                className="mb-4 rounded-2xl border px-4 py-3 text-center text-sm font-semibold"
                style={{
                  background: `linear-gradient(90deg, ${levelInfo.color}18, rgba(232,166,187,0.12))`,
                  borderColor: `${levelInfo.color}33`,
                  color: levelInfo.color,
                  animation: "celebrateBounce 0.6s ease",
                }}
              >
                🎉 Amazing, {user?.username ?? "you"}! Routine complete for today!
              </div>
            )}
          </>
        )}

        {/* AM / PM tab */}
        <div
          className="flex rounded-2xl p-1 mb-3"
          style={{ background: "rgba(21,19,22,0.05)" }}
        >
          {(["am", "pm"] as const).map((t) => {
            const items2 = t === "am" ? routines.am : routines.pm;
            const doneArr = t === "am" ? amDone : pmDone;
            const tabPercent = Math.round(
              (doneArr.filter(Boolean).length / items2.length) * 100,
            );
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-semibold transition"
                style={{
                  background:
                    tab === t
                      ? "linear-gradient(90deg, var(--gold), var(--rose))"
                      : "transparent",
                  color: tab === t ? "white" : "var(--muted)",
                }}
              >
                <span>{t === "am" ? "🌅 AM" : "🌙 PM"}</span>
                {tabPercent === 100 && <span>✅</span>}
              </button>
            );
          })}
        </div>

        {/* Checklist */}
        <div className="flex flex-col gap-2">
          {items.map((label, i) => (
            <CheckItem
              key={label}
              label={label}
              done={current[i] ?? false}
              onToggle={() => toggle(i)}
              index={i}
            />
          ))}
        </div>

        {!isGold && (
          <button
            onClick={() => router.push("/settings?tab=premium")}
            className="mt-4 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
            style={{
              background: "linear-gradient(90deg, var(--gold), var(--rose))",
              boxShadow: "0 12px 30px rgba(232,166,187,0.18)",
            }}
          >
            Unlock Premium Routines ✨
          </button>
        )}
      </div>
    </>
  );
}
