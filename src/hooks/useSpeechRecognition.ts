import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechRecognitionResultLike {
  results: { length: number; [i: number]: { 0: { transcript: string } } };
  resultIndex: number;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: SpeechRecognitionResultLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

type Ctor = new () => SpeechRecognitionLike;

function getCtor(): Ctor | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { SpeechRecognition?: Ctor; webkitSpeechRecognition?: Ctor })
    .SpeechRecognition ?? (window as unknown as { webkitSpeechRecognition?: Ctor }).webkitSpeechRecognition ?? null;
}

export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supported] = useState(() => getCtor() !== null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseRef = useRef("");
  const onTranscriptRef = useRef(onTranscript);
  onTranscriptRef.current = onTranscript;

  useEffect(() => {
    const Ctor = getCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (i < event.resultIndex) continue;
        final += chunk;
        interim += chunk;
      }
      const combined = `${baseRef.current} ${final}`.trim();
      onTranscriptRef.current(combined);
    };

    recognition.onerror = (event) => {
      if (event.error === "not-allowed" || event.error === "service-not-allowed") {
        setError("Microphone is not available. You can still type or paste your message.");
      } else if (event.error === "no-speech") {
        setError("We did not hear anything. Try again and speak clearly.");
      }
      setListening(false);
    };

    recognition.onend = () => {
      // Commit the accumulated transcript as the new base for the next session
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      try {
        recognition.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  const start = useCallback((currentText: string) => {
    const rec = recognitionRef.current;
    if (!rec) {
      setError("Voice typing is not supported on this device. You can still type or paste.");
      return;
    }
    setError(null);
    baseRef.current = currentText;
    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  }, []);

  const stop = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    }
    setListening(false);
  }, []);

  return { listening, error, supported, start, stop, clearError: () => setError(null) };
}
