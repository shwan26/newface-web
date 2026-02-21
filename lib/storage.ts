import type { ChatSession } from "./types";

const KEY = "newface.sessions.v2";

export function loadSessions(): ChatSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChatSession[]) : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(KEY, JSON.stringify(sessions));
}

export function upsertSession(session: ChatSession) {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  const next = [...sessions];
  if (idx >= 0) next[idx] = session;
  else next.unshift(session);
  saveSessions(next);
}

export function getSession(id: string): ChatSession | null {
  return loadSessions().find((s) => s.id === id) ?? null;
}

export function deleteAllSessions() {
  localStorage.removeItem(KEY);
}

