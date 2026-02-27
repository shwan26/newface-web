"use client";

import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import { deleteAllSessions } from "@/lib/storage";
import { useAuth } from "@/app/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
// ── Reusable toggle ───────────────────────────────────────────────────────────
function Toggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!value)}
      aria-checked={value}
      role="switch"
      className="relative flex-shrink-0 transition-all duration-200 active:scale-95"
      style={{
        width: 52,
        height: 30,
        borderRadius: 999,
        background: value
          ? "linear-gradient(90deg, #C8A24A, #E8A6BB)"
          : "rgba(21,19,22,0.10)",
        boxShadow: value
          ? "0 4px 16px rgba(232,166,187,0.35), inset 0 1px 0 rgba(255,255,255,0.2)"
          : "inset 0 1px 3px rgba(0,0,0,0.08)",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: value ? 25 : 3,
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: "white",
          boxShadow: "0 2px 8px rgba(21,19,22,0.18)",
          transition: "left 0.22s cubic-bezier(0.34,1.4,0.64,1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {value && (
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="url(#chk)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <defs>
              <linearGradient
                id="chk"
                x1="2"
                y1="6"
                x2="10"
                y2="4"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#C8A24A" />
                <stop offset="1" stopColor="#E8A6BB" />
              </linearGradient>
            </defs>
          </svg>
        )}
      </span>
    </button>
  );
}

// ── Setting row ───────────────────────────────────────────────────────────────
function SettingRow({
  icon,
  label,
  description,
  value,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(200,162,74,0.13), rgba(232,166,187,0.13))",
          }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <div
            className="text-sm font-semibold leading-tight"
            style={{ color: "var(--fg)" }}
          >
            {label}
          </div>
          {description && (
            <div
              className="mt-0.5 truncate text-xs"
              style={{ color: "var(--muted)" }}
            >
              {description}
            </div>
          )}
        </div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
function Card({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border px-4"
      style={{
        background: "var(--card)",
        borderColor: "var(--border)",
        boxShadow: "0 10px 30px rgba(21,19,22,0.05)",
      }}
    >
      {title && (
        <div
          className="pt-4 pb-2 text-xs font-bold uppercase tracking-widest"
          style={{ color: "var(--muted)" }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        height: 1,
        background:
          "linear-gradient(90deg, transparent, rgba(232,166,187,0.25), transparent)",
      }}
    />
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const GradientDefs = () => (
  <defs>
    <linearGradient
      id="ig"
      x1="0"
      y1="0"
      x2="1"
      y2="1"
      gradientUnits="objectBoundingBox"
    >
      <stop stopColor="#C8A24A" />
      <stop offset="1" stopColor="#E8A6BB" />
    </linearGradient>
  </defs>
);
function IconPhoto() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <GradientDefs />
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke="url(#ig)"
        strokeWidth="1.7"
      />
      <circle cx="8.5" cy="8.5" r="1.5" fill="url(#ig)" />
      <path
        d="M3 15l5-5 4 4 3-3 6 6"
        stroke="url(#ig)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <GradientDefs />
      <path
        d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
        stroke="url(#ig)"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.73 21a2 2 0 0 1-3.46 0"
        stroke="url(#ig)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconAnalytics() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <GradientDefs />
      <path
        d="M18 20V10M12 20V4M6 20v-6"
        stroke="url(#ig)"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
        stroke="#E8A6BB"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconCrown({ color = "#C8A24A" }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 17h18M5 17L3 7l5 4 4-6 4 6 5-4-2 10H5Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Package data ──────────────────────────────────────────────────────────────

interface Package {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  color: string;
  glow: string;
  badge: string;
  emoji: string;
  features: string[];
  highlight?: boolean;
}

const PACKAGES: Package[] = [
  {
    id: "free",
    name: "Free",
    price: "0 THB",
    priceNum: 0,
    color: "var(--muted)",
    glow: "rgba(21,19,22,0.06)",
    badge: "Current",
    emoji: "🌱",
    features: [
      "Basic AM/PM routine checklist",
      "3 AI chat messages/day",
      "General skincare tips",
    ],
  },
  {
    id: "skincare",
    name: "Skincare Package",
    price: "199 THB/mo",
    priceNum: 199,
    color: "#E8A6BB",
    glow: "rgba(232,166,187,0.35)",
    badge: "Popular",
    emoji: "🌸",
    highlight: true,
    features: [
      "Full personalised skincare routine",
      "Unlimited AI chat",
      "Ingredient scanner",
      "Progress tracking & streak rewards",
      "Partner product recommendations",
    ],
  },
  {
    id: "nutrition",
    name: "Nutrition Package",
    price: "299 THB/mo",
    priceNum: 299,
    color: "#34D399",
    glow: "rgba(52,211,153,0.35)",
    badge: "Lifestyle",
    emoji: "🥗",
    features: [
      "Everything in Skincare",
      "Personalised nutrition plan",
      "Skin-food connection tips",
      "Hydration & supplement guide",
      "Weekly meal planning assistant",
    ],
  },
  {
    id: "gold",
    name: "Gold Package",
    price: "499 THB/mo",
    priceNum: 499,
    color: "#C8A24A",
    glow: "rgba(200,162,74,0.45)",
    badge: "Best Value",
    emoji: "👑",
    features: [
      "Everything in Nutrition",
      "1-on-1 expert consultation (monthly)",
      "Exclusive partner discounts",
      "Priority AI responses",
      "Advanced skin analysis",
      "Lifestyle & aesthetic routines",
    ],
  },
];

// ── Upgrade Modal ─────────────────────────────────────────────────────────────

function UpgradeModal({
  currentPlan,
  onClose,
  onSelect,
}: {
  currentPlan: string;
  onClose: () => void;
  onSelect: (pkg: Package) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [success, setSuccess] = useState(false);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  const selectedPkg = PACKAGES.find((p) => p.id === selected);

  // Auto-scroll to confirm button when package is selected
  useEffect(() => {
    if (selected && confirmButtonRef.current) {
      setTimeout(() => {
        confirmButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 100);
    }
  }, [selected]);

  function handleConfirm() {
    if (!selectedPkg) return;
    setConfirming(true);
    setTimeout(() => {
      setConfirming(false);
      setSuccess(true);
      setTimeout(() => {
        onSelect(selectedPkg);
        onClose();
      }, 1800);
    }, 1200);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(21,19,22,0.50)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl"
        style={{
          background: "var(--card, #FBF7F4)",
          boxShadow: "0 -12px 48px rgba(21,19,22,0.16)",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="pt-4 flex justify-center">
          <div
            className="h-1 w-10 rounded-full"
            style={{ background: "var(--border)" }}
          />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-3">
          <div className="flex items-center gap-2 mb-1">
            <IconCrown color="#C8A24A" />
            <div className="text-lg font-bold">Upgrade your plan</div>
          </div>
          <div className="text-sm" style={{ color: "var(--muted)" }}>
            Choose a package that fits your goals.
          </div>
        </div>

        {/* Success state */}
        {success ? (
          <div className="px-5 pb-32 flex flex-col items-center gap-3 pt-4">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full text-3xl"
              style={{
                background: "linear-gradient(135deg, #C8A24A22, #E8A6BB22)",
                border: "2px solid rgba(200,162,74,0.3)",
              }}
            >
              🎉
            </div>
            <div className="text-base font-bold text-center">
              Welcome to {selectedPkg?.name}!
            </div>
            <div
              className="text-sm text-center"
              style={{ color: "var(--muted)" }}
            >
              Your plan has been updated. Enjoy your new features!
            </div>
          </div>
        ) : (
          <div className="px-4 pb-32 flex flex-col gap-3">
            {/* Package cards */}
            {PACKAGES.map((pkg) => {
              const isCurrent =
                pkg.id === currentPlan ||
                (currentPlan === "Free plan" && pkg.id === "free");
              const isSelected = selected === pkg.id;

              return (
                <button
                  key={pkg.id}
                  onClick={() => !isCurrent && setSelected(pkg.id)}
                  className="w-full rounded-2xl border p-4 text-left transition-all active:scale-[0.99]"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${pkg.color}18, ${pkg.color}08)`
                      : isCurrent
                        ? "rgba(21,19,22,0.03)"
                        : "rgba(255,255,255,0.80)",
                    borderColor: isSelected
                      ? pkg.color
                      : isCurrent
                        ? "var(--border)"
                        : "var(--border)",
                    boxShadow: isSelected ? `0 4px 20px ${pkg.glow}` : "none",
                    opacity: isCurrent ? 0.65 : 1,
                    cursor: isCurrent ? "default" : "pointer",
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{pkg.emoji}</span>
                      <div>
                        <div
                          className="text-sm font-bold leading-tight"
                          style={{ color: "var(--fg)" }}
                        >
                          {pkg.name}
                        </div>
                        <div
                          className="text-base font-bold mt-0.5"
                          style={{ color: pkg.color }}
                        >
                          {pkg.price}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {/* Badge */}
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                        style={{
                          background: isCurrent
                            ? "rgba(21,19,22,0.08)"
                            : `${pkg.color}22`,
                          color: isCurrent ? "var(--muted)" : pkg.color,
                          border: `1px solid ${isCurrent ? "var(--border)" : pkg.color + "44"}`,
                        }}
                      >
                        {isCurrent ? "Current" : pkg.badge}
                      </span>

                      {/* Selection circle */}
                      {!isCurrent && (
                        <div
                          className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full transition-all"
                          style={{
                            background: isSelected
                              ? `linear-gradient(135deg, ${pkg.color}, ${pkg.color}aa)`
                              : "rgba(21,19,22,0.07)",
                            border: isSelected
                              ? "none"
                              : "1.5px solid rgba(21,19,22,0.15)",
                            color: "white",
                          }}
                        >
                          {isSelected && <IconCheck />}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-3 flex flex-col gap-1.5">
                    {pkg.features.map((f) => (
                      <div
                        key={f}
                        className="flex items-start gap-2 text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        <span
                          className="mt-0.5 flex-shrink-0"
                          style={{ color: pkg.color }}
                        >
                          ✓
                        </span>
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </button>
              );
            })}

            {/* Confirm button */}
            <button
              ref={confirmButtonRef}
              onClick={handleConfirm}
              disabled={!selected || confirming}
              className="w-full rounded-2xl py-3.5 text-sm font-bold text-white transition active:scale-[0.99] mt-1"
              style={{
                background: selected
                  ? `linear-gradient(90deg, ${PACKAGES.find((p) => p.id === selected)?.color ?? "#C8A24A"}, #E8A6BB)`
                  : "rgba(21,19,22,0.10)",
                color: selected ? "white" : "var(--muted)",
                boxShadow: selected
                  ? `0 8px 24px ${PACKAGES.find((p) => p.id === selected)?.glow ?? "rgba(200,162,74,0.3)"}`
                  : "none",
                cursor: selected ? "pointer" : "not-allowed",
              }}
            >
              {confirming
                ? "Processing…"
                : selected
                  ? `Upgrade to ${PACKAGES.find((p) => p.id === selected)?.name}`
                  : "Select a package to continue"}
            </button>

            <p
              className="text-center text-[11px]"
              style={{ color: "var(--muted)" }}
            >
              This is a prototype — no real payment will be charged.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user, updateProfile } = useAuth();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const [savePhotos, setSavePhotos] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [analytics, setAnalytics] = useState(true);
  const [cleared, setCleared] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    setSavePhotos(localStorage.getItem("newface.savePhotos.v2") === "true");
    setNotifications(localStorage.getItem("newface.notifications") !== "false");
    setAnalytics(localStorage.getItem("newface.analytics") !== "false");
  }, []);

  // Auto-open upgrade modal when tab=premium
  useEffect(() => {
    if (tab === "premium") {
      setUpgradeOpen(true);
    }
  }, [tab]);

  function persist(key: string, val: boolean) {
    localStorage.setItem(key, String(val));
  }

  function clearHistory() {
    deleteAllSessions();
    setCleared(true);
    setTimeout(() => setCleared(false), 2200);
  }

  function handleUpgrade(pkg: Package) {
    updateProfile({ plan: pkg.name });
  }

  const currentPlan = user?.plan ?? "Free plan";
  const isFreePlan = currentPlan === "Free plan" || currentPlan === "Free";

  // Find matching package for current plan display
  const currentPkg =
    PACKAGES.find(
      (p) =>
        currentPlan.toLowerCase().includes(p.id) ||
        (isFreePlan && p.id === "free"),
    ) ?? PACKAGES[0];

  return (
    <>
      {upgradeOpen && (
        <UpgradeModal
          currentPlan={currentPkg.id}
          onClose={() => setUpgradeOpen(false)}
          onSelect={handleUpgrade}
        />
      )}

      <Screen title="Settings" subtitle="Your preferences, stored locally.">
        <div className="flex flex-col gap-3 pb-24">
          {/* ── Current Plan Banner ── */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: isFreePlan
                ? "linear-gradient(135deg, rgba(200,162,74,0.06), rgba(232,166,187,0.06))"
                : `linear-gradient(135deg, ${currentPkg.color}12, ${currentPkg.color}06)`,
              borderColor: isFreePlan
                ? "rgba(200,162,74,0.20)"
                : `${currentPkg.color}33`,
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-xl"
                  style={{
                    background: isFreePlan
                      ? "linear-gradient(135deg, rgba(200,162,74,0.15), rgba(232,166,187,0.15))"
                      : `${currentPkg.color}22`,
                    border: `1px solid ${isFreePlan ? "rgba(200,162,74,0.25)" : currentPkg.color + "44"}`,
                  }}
                >
                  {currentPkg.emoji}
                </div>
                <div>
                  <div
                    className="text-[11px] font-semibold uppercase tracking-widest"
                    style={{ color: "var(--muted)" }}
                  >
                    Current Plan
                  </div>
                  <div
                    className="text-sm font-bold mt-0.5"
                    style={{
                      color: isFreePlan ? "var(--fg)" : currentPkg.color,
                    }}
                  >
                    {currentPlan}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setUpgradeOpen(true)}
                className="flex items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-bold text-white transition active:scale-95"
                style={{
                  background: "linear-gradient(90deg, #C8A24A, #E8A6BB)",
                  boxShadow: "0 4px 14px rgba(232,166,187,0.30)",
                }}
              >
                <IconCrown color="white" />
                Upgrade
              </button>
            </div>

            {isFreePlan && (
              <div
                className="mt-3 rounded-xl px-3 py-2 text-xs"
                style={{
                  background: "rgba(255,255,255,0.60)",
                  color: "var(--muted)",
                }}
              >
                🌸 Unlock full routines, unlimited AI chat & more — starting at{" "}
                <strong style={{ color: "#C8A24A" }}>199 THB/mo</strong>
              </div>
            )}
          </div>

          {/* ── Privacy ── */}
          <Card title="Privacy">
            <SettingRow
              icon={<IconPhoto />}
              label="Save photos"
              description="Photos stay on your device only."
              value={savePhotos}
              onChange={(v) => {
                setSavePhotos(v);
                persist("newface.savePhotos.v2", v);
              }}
            />
            <Divider />
            <SettingRow
              icon={<IconAnalytics />}
              label="Usage analytics"
              description="Anonymous, no personal data."
              value={analytics}
              onChange={(v) => {
                setAnalytics(v);
                persist("newface.analytics", v);
              }}
            />
            <div className="pb-1" />
          </Card>

          {/* ── Preferences ── */}
          <Card title="Preferences">
            <SettingRow
              icon={<IconBell />}
              label="Notifications"
              description="Routine reminders & tips."
              value={notifications}
              onChange={(v) => {
                setNotifications(v);
                persist("newface.notifications", v);
              }}
            />
            <div className="pb-1" />
          </Card>

          {/* ── Data ── */}
          <Card title="Data">
            <div className="py-3">
              <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                Chats are stored locally in your browser. Clearing removes all
                sessions permanently.
              </p>
              <button
                onClick={clearHistory}
                className="w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]"
                style={{
                  background: cleared
                    ? "rgba(232,166,187,0.12)"
                    : "rgba(232,166,187,0.09)",
                  border: "1.5px solid rgba(232,166,187,0.35)",
                  color: cleared ? "#C8A24A" : "#E8A6BB",
                }}
              >
                {cleared ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="#C8A24A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Cleared!
                  </>
                ) : (
                  <>
                    <IconTrash />
                    Clear chat history
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* ── Disclaimer ── */}
          <div
            className="rounded-2xl border px-4 py-3 text-xs"
            style={{
              borderColor: "var(--border)",
              background:
                "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))",
              color: "var(--muted)",
              lineHeight: 1.6,
            }}
          >
            <span className="font-semibold" style={{ color: "var(--fg)" }}>
              Prototype disclaimer:{" "}
            </span>
            Guidance only — not a medical diagnosis. For severe or persistent
            symptoms, consult a dermatologist.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}
