import { Trash2, Mic, Square } from "lucide-react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled: boolean;
}

export default function InputSection({ value, onChange, onSubmit, disabled }: InputSectionProps) {
  const { listening, error, supported, start, stop, clearError } = useSpeechRecognition(onChange);

  const toggleMic = () => {
    if (listening) {
      stop();
    } else {
      clearError();
      start(value);
    }
  };

  return (
    <section aria-label="Message to check" className="flex flex-col gap-5">
      <label htmlFor="scam-text" className="text-2xl font-bold text-navy">
        Paste or type the message you want to check:
      </label>
      <textarea
        id="scam-text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="Paste a text message, an email, or type out what someone said to you on the phone..."
        className="w-full min-h-[200px] sm:min-h-[240px] text-2xl leading-relaxed text-navy bg-white border-4 border-navy/20 rounded-2xl p-6 focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold/30 transition shadow-inner placeholder:text-navy/40 placeholder:text-xl resize-y"
      />

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          onClick={toggleMic}
          disabled={disabled}
          aria-label={listening ? "Stop speaking" : "Tap to speak"}
          className={`flex items-center justify-center gap-3 px-8 py-6 rounded-2xl border-4 text-2xl font-bold transition shadow-md disabled:opacity-50 ${
            listening
              ? "bg-red-600 border-red-700 text-white animate-pulse"
              : "bg-white border-navy/30 text-navy hover:border-gold hover:bg-gold/10"
          }`}
        >
          {listening ? <Square className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          {listening ? "Stop Speaking" : "Tap to Speak"}
        </button>

        <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled || !value}
          aria-label="Clear the message"
          className="flex items-center justify-center gap-3 px-8 py-6 rounded-2xl border-4 border-navy/30 bg-white text-navy text-2xl font-bold hover:border-red-500 hover:bg-red-50 transition shadow-md disabled:opacity-40"
        >
          <Trash2 className="w-8 h-8" />
          Clear
        </button>
      </div>

      {listening && (
        <p className="text-xl text-navy bg-gold/10 border-2 border-gold/40 rounded-xl p-4 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse shrink-0" />
          Listening... speak clearly. Your words will appear in the box.
        </p>
      )}

      {error && (
        <p className="text-xl text-amber-700 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          {error}
        </p>
      )}

      {!supported && !error && (
        <p className="text-lg text-navy/60 bg-warmgray-dark border-2 border-navy/10 rounded-xl p-4">
          Voice typing is not available on this device, but you can still type or paste your message.
        </p>
      )}
    </section>
  );
}
