function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function hasAny(text: string, words: string[]) {
  const t = text.toLowerCase();
  return words.some((w) => t.includes(w));
}

// ── CHITCHAT DETECTORS ───────────────────────────────────────────────────────
function skincareAddon(profile?: any): string {
  if (!profile) return "";

  return `

---

✨ **Extra Skincare Personalisation**

Based on your profile:
- Skin type: ${profile.skinType ?? "unknown"}
- Goal: ${profile.goal ?? "general skin health"}

Tips:
- Stick to a consistent routine for at least 6–8 weeks.
- Avoid introducing multiple actives at once.
- Hydration and SPF dramatically improve long-term skin health.
`;
}

function nutritionAddon(profile?: any): string {
  return `

---

🥗 **Nutrition for Better Skin**

Diet plays a real role in skin health:

- Omega-3 foods (salmon, chia seeds, walnuts) help reduce inflammation.
- Zinc-rich foods (pumpkin seeds, lentils) support acne healing.
- Limit high-glycemic foods (sugar, white bread) if breakouts are frequent.
- Drink enough water daily to support skin hydration.

`;
}

function goldAddon(): string {
  return `

---

👑 **Gold Plan Insight**

As a Gold member you can:
- Get deeper routine optimisation
- Receive ingredient compatibility checks
- Access advanced skin analysis features

`;
}

function isGreeting(t: string) {
  return /^(hi|hey|hello|hiya|heya|yo|sup|howdy|helo|hii+|hai|good morning|good evening|good afternoon|morning|evening|afternoon|what'?s up|wazzup|greetings)[\s!?.]*$/.test(
    t.trim(),
  );
}
function isHowAreYou(t: string) {
  return hasAny(t, [
    "how are you",
    "how r u",
    "how are u",
    "you okay",
    "u okay",
    "you good",
    "u good",
    "how's it going",
    "how is it going",
    "how do you do",
    "you doing",
    "u doing",
  ]);
}
function isCompliment(t: string) {
  return hasAny(t, [
    "thank",
    "thanks",
    "love you",
    "love this",
    "great job",
    "amazing",
    "helpful",
    "best",
    "awesome",
    "excellent",
    "brilliant",
    "perfect",
    "good job",
    "well done",
    "you're great",
    "you're amazing",
  ]);
}
function isPersonalQuestion(t: string) {
  return hasAny(t, [
    "your name",
    "who are you",
    "what are you",
    "are you human",
    "are you a bot",
    "are you ai",
    "are you real",
  ]);
}
function isOffTopic(t: string) {
  return hasAny(t, [
    "weather",
    "news",
    "politics",
    "sport",
    "football",
    "basketball",
    "movie",
    "film",
    "music",
    "song",
    "food",
    "recipe",
    "cook",
    "restaurant",
    "travel",
    "holiday",
    "vacation",
    "car",
    "phone",
    "laptop",
    "computer",
    "game",
    "crypto",
    "bitcoin",
    "stock",
    "invest",
    "love",
    "relationship",
    "boyfriend",
    "girlfriend",
    "dating",
    "heartbreak",
    "work",
    "job",
    "salary",
    "school",
    "exam",
    "study",
    "homework",
    "wifi",
    "netflix",
    "tiktok",
    "instagram",
    "twitter",
    "facebook",
    "youtube",
    "shopping",
    "fashion",
    "clothes",
  ]);
}
function isSkinRelated(t: string) {
  return hasAny(t, [
    "skin",
    "acne",
    "pimple",
    "breakout",
    "moistur",
    "cleanser",
    "serum",
    "sunscreen",
    "spf",
    "routine",
    "dark spot",
    "hyperpig",
    "oily",
    "dry",
    "sensitive",
    "redness",
    "pore",
    "wrinkle",
    "retinol",
    "vitamin c",
    "niacinamide",
    "aha",
    "bha",
    "toner",
    "exfoliat",
    "face wash",
    "spot",
    "scar",
    "blemish",
    "cystic",
    "rosacea",
    "eczema",
    "dehydrat",
    "blackhead",
    "whitehead",
    "anti-age",
    "fine line",
    "glow",
    "brightening",
    "barrier",
    "ceramide",
    "hyaluronic",
    "peptide",
  ]);
}

// ── CHITCHAT REPLIES ─────────────────────────────────────────────────────────

function greetingReply(username: string): string {
  const h = new Date().getHours();
  const tod =
    h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return pick([
    `${tod}, ${username}! 🌸 How's your skin feeling today? Ready to keep your routine on track?`,
    `Hey ${username}! 👋 So lovely to hear from you. How has your skin been treating you lately?`,
    `Hello, ${username}! ✨ Hope your day is going beautifully. Shall we check in on your skincare routine?`,
    `Hi ${username}! 🌷 ${tod}! What's on your mind — anything skin-related I can help with today?`,
    `${tod}, ${username}! 💛 Always great to see you here. What skincare question can I tackle for you today?`,
  ]);
}

function howAreYouReply(username: string): string {
  return pick([
    `I'm doing wonderfully, ${username}, thank you for asking! 💛 More importantly — how is your skin doing? Any concerns I can help you with today?`,
    `Honestly? I'm always excited when you check in! 😊 Tell me, how has your skin been feeling lately, ${username}?`,
    `I'm great, thanks for asking! And I'm even better when I get to help with skincare. 🌸 So — what's going on with your skin today, ${username}?`,
    `Glowing as always! ✨ But more importantly — are *you* glowing, ${username}? Let's make sure your skin is too. Any concerns today?`,
  ]);
}

function complimentReply(username: string): string {
  return pick([
    `Aww, that honestly made my day, ${username}! 🥰 I'm always here when you need skincare advice. Anything else on your skin I can help with?`,
    `Thank you so much, ${username}! 💛 That means the world. Remember — consistency is your best skincare secret. Is there anything else you'd like to know?`,
    `You're so kind, ${username}! 🌸 It's my absolute pleasure. Your skin is going to look amazing — keep going with your routine!`,
    `That really means a lot, ${username}! 😊 You're doing amazing. Keep up with your routine and your skin will keep thanking you! 💛`,
  ]);
}

function personalQuestionReply(username: string): string {
  return pick([
    `I'm NEWFACE — your personal skincare assistant! 🌸 I'm AI-powered, not human, but I'm built to give you thoughtful, personalised skincare guidance. What can I help you with today, ${username}?`,
    `Great question! I'm your NEWFACE skincare advisor — think of me as your knowledgeable, beauty-obsessed best friend. 💛 What skin concern can I help you tackle today?`,
    `I'm NEWFACE, your dedicated skincare companion! ✨ I live and breathe skincare routines, ingredients, and everything in between. What can I help you with, ${username}?`,
  ]);
}

function offTopicReply(username: string): string {
  return pick([
    `I'm so sorry, ${username} — I'd genuinely love to hear all about that! 🥺 But let's bring things back to what I do best: your skin. Tell me how your routine is going, or share any concerns and I'll put together a personalised plan for you. 🌸`,
    `Oh ${username}, that sounds so interesting! 😊 But honestly, I wouldn't want to give you bad advice outside of skincare — that's where my heart and knowledge truly live. Let's chat about your skin instead — is there anything you'd like help with for your daily routine?`,
    `Ha, I wish I could help with everything, ${username}! 🌷 But I'd hate to steer you wrong outside of skincare. What I *can* do is build you an amazing personalised routine — so tell me, how is your skin feeling lately?`,
    `I'm so flattered you want to chat about everything with me, ${username}! 💛 But let me be upfront — I'm best kept for skincare, and I don't want to waste your time with things I'm not great at. Now — shall we work on that glowing skin of yours? ✨`,
    `Aww, ${username}! I'd love to be your everything, truly 🥰 — but my superpower is skincare. Let's cut back to what I know best: your daily routine, your skin concerns, and getting you that glow. What's on your skin today?`,
  ]);
}

// ── IMAGE ANALYSIS ───────────────────────────────────────────────────────────

export function analyzePhotoForAcne(username: string = "Tulip"): string {
  // Simulate different acne conditions detected in the photo
  const conditions = [
    "general-acne",
    "cystic-acne",
    "blackheads",
    "whitehead-acne",
    "oily-acne",
  ];

  const detected = pick(conditions);
  const severityOptions = ["mild", "moderate", "severe"];
  const severity = pick(severityOptions);

  const severityText =
    severity === "mild"
      ? "I can see some light breakout activity"
      : severity === "moderate"
        ? "I can see moderate breakout and congestion"
        : "I can see significant acne activity that needs targeted care";

  const opener = pick([
    `📸 **Photo Analysis Complete** — ${username}, here's what I see:`,
    `📸 **Skin Assessment** — I've analyzed your photo, ${username}. Here's my breakdown:`,
    `📸 **Image Analysis Ready** — Great skin shot, ${username}! Here's what the photo reveals:`,
  ]);

  const findings =
    detected === "general-acne"
      ? `**Condition Detected:** General acne with mixed lesions (comedones + papules)\n**Severity:** ${severityText}\n**Primary Issue:** Bacterial colonisation + pore congestion`
      : detected === "cystic-acne"
        ? `**Condition Detected:** Cystic/nodular acne (deep, painful lesions)\n**Severity:** ${severityText}\n**Primary Issue:** Deep inflammation — may require professional intervention`
        : detected === "blackheads"
          ? `**Condition Detected:** Comedonal acne (predominantly blackheads)\n**Severity:** ${severityText}\n**Primary Issue:** Oxidised sebum + dead skin clogging pores`
          : detected === "whitehead-acne"
            ? `**Condition Detected:** Closed comedonal acne (whiteheads)\n**Severity:** ${severityText}\n**Primary Issue:** Trapped sebum beneath skin surface`
            : `**Condition Detected:** Oily, congestion-prone skin with active breakouts\n**Severity:** ${severityText}\n**Primary Issue:** Excess sebum production + bacterial overgrowth`;

  const targetedRoutine =
    detected === "cystic-acne"
      ? `**🌅 AM Routine**
- Gentle cleanser (non-irritating, pH 5.5)
- Azelaic acid 15% (anti-inflammatory, antibacterial) — exceptional for deep acne
- Lightweight moisturiser
- SPF 50 mineral (zinc oxide preferred — calming)

**🌙 PM Routine**
- Gentle cleanser
- Benzoyl peroxide 2.5% (targeted spot treatment on cystic lesions only — not all-over)
- Azelaic acid 15% (all over after BP dries)
- Light moisturiser
- Optional: ice roller before bed to reduce inflammation

**⚠️ Important:** Cystic acne often has a hormonal or internal component. If this persists beyond 4 weeks of treatment, please consult a dermatologist — you may need oral medication (antibiotics, spironolactone, or isotretinoin).

**Weekly additions (weeks 3+):**
- Low-dose retinol 0.025% (1x/week, build slowly) — only after inflammation calms`
      : detected === "blackheads"
        ? `**🌅 AM Routine**
- BHA (salicylic acid 1–2%) cleanser or toner
- Niacinamide 10% serum (pore-minimising)
- Oil-free moisturiser
- SPF 30+

**🌙 PM Routine**
- BHA cleanser (double cleanse if wearing SPF/makeup)
- BHA toner or serum (alternate nights: Mon/Wed/Fri)
- Clay mask (kaolin or bentonite) 1–2x/week, 10 min
- Retinol 0.03% (start 1x/week after BHA established)
- Lightweight moisturiser

**Pro tip:** Blackheads = oxidised sebum, not dirt. BHA is oil-soluble and dives into pores — it's the gold standard. Physical extraction worsens them.`
        : detected === "whitehead-acne"
          ? `**🌅 AM Routine**
- Gentle gel cleanser
- BHA (salicylic acid 1–2%) toner or serum
- Niacinamide 10% (anti-inflammatory)
- Lightweight moisturiser
- SPF 30+

**🌙 PM Routine**
- Gentle cleanser
- BHA toner (3–5x/week)
- Retinol 0.03–0.05% (2–3x/week, not same night as BHA)
- Moisturiser

**Critical:** Never squeeze whiteheads — you'll push bacteria deeper and cause permanent scarring. BHA + retinol are your best friends here.`
          : detected === "oily-acne"
            ? `**🌅 AM Routine**
- Gel or foam cleanser (oil-control formula)
- Niacinamide 10% serum (sebum regulator)
- Oil-free fluid moisturiser (or skip if skin feels hydrated)
- SPF 30+ fluid (NOT cream)

**🌙 PM Routine**
- Gel cleanser (double cleanse)
- BHA toner (3–4x/week) — oil-soluble, tackles sebum at source
- Retinol 0.025% (2–3x/week, alternate with BHA nights)
- Lightweight gel moisturiser

**Key insight:** Oily skin ≠ hydrated skin. You still need moisture, but in lightweight forms. Oil accumulation on skin = bacteria + clogged pores = breakouts.`
            : `**🌅 AM Routine**
- Gentle cleanser
- Niacinamide 10% serum (universally calming)
- Lightweight moisturiser with ceramides
- SPF 30+

**🌙 PM Routine**
- Gentle cleanser
- BHA toner (2–3x/week) — gentler introduction for mixed acne
- Retinol 0.025% (1–2x/week, build slowly)
- Moisturiser

**Ingredient focus:** Start with lower concentrations (salicylic acid 1%, retinol 0.025%) and build tolerance over 4–6 weeks.`;

  const timeline = pick([
    `**⏳ Expected Results:**
- Weeks 1–2: Possible purging (skin brings congestion to surface — normal!)
- Weeks 3–4: Inflammation calms, less red
- Weeks 6–8: Visible improvement in active lesions
- 12+ weeks: Clear, smooth texture`,
    `**📈 Timeline to Clear Skin:**
- Days 1–7: Focus on consistency, not results
- Weeks 2–3: You may see temporary worsening (purging) — this is a good sign
- Weeks 4–6: First signs of improvement appear
- Weeks 8–12: Significant clearing (if routine is consistent)`,
  ]);

  return `${opener}

---

${findings}

---

**💊 Personalised Routine for Your Condition**

${targetedRoutine}

---

${timeline}

---

**⚠️ Safety Checklist**
- ✅ Start with ONE active ingredient (BHA or retinol, not both at once)
- ✅ Patch test on inner arm for 24–48 hours first
- ✅ Wait 5–7 days between introducing new products
- ✅ Use SPF daily — acne treatments make skin sun-sensitive
- ✅ If severe irritation or cysts worsen, pause and see a dermatologist

---

**🚨 When to See a Dermatologist**
If you experience: severe pain, cysts that don't improve in 4 weeks, signs of infection (pus, warmth, spreading), or scarring — professional treatment may be needed.

---

_📸 This analysis is AI-powered and based on visual assessment only. I am not a doctor and cannot diagnose skin conditions. For persistent or severe acne, please consult a dermatologist. Confidence: 81%_`;
}

// ── MAIN EXPORT ──────────────────────────────────────────────────────────────

export function generateAssistantReply(
  userText: string,
  username: string = "Tulip",
  plan: string = "Free plan",
  profile?: { skinType?: string; concerns?: string[]; goal?: string; condition?: string; sleep?: string; water?: string }
): string {
  
  const planLower = (plan ?? "").toLowerCase();
  const isFree = planLower.includes("free");
  const hasSkincare = planLower.includes("skincare") || planLower.includes("nutrition") || planLower.includes("gold");
  const hasNutrition = planLower.includes("nutrition") || planLower.includes("gold");
  const isGold = planLower.includes("gold");

  const skinType = profile?.skinType ?? "unknown";
  const concerns = profile?.concerns ?? [];
  const goal = profile?.goal ?? "general";

  const t = userText.toLowerCase().trim();

  // Chitchat routing — check these first
  if (isGreeting(t)) return greetingReply(username);
  if (isHowAreYou(t)) return howAreYouReply(username);
  if (isCompliment(t)) return complimentReply(username);
  if (isPersonalQuestion(t)) return personalQuestionReply(username);
  if (isOffTopic(t) && !isSkinRelated(t)) return offTopicReply(username);

  // ── SKIN CONCERN ROUTING ──────────────────────────────────────────────────
  const concern = hasAny(t, [
    "acne",
    "pimple",
    "breakout",
    "blemish",
    "zit",
    "cystic",
    "whitehead",
    "blackhead",
  ])
    ? "acne"
    : hasAny(t, [
          "dark spot",
          "spots",
          "hyperpig",
          "pigment",
          "uneven",
          "discolor",
          "melasma",
          "post-acne",
        ])
      ? "darkspots"
      : hasAny(t, ["dry", "flaky", "tight", "dehydrated", "rough", "peeling"])
        ? "dry"
        : hasAny(t, [
              "red",
              "redness",
              "irrit",
              "sensitive",
              "sting",
              "react",
              "flush",
              "rosacea",
            ])
          ? "sensitive"
          : hasAny(t, [
                "oil",
                "oily",
                "shine",
                "shiny",
                "pore",
                "greasy",
                "t-zone",
              ])
            ? "oily"
            : hasAny(t, [
                  "age",
                  "wrinkle",
                  "fine line",
                  "anti-age",
                  "firm",
                  "sag",
                  "collagen",
                ])
              ? "aging"
              : "general";

  // ── ACNE ──────────────────────────────────────────────────────────────────
  if (concern === "acne") {
    const subtype = hasAny(t, ["cystic", "deep", "hormonal", "jawline", "chin"])
      ? "cystic"
      : hasAny(t, ["blackhead", "open pore", "congested"])
        ? "blackhead"
        : hasAny(t, ["whitehead", "closed comedo"])
          ? "whitehead"
          : hasAny(t, ["oily", "oil"])
            ? "oily-acne"
            : "general-acne";

    const opener = pick([
      `Here's your personalised acne routine, ${username}. Acne can feel frustrating — but a consistent, targeted approach makes a real difference.`,
      `Got it, ${username}. Acne is caused by a mix of excess oil, bacteria, and clogged pores — your routine will address all three.`,
      `Let's tackle this properly, ${username}. Here's a routine built around the most evidence-backed ingredients for breakouts.`,
    ]);

    const am = [
      "Gentle, non-comedogenic cleanser (gel or foam)",
      "Niacinamide 10% serum (anti-inflammatory, pore-minimising)",
      "Lightweight oil-free moisturiser",
      "Broad-spectrum SPF 30–50 (non-comedogenic fluid texture)",
    ];
    const pm = [
      "Gentle cleanser — double-cleanse if wearing SPF or makeup",
      subtype === "cystic"
        ? "Benzoyl peroxide 2.5–5% spot treatment (targeted, not all-over)"
        : "BHA (salicylic acid 1–2%) toner or serum — 3–5 nights/week",
      "Retinol 0.025–0.05% (2–3 nights/week, not same night as BHA)",
      "Oil-free moisturiser (non-comedogenic)",
    ];
    const why = [
      "**Salicylic acid (BHA)** is oil-soluble — it gets inside pores to dissolve the sebum + dead skin mix that causes blackheads.",
      "**Niacinamide** calms post-breakout redness, reduces sebum production, and fades post-acne marks.",
      "**Benzoyl peroxide** (cystic types) kills *C. acnes* bacteria directly — the most evidence-backed ingredient for active breakouts.",
      "**Retinol** speeds up cell turnover, preventing clogged pores and fading post-acne hyperpigmentation.",
      "**SPF is non-negotiable** — UV significantly worsens post-acne marks.",
    ];
    const subtypeNote =
      subtype === "cystic"
        ? "\n⚠️ **Cystic / hormonal acne** often needs more than topicals. If breakouts are deep, painful, or recurring around your jawline/chin, consider seeing a dermatologist."
        : subtype === "blackhead"
          ? "\n💡 **Blackhead tip:** A clay mask (kaolin or bentonite) 1–2x/week helps draw out impurities. Avoid physical scrubs — they spread bacteria."
          : subtype === "whitehead"
            ? "\n💡 **Whitehead tip:** Don't squeeze — it pushes bacteria deeper and causes scarring. BHA + retinol are the most effective combo."
            : subtype === "oily-acne"
              ? "\n💡 **Oily + acne:** Skip heavy creams in AM. Niacinamide + SPF fluid alone is enough on top of a cleanser."
              : "";
    const safety = [
      "Introduce **one new active at a time** — wait 5–7 days before adding the next.",
      "Never use BHA and retinol on the same night in the first month.",
      "Patch test everything on your inner arm for 24–48 hrs first.",
      "Purging (initial breakout) is normal with retinol — lasts ~4–6 weeks.",
      "If severe irritation or cysts worsen, pause all actives and see a professional.",
    ];
    const confidence = subtype === "cystic" ? 0.78 : 0.87;
    let out = `${opener}

---

**🌅 AM Routine**
${am.map((s) => `- ${s}`).join("\n")}

**🌙 PM Routine**
${pm.map((s) => `- ${s}`).join("\n")}

---

**🧪 Why these ingredients?**
${why.map((s) => `- ${s}`).join("\n")}
${subtypeNote}

---

**⚠️ Safety & Patch-Test Rules**
${safety.map((s) => `- ${s}`).join("\n")}

---

**📅 Week-by-week intro guide**
- Week 1: Cleanser + Niacinamide + moisturiser + SPF only
- Week 2: Add BHA (2x this week)
- Week 3: Increase BHA to 3–4x/week
- Week 4: Introduce retinol (1x this week, then build slowly)

_Confidence (prototype): ${(confidence * 100).toFixed(0)}% · This is not medical advice._`;

    if (hasSkincare) out += skincareAddon(profile);
    if (hasNutrition) out += nutritionAddon(profile);
    if (isGold) out += goldAddon();

    if (isFree) {
      out += `
  
---

🔒 **Free plan note**
You get **3 AI chats per day**. Upgrade to unlock unlimited chat + personalized plans.`;
  }

  // ✅ AND RETURN IT
  return out;
}

  // ── DARK SPOTS ────────────────────────────────────────────────────────────
  if (concern === "darkspots") {
    return `${pick([`Post-acne marks and dark spots are super common, ${username} — and very treatable.`, `Fading hyperpigmentation takes consistency, ${username}, but you'll see real results within 8–12 weeks.`])}

---

**🌅 AM Routine**
- Gentle cleanser
- Vitamin C 10–15% (L-ascorbic acid) — brightening + antioxidant
- Lightweight moisturiser
- SPF 50 (critical — UV makes spots 3× darker)

**🌙 PM Routine**
- Gentle cleanser
- Niacinamide 10% or Tranexamic acid serum
- Retinol 0.05% (3x/week) — accelerates cell turnover
- Moisturiser

---

**🧪 Why these ingredients?**
- Vitamin C inhibits melanin production and brightens existing marks.
- Niacinamide prevents melanin transfer to the skin surface.
- Tranexamic acid is gentler than hydroquinone and very effective for melasma.
- SPF is the single most important step — without it, brightening products barely work.

---

**📅 Expected timeline**
- Weeks 1–4: Skin tone may look more even
- Weeks 8–12: Visible fading of marks
- 3–6 months: Significant clearing (if SPF is consistent)

_Confidence (prototype): 83% · This is not medical advice._`;
  }

  // ── DRY ───────────────────────────────────────────────────────────────────
  if (concern === "dry") {
    return `${pick([`Dry skin is often about the skin barrier, ${username} — once you repair it, everything improves.`, `Tight, flaky skin usually means your barrier needs more support, ${username}. Here's a barrier-first routine.`])}

---

**🌅 AM Routine**
- Cream or milk cleanser (avoid foamy/gel — these strip moisture)
- Hyaluronic acid serum (apply on damp skin for best effect)
- Rich moisturiser with ceramides + shea butter
- SPF 30–50 (look for hydrating formulas with glycerin)

**🌙 PM Routine**
- Cream cleanser or micellar water
- Hyaluronic acid serum
- Barrier repair cream (ceramides, fatty acids, cholesterol)
- Facial oil as last step (rosehip, squalane) to seal moisture in

---

**🧪 Why these ingredients?**
- Ceramides rebuild the lipid layer that keeps moisture locked in.
- Hyaluronic acid holds up to 1000× its weight in water — applied to damp skin.
- Facial oils create an occlusive seal — they don't add moisture, they trap it.

---

**⚠️ Safety Notes**
- Avoid hot showers — they strip skin oils.
- Alcohol-based toners will worsen dryness.
- If skin is cracking or very inflamed, see a dermatologist (could be eczema).

_Confidence (prototype): 85% · This is not medical advice._`;
  }

  // ── SENSITIVE ─────────────────────────────────────────────────────────────
  if (concern === "sensitive") {
    return `Sensitive skin needs a "less is more" approach, ${username} — every extra product is a potential trigger.

---

**🌅 AM Routine**
- Rinse with cool water only (or ultra-gentle milky cleanser)
- Barrier moisturiser (ceramides, no fragrance, no alcohol)
- Mineral SPF (zinc oxide — sits on skin, less reaction risk)

**🌙 PM Routine**
- Ultra-gentle cleanser (pH balanced, fragrance-free)
- Barrier moisturiser (same as AM, or richer version)
- Optional: 1–2 drops of squalane oil over moisturiser

---

**🧪 Why this approach?**
- Fragrance is the #1 cause of cosmetic contact dermatitis — eliminate it.
- Mineral sunscreen avoids chemical filters that commonly sting reactive skin.
- Ceramides + fatty acids rebuild the barrier, often compromised in sensitive skin.

---

**⚠️ Safety Notes**
- Avoid retinol, AHAs, BHAs until skin is calm for 30+ days.
- Keep your routine to 3 products max until you know your triggers.
- If redness is chronic or burning, consider rosacea — a dermatologist can help.

_Confidence (prototype): 76% · This is not medical advice._`;
  }

  // ── OILY ──────────────────────────────────────────────────────────────────
  if (concern === "oily") {
    return `Oily skin doesn't need to be stripped, ${username} — over-cleansing actually triggers more oil production.

---

**🌅 AM Routine**
- Foaming or gel cleanser (pH 4.5–5.5)
- Niacinamide 10% serum (oil control + pore appearance)
- Lightweight gel-cream moisturiser (don't skip this!)
- SPF fluid (mattifying formula if preferred)

**🌙 PM Routine**
- Double cleanse if wearing SPF/makeup (oil cleanser → gel cleanser)
- BHA (salicylic acid 2%) toner — 4–5x/week
- Oil-free gel moisturiser

---

**🧪 Why these ingredients?**
- Niacinamide regulates sebum production — results visible in 4–8 weeks.
- BHA is oil-soluble and gets inside pores to clear congestion.
- Skipping moisturiser = more oil. Your skin compensates by producing more.

---

**⚠️ Safety Notes**
- Clay masks (1–2x/week) help absorb excess sebum.
- Don't over-cleanse — twice daily max.
- SPF is still essential, even for oily skin.

_Confidence (prototype): 86% · This is not medical advice._`;
  }

  // ── AGING ─────────────────────────────────────────────────────────────────
  if (concern === "aging") {
    return `Anti-ageing is one of the most evidence-backed areas in skincare, ${username}. A few key ingredients do most of the work.

---

**🌅 AM Routine**
- Gentle cleanser
- Vitamin C 10–20% (antioxidant + collagen support)
- Peptide serum (excellent long-term)
- Moisturiser with hyaluronic acid + ceramides
- SPF 50 (the single best anti-ageing product that exists)

**🌙 PM Routine**
- Gentle cleanser
- Retinol 0.05–0.1% (gold standard for wrinkles + texture)
- Rich moisturiser (ceramides + peptides)

---

**🧪 Why these ingredients?**
- Retinol is the most clinically proven ingredient for fine lines — boosts collagen, speeds cell turnover.
- Vitamin C + SPF together block 96%+ of photoageing (the main cause of wrinkles).
- Peptides signal the skin to produce more collagen — great complement to retinol.

---

**⚠️ Safety Notes**
- Never use Vitamin C and retinol in the same routine (different pH needs).
- Build retinol up very slowly — start 1x/week for a month.
- Retinol causes photosensitivity — SPF in AM is non-negotiable.

_Confidence (prototype): 88% · This is not medical advice._`;
  }

  // ── GENERAL FALLBACK ──────────────────────────────────────────────────────
  return `${pick([
    `Here's a solid, evidence-backed foundation routine to start with, ${username}.`,
    `A simple consistent routine beats complicated expensive ones every time. Here's your starter, ${username}:`,
    `Let's build you a clean baseline, ${username}. Tell me your specific concerns and I'll personalise it further!`,
  ])}

---

**🌅 AM Routine**
- Gentle pH-balanced cleanser
- Niacinamide serum (brightening, barrier support, oil control)
- Moisturiser (ceramide-based)
- SPF 30–50 (daily, even indoors)

**🌙 PM Routine**
- Gentle cleanser
- Optional: retinol 0.025% (2x/week to start)
- Moisturiser

---

**🧪 Why this works**
- Consistent cleansing + moisture + SPF is the foundation every dermatologist recommends.
- Niacinamide is one of the most versatile and well-tolerated actives for all skin types.
- Retinol (optional) delivers long-term benefits for texture, pores, and fine lines.

---

**⚠️ Safety Notes**
- Introduce one new product at a time (5–7 days between each).
- Patch test on inner arm before applying to full face.
- If any burning or rash occurs, discontinue immediately.

💬 **Tell me your specific concern** — acne, dark spots, dryness, oiliness, sensitivity, or ageing — and I'll give you a much more targeted routine!

_Confidence (prototype): 79% · This is not medical advice._`;
}
