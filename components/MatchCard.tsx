"use client";
import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { formatUSDC } from "@/lib/utils";

interface MatchCardProps {
  match: {
    id: bigint;
    sport: number;
    homeTeam: string;
    awayTeam: string;
    league: string;
    startTime: bigint;
    status: number;
    result: number;
    totalStakedUSDC: bigint;
  };
  onBetPlaced?: () => void;
}

const statusLabels = ["Open", "Closed", "Resolved", "Cancelled"];
const sportEmojis: Record<number, string> = {
  0: "⚽",
  1: "🏀",
};

export default function MatchCard({ match, onBetPlaced }: MatchCardProps) {
  const { address } = useAccount();
  const [selectedOutcome, setSelectedOutcome] = useState<string>("0");
  const [betAmount, setBetAmount] = useState<string>("");
  const [betStatus, setBetStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [betError, setBetError] = useState("");

  const { writeContractAsync: wc } = useWriteContract();
  const writeContractAsync = wc as any;

  const isOpen = match.status === 0;
  const isResolved = match.status === 2;

  const startDate = new Date(Number(match.startTime) * 1000);
  const isStarted = new Date() > startDate;

  const handleBet = async () => {
    if (!betAmount || parseFloat(betAmount) <= 0) {
      setBetError("Enter a valid bet amount");
      return;
    }

    if (!address) {
      setBetError("Connect wallet first");
      return;
    }

    try {
      setBetError("");
      setBetStatus("loading");

      const amountInUSDC = BigInt(Math.floor(parseFloat(betAmount) * 1e6)); // USDC has 6 decimals

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "placeBet",
        args: [match.id, Number(selectedOutcome), amountInUSDC],
      });

      setBetStatus("done");
      setBetAmount("");
      setSelectedOutcome("0");
      onBetPlaced?.();
      setTimeout(() => setBetStatus("idle"), 2000);
    } catch (err: any) {
      setBetError(err?.message?.slice(0, 100) || "Bet failed");
      setBetStatus("error");
    }
  };

  const statusColors: Record<number, string> = {
    0: "rgba(0,200,150,0.1)",
    1: "rgba(255,140,0,0.1)",
    2: "rgba(30,111,217,0.1)",
    3: "rgba(255,77,106,0.1)",
  };
  const statusTextColors: Record<number, string> = {
    0: "var(--ab-win)",
    1: "var(--ab-live)",
    2: "var(--ab-royal)",
    3: "var(--ab-loss)",
  };

  const outcomeBorders: Record<string, string> = {
    "0": "rgba(0,200,150,0.3)",
    "1": "rgba(100,100,100,0.3)",
    "2": "rgba(255,77,106,0.3)",
  };

  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid rgba(30,111,217,0.15)",
      borderRadius: "14px",
      padding: "1.25rem",
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "1rem",
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "16px",
            color: "var(--ab-navy)",
            margin: "0 0 4px",
          }}>
            {sportEmojis[match.sport] || "🎯"} {match.homeTeam} vs {match.awayTeam}
          </p>
          <p style={{
            fontSize: "12px",
            color: "#888",
            margin: 0,
          }}>
            {match.league} · {startDate.toLocaleDateString()}
          </p>
        </div>
        <span style={{
          background: statusColors[match.status] ?? "var(--ab-ice)",
          color: statusTextColors[match.status] ?? "var(--ab-royal)",
          borderRadius: "20px",
          padding: "3px 12px",
          fontSize: "11px",
          fontWeight: 600,
        }}>
          {statusLabels[match.status]}
        </span>
      </div>

      {/* Total Staked */}
      <div style={{
        background: "rgba(30,111,217,0.05)",
        borderRadius: "8px",
        padding: "8px 12px",
        marginBottom: "1rem",
      }}>
        <p style={{
          fontSize: "12px",
          color: "#888",
          margin: "0 0 4px",
        }}>
          Total Pool
        </p>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "18px",
          color: "var(--ab-royal)",
          margin: 0,
        }}>
          ${formatUSDC(match.totalStakedUSDC)}
        </p>
      </div>

      {/* Result Display (if resolved) */}
      {isResolved && (
        <div style={{
          background: "rgba(0,200,150,0.08)",
          border: "0.5px solid rgba(0,200,150,0.2)",
          borderRadius: "8px",
          padding: "10px 12px",
          marginBottom: "1rem",
        }}>
          <p style={{
            fontSize: "12px",
            color: "#888",
            margin: "0 0 4px",
          }}>
            Result
          </p>
          <p style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "14px",
            color: "var(--ab-win)",
            margin: 0,
          }}>
            {match.result === 0 ? "🏆 Home Win" : match.result === 1 ? "🤝 Draw" : "🏆 Away Win"}
          </p>
        </div>
      )}

      {/* Betting Interface */}
      {isOpen && !isStarted && (
        <div>
          {/* Outcome Selection */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{
              fontSize: "12px",
              color: "#888",
              fontWeight: 500,
              margin: "0 0 8px",
            }}>
              Predict
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "8px",
            }}>
              {["0", "1", "2"].map((outcome, idx) => {
                const labels = ["Home Win", "Draw", "Away Win"];
                const isSelected = selectedOutcome === outcome;
                return (
                  <button
                    key={outcome}
                    onClick={() => setSelectedOutcome(outcome)}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: `1px solid ${isSelected ? "var(--ab-electric)" : outcomeBorders[outcome]}`,
                      background: isSelected ? "rgba(123,181,255,0.1)" : "#fff",
                      color: isSelected ? "var(--ab-electric)" : "var(--ab-navy)",
                      fontSize: "13px",
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {labels[idx]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount Input */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={{
              fontSize: "12px",
              color: "#888",
              fontWeight: 500,
              margin: "0 0 8px",
            }}>
              Bet Amount (USDC)
            </p>
            <input
              type="number"
              placeholder="0.00"
              value={betAmount}
              onChange={(e) => setBetAmount(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid rgba(30,111,217,0.25)",
                fontSize: "14px",
                color: "var(--ab-navy)",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Error */}
          {betError && (
            <div style={{
              background: "rgba(255,77,106,0.08)",
              border: "0.5px solid rgba(255,77,106,0.3)",
              borderRadius: "8px",
              padding: "10px 12px",
              marginBottom: "1rem",
            }}>
              <p style={{
                color: "var(--ab-loss)",
                fontSize: "12px",
                margin: 0,
              }}>
                {betError}
              </p>
            </div>
          )}

          {/* Bet Button */}
          <button
            onClick={handleBet}
            disabled={betStatus === "loading" || !address}
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: "10px",
              border: "none",
              background: betStatus === "done" ? "var(--ab-win)" : "var(--ab-electric)",
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              cursor: betStatus === "loading" || !address ? "not-allowed" : "pointer",
              opacity: betStatus === "loading" || !address ? 0.6 : 1,
            }}
          >
            {betStatus === "loading"
              ? "Placing Bet..."
              : betStatus === "done"
              ? "✓ Bet Placed!"
              : "Place Bet"}
          </button>
        </div>
      )}

      {/* Match Not Open */}
      {!isOpen && (
        <div style={{
          textAlign: "center",
          padding: "12px",
          background: "rgba(100,100,100,0.05)",
          borderRadius: "8px",
        }}>
          <p style={{
            fontSize: "13px",
            color: "#888",
            margin: 0,
          }}>
            {isStarted ? "⏱️ Betting closed" : "Match cancelled or resolved"}
          </p>
        </div>
      )}
    </div>
  );
}
