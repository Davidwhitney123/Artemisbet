"use client";
import { useAccount, useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import Navbar from "@/components/Navbar";
import { formatUSDC } from "@/lib/utils";
import { ConnectKitButton } from "connectkit";

const outcomeLabels = ["Home Win", "Draw", "Away Win"];
const statusLabels = ["Open", "Closed", "Resolved", "Cancelled"];

export default function ProfilePage() {
  const { address, isConnected } = useAccount();

  const { data: balance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getBalance",
    args: address ? [address] : undefined,
  });

  const { data: betIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getUserBets",
    args: address ? [address] : undefined,
  });

  if (!isConnected) return (
    <main style={{ minHeight: "100vh", background: "var(--ab-navy)" }}>
      <Navbar />
      <div style={{ maxWidth: "500px", margin: "6rem auto", padding: "2rem", textAlign: "center" }}>
        <p style={{ fontSize: "48px", margin: "0 0 16px" }}>👤</p>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "22px", color: "var(--ab-text-primary)", margin: "0 0 8px" }}>
          Your Profile
        </p>
        <p style={{ color: "var(--ab-text-secondary)", fontSize: "15px", margin: "0 0 24px" }}>
          Connect your wallet to view your profile and betting stats.
        </p>
        <ConnectKitButton />
      </div>
    </main>
  );

  const bets = (betIds as bigint[]) ?? [];
  const totalBets = bets.length;
  const platformBalance = balance ? formatUSDC(balance as bigint) : "0.00";

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-navy)" }}>
      <Navbar />
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem" }}>

        {/* Profile Header */}
        <div style={{
          background: "linear-gradient(135deg, var(--ab-navy) 0%, var(--ab-royal) 100%)",
          borderRadius: "20px", padding: "2rem",
          marginBottom: "1.5rem", color: "var(--ab-text-primary)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "1.5rem" }}>
            <div style={{
              width: "64px", height: "64px", borderRadius: "50%",
              background: "rgba(251,250,252,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "28px",
            }}>
              👤
            </div>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", margin: "0 0 4px" }}>
                My Profile
              </p>
              <p style={{ fontSize: "13px", opacity: 0.7, margin: 0, fontFamily: "monospace" }}>
                {address?.slice(0, 10)}...{address?.slice(-8)}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            <div style={{ background: "rgba(251,250,252,0.1)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", opacity: 0.7, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Platform Balance</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "20px", margin: 0 }}>${platformBalance}</p>
              <p style={{ fontSize: "10px", opacity: 0.6, margin: "2px 0 0" }}>USDC</p>
            </div>
            <div style={{ background: "rgba(251,250,252,0.1)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", opacity: 0.7, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Bets</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "20px", margin: 0 }}>{totalBets}</p>
              <p style={{ fontSize: "10px", opacity: 0.6, margin: "2px 0 0" }}>placed</p>
            </div>
            <div style={{ background: "rgba(251,250,252,0.1)", borderRadius: "12px", padding: "14px", textAlign: "center" }}>
              <p style={{ fontSize: "11px", opacity: 0.7, margin: "0 0 4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Network</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "14px", margin: 0 }}>Arc Testnet</p>
              <p style={{ fontSize: "10px", opacity: 0.6, margin: "2px 0 0" }}>Chain #5042002</p>
            </div>
          </div>
        </div>

        {/* Bet History */}
        <div style={{ background: "var(--ab-royal)", border: "0.5px solid var(--ab-border)", borderRadius: "16px", padding: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-text-primary)", margin: "0 0 1rem" }}>
            Betting History
          </p>

          {totalBets === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 1rem" }}>
              <p style={{ fontSize: "32px", margin: "0 0 8px" }}>🎯</p>
              <p style={{ color: "var(--ab-text-secondary)", fontSize: "14px", margin: 0 }}>No bets yet. Go place your first bet!</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {bets.map(betId => (
                <ProfileBetRow key={betId.toString()} betId={betId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function ProfileBetRow({ betId }: { betId: bigint }) {
  const { data: rawBet } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "bets",
    args: [betId],
  });

  const bet = rawBet as any;
  const matchId = bet?.matchId ?? bet?.[1];

  const { data: rawMatch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getMatch",
    args: matchId !== undefined ? [matchId] : undefined,
  });

  if (!rawBet || !rawMatch) return null;

  const prediction = Number(bet?.prediction ?? bet?.[2] ?? 0);
  const amountUSDC = BigInt(bet?.amountUSDC ?? bet?.[3] ?? 0);
  const claimed = Boolean(bet?.claimed ?? bet?.[4] ?? false);

  const m = rawMatch as any;
  const homeTeam = String(m?.homeTeam ?? m?.[2] ?? "");
  const awayTeam = String(m?.awayTeam ?? m?.[3] ?? "");
  const status = Number(m?.status ?? m?.[6] ?? 0);
  const result = Number(m?.result ?? m?.[7] ?? 0);

  const isResolved = status === 2;
  const isCancelled = status === 3;
  const isWinner = isResolved && prediction === result;

  const getBadge = () => {
    if (claimed) return { text: "✓ Claimed", color: "var(--ab-win)", bg: "rgba(0,200,150,0.1)" };
    if (isWinner) return { text: "🏆 Won", color: "var(--ab-win)", bg: "rgba(0,200,150,0.1)" };
    if (isResolved && !isWinner) return { text: "❌ Lost", color: "var(--ab-loss)", bg: "rgba(255,77,106,0.08)" };
    if (isCancelled) return { text: "↩ Refund", color: "var(--ab-live)", bg: "rgba(255,140,0,0.1)" };
    return { text: statusLabels[status], color: "var(--ab-royal)", bg: "var(--ab-ice)" };
  };

  const badge = getBadge();

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 16px", borderRadius: "12px",
      background: isWinner ? "rgba(0,200,150,0.04)" : "var(--ab-card)",
      border: `0.5px solid ${isWinner ? "rgba(34,197,94,0.2)" : "var(--ab-border)"}`,
    }}>
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "14px", color: "var(--ab-navy)", margin: "0 0 3px" }}>
          {homeTeam} vs {awayTeam}
        </p>
        <p style={{ fontSize: "12px", color: "var(--ab-text-secondary)", margin: 0 }}>
          {outcomeLabels[prediction]} · ${formatUSDC(amountUSDC)} USDC · Bet #{betId.toString()}
        </p>
      </div>
      <span style={{
        background: badge.bg, color: badge.color,
        borderRadius: "20px", padding: "4px 12px",
        fontSize: "12px", fontWeight: 700, whiteSpace: "nowrap",
      }}>
        {badge.text}
      </span>
    </div>
  );
}
