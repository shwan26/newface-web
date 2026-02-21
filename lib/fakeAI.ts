function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function hasAny(text: string, words: string[]) {
  const t = text.toLowerCase();
  return words.some((w) => t.includes(w));
}

export function generateAssistantReply(userText: string) {
  const t = userText.toLowerCase();

  const concern =
    hasAny(t, ["acne", "pimple", "breakout"]) ? "acne" :
    hasAny(t, ["dark spot", "spots", "hyperpig", "pigment"]) ? "darkspots" :
    hasAny(t, ["dry", "flaky", "tight"]) ? "dry" :
    hasAny(t, ["red", "redness", "irrit", "sensitive"]) ? "sensitive" :
    hasAny(t, ["oil", "oily", "shine", "pores"]) ? "oily" :
    "general";

  const opener = pick([
    "Here’s a quick premium-style routine draft you can start today.",
    "Keeping it minimal and effective — here’s your routine draft.",
    "Got it. Here’s a simple routine (prototype guidance).",
  ]);

  const am: string[] = ["Gentle cleanser", "Moisturizer", "Sunscreen SPF 30+ (daily)"];
  const pm: string[] = ["Gentle cleanser", "Moisturizer"];

  const why: string[] = [];
  const safety: string[] = [
    "Patch test new products",
    "Introduce one new active at a time (3–5 days)",
    "If irritation persists, pause and seek professional advice",
  ];

  if (concern === "acne") {
    pm.splice(1, 0, "BHA (salicylic acid) 2–4 nights/week");
    why.push("BHA supports clogged pores and breakouts.");
    safety.push("Avoid layering multiple strong actives on the same night.");
  } else if (concern === "darkspots") {
    am.splice(1, 0, "Vitamin C (AM) or Niacinamide (gentler)");
    why.push("Brightening + daily sunscreen improves spots over time.");
    safety.push("Start every other day if sensitive.");
  } else if (concern === "dry") {
    am[1] = "Richer moisturizer (ceramides)";
    pm[1] = "Richer moisturizer (ceramides)";
    pm.splice(1, 0, "Hydrating serum (hyaluronic acid)");
    why.push("Hydration + barrier support reduces tightness and flaking.");
  } else if (concern === "sensitive") {
    am.splice(0, am.length, "Very gentle cleanser (or rinse AM)", "Barrier moisturizer (ceramides)", "Mineral sunscreen (if tolerated)");
    pm.splice(0, pm.length, "Very gentle cleanser", "Barrier moisturizer (ceramides)");
    why.push("Sensitive skin improves with fewer steps and barrier-first care.");
    safety.push("Avoid fragrance and strong acids until calm.");
  } else if (concern === "oily") {
    am[1] = "Lightweight moisturizer (gel-cream)";
    pm.splice(1, 0, "Niacinamide (daily)");
    why.push("Niacinamide can support oil control and the look of pores.");
  } else {
    pm.splice(1, 0, "Niacinamide (optional, daily)");
    why.push("A consistent simple routine is easiest to maintain.");
  }

  const confidence =
    concern === "sensitive" ? 0.76 :
    concern === "general" ? 0.79 :
    0.84;

  return `${opener}

**AM**
- ${am.join("\n- ")}

**PM**
- ${pm.join("\n- ")}

**Why**
- ${why.join("\n- ")}

**Safety**
- ${safety.join("\n- ")}

_Confidence (prototype): ${(confidence * 100).toFixed(0)}%_`;
}