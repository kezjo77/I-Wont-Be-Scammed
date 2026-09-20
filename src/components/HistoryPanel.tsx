import { useEffect, useState } from "react";
import { History, RefreshCw, CircleAlert, TriangleAlert, CircleCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export interface HistoryRow {
  id: string;
  input_text: string;
  risk_level: "high" | "suspicious" | "safe";
  title: string;
  created_at: string;
}

const LEVEL_META = {
  high: { icon: CircleAlert, color: "text-red-600", chip: "bg-red-100 text-red-700 border-red-300" },
  suspicious: { icon: TriangleAlert, color: "text-amber-600", chip: "bg-amber-100 text-amber-700 border-amber-300" },
  safe: { icon: CircleCheck, color: "text-emerald-600", chip: "bg-emerald-100 text-emerald-700 border-emerald-300" },
};

export default function HistoryPanel() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("scam_checks")
      .select("id, input_text, risk_level, title, created_at")
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      setError("Could not load recent checks right now.");
      setLoading(false);
      return;
    }
    setRows((data ?? []) as HistoryRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <History className="w-8 h-8 text-navy" strokeWidth={2.5} />
          <h3 className="text-2xl font-extrabold text-navy">Recent Checks</h3>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          aria-label="Refresh recent checks"
          className="flex items-center gap-2 px-4 py-3 rounded-xl border-2 border-navy/20 bg-white text-navy text-lg font-semibold hover:border-gold hover:bg-gold/10 transition disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error && (
        <p className="text-lg text-amber-700 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          {error}
        </p>
      )}

      {!error && rows.length === 0 && !loading && (
        <p className="text-lg text-navy/50 bg-warmgray-dark border-2 border-navy/10 rounded-xl p-4">
          No checks yet. Your recent scans will appear here.
        </p>
      )}

      {rows.length > 0 && (
        <ul className="flex flex-col gap-3">
          {rows.map((row) => {
            const meta = LEVEL_META[row.risk_level];
            const Icon = meta.icon;
            const time = new Date(row.created_at).toLocaleString(undefined, {
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            });
            return (
              <li
                key={row.id}
                className="flex items-start gap-3 p-4 rounded-xl border-2 border-navy/10 bg-white shadow-sm"
              >
                <Icon className={`w-8 h-8 shrink-0 mt-0.5 ${meta.color}`} strokeWidth={2.5} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-base font-bold px-2.5 py-0.5 rounded-full border ${meta.chip}`}>
                      {row.title}
                    </span>
                    <span className="text-sm text-navy/40">{time}</span>
                  </div>
                  <p className="mt-1.5 text-base text-navy/60 line-clamp-2 leading-snug">
                    {row.input_text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
