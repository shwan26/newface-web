"use client";

import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import { deleteAllSessions } from "@/lib/storage";
import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [savePhotos, setSavePhotos] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("newface.savePhotos.v2");
    setSavePhotos(raw === "true");
  }, []);

  function toggleSavePhotos() {
    const next = !savePhotos;
    setSavePhotos(next);
    localStorage.setItem("newface.savePhotos.v2", String(next));
  }

  function clearHistory() {
    deleteAllSessions();
    alert("History cleared on this device.");
  }

  return (
    <>
      <Screen title="Settings" subtitle="Premium prototype controls (privacy-first).">
        <div className="flex flex-col gap-3">
          {/* Privacy card */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
            }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-semibold">Save photos</div>
                <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
                  Prototype toggle. This demo doesn’t upload images to a server.
                </div>
              </div>

              {/* Premium toggle */}
              <button
                onClick={toggleSavePhotos}
                className="relative h-9 w-16 rounded-full border transition active:scale-[0.99]"
                style={{
                  background: savePhotos
                    ? "linear-gradient(90deg, var(--gold), var(--rose))"
                    : "rgba(21,19,22,0.07)",
                  borderColor: "var(--border)",
                  boxShadow: savePhotos
                    ? "0 10px 25px rgba(232,166,187,0.22)"
                    : "none",
                }}
                aria-label="toggle save photos"
              >
                <span
                  className="absolute top-1 h-7 w-7 rounded-full transition"
                  style={{
                    left: savePhotos ? "34px" : "4px",
                    background: "white",
                    boxShadow: "0 12px 20px rgba(21,19,22,0.10)",
                  }}
                />
              </button>
            </div>

            <div
              className="mt-4 rounded-xl border p-3 text-xs"
              style={{
                borderColor: "var(--border)",
                background:
                  "linear-gradient(90deg, rgba(232,166,187,0.14), rgba(200,162,74,0.10))",
                color: "var(--muted)",
              }}
            >
              Tip: For real product, add consent + retention period + delete button per session.
            </div>
          </div>

          {/* Data card */}
          <div
            className="rounded-2xl border p-4"
            style={{
              background: "var(--card)",
              borderColor: "var(--border)",
              boxShadow: "0 10px 30px rgba(21,19,22,0.06)",
            }}
          >
            <div className="text-sm font-semibold">Data</div>
            <div className="mt-1 text-xs" style={{ color: "var(--muted)" }}>
              Chats are stored locally in your browser (localStorage).
            </div>

            <button
              onClick={clearHistory}
              className="mt-3 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition hover:brightness-[0.99] active:scale-[0.99]"
              style={{
                background: "var(--card-2)",
                borderColor: "var(--border)",
                color: "var(--fg)",
              }}
            >
              Clear chat history
            </button>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-2xl border p-4 text-xs"
            style={{
              borderColor: "var(--border)",
              background:
                "linear-gradient(90deg, rgba(200,162,74,0.10), rgba(232,166,187,0.12))",
              color: "var(--muted)",
            }}
          >
            Prototype disclaimer: Guidance only, not a medical diagnosis. If symptoms are severe or persistent, consult a dermatologist.
          </div>
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}