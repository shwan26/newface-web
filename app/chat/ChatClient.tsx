"use client";

import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import { Chip, GhostButton, PrimaryButton } from "@/components/UI";
import { generateAssistantReply } from "@/lib/fakeAI";
import type { ChatMessage, ChatSession } from "@/lib/types";
import { getSession, loadSessions, upsertSession } from "@/lib/storage";
import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function titleFromFirstUserMessage(text: string) {
  const t = text.trim();
  return t.length > 34 ? t.slice(0, 34) + "…" : t || "New chat";
}

const quickChips = [
  "I have acne and oily skin",
  "Sensitive + redness",
  "Dark spots after acne",
  "Give me a 2-minute routine",
];

const CHAT_LIMIT_FREE = 3;

export default function ChatClient() {
  const { user } = useAuth();
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("id");

  const [session, setSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [limitReached, setLimitReached] = useState(false);

  const endRef = useRef<HTMLDivElement | null>(null);
  const attachMenuRef = useRef<HTMLDivElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);

  const sessionsPreview = useMemo(() => loadSessions().slice(0, 3), []);
  const planName = user?.plan ?? "Free plan";
  const planLower = planName.toLowerCase();
  const isFreePlan = planLower.includes("free");
  const hasUnlimitedChat =
    planLower.includes("skincare") ||
    planLower.includes("nutrition") ||
    planLower.includes("gold");

  const chatCountKey = `nf_chat_count_${user?.username ?? "guest"}`;
  const todayKey = new Date().toISOString().slice(0, 10);

  function loadDailyCount() {
    try {
      const raw = localStorage.getItem(chatCountKey);
      if (!raw) return 0;
      const parsed = JSON.parse(raw) as { date: string; count: number };
      if (parsed.date !== todayKey) return 0;
      return parsed.count ?? 0;
    } catch {
      return 0;
    }
  }

  function saveDailyCount(count: number) {
    localStorage.setItem(
      chatCountKey,
      JSON.stringify({ date: todayKey, count }),
    );
  }

  // Close attach menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        attachMenuRef.current &&
        !attachMenuRef.current.contains(e.target as Node)
      ) {
        setAttachMenuOpen(false);
      }
    }
    if (attachMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [attachMenuOpen]);

  useEffect(() => {
    if (sessionId) {
      const existing = getSession(sessionId);
      if (existing) setSession(existing);
      return;
    }
    setSession(null);
  }, [sessionId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages?.length, thinking]);

  useEffect(() => {
    const count = loadDailyCount();
    setDailyCount(count);
    setLimitReached(isFreePlan && count >= CHAT_LIMIT_FREE);
  }, [user?.username, isFreePlan]);

  function createNewChat() {
    const fresh: ChatSession = {
      id: uid(),
      title: "New chat",
      createdAt: Date.now(),
      messages: [
        {
          id: uid(),
          role: "newface",
          ts: Date.now(),
          text: "Welcome — NEWFACE (prototype). Tell me your skin concern and I'll draft a simple AM/PM routine.",
        },
      ],
    };
    upsertSession(fresh);
    router.push(`/chat?id=${encodeURIComponent(fresh.id)}`);
  }

  function pushMessage(msg: ChatMessage) {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, messages: [...prev.messages, msg] };
      upsertSession(next);
      return next;
    });
  }

  function handleImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      setAttachedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setAttachMenuOpen(false);
  }

  async function send(text: string) {
    if (!session) return;
    const trimmed = text.trim();
    if (!trimmed && !attachedImage) return;
    if (isFreePlan && dailyCount >= CHAT_LIMIT_FREE) {
      setLimitReached(true);
      return;
    }

    setInput("");
    const imageToSend = attachedImage;
    setAttachedImage(null);

    pushMessage({
      id: uid(),
      role: "user",
      text: trimmed,
      ts: Date.now(),
      image: imageToSend ?? undefined,
    } as ChatMessage & { image?: string });

    setSession((prev) => {
      if (!prev) return prev;
      const shouldTitle = prev.title === "New chat";
      const next = {
        ...prev,
        title: shouldTitle
          ? titleFromFirstUserMessage(trimmed || "Photo")
          : prev.title,
      };
      upsertSession(next);
      return next;
    });

    setThinking(true);
    const planLower = (user?.plan ?? "").toLowerCase();
    const isGold = planLower.includes("gold");
    await new Promise((r) => setTimeout(r, isGold ? 250 : 850));
    
    const replyText = generateAssistantReply(
      trimmed,
      user?.username,
      user?.plan ?? "Free plan",
      {
        skinType: user?.skinType,
        concerns: user?.concerns,
        goal: (user as any)?.goal,
        condition: (user as any)?.condition,
        sleep: (user as any)?.sleep,
        water: (user as any)?.water,
      }
    );
    pushMessage({
      id: uid(),
      role: "newface",
      text: replyText,
      ts: Date.now(),
    });
    if (isFreePlan) {
      const nextCount = dailyCount + 1;
      setDailyCount(nextCount);
      saveDailyCount(nextCount);
      setLimitReached(nextCount >= CHAT_LIMIT_FREE);
    }
    setThinking(false);
  }

  // ── Chooser UI ──────────────────────────────────────────────────────────────
  if (!session) {
    return (
      <>
        <Screen title="Chat" subtitle="Start a new chat or open a recent one.">
          <div className="flex flex-col gap-3 pb-24">
            <PrimaryButton onClick={createNewChat}>New Chat</PrimaryButton>

            <div
              className="rounded-2xl border p-4"
              style={{
                background: "var(--card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="text-sm font-semibold">Recent chats</div>
              <div className="mt-2 flex flex-col gap-2">
                {sessionsPreview.length === 0 ? (
                  <div className="text-sm" style={{ color: "var(--muted)" }}>
                    No chats yet.
                  </div>
                ) : (
                  sessionsPreview.map((s) => (
                    <Link
                      key={s.id}
                      href={`/chat?id=${encodeURIComponent(s.id)}`}
                      className="rounded-xl border px-3 py-3 text-sm transition active:scale-[0.99]"
                      style={{
                        background: "rgba(255,255,255,0.70)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="font-semibold">{s.title}</div>
                      <div
                        className="mt-1 text-xs"
                        style={{ color: "var(--muted)" }}
                      >
                        {s.messages.length} messages
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link href="/history" className="block">
              <GhostButton>Open Full History</GhostButton>
            </Link>
          </div>
        </Screen>
        <BottomNav />
      </>
    );
  }

  // ── Chat UI ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Hidden file inputs */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = "";
        }}
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleImageFile(file);
          e.target.value = "";
        }}
      />

      <Screen
        title="Quick Chat"
        subtitle="Prototype guidance only. Not medical advice."
      >
        <div className="flex flex-col gap-3 pb-24">
          <div
            className="rounded-2xl border px-4 py-3 text-xs"
            style={{
              background: "rgba(255,255,255,0.70)",
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            {hasUnlimitedChat ? (
              <span>
                Skincare Package: Unlimited AI chat is active for your account.
              </span>
            ) : (
              <span>
                Free plan: {dailyCount}/{CHAT_LIMIT_FREE} AI messages today.
              </span>
            )}
          </div>

          {limitReached && !hasUnlimitedChat && (
            <div
              className="rounded-2xl border px-4 py-3 text-xs"
              style={{
                background:
                  "linear-gradient(90deg, rgba(200,162,74,0.12), rgba(232,166,187,0.12))",
                borderColor: "rgba(200,162,74,0.25)",
                color: "var(--muted)",
              }}
            >
              You've reached today's free chat limit. Upgrade to unlock
              unlimited AI chat.
            </div>
          )}
          {/* Quick chips */}
          <div className="flex flex-wrap gap-2">
            {quickChips.map((c) => (
              <Chip key={c} label={c} onClick={() => send(c)} />
            ))}
          </div>

          {/* Message list */}
          <div
            className="h-[52vh] overflow-y-auto rounded-2xl border p-3"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
          >
            <div className="flex flex-col gap-3">
              {session.messages.map((m) => {
                const msg = m as ChatMessage & { image?: string };
                return (
                  <div
                    key={m.id}
                    className="max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                    style={{
                      marginLeft: m.role === "user" ? "auto" : undefined,
                      background:
                        m.role === "user"
                          ? "linear-gradient(90deg, var(--gold), var(--rose))"
                          : "rgba(255,255,255,0.80)",
                      color: m.role === "user" ? "white" : "var(--fg)",
                      border:
                        m.role === "newface"
                          ? "1px solid var(--border)"
                          : "none",
                    }}
                  >
                    {/* Attached image preview inside bubble */}
                    {msg.image && (
                      <img
                        src={msg.image}
                        alt="attachment"
                        className="mb-2 w-full rounded-xl object-cover"
                        style={{ maxHeight: 180 }}
                      />
                    )}
                    {m.text}
                  </div>
                );
              })}

              {thinking && (
                <div
                  className="mr-auto max-w-[92%] rounded-2xl border px-3 py-2 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.80)",
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2 w-2 animate-pulse rounded-full"
                      style={{
                        background:
                          "linear-gradient(90deg, var(--gold), var(--rose))",
                      }}
                    />
                    Analyzing…
                  </span>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>

          {/* Attached image preview strip (above input) */}
          {attachedImage && (
            <div className="relative w-fit">
              <img
                src={attachedImage}
                alt="preview"
                className="h-16 w-16 rounded-xl object-cover"
                style={{ border: "2px solid rgba(200,162,74,0.4)" }}
              />
              <button
                onClick={() => setAttachedImage(null)}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--gold), var(--rose))",
                  fontSize: 11,
                }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Input row */}
          <div className="relative flex items-center gap-2">
            {/* + button with popover */}
            <div ref={attachMenuRef} className="relative">
              <button
                onClick={() => setAttachMenuOpen((o) => !o)}
                className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl text-white transition active:scale-95"
                style={{
                  background: attachMenuOpen
                    ? "linear-gradient(135deg, var(--gold), var(--rose))"
                    : "rgba(200,162,74,0.15)",
                }}
                aria-label="Attach photo"
              >
                <span
                  className="text-xl font-light leading-none transition-transform duration-200"
                  style={{
                    color: attachMenuOpen ? "white" : "var(--gold)",
                    display: "inline-block",
                    transform: attachMenuOpen
                      ? "rotate(45deg)"
                      : "rotate(0deg)",
                  }}
                >
                  +
                </span>
              </button>

              {/* Popover */}
              {attachMenuOpen && (
                <div
                  className="absolute bottom-14 left-0 z-50 flex flex-col overflow-hidden rounded-2xl"
                  style={{
                    background: "rgba(255,250,248,0.95)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(232,166,187,0.30)",
                    boxShadow:
                      "0 8px 32px rgba(200,162,74,0.14), 0 2px 8px rgba(232,166,187,0.12)",
                    minWidth: 168,
                  }}
                >
                  {/* Camera */}
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition active:scale-[0.98]"
                    style={{ color: "var(--fg)" }}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(200,162,74,0.15), rgba(232,166,187,0.15))",
                      }}
                    >
                      {/* Camera icon */}
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="2"
                          y="7"
                          width="20"
                          height="14"
                          rx="3"
                          stroke="url(#cam-g)"
                          strokeWidth="1.8"
                        />
                        <circle
                          cx="12"
                          cy="14"
                          r="3.5"
                          stroke="url(#cam-g)"
                          strokeWidth="1.8"
                        />
                        <path
                          d="M8 7V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1"
                          stroke="url(#cam-g)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient
                            id="cam-g"
                            x1="2"
                            y1="4"
                            x2="22"
                            y2="21"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#C8A24A" />
                            <stop offset="1" stopColor="#E8A6BB" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    Take a Photo
                  </button>

                  {/* Divider */}
                  <div
                    style={{
                      height: 1,
                      background: "rgba(232,166,187,0.20)",
                      margin: "0 12px",
                    }}
                  />

                  {/* Gallery */}
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition active:scale-[0.98]"
                    style={{ color: "var(--fg)" }}
                  >
                    <span
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(200,162,74,0.15), rgba(232,166,187,0.15))",
                      }}
                    >
                      {/* Gallery / image icon */}
                      <svg
                        width="17"
                        height="17"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="3"
                          stroke="url(#gal-g)"
                          strokeWidth="1.8"
                        />
                        <circle cx="8.5" cy="8.5" r="1.5" fill="url(#gal-g)" />
                        <path
                          d="M3 15l5-5 4 4 3-3 6 6"
                          stroke="url(#gal-g)"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <defs>
                          <linearGradient
                            id="gal-g"
                            x1="3"
                            y1="3"
                            x2="21"
                            y2="21"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#C8A24A" />
                            <stop offset="1" stopColor="#E8A6BB" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    Choose from Gallery
                  </button>
                </div>
              )}
            </div>

            {/* Text input */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your concern…"
              className="flex-1 rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.80)",
                borderColor: "var(--border)",
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(input);
              }}
            />

            {/* Send */}
            <button
              onClick={() => send(input)}
              disabled={limitReached && !hasUnlimitedChat}
              className="rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
              style={{
                background:
                  limitReached && !hasUnlimitedChat
                    ? "rgba(21,19,22,0.15)"
                    : "linear-gradient(90deg, var(--gold), var(--rose))",
                color: limitReached && !hasUnlimitedChat ? "var(--muted)" : "white",
              }}
            >
              Send
            </button>
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}
