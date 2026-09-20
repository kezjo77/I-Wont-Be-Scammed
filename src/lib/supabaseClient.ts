import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const ANALYZE_ENDPOINT = `${supabaseUrl}/functions/v1/analyze-scam`;
export const ANON_HEADERS: Record<string, string> = {
  Authorization: `Bearer ${supabaseAnonKey}`,
  "Content-Type": "application/json",
};
