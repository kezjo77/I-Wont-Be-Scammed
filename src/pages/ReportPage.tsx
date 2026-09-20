import { useState } from "react";
import { Megaphone, Send, CheckCircle2, Loader2 } from "lucide-react";
import { checkForScam } from "@/lib/api";
import type { ScamResult } from "@/lib/scamEngine";
import ResultsDisplay from "@/components/ResultsDisplay";

export default function ReportPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScamResult | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResult(null);
    setError(null);
    setSubmitted(false);

    try {
      const res = await checkForScam(text);
      setResult(res);
      setSubmitted(true);
    } catch {
      setError("We could not check your message right now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setResult(null);
    setSubmitted(false);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-gold rounded-2xl p-5 shadow-lg mb-5">
          <Megaphone className="w-14 h-14 text-navy" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-navy">Report a Scam Message</h2>
        <p className="mt-4 text-2xl text-navy/70 leading-relaxed">
          Paste a scam message you received. We will check it and save it so we can learn which scam
          tactics are being used right now.
        </p>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
        placeholder="Paste the scam text, email, or phone-call summary here..."
        className="w-full min-h-[200px] text-2xl leading-relaxed text-navy bg-white border-4 border-navy/20 rounded-2xl p-6 focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/30 transition shadow-inner placeholder:text-navy/40 placeholder:text-xl resize-y"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || !text.trim()}
        className="mt-6 w-full flex items-center justify-center gap-4 bg-gold hover:bg-gold-dark active:bg-gold-dark disabled:bg-slate-300 disabled:cursor-not-allowed text-navy text-3xl font-extrabold py-8 rounded-2xl shadow-lg border-b-8 border-gold-dark disabled:border-slate-400 transition-all hover:shadow-xl active:translate-y-0.5 active:border-b-4"
      >
        {loading ? <Loader2 className="w-10 h-10 animate-spin" /> : <Send className="w-10 h-10" strokeWidth={3} />}
        {loading ? "Checking..." : "Check & Report This Scam"}
      </button>

      {error && (
        <p className="mt-6 text-xl text-red-700 bg-red-50 border-2 border-red-300 rounded-xl p-4">
          {error}
        </p>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <Loader2 className="w-24 h-24 text-gold animate-spin" strokeWidth={2.5} />
          <p className="text-3xl font-bold text-navy">Checking carefully, please hold...</p>
        </div>
      )}

      {submitted && result && (
        <div className="mt-8 flex flex-col gap-6">
          <div className="flex items-center gap-3 bg-gold/10 border-2 border-gold/40 rounded-xl p-5">
            <CheckCircle2 className="w-10 h-10 text-gold-dark shrink-0" strokeWidth={2.5} />
            <p className="text-xl font-bold text-navy">
              Thank you. Your report was saved and will help us spot scam patterns.
            </p>
          </div>
          <ResultsDisplay loading={false} result={result} />
          <button
            type="button"
            onClick={handleReset}
            className="w-full flex items-center justify-center gap-3 bg-white border-4 border-navy/20 hover:border-navy text-navy text-2xl font-bold py-5 rounded-2xl shadow-sm transition"
          >
            Report Another Message
          </button>
        </div>
      )}
    </div>
  );
}
