"use client";
import { useState } from "react";
import { formatUSDC, getSportLabel, getStatusLabel, getStatusColor, formatDate } from "@/lib/utils";
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
const resultColors = ["var(--ab-electric)", "var(--ab-sky)", "var(--ab-royal)"];

export default function MatchCard({ match, onBetPlaced }: MatchCardProps) {
  const [showBetModal, setShowBetModal] = useState(false);
  const isOpen = match.status === 0;
  const isLive = isOpen && Number(match.startTime) * 1000 > Date.now();
  const isResolved = match.status === 2;
  const isCancelled = match.status === 3;

  return (
    <>
      <div style={{
        background: "#fff",
        border: "0.5px solid rgba(30,111,217,0.15)",
        borderRadius: "16px",
        padding: "1.25rem",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
      }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 30px rgba(30,111,217,0.12)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "12px", color: "var(--ab-royal)", fontWeight: 500 }}>
            {getSportLabel(match.sport)} · {match.league}
          </span>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            {isLive && (
              <span style={{
                background: "rgba(255,140,0,0.1)",
                color: "var(--ab-live)",
                border: "0.5px solid rgba(255,140,0,0.3)",
                borderRadius: "20px",
                padding: "2px 10px",
                fontSize: "11px",
                fontWeight: 600,
              }}>
                ● LIVE
              </span>
            )}
            <span style={{
              background: "var(--ab-ice)",
              color: "var(--ab-royal)",
              borderRadius: "20px",
              padding: "2px 10px",
              fontSize: "11px",
              fontWeight: 500,
            }}>
              {getStatusLabel(match.status)}
            </span>
          </div>
        </div>

        {/* Teams */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
              color: "var(--ab-navy)",
              margin: 0,
            }}>
              {match.homeTeam}
            </p>
            <p style={{ fontSize: "11px", color: "#888", margin: "2px 0 0" }}>Home</p>
          </div>
          <div style={{
            background: "var(--ab-ice)",
            borderRadius: "8px",
            padding: "6px 12px",
            textAlign: "center",
          }}>
            <p style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "14px",
              color: "var(--ab-electric)",
              margin: 0,
            }}>VS</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "16px",
              color: "var(--ab-navy)",
              margin: 0,
            }}>
              {match.awayTeam}
            </p>
            <p style={{ fontSize: "11px", color: "#888", margin: "2px 0 0" }}>Away</p>
          </div>
        </div>

        {/* Resolved Result Banner */}
        {isResolved && (
          <div style={{
            background: "var(--ab-ice)",
            borderRadius: "8px",
            padding: "8px",
            textAlign: "center",
            marginBottom: "12px",
          }}>
            <p style={{ fontSize: "12px", color: "var(--ab-royal)", margin: 0, fontWeight: 600 }}>
              Result: {outcomeLabels[match.result]}
            </p>
          </div>
        )}

        {/* Cancelled Banner */}
        {isCancelled && (
          <div style={{
            background: "rgba(255,77,106,0.08)",
            borderRadius: "8px",
            padding: "8px",
            textAlign: "center",
            marginBottom: "12px",
          }}>
            <p style={{ fontSize: "12px", color: "var(--ab-loss)", margin: 0, fontWeight: 600 }}>
              Match Cancelled · Refunds Available
            </p>
          </div>
        )}

        {/* Stats Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          borderTop: "0.5px solid rgba(30,111,217,0.1)",
          borderBottom: "0.5px solid rgba(30,111,217,0.1)",
          marginBottom: "14px",
        }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Staked</p>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--ab-navy)", margin: 0, fontFamily: "var(--font-display)" }}>
              ${formatUSDC(match.totalStakedUSDC)}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Starts</p>
            <p style={{ fontSize: "12px", fontWeight: 500, color: "var(--ab-royal)", margin: 0 }}>
              {formatDate(match.startTime)}
            </p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Match ID</p>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--ab-navy)", margin: 0, fontFamily: "var(--font-display)" }}>
              #{match.id.toString()}
            </p>
          </div>
        </div>

        {/* Bet Button */}
        {isOpen && (
          <button
            onClick={() => setShowBetModal(true)}
            style={{
              width: "100%",
              background: "var(--ab-royal)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              padding: "12px",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              cursor: "pointer",
              letterSpacing: "0.03em",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--ab-electric)")}
            onMouseLeave={e => (e.currentTarget.style.background = "var(--ab-royal)")}
          >
            Place Bet →
          </button>
        )}
      </div>

      {showBetModal && (
        <BetModal
          match={match}
          onClose={() => setShowBetModal(false)}
          onSuccess={() => {
            setShowBetModal(false);
            onBetPlaced?.();
          }}
        />
      )}
    </>
  );
}