"use client";

import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import { loadSessions } from "@/lib/storage";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { ChatSession } from "@/lib/types";

function formatTime(ts: number) {
  return new Date(ts).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  useEffect(() => {
    setSessions(loadSessions());
  }, []);

  return (
    <>
      <Screen title="History" subtitle="Chats saved on this device. Tap to reopen.">
        <div className="flex flex-col gap-3">
          {sessions.length === 0 ? (
            <div
              className="rounded-2xl border p-4 text-sm"
              style={{
                background: "var(--card-2)",
                borderColor: "var(--border)",
                color: "var(--muted)",
              }}
            >
              No chats yet. Start a new one in <span style={{ color: "var(--fg)" }}>Chat</span>.
            </div>
          ) : (
            sessions.map((s) => (
              <Link
                key={s.id}
                href={`/chat?id=${encodeURIComponent(s.id)}`}
                className="group rounded-2xl border p-4 transition active:scale-[0.99]"
                style={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{
                          background:
                            "linear-gradient(90deg, var(--gold), var(--rose))",
                        }}
                      />
                      <div className="truncate font-semibold">{s.title || "Chat"}</div>
                    </div>

                    <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                      {formatTime(s.createdAt)} • {s.messages.length} messages
                    </div>

                    <div
                      className="mt-2 line-clamp-2 text-sm"
                      style={{ color: "var(--muted)" }}
                    >
                      {s.messages
                        .slice()
                        .reverse()
                        .find((m) => m.role === "user")?.text || "—"}
                    </div>
                  </div>

                  <div
                    className="mt-1 rounded-full px-2 py-1 text-xs font-semibold"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(200,162,74,0.14), rgba(232,166,187,0.16))",
                      color: "var(--fg)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    Open
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}