"use client";

import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import { deleteAllSessions } from "@/lib/storage";
import { useEffect, useState } from "react";

// ── Reusable toggle ──────────────────────────────────────────────────────────
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
      {/* Knob */}
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
        {/* On: checkmark, Off: nothing */}
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
              <linearGradient id="chk" x1="2" y1="6" x2="10" y2="4" gradientUnits="userSpaceOnUse">
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

// ── Setting row ──────────────────────────────────────────────────────────────
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
          <div className="text-sm font-semibold leading-tight" style={{ color: "var(--fg)" }}>
            {label}
          </div>
          {description && (
            <div className="mt-0.5 truncate text-xs" style={{ color: "var(--muted)" }}>
              {description}
            </div>
          )}
        </div>
      </div>
      <Toggle value={value} onChange={onChange} />
    </div>
  );
}

// ── Section card ─────────────────────────────────────────────────────────────
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
        background: "linear-gradient(90deg, transparent, rgba(232,166,187,0.25), transparent)",
      }}
    />
  );
}

// ── Icons ────────────────────────────────────────────────────────────────────
const GradientDefs = () => (
  <defs>
    <linearGradient id="ig" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
      <stop stopColor="#C8A24A" />
      <stop offset="1" stopColor="#E8A6BB" />
    </linearGradient>
  </defs>
);

function IconPhoto() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <GradientDefs />
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="url(#ig)" strokeWidth="1.7" />
      <circle cx="8.5" cy="8.5" r="1.5" fill="url(#ig)" />
      <path d="M3 15l5-5 4 4 3-3 6 6" stroke="url(#ig)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <GradientDefs />
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="url(#ig)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="url(#ig)" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconMoon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <GradientDefs />
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79Z" stroke="url(#ig)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconAnalytics() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <GradientDefs />
      <path d="M18 20V10M12 20V4M6 20v-6" stroke="url(#ig)" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconTrash() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#E8A6BB" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [savePhotos, setSavePhotos]         = useState(false);
  const [notifications, setNotifications]   = useState(true);
  const [darkMode, setDarkMode]             = useState(false);
  const [analytics, setAnalytics]           = useState(true);
  const [cleared, setCleared]               = useState(false);

  useEffect(() => {
    setSavePhotos(localStorage.getItem("newface.savePhotos.v2") === "true");
    setNotifications(localStorage.getItem("newface.notifications") !== "false");
    setDarkMode(localStorage.getItem("newface.darkMode") === "true");
    setAnalytics(localStorage.getItem("newface.analytics") !== "false");
  }, []);

  function persist(key: string, val: boolean) {
    localStorage.setItem(key, String(val));
  }

  function clearHistory() {
    deleteAllSessions();
    setCleared(true);
    setTimeout(() => setCleared(false), 2200);
  }

  return (
    <>
      <Screen title="Settings" subtitle="Your preferences, stored locally.">
        <div className="flex flex-col gap-3 pb-2">

          {/* ── Privacy ── */}
          <Card title="Privacy">
            <SettingRow
              icon={<IconPhoto />}
              label="Save photos"
              description="Photos stay on your device only."
              value={savePhotos}
              onChange={(v) => { setSavePhotos(v); persist("newface.savePhotos.v2", v); }}
            />
            <Divider />
            <SettingRow
              icon={<IconAnalytics />}
              label="Usage analytics"
              description="Anonymous, no personal data."
              value={analytics}
              onChange={(v) => { setAnalytics(v); persist("newface.analytics", v); }}
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
              onChange={(v) => { setNotifications(v); persist("newface.notifications", v); }}
            />
            {/* <Divider />
            <SettingRow
              icon={<IconMoon />}
              label="Dark mode"
              description="Easier on the eyes at night."
              value={darkMode}
              onChange={(v) => { setDarkMode(v); persist("newface.darkMode", v); }}
            />
            <div className="pb-1" /> */}
          </Card>

          {/* ── Data ── */}
          <Card title="Data">
            <div className="py-3">
              <p className="text-xs mb-3" style={{ color: "var(--muted)" }}>
                Chats are stored locally in your browser. Clearing removes all sessions permanently.
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
                      <path d="M5 13l4 4L19 7" stroke="#C8A24A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
              background: "linear-gradient(90deg, rgba(200,162,74,0.08), rgba(232,166,187,0.10))",
              color: "var(--muted)",
              lineHeight: 1.6,
            }}
          >
            <span className="font-semibold" style={{ color: "var(--fg)" }}>Prototype disclaimer: </span>
            Guidance only — not a medical diagnosis. For severe or persistent symptoms, consult a dermatologist.
          </div>

        </div>
      </Screen>

      <BottomNav />
    </>
  );
}