"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/home",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {active && (
          <defs>
            <linearGradient id="rg-home" x1="4" y1="4" x2="20" y2="21" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C8A24A" />
              <stop offset="1" stopColor="#E8A6BB" />
            </linearGradient>
          </defs>
        )}
        <path
          d="M4 11.5L12 4l8 7.5V20a1 1 0 0 1-1 1h-4.5v-5a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 0-.5.5v5H5a1 1 0 0 1-1-1V11.5Z"
          fill={active ? "url(#rg-home)" : "none"}
          stroke={active ? "none" : "#C0B8C4"}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    href: "/chat",
    label: "Chat",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {active && (
          <defs>
            <linearGradient id="rg-chat" x1="2" y1="2" x2="22" y2="20" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C8A24A" />
              <stop offset="1" stopColor="#E8A6BB" />
            </linearGradient>
          </defs>
        )}
        <path
          d="M20 3H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3.5l3 3.5 3-3.5H20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Z"
          fill={active ? "url(#rg-chat)" : "none"}
          stroke={active ? "none" : "#C0B8C4"}
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
        <path
          d="M7 10h10M7 14h6"
          stroke={active ? "rgba(255,255,255,0.82)" : "#C0B8C4"}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    href: "/settings",
    label: "Settings",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        {active && (
          <defs>
            <linearGradient id="rg-settings" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
              <stop stopColor="#C8A24A" />
              <stop offset="1" stopColor="#E8A6BB" />
            </linearGradient>
          </defs>
        )}
        <path
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065Z"
          fill={active ? "url(#rg-settings)" : "none"}
          stroke={active ? "none" : "#C0B8C4"}
          strokeWidth="1.6"
        />
        <circle
          cx="12"
          cy="12"
          r="2.8"
          fill={active ? "rgba(255,255,255,0.88)" : "none"}
          stroke={active ? "none" : "#C0B8C4"}
          strokeWidth="1.6"
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      <style>{`
        @keyframes tab-pop {
          0%   { transform: scale(0.80); }
          55%  { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        .tab-active-icon {
          animation: tab-pop 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .tab-link {
          -webkit-tap-highlight-color: transparent;
        }
        .tab-inner {
          transition: opacity 0.15s ease, transform 0.15s ease;
        }
        .tab-link:active .tab-inner {
          opacity: 0.6;
          transform: scale(0.92);
        }
      `}</style>

      <nav
        className="fixed inset-x-0 bottom-0 z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Frosted glass panel — the clear separator from content */}
        <div
          style={{
            background: "rgba(255, 250, 248, 0.82)",
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            borderTop: "1px solid rgba(232, 166, 187, 0.28)",
            boxShadow: "0 -1px 0 0 rgba(200,162,74,0.10), 0 -12px 32px rgba(232,166,187,0.14)",
          }}
        >
          {/* Subtle rose-gold shimmer line at the very top edge */}
          <div
            aria-hidden="true"
            style={{
              height: 1,
              marginBottom: -1,
              background:
                "linear-gradient(90deg, transparent 0%, rgba(200,162,74,0.45) 30%, rgba(232,166,187,0.55) 70%, transparent 100%)",
            }}
          />

          {/* Tab row */}
          <div className="mx-auto max-w-md px-4 py-2">
            <div className="grid grid-cols-3">
              {tabs.map((t) => {
                const active = isActive(t.href);
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className="tab-link flex justify-center"
                  >
                    <div className="tab-inner flex flex-col items-center gap-1.5 pt-2 pb-1 px-4">
                      {/* Icon */}
                      <span className={active ? "tab-active-icon" : ""}>
                        {t.icon(active)}
                      </span>

                      {/* Label */}
                      <span
                        className="text-[10px] font-semibold tracking-wide leading-none"
                        style={
                          active
                            ? {
                                background: "linear-gradient(90deg, #C8A24A, #E8A6BB)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontFamily: "'SF Pro Rounded', 'SF Pro Text', system-ui, sans-serif",
                              }
                            : {
                                color: "#C0B8C4",
                                fontFamily: "'SF Pro Rounded', 'SF Pro Text', system-ui, sans-serif",
                              }
                        }
                      >
                        {t.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}