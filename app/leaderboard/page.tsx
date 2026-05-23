"use client";
import { useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import Navbar from "@/components/Navbar";
import { formatUSDC } from "@/lib/utils";

function ShortAddress({ address }: { address: string }) {
  if (!address) return <>—</>;
  return <>{address.slice(0, 6)}...{address.slice(-4)}</>;
}

export default function LeaderboardPage() {
  const { data: betCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "betCount",
  });

  const count = betCount ? Number(betCount) : 0;
  const betIds = Array.from({ length: count }, (_, i) => BigInt(i));

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "28px", color: "var(--ab-navy)", margin: "0 0 4px" }}>
            🏆 Leaderboard
          </p>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
            Top bettors by total bets placed on Artemis Bet
          </p>
        </div>

        {count === 0 ? (
          <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "16px", padding: "4rem", textAlign: "center" }}>
            <p style={{ fontSize: "40px", margin: "0 0 12px" }}>🏆</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ab-navy)", fontSize: "18px", margin: "0 0 8px" }}>No Bets Yet</p>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Be the first to place a bet and top the leaderboard!</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {/* Header */}
            <div style={{
              display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 100px",
              gap: "12px", padding: "10px 16px",
              background: "var(--ab-ice)", borderRadius: "10px",
              fontSize: "11px", fontWeight: 600, color: "var(--ab-royal)",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              <span>Rank</span>
              <span>Address</span>
              <span style={{ textAlign: "center" }}>Bet #</span>
              <span style={{ textAlign: "center" }}>Claimed</span>
              <span style={{ textAlign: "right" }}>Staked</span>
            </div>
            {betIds.map((betId) => (
              <LeaderboardBetRow key={betId.toString()} betId={betId} rank={Number(betId) + 1} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function LeaderboardBetRow({ betId, rank }: { betId: bigint; rank: number }) {
  const { data: rawBet } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "bets",
    args: [betId],
  });

  if (!rawBet) return null;

  const bet = rawBet as any;
  const bettor = String(bet?.bettor ?? bet?.[0] ?? "");
  const amountUSDC = BigInt(bet?.amountUSDC ?? bet?.[3] ?? 0);
  const claimed = Boolean(bet?.claimed ?? bet?.[4] ?? false);

  if (!bettor || bettor === "0x0000000000000000000000000000000000000000") return null;

  const rankColors: Record<number, string> = { 1: "#FFD700", 2: "#C0C0C0", 3: "#CD7F32" };
  const rankEmoji: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 100px",
      gap: "12px", padding: "14px 16px",
      background: "#fff", borderRadius: "12px",
      border: rank <= 3 ? `0.5px solid ${rankColors[rank]}40` : "0.5px solid rgba(30,111,217,0.1)",
      alignItems: "center",
    }}>
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: rankColors[rank] ?? "var(--ab-navy)" }}>
        {rankEmoji[rank] ?? `#${rank}`}
      </span>
      <span style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--ab-navy)", fontWeight: 600 }}>
        <ShortAddress address={bettor} />
      </span>
      <span style={{ textAlign: "center", fontSize: "14px", fontWeight: 700, color: "var(--ab-royal)" }}>
        #{betId.toString()}
      </span>
      <span style={{ textAlign: "center", fontSize: "14px", fontWeight: 700, color: claimed ? "var(--ab-win)" : "#888" }}>
        {claimed ? "✓" : "—"}
      </span>
      <span style={{ textAlign: "right", fontSize: "14px", fontWeight: 700, color: "var(--ab-navy)", fontFamily: "var(--font-display)" }}>
        ${formatUSDC(amountUSDC)}
      </span>
    </div>
  );
}