"use client";
import { useEffect, useState } from "react";

interface Match {
  id: string;
  sport: "football" | "basketball";
  type: "live" | "upcoming";
  homeTeam: string;
  awayTeam: string;
  league: string;
  homeScore: number | null;
  awayScore: number | null;
  status: string;
  elapsed: number | null;
  startTime: string | null;
  odds: { home: string; draw: string; away: string } | null;
}

interface MatchData {
  live: Match[];
  upcoming: Match[];
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function LiveMatches() {
  const [data, setData] = useState<MatchData>({ live: [], upcoming: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"live" | "upcoming">("live");

  const fetchData = () =>
    fetch("/api/matches")
      .then(r => r.json())
      .then(d => setData(d))
      .catch(() => {});

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const hasLive = data.live.length > 0;
  const hasUpcoming = data.upcoming.length > 0;

  if (loading) return (
    <div style={{ padding: "1rem", textAlign: "center", color: "var(--ab-text-secondary)", fontSize: "14px", marginBottom: "1.5rem" }}>
      Loading scores...
    </div>
  );

  if (!hasLive && !hasUpcoming) return null;

  const activeMatches = tab === "live" ? data.live : data.upcoming;

  return (
    <div style={{ marginBottom: "2rem" }}>
      {/* Tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "1rem", alignItems: "center" }}>
        <button
          onClick={() => setTab("live")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "5px 14px", borderRadius: "20px",
            border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600,
            background: tab === "live" ? "rgba(239,68,68,0.15)" : "var(--ab-ice)",
            color: tab === "live" ? "var(--ab-loss)" : "var(--ab-text-secondary)",
          }}
        >
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--ab-loss)", display: "inline-block", animation: tab === "live" ? "pulse 1.5s infinite" : "none" }} />
          LIVE {hasLive && `(${data.live.length})`}
        </button>
        <button
          onClick={() => setTab("upcoming")}
          style={{
            padding: "5px 14px", borderRadius: "20px",
            border: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600,
            background: tab === "upcoming" ? "var(--ab-ice)" : "var(--ab-ice)",
            color: tab === "upcoming" ? "var(--ab-text-primary)" : "var(--ab-text-secondary)",
            outline: tab === "upcoming" ? "1.5px solid var(--ab-sky)" : "none",
          }}
        >
          📅 UPCOMING {hasUpcoming && `(${data.upcoming.length})`}
        </button>
        <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--ab-text-secondary)" }}>
          Updates every 60s
        </span>
      </div>

      {activeMatches.length === 0 ? (
        <div style={{ padding: "1.5rem", textAlign: "center", background: "var(--ab-royal)", borderRadius: "12px", border: "0.5px solid var(--ab-border)" }}>
          <p style={{ color: "var(--ab-text-secondary)", fontSize: "13px", margin: 0 }}>
            {tab === "live" ? "No live matches right now" : "No upcoming matches today"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {activeMatches.map(match => (
            <MatchRow key={match.id} match={match} />
          ))}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

function MatchRow({ match }: { match: Match }) {
  const sportEmoji = match.sport === "football" ? "⚽" : "🏀";
  const isLive = match.type === "live";

  return (
    <div style={{
      background: "var(--ab-royal)",
      border: `0.5px solid ${isLive ? "rgba(239,68,68,0.3)" : "var(--ab-border)"}`,
      borderRadius: "12px",
      padding: "12px 16px",
      transition: "box-shadow 0.2s",
    }}>
      {/* League + Sport */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "11px", color: "var(--ab-text-secondary)", fontWeight: 500 }}>
          {sportEmoji} {match.league}
        </span>
        <span style={{
          fontSize: "11px", fontWeight: 600,
          color: isLive ? "var(--ab-loss)" : "var(--ab-sky)",
          background: isLive ? "rgba(239,68,68,0.12)" : "rgba(6,182,212,0.12)",
          borderRadius: "20px", padding: "2px 8px",
        }}>
          {isLive
            ? match.elapsed ? `${match.elapsed}'` : match.status
            : match.startTime ? formatTime(match.startTime) : "Soon"
          }
        </span>
      </div>

      {/* Score Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--ab-text-primary)", flex: 1, textAlign: "right" }}>
          {match.homeTeam}
        </span>
        <span style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: isLive ? "20px" : "14px",
          color: isLive ? "var(--ab-sky)" : "var(--ab-text-secondary)",
          minWidth: "60px", textAlign: "center",
        }}>
          {isLive
            ? `${match.homeScore ?? 0} - ${match.awayScore ?? 0}`
            : "vs"
          }
        </span>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--ab-text-primary)", flex: 1, textAlign: "left" }}>
          {match.awayTeam}
        </span>
      </div>

      {/* Odds for upcoming */}
      {!isLive && match.odds && (
        <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
          {[
            { label: "Home", value: match.odds.home, color: "var(--ab-win)" },
            { label: "Draw", value: match.odds.draw, color: "var(--ab-royal)" },
            { label: "Away", value: match.odds.away, color: "var(--ab-live)" },
          ].map(o => o.value && (
            <div key={o.label} style={{
              flex: 1, textAlign: "center",
              background: "var(--ab-navy)", borderRadius: "8px", padding: "6px 4px", border: "0.5px solid var(--ab-border)",
            }}>
              <p style={{ fontSize: "10px", color: "var(--ab-text-secondary)", margin: "0 0 2px", textTransform: "uppercase" }}>{o.label}</p>
              <p style={{ fontSize: "14px", fontWeight: 700, color: o.color, margin: 0, fontFamily: "var(--font-display)" }}>
                {o.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* No odds placeholder for upcoming */}
      {!isLive && !match.odds && (
        <div style={{ marginTop: "8px", display: "flex", gap: "6px" }}>
          {["Home", "Draw", "Away"].map(label => (
            <div key={label} style={{
              flex: 1, textAlign: "center",
              background: "var(--ab-navy)", borderRadius: "8px", padding: "6px 4px", border: "0.5px solid var(--ab-border)",
            }}>
              <p style={{ fontSize: "10px", color: "var(--ab-text-secondary)", margin: "0 0 2px", textTransform: "uppercase" }}>{label}</p>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--ab-text-secondary)", margin: 0 }}>—</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
