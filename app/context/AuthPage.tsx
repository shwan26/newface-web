"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function reset() {
    setError("");
    setUsername("");
    setEmail("");
    setPassword("");
  }

  function switchMode(m: Mode) {
    setMode(m);
    reset();
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // small UX delay

    if (mode === "login") {
      const res = login(username, password);
      if (!res.ok) {
        setError(res.error ?? "Login failed.");
        setLoading(false);
        return;
      }
    } else {
      const res = signup(username, email, password);
      if (!res.ok) {
        setError(res.error ?? "Signup failed.");
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    router.push("/");
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center px-5 py-10"
      style={{ background: "var(--bg, #FBF7F4)" }}
    >
      {/* Logo / wordmark */}
      <div className="mb-8 flex flex-col items-center gap-2">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-2xl font-bold text-white"
          style={{
            background:
              "linear-gradient(135deg, var(--gold, #C8A24A), var(--rose, #E8A6BB))",
          }}
        >
          N
        </div>
        <div
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--fg, #151316)" }}
        >
          NEWFACE
        </div>
        <div className="text-sm" style={{ color: "var(--muted, #888)" }}>
          Your personal skincare advisor
        </div>
      </div>

      {/* Card */}
      <div
        className="w-full max-w-sm rounded-3xl border p-6"
        style={{
          background: "var(--card, #fff)",
          borderColor: "var(--border, rgba(21,19,22,0.08))",
          boxShadow: "0 20px 60px rgba(21,19,22,0.08)",
        }}
      >
        {/* Tab switcher */}
        <div
          className="mb-6 flex rounded-2xl p-1"
          style={{ background: "rgba(21,19,22,0.05)" }}
        >
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className="flex-1 rounded-xl py-2 text-sm font-semibold transition"
              style={{
                background:
                  mode === m
                    ? "linear-gradient(90deg, var(--gold, #C8A24A), var(--rose, #E8A6BB))"
                    : "transparent",
                color: mode === m ? "white" : "var(--muted, #888)",
              }}
            >
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        {/* Heading */}
        <div className="mb-5">
          <div className="text-lg font-semibold">
            {mode === "login" ? "Welcome back 🌸" : "Create your account ✨"}
          </div>
          <div className="mt-1 text-sm" style={{ color: "var(--muted, #888)" }}>
            {mode === "login"
              ? "Log in to continue your skincare journey."
              : "Sign up and start your personalised routine today."}
          </div>
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3">
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-semibold"
              style={{ color: "var(--muted, #888)" }}
            >
              USERNAME
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={
                mode === "login" ? "e.g. Tulip" : "Choose a username"
              }
              className="rounded-2xl border px-4 py-3 text-sm outline-none transition"
              style={{
                background: "rgba(255,255,255,0.80)",
                borderColor: "var(--border, rgba(21,19,22,0.08))",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
          </div>

          {/* Email — signup only */}
          {mode === "signup" && (
            <div className="flex flex-col gap-1">
              <label
                className="text-xs font-semibold"
                style={{ color: "var(--muted, #888)" }}
              >
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. you@gmail.com"
                className="rounded-2xl border px-4 py-3 text-sm outline-none transition"
                style={{
                  background: "rgba(255,255,255,0.80)",
                  borderColor: "var(--border, rgba(21,19,22,0.08))",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label
              className="text-xs font-semibold"
              style={{ color: "var(--muted, #888)" }}
            >
              PASSWORD
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "login" ? "Your password" : "Min. 6 characters"
                }
                className="w-full rounded-2xl border px-4 py-3 pr-12 text-sm outline-none"
                style={{
                  background: "rgba(255,255,255,0.80)",
                  borderColor: "var(--border, rgba(21,19,22,0.08))",
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSubmit();
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold"
                style={{ color: "var(--muted, #888)" }}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="rounded-xl border px-4 py-2.5 text-sm"
              style={{
                background: "rgba(232,100,100,0.08)",
                borderColor: "rgba(232,100,100,0.25)",
                color: "#C0392B",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-1 w-full rounded-2xl py-3 text-sm font-semibold text-white transition active:scale-[0.99]"
            style={{
              background: loading
                ? "rgba(200,162,74,0.5)"
                : "linear-gradient(90deg, var(--gold, #C8A24A), var(--rose, #E8A6BB))",
              boxShadow: loading ? "none" : "0 8px 24px rgba(232,166,187,0.25)",
            }}
          >
            {loading
              ? mode === "login"
                ? "Logging in…"
                : "Creating account…"
              : mode === "login"
                ? "Log In"
                : "Create Account"}
          </button>
        </div>

        {/* Footer link */}
        <div
          className="mt-5 text-center text-sm"
          style={{ color: "var(--muted, #888)" }}
        >
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => switchMode("signup")}
                className="font-semibold"
                style={{ color: "var(--gold, #C8A24A)" }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode("login")}
                className="font-semibold"
                style={{ color: "var(--gold, #C8A24A)" }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>

      {/* Hint for demo */}
      <div
        className="mt-6 rounded-2xl border px-4 py-3 text-xs text-center max-w-sm w-full"
        style={{
          background: "rgba(200,162,74,0.06)",
          borderColor: "rgba(200,162,74,0.20)",
          color: "var(--muted, #888)",
        }}
      >
        🌸 Default account: <strong>Tulip</strong> /{" "}
        <strong>Tulip'sShwan</strong>
      </div>
    </div>
  );
}
