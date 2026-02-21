"use client";

import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import { Chip, GhostButton, PrimaryButton } from "@/components/UI";
import { generateAssistantReply } from "@/lib/fakeAI";
import type { ChatMessage, ChatSession } from "@/lib/types";
import { getSession, loadSessions, upsertSession } from "@/lib/storage";
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

export default function ChatPage() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get("id");

  const [session, setSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const sessionsPreview = useMemo(() => loadSessions().slice(0, 3), []);

  useEffect(() => {
    if (sessionId) {
      const existing = getSession(sessionId);
      if (existing) setSession(existing);
      return;
    }
    // No session selected -> show chooser UI first (session stays null)
  }, [sessionId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages?.length, thinking]);

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
          text:
            "Welcome — NEWFACE (prototype). Tell me your skin concern and I’ll draft a simple AM/PM routine.",
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

  async function send(text: string) {
    if (!session) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    setInput("");
    pushMessage({ id: uid(), role: "user", text: trimmed, ts: Date.now() });

    // title
    setSession((prev) => {
      if (!prev) return prev;
      const shouldTitle = prev.title === "New chat";
      const next = { ...prev, title: shouldTitle ? titleFromFirstUserMessage(trimmed) : prev.title };
      upsertSession(next);
      return next;
    });

    setThinking(true);
    await new Promise((r) => setTimeout(r, 850));

    const replyText = generateAssistantReply(trimmed);
    pushMessage({ id: uid(), role: "newface", text: replyText, ts: Date.now() });

    setThinking(false);
  }

  // If no session selected, show "choose new chat" UI
  if (!session) {
    return (
      <>
        <Screen
          title="Chat"
          subtitle="Start a new chat or open a recent one."
        >
          <div className="flex flex-col gap-3">
            <PrimaryButton onClick={createNewChat}>New Chat</PrimaryButton>

            <div
              className="rounded-2xl border p-4"
              style={{ background: "rgba(255,255,255,0.55)", borderColor: "var(--border)" }}
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
                      className="rounded-xl border px-3 py-3 text-sm transition"
                      style={{
                        background: "rgba(255,255,255,0.70)",
                        borderColor: "var(--border)",
                      }}
                    >
                      <div className="font-semibold">{s.title}</div>
                      <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
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

  const messages = session.messages;

  return (
    <>
      <Screen
        title="Quick Chat"
        subtitle="Prototype guidance only. Not medical advice."
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            {quickChips.map((c) => (
              <Chip key={c} label={c} onClick={() => send(c)} />
            ))}
          </div>

          <div
            className="h-[52vh] overflow-y-auto rounded-2xl border p-3"
            style={{
              background: "rgba(255,255,255,0.55)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex flex-col gap-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap"
                  style={{
                    marginLeft: m.role === "user" ? "auto" : undefined,
                    background:
                      m.role === "user"
                        ? "linear-gradient(90deg, rgba(200,162,74,0.95), rgba(231,162,182,0.95))"
                        : "rgba(255,255,255,0.75)",
                    color: m.role === "user" ? "white" : "var(--fg)",
                    border: m.role === "newface" ? `1px solid var(--border)` : "none",
                  }}
                >
                  {m.text}
                </div>
              ))}

              {thinking ? (
                <div
                  className="mr-auto max-w-[92%] rounded-2xl border px-3 py-2 text-sm"
                  style={{
                    background: "rgba(255,255,255,0.72)",
                    borderColor: "var(--border)",
                    color: "var(--muted)",
                  }}
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2 w-2 animate-pulse rounded-full"
                      style={{
                        background: "linear-gradient(90deg, var(--gold), var(--rose))",
                      }}
                    />
                    Analyzing…
                  </span>
                </div>
              ) : null}

              <div ref={endRef} />
            </div>
          </div>

          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your concern…"
              className="flex-1 rounded-2xl border px-4 py-3 text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.72)",
                borderColor: "var(--border)",
                boxShadow: "0 0 0 0 transparent",
              }}
              onFocus={(e) => (e.currentTarget.style.boxShadow = `0 0 0 6px var(--ring)`)}
              onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 0 transparent")}
              onKeyDown={(e) => {
                if (e.key === "Enter") send(input);
              }}
            />
            <button
              onClick={() => send(input)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
              style={{
                background: "linear-gradient(90deg, var(--gold), var(--rose))",
                color: "white",
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