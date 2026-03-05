import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

export function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(21,19,22,0.40)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl p-6"
        style={{
          background: "var(--card)",
          boxShadow: "0 -10px 40px rgba(21,19,22,0.14)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="mx-auto mb-5 h-1 w-10 rounded-full"
          style={{ background: "var(--border)" }}
        />

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2 mb-5">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white"
            style={{
              background: "linear-gradient(135deg, var(--gold), var(--rose))",
            }}
          >
            {user.avatar ?? user.username[0].toUpperCase()}
          </div>
          <div className="text-lg font-semibold">{user.username}</div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            {user.email}
          </div>
          <span
            className="rounded-full border px-3 py-0.5 text-xs font-semibold"
            style={{
              background:
                "linear-gradient(90deg, rgba(200,162,74,0.12), rgba(232,166,187,0.14))",
              borderColor: "var(--border)",
            }}
          >
            {user.plan ?? "Free plan"}
          </span>
        </div>

        {/* Details */}
        <div
          className="rounded-2xl border p-4 text-sm flex flex-col gap-2"
          style={{
            background: "rgba(255,255,255,0.70)",
            borderColor: "var(--border)",
          }}
        >
          <div>
            <span className="font-semibold">Skin Type: </span>
            {user.skinType ?? (
              <span style={{ color: "var(--muted)" }}>Not set yet</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Concerns: </span>
            {user.concerns && user.concerns.length > 0 ? (
              user.concerns.join(", ")
            ) : (
              <span style={{ color: "var(--muted)" }}>None added yet</span>
            )}
          </div>
          <div>
            <span className="font-semibold">Account: </span>
            {user.isDefault ? "Default account" : "Member"}
          </div>
        </div>

        <button
            onClick={() => router.push("/profile/edit")}
            className="mt-4 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
            style={{
                background: "rgba(255,255,255,0.75)",
                borderColor: "var(--border)",
                color: "var(--fg)",
            }}
            >
            Edit Profile
        </button>

        <button
          onClick={handleLogout}
          className="mt-2 w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition active:scale-[0.99]"
          style={{
            background: "rgba(232,100,100,0.08)",
            borderColor: "rgba(232,100,100,0.25)",
            color: "#C0392B",
          }}
        >
          Log Out
        </button>

        <button
          className="mt-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(90deg, var(--gold), var(--rose))",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}