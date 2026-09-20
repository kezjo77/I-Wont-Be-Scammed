import { useEffect, useState } from "react";
import { ListChecks, Loader2, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface PatternRow {
  signal: string;
  count: number;
}

interface LevelCount {
  level: string;
  count: number;
}

export default function PatternsPage() {
  const [patterns, setPatterns] = useState<PatternRow[]>([]);
  const [levelCounts, setLevelCounts] = useState<LevelCount[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);

      const { data: rows, error: rowsErr } = await supabase
        .from("scam_checks")
        .select("signals, risk_level");

      if (rowsErr) {
        setError("Could not load scam patterns right now.");
        setLoading(false);
        return;
      }

      const allRows = (rows ?? []) as { signals: string[] | null; risk_level: string }[];
      setTotal(allRows.length);

      const counts = new Map<string, number>();
      for (const row of allRows) {
        if (!row.signals) continue;
        for (const sig of row.signals) {
          counts.set(sig, (counts.get(sig) ?? 0) + 1);
        }
      }
      const sorted: PatternRow[] = [...counts.entries()]
        .map(([signal, count]) => ({ signal, count }))
        .sort((a, b) => b.count - a.count);
      setPatterns(sorted);

      const levelMap = new Map<string, number>();
      for (const row of allRows) {
        levelMap.set(row.risk_level, (levelMap.get(row.risk_level) ?? 0) + 1);
      }
      setLevelCounts(
        [...levelMap.entries()].map(([level, count]) => ({ level, count })),
      );

      setLoading(false);
    };

    load();
  }, []);

  const levelMeta: Record<string, { label: string; color: string; bg: string }> = {
    high: { label: "High Risk", color: "text-red-700", bg: "bg-red-100 border-red-300" },
    suspicious: { label: "Suspicious", color: "text-amber-700", bg: "bg-amber-100 border-amber-300" },
    safe: { label: "Likely Safe", color: "text-emerald-700", bg: "bg-emerald-100 border-emerald-300" },
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center bg-gold rounded-2xl p-5 shadow-lg mb-5">
          <ListChecks className="w-14 h-14 text-navy" strokeWidth={2.5} />
        </div>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-navy">Scam Patterns We Are Seeing</h2>
        <p className="mt-4 text-2xl text-navy/70 leading-relaxed">
          These are the scam tactics showing up most often in messages people have checked.
        </p>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="w-16 h-16 text-gold animate-spin" strokeWidth={2.5} />
          <p className="text-2xl text-navy/70 font-medium">Loading patterns...</p>
        </div>
      )}

      {error && (
        <p className="text-xl text-amber-700 bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
            <div className="bg-white border-4 border-navy/10 rounded-2xl p-6 text-center shadow-sm">
              <p className="text-5xl font-extrabold text-navy">{total}</p>
              <p className="text-lg text-navy/50 font-semibold mt-1">Total Checks</p>
            </div>
            {(["high", "suspicious", "safe"] as const).map((lvl) => {
              const meta = levelMeta[lvl];
              const count = levelCounts.find((l) => l.level === lvl)?.count ?? 0;
              return (
                <div
                  key={lvl}
                  className={`border-4 rounded-2xl p-6 text-center shadow-sm ${meta.bg}`}
                >
                  <p className={`text-5xl font-extrabold ${meta.color}`}>{count}</p>
                  <p className={`text-lg font-semibold mt-1 ${meta.color}`}>{meta.label}</p>
                </div>
              );
            })}
          </div>

          {patterns.length === 0 ? (
            <div className="bg-white border-4 border-navy/10 rounded-2xl p-10 text-center">
              <TrendingUp className="w-16 h-16 text-navy/20 mx-auto mb-4" strokeWidth={2} />
              <p className="text-2xl text-navy/50 font-medium">
                No patterns yet. Once people check messages, the most common scam tactics will
                appear here.
              </p>
            </div>
          ) : (
            <div className="bg-white border-4 border-navy/10 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-2xl font-extrabold text-navy mb-5">
                Most Common Warning Signs
              </h3>
              <ul className="flex flex-col gap-3">
                {patterns.map((p, i) => {
                  const max = patterns[0].count;
                  const pct = Math.round((p.count / max) * 100);
                  return (
                    <li key={p.signal} className="flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-lg sm:text-xl text-navy font-semibold flex items-center gap-3">
                          <span className="text-navy/40 font-bold w-8 shrink-0">{i + 1}.</span>
                          {p.signal}
                        </span>
                        <span className="text-lg font-extrabold text-gold-dark shrink-0">
                          {p.count}×
                        </span>
                      </div>
                      <div className="h-3 bg-navy/10 rounded-full overflow-hidden ml-11">
                        <div
                          className="h-full bg-gold rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
