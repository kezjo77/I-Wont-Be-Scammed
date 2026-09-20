import { ANALYZE_ENDPOINT, ANON_HEADERS } from "@/lib/supabaseClient";
import { analyzeText, type ScamResult } from "@/lib/scamEngine";

export async function checkForScam(text: string): Promise<ScamResult> {
  try {
    const response = await fetch(ANALYZE_ENDPOINT, {
      method: "POST",
      headers: ANON_HEADERS,
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }

    const data = await response.json();
    if (
      !data ||
      typeof data.level !== "string" ||
      typeof data.title !== "string" ||
      !Array.isArray(data.advice)
    ) {
      throw new Error("Unexpected response from the server.");
    }

    return data as ScamResult;
  } catch {
    // Robust local fallback so the demo never breaks, even if the backend is unreachable
    return analyzeText(text);
  }
}
