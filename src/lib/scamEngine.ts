export type RiskLevel = "high" | "suspicious" | "safe";

export interface ScamResult {
  level: RiskLevel;
  title: string;
  summary: string;
  advice: string[];
  signals: string[];
}

export interface Signal {
  pattern: RegExp;
  weight: number;
  label: string;
}

/**
 * Curated list of known scam phrases and patterns, drawn from real-world
 * scam reports (FTC, AARP, consumer protection agencies). Each entry matches
 * a phrase or tactic scammers actually use, beyond generic keyword guesses.
 */
export const SIGNALS: Signal[] = [
  // --- Urgency / pressure ---
  { pattern: /\b(urgent|immediately|right now|asap|act now|before it'?s too late|time sensitive|final notice|last chance|don'?t delay)\b/i, weight: 3, label: "Creates a false sense of urgency" },
  { pattern: /\b(in \d+ (hour|minute|day)s?|within \d+ (hour|minute|day)s?|today only|expires (today|in \d+))\b/i, weight: 3, label: "Threatens a fast deadline" },
  { pattern: /\b(don'?t|do not) (call|tell|contact) (your|his|her|their)? ?(mom|mother|dad|father|family|parents|son|daughter|wife|husband|police|anyone)\b/i, weight: 5, label: "Tells you not to tell family or police" },
  { pattern: /\bkeep this (a )?secret|don'?t tell anyone|this stays between us\b/i, weight: 4, label: "Asks you to keep it secret" },

  // --- Money / gift cards / crypto / wire ---
  { pattern: /\bgift card(s)?\b/i, weight: 5, label: "Asks for gift cards as payment" },
  { pattern: /\b(apple|google|steam|amazon|target|walmart|ebay|best buy) gift card/i, weight: 5, label: "Asks for a specific brand of gift card" },
  { pattern: /\b(read|scratch) (the back of|off) the card|send us the (code|pin|numbers) (on|from) the (back of the )?card\b/i, weight: 5, label: "Wants the gift card codes" },
  { pattern: /\b(bitcoin|crypto|cryptocurrency|wire transfer|western union|moneygram|venmo|zelle|paypal|cash app|coinbase)\b/i, weight: 4, label: "Asks for hard-to-trace payment" },
  { pattern: /\b(send (money|cash|funds)|wire (money|funds)|deposit (a )?check)\b/i, weight: 3, label: "Asks you to send or wire money" },
  { pattern: /\$?\s?\d{3,}(\.\d{2})?/i, weight: 2, label: "Mentions a specific amount of money" },
  { pattern: /\b(bail|bond|fine|fee|tax(es)?|payment|invoice|overdue|balance due|processing fee|release fee|clearance fee)\b/i, weight: 2, label: "Mentions a debt or legal payment" },
  { pattern: /\b(refund(ed)?|rebate|money back|overpaid|refund (you|your) (money|account))\b/i, weight: 3, label: "Offers a surprise refund" },

  // --- Threats / fear ---
  { pattern: /\b(arrest(ed)?|jail|prison|warrant|deport(ed|ation)?|lawsuit|sued|court (date|summons)|police are on their way|going to (jail|prison))\b/i, weight: 4, label: "Threatens legal action or arrest" },
  { pattern: /\b(ssn (will be|is) (suspended|canceled|revoked)|your (social security|ssn) (number|is) (suspended|blocked|flagged))\b/i, weight: 5, label: "Claims your Social Security number is suspended" },
  { pattern: /\b(account (will be )?(deleted|closed|suspended|terminated|locked|disabled|restricted|deactivated))\b/i, weight: 3, label: "Threatens to close your account" },
  { pattern: /\b(your (grand)?son|granddaughter|grandchild|nephew|niece)\b.*\b(car crash|accident|hospital|hurt|injured|emergency|surgery|bail|jail)\b/i, weight: 5, label: "Claims a family emergency with a request for money" },
  { pattern: /\b(grandparent|grandma|grandpa|nana|papa|pop-?pop)\b.*\b(accident|hospital|hurt|emergency|money|gift card|bail)\b/i, weight: 4, label: "Targets a grandparent with an emergency plea" },

  // --- Links / credentials / phishing ---
  { pattern: /\b(click here|click the link|tap here|follow this link|open the link|visit (this|the) link)\b/i, weight: 3, label: "Pushes you to click a link" },
  { pattern: /https?:\/\/\S+/i, weight: 2, label: "Contains a web link" },
  { pattern: /\b(bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly|is\.gd|buff\.ly|rebrand\.ly|cutt\.ly)\b/i, weight: 3, label: "Uses a shortened link that hides the real address" },
  { pattern: /\b(verify|confirm|update|re-?verify|validate) (your )?(account|card|details|information|password|identity|ssn|social security|billing)\b/i, weight: 3, label: "Asks you to verify personal information" },
  { pattern: /\b(password|pin|otp|one[- ]time (code|password)|social security|ssn|cvv|mother'?s maiden name)\b/i, weight: 4, label: "Asks for passwords or private codes" },
  { pattern: /\b(log in (to|and) (confirm|verify|update)|sign in (to|and) (confirm|verify|update))\b/i, weight: 3, label: "Pushes you to log in to a fake page" },

  // --- Impersonation / authority ---
  { pattern: /\b(irs|treasury|social security administration|medicare|medicaid|bank of america|wells fargo|chase|citibank|pnc|td bank|capital one)\b/i, weight: 3, label: "Claims to be a government agency or bank" },
  { pattern: /\b(prize|sweepstakes|lottery|winner|you(?:'ve| have) won|congratulations|claim your (prize|winnings|reward))\b/i, weight: 4, label: "Claims you won a prize or lottery" },
  { pattern: /\b(tech support|microsoft|apple support|windows support|amazon support|geek squad|norton|mcafee|your (computer|pc|device) (has|is) (infected|compromised|in danger|at risk))\b/i, weight: 4, label: "Claims to be tech support or says your device is infected" },
  { pattern: /\b(amazon (is )?(canceling|cancel|closing) (your )?order|your (amazon|netflix|apple|paypal|ebay) (order|account) (has been|is) (canceled|cancelled|suspended|on hold))\b/i, weight: 4, label: "Claims a familiar company is canceling your order or account" },
  { pattern: /\b(usps|ups|fedex|dhl|postal service|delivery (is )?(pending|held|delayed)|package (is )?(on hold|waiting|undeliverable)|shipping (fee|charge|label))\b/i, weight: 3, label: "Claims a delivery problem and asks for a fee or details" },
  { pattern: /\b(utility|electric|gas|water|power) (company|bill|service).{0,30}(shut off|disconnected|cut off|past due|overdue)\b/i, weight: 4, label: "Threatens to shut off your utilities" },

  // --- Romance / investment / job ---
  { pattern: /\b(invest(ment)?|crypto opportunity|guaranteed return|double your money|passive income|forex|trading (bot|platform))\b/i, weight: 3, label: "Pushes an investment opportunity" },
  { pattern: /\b(i love you|i miss you|darling|honey|sweetheart|my dear|soulmate|we were meant to be)\b/i, weight: 1, label: "Uses overly familiar affection language" },
  { pattern: /\b(work from home|earn \$\d+ (a|per) (day|week|hour)|mystery shopper|data entry (job|position)|package (forwarding|reshipping))\b/i, weight: 3, label: "Offers a too-good-to-be-true job" },
  { pattern: /\b(cash (a )?check (for|and) (send|wire|transfer)|reship|reshipping|forward (this|the) package)\b/i, weight: 5, label: "Asks you to cash a check and send money back" },

  // --- Misc real scammer lingo ---
  { pattern: /\b(this is (your )?(grand)?son|it'?s me|it'?s your (grand)?son|guess who this is)\b/i, weight: 3, label: "Hides who is really calling ('it's me')" },
  { pattern: /\b(i'?m (in|at) the (hospital|jail|police station|airport|border) and i (need|require) (money|help|a lawyer))\b/i, weight: 5, label: "Claims to be stranded and needs money fast" },
  { pattern: /\b(activation fee|release fee|clearance fee|transfer fee|processing (fee|charge))\b/i, weight: 4, label: "Charges a fee to 'release' a prize or money" },
  { pattern: /\b(remote (access|desktop)|install (this|a) (software|app|program)|teamviewer|anydesk)\b/i, weight: 5, label: "Wants remote access to your device" },

  // --- Safe signals (negative weight) ---
  { pattern: /\b(sunday dinner|family dinner|see you (on )?(sunday|monday|tuesday|wednesday|thursday|friday|saturday))\b/i, weight: -2, label: "Mentions an ordinary family plan" },
  { pattern: /\b(love,?\s|miss you,?\s|hugs,?\s|talk soon,?\s)/i, weight: -1, label: "Friendly, personal sign-off" },
];

interface MatchedSignal extends Signal {
  matchedText: string;
}

export function analyzeText(input: string): ScamResult {
  const text = input.trim();
  const matched: MatchedSignal[] = [];
  let score = 0;

  for (const signal of SIGNALS) {
    const m = text.match(signal.pattern);
    if (m) {
      score += signal.weight;
      if (signal.weight > 0) {
        matched.push({ ...signal, matchedText: m[0] });
      }
    }
  }

  if (text.length > 0 && text.length < 60 && score <= 0) score -= 1;

  let level: RiskLevel;
  if (score >= 8) level = "high";
  else if (score >= 3) level = "suspicious";
  else level = "safe";

  const signals = matched.map((m) => m.label);
  return buildResult(level, signals, matched, text);
}

function hasSignal(matched: MatchedSignal[], labels: string[]): boolean {
  return matched.some((m) => labels.includes(m.label));
}

function buildResult(
  level: RiskLevel,
  signals: string[],
  matched: MatchedSignal[],
  text: string,
): ScamResult {
  if (level === "high") {
    const advice: string[] = [];

    if (hasSignal(matched, [
      "Claims a family emergency with a request for money",
      "Targets a grandparent with an emergency plea",
      "Hides who is really calling ('it's me')",
    ])) {
      advice.push(
        "This message claims a family member is in trouble. Do not send money. Call that person directly on a phone number you already know to check if they are really okay.",
      );
    }

    if (hasSignal(matched, [
      "Asks for gift cards as payment",
      "Asks for a specific brand of gift card",
      "Wants the gift card codes",
    ])) {
      advice.push(
        "No real business or government office will ever ask you to pay with gift cards. Anyone who does is a scammer. Do not buy or share any gift card codes.",
      );
    }

    if (hasSignal(matched, ["Asks for hard-to-trace payment", "Asks you to send or wire money"])) {
      advice.push(
        "Do not send money through wire transfer, Bitcoin, Cash App, Zelle, or any other hard-to-trace method. Once it is sent, you cannot get it back.",
      );
    }

    if (hasSignal(matched, [
      "Threatens legal action or arrest",
      "Claims your Social Security number is suspended",
    ])) {
      advice.push(
        "The real IRS, police, and Social Security office never call to threaten you with arrest over the phone. Hang up — this is a scare tactic.",
      );
    }

    if (hasSignal(matched, ["Wants remote access to your device"])) {
      advice.push(
        "Never let a stranger install software or take remote control of your computer. Hang up and call a trusted family member or a known tech shop.",
      );
    }

    if (hasSignal(matched, ["Asks for passwords or private codes", "Pushes you to log in to a fake page"])) {
      advice.push(
        "Do not give out your password, PIN, or one-time code. A real company will never ask for these over a text, email, or phone call.",
      );
    }

    if (hasSignal(matched, ["Pushes you to click a link", "Contains a web link", "Uses a shortened link that hides the real address"])) {
      advice.push("Do not click any links in this message. They can lead to fake websites that steal your information.");
    }

    if (hasSignal(matched, ["Tells you not to tell family or police", "Asks you to keep it secret"])) {
      advice.push("This message tells you to keep it a secret. That is a huge warning sign. Call a trusted family member right now and read them this message.");
    }

    if (hasSignal(matched, ["Claims you won a prize or lottery", "Charges a fee to 'release' a prize or money"])) {
      advice.push("You cannot win a prize you never entered, and real prizes never require a fee. Do not pay any 'processing' or 'clearance' fee.");
    }

    if (hasSignal(matched, ["Asks you to cash a check and send money back"])) {
      advice.push("This is a fake-check scam. The check will bounce and you will be responsible for the money. Do not deposit it or send anything back.");
    }

    advice.push("Call a trusted family member and read them this message before you do anything.");
    advice.push("If you already sent money or gave out information, call your bank right away.");

    return {
      level,
      title: "High Scam Risk",
      summary: "This message has several warning signs of a scam. Stop and do not do what it asks.",
      advice,
      signals,
    };
  }

  if (level === "suspicious") {
    const advice: string[] = [];

    if (hasSignal(matched, ["Threatens to close your account", "Claims a familiar company is canceling your order or account"])) {
      advice.push(
        "This message claims a problem with your account. Do not click the link. If you are worried, open your app or call the company using the phone number on your card or bill.",
      );
    }

    if (hasSignal(matched, ["Pushes you to click a link", "Contains a web link", "Uses a shortened link that hides the real address"])) {
      advice.push("Do not click any links in this message. Instead, go to the company's website yourself by typing the address directly.");
    }

    if (hasSignal(matched, ["Asks you to verify personal information", "Asks for passwords or private codes"])) {
      advice.push("Do not give out your password, card details, or personal information from this message. A real company will never ask this way.");
    }

    if (hasSignal(matched, ["Creates a false sense of urgency", "Threatens a fast deadline"])) {
      advice.push("This message is trying to rush you. Scammers use deadlines so you do not have time to think. Slow down and take a breath.");
    }

    if (hasSignal(matched, ["Claims a delivery problem and asks for a fee or details"])) {
      advice.push("This looks like a package scam. Do not pay any redelivery fee or give your address. Check your real delivery status on the courier's official website.");
    }

    if (hasSignal(matched, ["Offers a surprise refund"])) {
      advice.push("Be careful with unexpected refund offers. Call the company directly on a number you trust to confirm it is real.");
    }

    advice.push("Ask a trusted family member to look at this message with you before you do anything.");
    advice.push("When in doubt, wait. A real company or loved one will not rush you.");

    return {
      level,
      title: "Suspicious — Check Before You Act",
      summary:
        "This message has some warning signs. It may not be safe. Take a moment to check with someone you trust.",
      advice,
      signals,
    };
  }

  return {
    level,
    title: "Likely Safe",
    summary:
      "We did not find strong scam warning signs in this message. It looks like a normal, friendly message.",
    advice: [
      "This message looks okay, but always stay alert.",
      "If anything still feels off, ask a family member you trust.",
      "Never share passwords or personal codes, even with people you know.",
    ],
    signals,
  };
}
