"use client";
import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
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
  { label: "🏠 Home Win", sublabel: (home: string) => home, value: 0, color: "var(--ab-electric)" },
  { label: "🤝 Draw", sublabel: () => "Equal score", value: 1, color: "var(--ab-sky)" },
  { label: "✈️ Away Win", sublabel: (_: string, away: string) => away, value: 2, color: "var(--ab-royal)" },
];

const QUICK_AMOUNTS = ["1", "5", "10", "25", "50"];

export default function BetModal({ match, onClose, onSuccess }: BetModalProps) {
  const { address } = useAccount();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedOutcome, setSelectedOutcome] = useState<number | null>(null);
  const [amount, setAmount] = useState("");
  const [txStatus, setTxStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const { writeContractAsync: writeContract } = useWriteContract();
  const writeContractAsync = writeContract as any;

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getBalance",
    args: address ? [address] : undefined,
  });

  const handlePlaceBet = async () => {
    if (!amount || parseFloat(amount) <= 0) return setError("Enter a valid amount");
    const usdcAmount = parseUSDC(amount);
    if (balance && usdcAmount > (balance as bigint)) return setError("Insufficient balance. Please deposit first.");

    try {
      setError("");
      setTxStatus("loading");
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "placeBet",
        args: [match.id, selectedOutcome, usdcAmount],
      });
      setTxStatus("done");
      setTimeout(() => onSuccess(), 1500);
    } catch (err: any) {
      setError(err?.message?.slice(0, 120) || "Transaction failed");
      setTxStatus("error");
    }
  };

  const selectedOutcomeData = outcomes.find(o => o.value === selectedOutcome);

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(10,31,92,0.65)",
        zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#fff", borderRadius: "24px",
          width: "100%", maxWidth: "440px",
          boxShadow: "0 24px 64px rgba(10,31,92,0.3)",
          overflow: "hidden",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Progress Bar */}
        <div style={{ background: "var(--ab-ice)", height: "4px" }}>
          <div style={{
            background: "var(--ab-electric)",
            height: "100%",
            width: step === 1 ? "33%" : step === 2 ? "66%" : "100%",
            transition: "width 0.3s ease",
          }} />
        </div>

        <div style={{ padding: "1.75rem" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: 0 }}>
                {step === 1 ? "Select Outcome" : step === 2 ? "Stake Amount" : "Confirm Bet"}
              </p>
              <p style={{ fontSize: "12px", color: "#888", margin: "2px 0 0" }}>
                Step {step} of 3
              </p>
            </div>
            <button onClick={onClose} style={{ background: "var(--ab-ice)", border: "none", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "16px", color: "#888" }}>
              ✕
            </button>
          </div>

          {/* Match Info */}
          <div style={{ background: "var(--ab-ice)", borderRadius: "12px", padding: "12px 16px", marginBottom: "1.25rem" }}>
            <p style={{ fontSize: "11px", color: "var(--ab-royal)", margin: "0 0 4px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {match.league}
            </p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: 0 }}>
              {match.homeTeam} vs {match.awayTeam}
            </p>
          </div>

          {/* STEP 1: Select Outcome */}
          {step === 1 && (
            <div>
              <p style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
                Who will win?
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "1.5rem" }}>
                {outcomes.map(o => (
                  <button
                    key={o.value}
                    onClick={() => setSelectedOutcome(o.value)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      border: selectedOutcome === o.value ? `2px solid ${o.color}` : "1.5px solid rgba(30,111,217,0.15)",
                      background: selectedOutcome === o.value ? `${o.color}10` : "#fff",
                      cursor: "pointer",
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px", color: "var(--ab-navy)", margin: 0 }}>
                        {o.label}
                      </p>
                      <p style={{ fontSize: "12px", color: "#888", margin: "2px 0 0" }}>
                        {o.value === 0 ? match.homeTeam : o.value === 2 ? match.awayTeam : "Equal score at full time"}
                      </p>
                    </div>
                    {selectedOutcome === o.value && (
                      <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: o.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ color: "#fff", fontSize: "11px", fontWeight: 700 }}>✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => selectedOutcome !== null && setStep(2)}
                disabled={selectedOutcome === null}
                style={{
                  width: "100%", padding: "14px",
                  borderRadius: "12px", border: "none",
                  background: selectedOutcome !== null ? "var(--ab-royal)" : "rgba(30,111,217,0.15)",
                  color: selectedOutcome !== null ? "#fff" : "#aaa",
                  fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "15px",
                  cursor: selectedOutcome !== null ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
              >
                Next: Set Stake Amount →
              </button>
            </div>
          )}

          {/* STEP 2: Enter Amount */}
          {step === 2 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>Your Outcome</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: selectedOutcomeData?.color }}>
                  {selectedOutcomeData?.label}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "13px", color: "#888" }}>Platform Balance</span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ab-royal)" }}>
                  ${balance ? formatUSDC(balance as bigint) : "0.00"} USDC
                </span>
              </div>

              <p style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                Stake Amount
              </p>
              <div style={{ position: "relative", marginBottom: "10px" }}>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  autoFocus
                  style={{
                    width: "100%", padding: "14px 60px 14px 16px",
                    borderRadius: "10px", border: "1.5px solid rgba(30,111,217,0.25)",
                    fontSize: "20px", fontFamily: "var(--font-display)", fontWeight: 700,
                    color: "var(--ab-navy)", outline: "none", boxSizing: "border-box",
                  }}
                />
                <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", fontWeight: 600, color: "var(--ab-royal)" }}>
                  USDC
                </span>
              </div>

              <div style={{ display: "flex", gap: "6px", marginBottom: "1.25rem" }}>
                {QUICK_AMOUNTS.map(v => (
                  <button
                    key={v}
                    onClick={() => setAmount(v)}
                    style={{
                      flex: 1, padding: "7px 4px", borderRadius: "8px",
                      border: amount === v ? "1.5px solid var(--ab-electric)" : "0.5px solid rgba(30,111,217,0.2)",
                      background: amount === v ? "var(--ab-ice)" : "#fff",
                      color: amount === v ? "var(--ab-electric)" : "var(--ab-royal)",
                      fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    }}
                  >
                    ${v}
                  </button>
                ))}
              </div>

              {error && (
                <div style={{ background: "rgba(255,77,106,0.08)", border: "0.5px solid rgba(255,77,106,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem" }}>
                  <p style={{ color: "var(--ab-loss)", fontSize: "13px", margin: 0 }}>{error}</p>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8px" }}>
                <button
                  onClick={() => { setStep(1); setError(""); }}
                  style={{ padding: "13px", borderRadius: "12px", border: "1px solid rgba(30,111,217,0.2)", background: "#fff", color: "var(--ab-navy)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => { if (amount && parseFloat(amount) > 0) { setError(""); setStep(3); } else setError("Enter a valid amount"); }}
                  style={{ padding: "13px", borderRadius: "12px", border: "none", background: "var(--ab-royal)", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", cursor: "pointer" }}
                >
                  Review Bet →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Confirm */}
          {step === 3 && (
            <div>
              <div style={{ background: "var(--ab-ice)", borderRadius: "12px", padding: "1rem", marginBottom: "1.25rem" }}>
                <p style={{ fontSize: "12px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 10px" }}>Bet Summary</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#888" }}>Match</span>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ab-navy)" }}>{match.homeTeam} vs {match.awayTeam}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "#888" }}>Prediction</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: selectedOutcomeData?.color }}>{selectedOutcomeData?.label}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "8px", borderTop: "0.5px solid rgba(30,111,217,0.15)" }}>
                  <span style={{ fontSize: "13px", color: "#888" }}>Stake</span>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--ab-navy)", fontFamily: "var(--font-display)" }}>${amount} USDC</span>
                </div>
              </div>

              {error && (
                <div style={{ background: "rgba(255,77,106,0.08)", border: "0.5px solid rgba(255,77,106,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem" }}>
                  <p style={{ color: "var(--ab-loss)", fontSize: "13px", margin: 0 }}>{error}</p>
                </div>
              )}

              {txStatus === "done" ? (
                <div style={{ textAlign: "center", padding: "1rem" }}>
                  <p style={{ fontSize: "40px", margin: "0 0 8px" }}>🎉</p>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-win)", margin: 0 }}>
                    Bet Placed!
                  </p>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8px" }}>
                  <button
                    onClick={() => { setStep(2); setError(""); setTxStatus("idle"); }}
                    disabled={txStatus === "loading"}
                    style={{ padding: "13px", borderRadius: "12px", border: "1px solid rgba(30,111,217,0.2)", background: "#fff", color: "var(--ab-navy)", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px", cursor: "pointer" }}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handlePlaceBet}
                    disabled={txStatus === "loading"}
                    style={{
                      padding: "13px", borderRadius: "12px", border: "none",
                      background: txStatus === "loading" ? "rgba(30,111,217,0.4)" : "var(--ab-electric)",
                      color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700,
                      fontSize: "14px", cursor: txStatus === "loading" ? "not-allowed" : "pointer",
                    }}
                  >
                    {txStatus === "loading" ? "Confirming..." : "✓ Confirm Bet"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}