"use client";
import { useEffect, useState } from "react";

interface LiveMatch {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  elapsed: number | null;
}

export default function LiveMatches() {
  const [matches, setMatches] = useState<LiveMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(data => { setMatches(data); setLoading(false); })
      .catch(() => setLoading(false));

    const interval = setInterval(() => {
      fetch("/api/matches").then(r => r.json()).then(setMatches);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return (
    <div style={{ padding: "1rem", textAlign: "center", color: "#888", fontSize: "14px" }}>
      Loading live scores...
    </div>
  );

  if (matches.length === 0) return null;

  return (
    <div style={{ marginBottom: "2rem" }}>
      <p style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: "16px", color: "var(--ab-navy)",
        margin: "0 0 1rem", display: "flex", alignItems: "center", gap: "8px"
      }}>
        <span style={{
          background: "rgba(255,80,80,0.1)", color: "#ff5050",
          border: "0.5px solid rgba(255,80,80,0.3)",
          borderRadius: "20px", padding: "2px 10px",
          fontSize: "11px", fontWeight: 600
        }}>● LIVE</span>
        Live Scores
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {matches.map(match => (
          <div key={match.id} style={{
            background: "#fff",
            border: "0.5px solid rgba(30,111,217,0.15)",
            borderRadius: "12px", padding: "12px 16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ fontSize: "12px", color: "var(--ab-royal)", fontWeight: 500, minWidth: "120px" }}>
              {match.league}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, justifyContent: "center" }}>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--ab-navy)" }}>
                {match.homeTeam}
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "18px", color: "var(--ab-electric)", minWidth: "60px", textAlign: "center" }}>
                {match.homeScore ?? 0} - {match.awayScore ?? 0}
              </span>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--ab-navy)" }}>
                {match.awayTeam}
              </span>
            </div>
            <div style={{ fontSize: "11px", color: "#ff5050", fontWeight: 600, minWidth: "50px", textAlign: "right" }}>
              {match.elapsed ? `${match.elapsed}'` : match.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}