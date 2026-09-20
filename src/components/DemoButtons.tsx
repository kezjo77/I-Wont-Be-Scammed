import { useId } from "react";
import { FlaskConical } from "lucide-react";

export interface DemoCase {
  label: string;
  text: string;
  hint: string;
}

export const DEMO_CASES: DemoCase[] = [
  {
    label: "Demo 1 — Scam",
    hint: "Grandchild emergency",
    text: "URGENT: Your grandson Alex was in a car crash. Need $2000 in Apple gift cards for bail immediately. Don't call his mom.",
  },
  {
    label: "Demo 2 — Suspicious",
    hint: "Account warning link",
    text: "Netflix: Your payment failed. Click here to update your card details or your account will be deleted in 2 hours.",
  },
  {
    label: "Demo 3 — Safe",
    hint: "Friendly family note",
    text: "Hi Grandma, just checking in to see if we are still on for Sunday dinner at 5 PM? Love, Sarah.",
  },
];

interface DemoButtonsProps {
  onPick: (text: string) => void;
  disabled: boolean;
}

export default function DemoButtons({ onPick, disabled }: DemoButtonsProps) {
  const headingId = useId();

  return (
    <aside aria-labelledby={headingId} className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <FlaskConical className="w-9 h-9 text-gold" strokeWidth={2.5} />
        <h2 id={headingId} className="text-2xl font-extrabold text-navy">
          Try a Sample
        </h2>
      </div>
      <p className="text-lg text-navy/70 leading-snug">
        Tap a box below to check it instantly.
      </p>
      <div className="flex flex-col gap-4">
        {DEMO_CASES.map((demo) => (
          <button
            key={demo.label}
            type="button"
            onClick={() => onPick(demo.text)}
            disabled={disabled}
            className="group text-left w-full bg-white border-4 border-navy/20 rounded-2xl p-5 hover:border-gold hover:bg-gold/10 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xl font-bold text-navy">{demo.label}</span>
              <span className="text-base text-navy/50 font-medium">{demo.hint}</span>
            </div>
            <p className="text-lg text-navy/70 leading-snug line-clamp-3 group-hover:text-navy">
              {demo.text}
            </p>
          </button>
        ))}
      </div>
    </aside>
  );
}
