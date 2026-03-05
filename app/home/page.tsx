"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import BottomNav from "@/components/BottomNav";
import Screen from "@/components/Screen";
import RoutineCard from "@/components/RoutineCard";
import { useAuth } from "@/app/context/AuthContext";
import { lifestyleRoutines, partnerPicks } from "../../lib/data";

import { normalizePlan } from "./_components/PlanGate";
import PartnerPicksGrid from "./_components/PartnerPicksGrid";
import SkincareSection from "./_components/SkincareSection";
import NutritionSection from "./_components/NutritionSection";
import GoldSection from "./_components/GoldSection";
import LifestyleSection from "./_components/LifestyleSection";

import OnboardingModal from "./_components/OnboardingModal";
import { ProfileModal } from "./_components/ProfileModal";

/* your existing getPersonalisedPicks(...) stays here (or move to another file) */
function getPersonalisedPicks(concerns: string[]) {
  const c = concerns.map((x) => x.toLowerCase());
  const pool = [
    { brand: "CeraVe", name: "Hydrating Cleanser", tag: "Dry", note: "Barrier repair", concern: "dry patches" },
    { brand: "Paula's Choice", name: "BHA 2% Exfoliant", tag: "Acne", note: "Pore clearing", concern: "acne" },
    { brand: "The Ordinary", name: "Niacinamide 10%", tag: "Oily", note: "Oil control", concern: "oiliness" },
    { brand: "La Roche-Posay", name: "Toleriane Fluid", tag: "Sensitive", note: "Calming", concern: "redness" },
    { brand: "SkinCeuticals", name: "C E Ferulic", tag: "Brightening", note: "Vitamin C", concern: "dark spots" },
    { brand: "Neutrogena", name: "Retinol 0.1%", tag: "Anti-age", note: "Night repair", concern: "fine lines" },
    { brand: "Cosrx", name: "Snail Mucin Serum", tag: "Repair", note: "Regenerating", concern: "uneven tone" },
    { brand: "Innisfree", name: "Pore Blur SPF50", tag: "SPF", note: "Mattifying", concern: "large pores" },
  ];
  const matched = pool.filter((p) => c.some((x) => p.concern.includes(x)));
  const rest = pool.filter((p) => !matched.includes(p));
  return [...matched, ...rest].slice(0, 3);
}

export default function HomePage() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (user === null) {
      const t = setTimeout(() => {
        if (!user) router.push("/login");
      }, 300);
      return () => clearTimeout(t);
    }
  }, [user]); // eslint-disable-line

  useEffect(() => {
    if (user && !user.isDefault && !user.skinType) setShowOnboarding(true);
  }, [user]);

  if (!user) return null;

  const { isFree, hasSkincare, hasNutrition, isGold } = normalizePlan(user.plan);

  const h = new Date().getHours();
  const greeting = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";

  const picks = user.isDefault ? partnerPicks : getPersonalisedPicks(user.concerns ?? []);

  return (
    <>
      {showOnboarding && (
        <OnboardingModal
          onDone={(skinType: string, concerns: string[]) => {
            updateProfile({ skinType, concerns });
            setShowOnboarding(false);
          }}
        />
      )}

      {profileOpen && <ProfileModal onClose={() => setProfileOpen(false)} />}

      <Screen title="Home" subtitle="Your routine, picks & progress.">
        <div className="flex flex-col gap-4 pb-24">
          {/* Greeting row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-semibold">
                {greeting}, {user.username} 🌷
              </div>
              <div className="text-sm mt-0.5" style={{ color: "var(--muted)" }}>
                {user.skinType ? `${user.skinType} skin · Let's keep your routine on track.` : "Let's keep your routine on track."}
              </div>
            </div>

            <button
              onClick={() => setProfileOpen(true)}
              className="relative flex h-11 w-11 items-center justify-center rounded-full text-base font-bold text-white transition active:scale-95"
              style={{
                background: "linear-gradient(135deg, var(--gold), var(--rose))",
                boxShadow: "0 4px 14px rgba(232,166,187,0.35)",
              }}
              aria-label="Open profile"
            >
              {user.avatar ?? user.username[0].toUpperCase()}
              <span
                className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2"
                style={{ background: "#4ade80", borderColor: "var(--card)" }}
              />
            </button>
          </div>

          {/* Free plan: only partner products/events that monetize */}
          {isFree && (
            <>
              <div
                className="rounded-2xl border p-4"
                style={{ background: "var(--card)", borderColor: "var(--border)" }}
              >
                <div className="mb-2 text-sm font-semibold">General skincare tips</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>
                  Keep it gentle, protect your barrier, and be consistent.
                </div>
              </div>

              <PartnerPicksGrid
                title="Partner picks"
                subtitleRight="Sponsored"
                picks={partnerPicks}
              />
            </>
          )}

          {/* Skincare+ packages: show tools + personalized picks + routine */}
          {hasSkincare && (
            <>
              <SkincareSection skinType={user.skinType} concerns={user.concerns} />
              <PartnerPicksGrid
                title="Recommended for you"
                subtitleRight={user.isDefault ? "Partner picks" : "Based on your skin"}
                picks={picks as any}
              />
            </>
          )}

          {/* Nutrition+ packages */}
          {hasNutrition && <NutritionSection />}

          {/* Gold only */}
          {isGold && <GoldSection />}

          {/* Routine checklist (your existing component) */}
          <RoutineCard
            showRewards={hasSkincare}
            title={hasSkincare ? "Your personalized routine" : "AM/PM routine checklist"}
            subtitle={
              hasSkincare
                ? user.skinType
                  ? `${user.skinType} skin · tailored to your concerns.`
                  : "Tailored to your skin profile."
                : "Simple daily steps to keep your skin on track."
            }
          />

          {/* Lifestyle routines */}
          <LifestyleSection lifestyleRoutines={lifestyleRoutines} />
        </div>
      </Screen>

      <BottomNav />
    </>
  );
}