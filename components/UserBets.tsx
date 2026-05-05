"use client";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { formatUSDC } from "@/lib/utils";
import { useState } from "react";

const statusLabels = ["Open", "Closed", "Resolved", "Cancelled"];
const outcomeLabels = ["Home Win", "Draw", "Away Win"];

export default function UserBets() {
  const { address } = useAccount();
  const [claiming, setClaiming] = useState<number | null>(null);
  const { writeContractAsync } = useWriteContract();

  const { data: betIds, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getUserBets",
    args: address ? [address] : undefined,
  });

  if (!address) return null;
  if (!betIds || (betIds as bigint[]).length === 0) return (
    <div style={{
      background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
      borderRadius: "16px", padding: "2rem", textAlign: "center",
    }}>
      <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>No bets placed yet. Find a match and place your first bet!</p>
    </div>
  );

  return (
    <div style={{
      background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
      borderRadius: "16px", padding: "1.5rem",
    }}>
      <p style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 1rem",
      }}>My Bets</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {(betIds as bigint[]).map(betId => (
          <BetRow
            key={betId.toString()}
            betId={betId}
            onClaim={async () => {
              try {
                setClaiming(Number(betId));
                await writeContractAsync({
                  address: CONTRACT_ADDRESS,
                  abi: ARTEMIS_ABI,
                  functionName: "claimWinnings",
                  args: [betId],
                });
                refetch();
              } finally {
                setClaiming(null);
              }
            }}
            isClaiming={claiming === Number(betId)}
          />
        ))}
      </div>
    </div>
  );
}

function BetRow({ betId, onClaim, isClaiming }: {
  betId: bigint;
  onClaim: () => void;
  isClaiming: boolean;
}) {
  const { data: rawBet } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "bets",
    args: [betId],
  });

  const { data: rawMatch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getMatch",
    args: rawBet ? [(rawBet as any)[1]] : undefined,
  });

  if (!rawBet || !rawMatch) return null;

  const [bettor, matchId, prediction, amountUSDC, claimed] = rawBet as any;
  const [id, sport, homeTeam, awayTeam, league, startTime, status, result] = rawMatch as any;

  const isResolved = status === 2;
  const isCancelled = status === 3;
  const isWinner = isResolved && Number(prediction) === Number(result);
  const canClaim = (isWinner || isCancelled) && !claimed;

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 14px", borderRadius: "10px",
      background: claimed ? "#F9F9F9" : isWinner ? "rgba(0,200,150,0.06)" : "var(--ab-ice)",
      border: `0.5px solid ${isWinner ? "rgba(0,200,150,0.3)" : "rgba(30,111,217,0.15)"}`,
    }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px", color: "var(--ab-navy)", margin: "0 0 3px" }}>
          {homeTeam} vs {awayTeam}
        </p>
        <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
          Bet: {outcomeLabels[Number(prediction)]} · ${formatUSDC(amountUSDC)} USDC
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        {claimed && <span style={{ fontSize: "12px", color: "var(--ab-win)", fontWeight: 600 }}>✓ Claimed</span>}
        {canClaim && (
          <button
            onClick={onClaim}
            disabled={isClaiming}
            style={{
              background: "var(--ab-win)", color: "#fff",
              border: "none", borderRadius: "8px",
              padding: "6px 14px", fontSize: "12px",
              fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--font-display)",
            }}
          >
            {isClaiming ? "Claiming..." : "Claim →"}
          </button>
        )}
        {!canClaim && !claimed && (
          <span style={{
            fontSize: "11px", fontWeight: 600,
            color: isResolved && !isWinner ? "var(--ab-loss)" : "var(--ab-royal)",
          }}>
            {isResolved && !isWinner ? "Lost" : statusLabels[status]}
          </span>
        )}
      </div>
    </div>
  );
}