"use client";
import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { parseUnits } from "viem";
import { ARTEMIS_ABI, CONTRACT_ADDRESS, USDC_ABI, USDC_ADDRESS } from "@/lib/contract";
import { formatUSDC, parseUSDC } from "@/lib/utils";

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

interface BetModalProps {
  match: Match;
  onClose: () => void;
  onSuccess: () => void;
}

const outcomes = [
  { label: "Home Win", value: 0 },
  { label: "Draw", value: 1 },
  { label: "Away Win", value: 2 },
];

export default function BetModal({ match, onClose, onSuccess }: BetModalProps) {
  const { address } = useAccount();
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"bet" | "approving" | "betting" | "done">("bet");
  const [error, setError] = useState("");

  const { writeContractAsync: writeContract } = useWriteContract();
const writeContractAsync = writeContract as any;

  // Get user balance on contract
  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getBalance",
    args: address ? [address] : undefined,
  });

  const handleBet = async () => {
    if (selectedOutcome === null) return setError("Please select an outcome");
    if (!amount || parseFloat(amount) <= 0) return setError("Enter a valid amount");
    if (!address) return setError("Please connect your wallet");

    const usdcAmount = parseUSDC(amount);
    if (balance && usdcAmount > balance) return setError("Insufficient balance. Please deposit first.");

    try {
      setError("");
      setStep("betting");

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "placeBet",
        args: [match.id, selectedOutcome, usdcAmount],
      });

      setStep("done");
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setError(err?.message?.slice(0, 100) || "Transaction failed");
      setStep("bet");
    }
  };

  return (
    // Backdrop
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10,31,92,0.6)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "1.75rem",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(10,31,92,0.3)",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: 0 }}>
            Place Your Bet
          </p>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#888" }}>✕</button>
        </div>

        {/* Match Info */}
        <div style={{ background: "var(--ab-ice)", borderRadius: "12px", padding: "12px 16px", marginBottom: "1.25rem" }}>
          <p style={{ fontSize: "12px", color: "var(--ab-royal)", margin: "0 0 4px", fontWeight: 500 }}>{match.league}</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: 0 }}>
            {match.homeTeam} vs {match.awayTeam}
          </p>
        </div>

        {/* Your Balance */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontSize: "13px", color: "#888" }}>Your Balance</span>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ab-royal)" }}>
            ${balance ? formatUSDC(balance) : "0.00"} USDC
          </span>
        </div>

        {/* Outcome Selection */}
        <p style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Select Outcome</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "1.25rem" }}>
          {outcomes.map(o => (
            <button
              key={o.value}
              onClick={() => setSelectedOutcome(o.value)}
              style={{
                padding: "12px 8px",
                borderRadius: "10px",
                border: selectedOutcome === o.value
                  ? "2px solid var(--ab-electric)"
                  : "1px solid rgba(30,111,217,0.2)",
                background: selectedOutcome === o.value ? "var(--ab-ice)" : "#fff",
                color: selectedOutcome === o.value ? "var(--ab-navy)" : "#666",
                fontWeight: selectedOutcome === o.value ? 700 : 400,
                fontSize: "13px",
                cursor: "pointer",
                fontFamily: "var(--font-display)",
                transition: "all 0.15s",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>

        {/* Amount Input */}
        <p style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>Stake Amount (USDC)</p>
        <div style={{ position: "relative", marginBottom: "1.25rem" }}>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 60px 12px 16px",
              borderRadius: "10px",
              border: "1px solid rgba(30,111,217,0.25)",
              fontSize: "16px",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              color: "var(--ab-navy)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
          <span style={{
            position: "absolute", right: "14px", top: "50%",
            transform: "translateY(-50%)",
            fontSize: "12px", fontWeight: 600, color: "var(--ab-royal)",
          }}>USDC</span>
        </div>

        {/* Quick amounts */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem" }}>
          {["1", "5", "10", "25"].map(v => (
            <button
              key={v}
              onClick={() => setAmount(v)}
              style={{
                flex: 1, padding: "6px", borderRadius: "8px",
                border: "0.5px solid rgba(30,111,217,0.2)",
                background: amount === v ? "var(--ab-ice)" : "#fff",
                color: "var(--ab-royal)", fontSize: "12px", fontWeight: 500,
                cursor: "pointer",
              }}
            >
              ${v}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(255,77,106,0.08)", border: "0.5px solid rgba(255,77,106,0.3)",
            borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem",
          }}>
            <p style={{ color: "var(--ab-loss)", fontSize: "13px", margin: 0 }}>{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleBet}
          disabled={step !== "bet"}
          style={{
            width: "100%",
            background: step === "done" ? "var(--ab-win)" : "var(--ab-royal)",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "15px",
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            cursor: step === "bet" ? "pointer" : "not-allowed",
            letterSpacing: "0.03em",
            transition: "background 0.2s",
          }}
        >
          {step === "bet" && "Confirm Bet →"}
          {step === "betting" && "Placing Bet..."}
          {step === "done" && "✓ Bet Placed!"}
        </button>
      </div>
    </div>
  );
}