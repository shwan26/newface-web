import { Suspense } from "react";
import ChatClient from "./ChatClient";

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatClient />
    </Suspense>
  );
}

function ChatSkeleton() {
  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-6">
      <div className="mb-4">
        <div className="h-6 w-40 rounded bg-black/5" />
        <div className="mt-2 h-4 w-72 rounded bg-black/5" />
      </div>
      <div className="rounded-3xl border bg-white/70 p-4 backdrop-blur-xl"
        style={{ borderColor: "var(--border)", boxShadow: "var(--shadow)" }}
      >
        <div className="h-[52vh] rounded-2xl bg-black/5" />
        <div className="mt-3 h-12 rounded-2xl bg-black/5" />
      </div>
    </div>
  );
}