import { CircleAlert, CircleCheck, TriangleAlert, Loader2 } from "lucide-react";
import type { ScamResult } from "@/lib/scamEngine";

interface ResultsDisplayProps {
  loading: boolean;
  result: ScamResult | null;
}

const STYLES = {
  high: {
    wrap: "border-red-600 bg-red-50",
    ring: "bg-red-600 shadow-red-300",
    icon: <CircleAlert className="w-16 h-16 text-white" strokeWidth={2.5} />,
    chip: "bg-red-600 text-white",
    label: "RED — High Scam Risk",
    title: "text-red-700",
    summaryBox: "bg-red-100",
    summaryText: "text-red-900",
    adviceTitle: "text-red-700",
    item: "border-red-100 bg-red-50/40 hover:bg-red-50 hover:border-red-300",
    number: "bg-red-600 border-red-700",
    signalsBox: "bg-red-100 border-red-300",
    signalsText: "text-red-800",
    dot: "text-red-600",
  },
  suspicious: {
    wrap: "border-amber-500 bg-amber-50",
    ring: "bg-amber-500 shadow-amber-300",
    icon: <TriangleAlert className="w-16 h-16 text-white" strokeWidth={2.5} />,
    chip: "bg-amber-500 text-white",
    label: "YELLOW — Suspicious",
    title: "text-amber-700",
    summaryBox: "bg-amber-100",
    summaryText: "text-amber-900",
    adviceTitle: "text-amber-700",
    item: "border-amber-100 bg-amber-50/40 hover:bg-amber-50 hover:border-amber-300",
    number: "bg-amber-500 border-amber-600",
    signalsBox: "bg-amber-100 border-amber-300",
    signalsText: "text-amber-800",
    dot: "text-amber-600",
  },
  safe: {
    wrap: "border-emerald-600 bg-emerald-50",
    ring: "bg-emerald-600 shadow-emerald-300",
    icon: <CircleCheck className="w-16 h-16 text-white" strokeWidth={2.5} />,
    chip: "bg-emerald-600 text-white",
    label: "GREEN — Likely Safe",
    title: "text-emerald-700",
    summaryBox: "bg-emerald-100",
    summaryText: "text-emerald-900",
    adviceTitle: "text-emerald-700",
    item: "border-emerald-100 bg-emerald-50/40 hover:bg-emerald-50 hover:border-emerald-300",
    number: "bg-emerald-600 border-emerald-700",
    signalsBox: "bg-emerald-50 border-emerald-200",
    signalsText: "text-emerald-800",
    dot: "text-emerald-600",
  },
} as const;

export default function ResultsDisplay({ loading, result }: ResultsDisplayProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
        <Loader2 className="w-24 h-24 text-gold animate-spin" strokeWidth={2.5} />
        <p className="text-3xl font-bold text-navy">Checking carefully, please hold...</p>
        <p className="text-xl text-navy/60">This will only take a moment.</p>
      </div>
    );
  }

  if (!result) return null;

  const s = STYLES[result.level];

  return (
    <div className={`rounded-3xl border-4 ${s.wrap} shadow-xl overflow-hidden`}>
      <div className="flex flex-col sm:flex-row items-center gap-6 p-8 sm:p-10">
        <div className="shrink-0">
          <div
            className={`w-28 h-28 rounded-full ${s.ring} shadow-lg flex items-center justify-center ring-8 ring-white`}
          >
            {s.icon}
          </div>
        </div>
        <div className="text-center sm:text-left">
          <span className={`inline-block px-5 py-2 rounded-full ${s.chip} text-xl font-bold tracking-wide`}>
            {s.label}
          </span>
          <h2 className={`mt-4 text-4xl sm:text-5xl font-extrabold ${s.title}`}>{result.title}</h2>
        </div>
      </div>

      <div className="px-8 sm:px-10 pb-6">
        <div className={`${s.summaryBox} rounded-2xl p-6`}>
          <p className={`text-2xl leading-relaxed ${s.summaryText} font-medium`}>{result.summary}</p>
        </div>
      </div>

      <div className="px-8 sm:px-10 pb-8">
        <h3 className={`text-3xl font-extrabold ${s.adviceTitle} mb-5`}>I Wont Be Scammed's Advice</h3>
        <ol className="flex flex-col gap-4">
          {result.advice.map((tip, i) => (
            <li
              key={i}
              className={`flex items-start gap-4 w-full p-5 rounded-xl border-2 ${s.item} shadow-sm transition`}
            >
              <span
                className={`w-10 h-10 flex items-center justify-center rounded-full ${s.number} text-white text-xl font-bold shadow border-2 shrink-0 mt-0.5`}
              >
                {i + 1}
              </span>
              <span className="text-2xl leading-relaxed text-navy font-semibold">{tip}</span>
            </li>
          ))}
        </ol>

        {result.signals.length > 0 && (
          <div className={`mt-8 border-2 rounded-2xl p-6 ${s.signalsBox}`}>
            <p className={`text-2xl font-bold ${s.signalsText} mb-3`}>What we noticed:</p>
            <ul className="flex flex-col gap-2">
              {result.signals.map((sig, i) => (
                <li key={i} className={`text-xl ${s.signalsText} flex items-start gap-2`}>
                  <span className={`${s.dot} font-bold`}>•</span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
