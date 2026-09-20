import { useState, useCallback, useRef } from "react";
import { ShieldCheck, Search } from "lucide-react";
import InputSection from "@/components/InputSection";
import ResultsDisplay from "@/components/ResultsDisplay";
import DemoButtons from "@/components/DemoButtons";
import HistoryPanel from "@/components/HistoryPanel";
import { checkForScam } from "@/lib/api";
import type { ScamResult } from "@/lib/scamEngine";

export default function HomePage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamResult | null>(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [historyKey, setHistoryKey] = useState(0);
  const textRef = useRef("");

  const runCheck = useCallback(async (checkText: string) => {
    if (!checkText.trim() || loading) return;
    setLoading(true);
    setChecked(false);
    setResult(null);
    setError(null);

    try {
      const res = await checkForScam(checkText);
      setResult(res);
      setChecked(true);
      setHistoryKey((k) => k + 1);
      requestAnimationFrame(() => {
        document.getElementById("results-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    } catch {
      setError("We could not check your message right now. Please try again in a moment.");
      setChecked(true);
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSubmit = useCallback(() => {
    runCheck(textRef.current);
  }, [runCheck]);

  const handlePickDemo = useCallback((demoText: string) => {
    setText(demoText);
    textRef.current = demoText;
    setResult(null);
    setChecked(false);
    setError(null);
    runCheck(demoText);
  }, [runCheck]);

  const handleChange = (value: string) => {
    setText(value);
    textRef.current = value;
  };

  const handleReset = () => {
    setText("");
    textRef.current = "";
    setResult(null);
    setChecked(false);
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 lg:gap-10">
      <div className="flex flex-col gap-8">
        <InputSection value={text} onChange={handleChange} onSubmit={handleSubmit} disabled={loading} />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          className="w-full flex items-center justify-center gap-4 bg-gold hover:bg-gold-dark active:bg-gold-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-navy text-3xl sm:text-4xl font-extrabold py-8 sm:py-10 rounded-2xl shadow-lg border-b-8 border-gold-dark disabled:border-slate-400 transition-all hover:shadow-xl active:translate-y-0.5 active:border-b-4"
        >
          <Search className="w-10 h-10 sm:w-12 sm:h-12" strokeWidth={3} />
          Check for Scams Now
        </button>

        <div id="results-anchor" className="scroll-mt-6">
          {(loading || checked) && <ResultsDisplay loading={loading} result={result} />}

          {error && (
            <p className="mt-4 text-xl text-red-700 bg-red-50 border-2 border-red-300 rounded-xl p-4">
              {error}
            </p>
          )}

          {checked && !error && (
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 w-full flex items-center justify-center gap-3 bg-white border-4 border-navy/20 hover:border-navy text-navy text-2xl font-bold py-5 rounded-2xl shadow-sm transition"
            >
              Check Another Message
            </button>
          )}
        </div>
      </div>

      <div className="lg:sticky lg:top-8 h-fit flex flex-col gap-6">
        <div className="bg-white border-4 border-navy/10 rounded-3xl p-6 shadow-sm">
          <DemoButtons onPick={handlePickDemo} disabled={loading} />
        </div>

        <div className="bg-white border-4 border-navy/10 rounded-3xl p-6 shadow-sm">
          <HistoryPanel key={historyKey} />
        </div>

        <div className="bg-navy border-2 border-gold/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-8 h-8 text-gold" strokeWidth={2.5} />
            <h3 className="text-xl font-extrabold text-gold">A Simple Rule</h3>
          </div>
          <p className="text-lg text-warmgray leading-relaxed">
            If a message rushes you, asks for money or gift cards, or tells you not to tell your
            family — stop and check with someone you trust first.
          </p>
        </div>
      </div>
    </div>
  );
}
