"use client";
import { useState } from "react";
import { formatUSDC, getSportLabel, getStatusLabel, formatDate } from "@/lib/utils";
import BetModal from "./BetModal";

interface Match {
  id: bigint;
  sport: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: bigint;
  status: number;
  result: number;
  totalStakedUSDC: bigint;
}

interface MatchCardProps {
  match: Match;
  onBetPlaced?: () => void;
}

const outcomeLabels = ["Home Win", "Draw", "Away Win"];

export default function MatchCard({ match: rawMatch, onBetPlaced }: MatchCardProps) {
  const [showBetModal, setShowBetModal] = useState(false);

  const m = rawMatch as any;
  const match: Match = {
    id: BigInt(m.id ?? 0),
    sport: Number(m.sport ?? 0),
    homeTeam: String(m.homeTeam ?? ""),
    awayTeam: String(m.awayTeam ?? ""),
    league: String(m.league ?? ""),
    startTime: BigInt(m.startTime ?? 0),
    status: Number(m.status ?? 0),
    result: Number(m.result ?? 0),
    totalStakedUSDC: BigInt(m.totalStakedUSDC ?? 0),
  };

  const isOpen = match.status === 0;
  const isResolved = match.status === 2;
  const isCancelled = match.status === 3;
  const matchStarted = Number(match.startTime) * 1000 < Date.now();

  const statusBadge = () => {
    if (isOpen && !matchStarted) return { label: "● Open", bg: "rgba(34,197,94,0.15)", color: "#22C55E", border: "rgba(34,197,94,0.3)" };
    if (isOpen && matchStarted) return { label: "● Live", bg: "rgba(239,68,68,0.15)", color: "#EF4444", border: "rgba(239,68,68,0.3)" };
    if (isResolved) return { label: "Resolved", bg: "rgba(59,130,246,0.15)", color: "#60A5FA", border: "rgba(59,130,246,0.3)" };
    if (isCancelled) return { label: "Cancelled", bg: "rgba(239,68,68,0.15)", color: "#EF4444", border: "rgba(239,68,68,0.3)" };
    return { label: "Closed", bg: "rgba(245,158,11,0.15)", color: "#F59E0B", border: "rgba(245,158,11,0.3)" };
  };

  const badge = statusBadge();

  return (
    <>
      <div style={{
        background: "linear-gradient(145deg, #1E293B 0%, #162032 100%)",
        border: "1px solid #334155",
        borderRadius: "16px",
        padding: "1.25rem",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        position: "relative",
        overflow: "hidden",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.5)";
          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.4)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.borderColor = "#334155";
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "2px",
          background: isOpen ? "linear-gradient(90deg, #3B82F6, #22C55E)" : "linear-gradient(90deg, #334155, #334155)",
        }} />

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingTop: "4px" }}>
          <span style={{ fontSize: "12px", color: "#9AA3BB", fontWeight: 500 }}>
            {getSportLabel(match.sport)} · {match.league}
          </span>
          <span style={{
            background: badge.bg, color: badge.color,
            border: `0.5px solid ${badge.border}`,
            borderRadius: "20px", padding: "3px 10px",
            fontSize: "11px", fontWeight: 600,
          }}>
            {badge.label}
          </span>
        </div>

        {/* Teams */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center", gap: "8px", marginBottom: "16px",
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "15px", color: "#FBFAFC", margin: 0,
            }}>
              {match.homeTeam}
            </p>
            <p style={{ fontSize: "11px", color: "#9AA3BB", margin: "3px 0 0" }}>Home</p>
          </div>
          <div style={{
            background: "#111827", border: "1px solid #334155",
            borderRadius: "10px", padding: "8px 14px", textAlign: "center",
          }}>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 800,
              fontSize: "13px", color: "#3B82F6", margin: 0, letterSpacing: "0.05em",
            }}>VS</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "15px", color: "#FBFAFC", margin: 0,
            }}>
              {match.awayTeam}
            </p>
            <p style={{ fontSize: "11px", color: "#9AA3BB", margin: "3px 0 0" }}>Away</p>
          </div>
        </div>

        {/* Resolved Result Banner */}
        {isResolved && (
          <div style={{
            background: "rgba(59,130,246,0.1)", border: "0.5px solid rgba(59,130,246,0.2)",
            borderRadius: "8px", padding: "8px", textAlign: "center", marginBottom: "12px",
          }}>
            <p style={{ fontSize: "12px", color: "#60A5FA", margin: 0, fontWeight: 600 }}>
              🏆 Result: {outcomeLabels[match.result]}
            </p>
          </div>
        )}

        {/* Cancelled Banner */}
        {isCancelled && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.2)",
            borderRadius: "8px", padding: "8px", textAlign: "center", marginBottom: "12px",
          }}>
            <p style={{ fontSize: "12px", color: "#EF4444", margin: 0, fontWeight: 600 }}>
              Match Cancelled · Refunds Available
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "10px 0",
          borderTop: "1px solid #334155",
          borderBottom: "1px solid #334155",
          marginBottom: "14px",
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#9AA3BB", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Pool</p>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#22C55E", margin: 0, fontFamily: "var(--font-display)" }}>
              ${formatUSDC(match.totalStakedUSDC)}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#9AA3BB", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Starts</p>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "#60A5FA", margin: 0 }}>
              {formatDate(match.startTime)}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#9AA3BB", margin: "0 0 3px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Match ID</p>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#FBFAFC", margin: 0, fontFamily: "var(--font-display)" }}>
              #{match.id?.toString() ?? "—"}
            </p>
          </div>
        </div>

        {/* Bet Button */}
        {isOpen ? (
          <button
            onClick={(e) => { e.stopPropagation(); setShowBetModal(true); }}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #1D4ED8 0%, #3B82F6 100%)",
              color: "#fff", border: "none", borderRadius: "10px",
              padding: "12px", fontSize: "14px", fontWeight: 700,
              fontFamily: "var(--font-display)", cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "opacity 0.2s, transform 0.15s",
              boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.9"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; }}
          >
            Place Bet →
          </button>
        ) : (
          <div style={{
            width: "100%", background: "#111827",
            border: "1px solid #334155",
            borderRadius: "10px", padding: "12px",
            textAlign: "center", fontSize: "14px",
            color: "#9AA3BB", fontWeight: 500,
          }}>
            {isResolved ? "Match Resolved" : isCancelled ? "Match Cancelled" : "Betting Closed"}
          </div>
        )}
      </div>

      {showBetModal && (
        <BetModal
          match={match}
          onClose={() => setShowBetModal(false)}
          onSuccess={() => { setShowBetModal(false); onBetPlaced?.(); }}
        />
      )}
    </>
  );
}