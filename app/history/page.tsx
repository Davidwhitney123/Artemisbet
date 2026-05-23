"use client";
import { useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import Navbar from "@/components/Navbar";
import { formatUSDC, formatDate, getSportLabel } from "@/lib/utils";

const statusLabels = ["Open", "Closed", "Resolved", "Cancelled"];
const statusColors: Record<number, string> = {
  0: "var(--ab-win)",
  1: "var(--ab-live)",
  2: "var(--ab-royal)",
  3: "var(--ab-loss)",
};
const statusBg: Record<number, string> = {
  0: "rgba(0,200,150,0.1)",
  1: "rgba(255,140,0,0.1)",
  2: "rgba(30,111,217,0.1)",
  3: "rgba(255,77,106,0.1)",
};
const outcomeLabels = ["Home Win", "Draw", "Away Win"];

export default function HistoryPage() {
  const { data: matchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "matchCount",
  });

  const count = matchCount ? Number(matchCount) : 0;
  const matchIds = Array.from({ length: count }, (_, i) => BigInt(i));

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "28px", color: "var(--ab-navy)", margin: "0 0 4px" }}>
            📋 Match History
          </p>
          <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
            All matches ever created on Artemis Bet
          </p>
        </div>

        {count === 0 ? (
          <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "16px", padding: "4rem", textAlign: "center" }}>
            <p style={{ fontSize: "40px", margin: "0 0 12px" }}>📋</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ab-navy)", fontSize: "18px", margin: "0 0 8px" }}>No Matches Yet</p>
            <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>Match history will appear here once matches are created.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[...matchIds].reverse().map(id => (
              <HistoryMatchRow key={id.toString()} matchId={id} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function HistoryMatchRow({ matchId }: { matchId: bigint }) {
  const { data: raw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getMatch",
    args: [matchId],
  });

  const { data: stakes } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getOutcomeStakes",
    args: [matchId],
  });

  if (!raw) return (
    <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.1)", borderRadius: "14px", padding: "1.25rem", height: "80px" }} />
  );

  const m = raw as any;
  const id = BigInt(m?.id ?? 0);
  const sport = Number(m?.sport ?? 0);
  const homeTeam = String(m?.homeTeam ?? "");
  const awayTeam = String(m?.awayTeam ?? "");
  const league = String(m?.league ?? "");
  const startTime = BigInt(m?.startTime ?? 0);
  const status = Number(m?.status ?? 0);
  const result = Number(m?.result ?? 0);
  const totalStaked = BigInt(m?.totalStakedUSDC ?? 0);

  const s = stakes as any;
  const homeStake = s ? BigInt(s[0] ?? 0) : BigInt(0);
  const drawStake = s ? BigInt(s[1] ?? 0) : BigInt(0);
  const awayStake = s ? BigInt(s[2] ?? 0) : BigInt(0);

  const isResolved = status === 2;

  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid rgba(30,111,217,0.12)",
      borderRadius: "14px",
      padding: "1.25rem",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "12px", color: "var(--ab-royal)", fontWeight: 500 }}>
              {getSportLabel(sport)} · {league}
            </span>
            <span style={{ fontSize: "11px", color: "#aaa" }}>#{id.toString()}</span>
          </div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: 0 }}>
            {homeTeam} vs {awayTeam}
          </p>
        </div>
        <span style={{
          background: statusBg[status] ?? "var(--ab-ice)",
          color: statusColors[status] ?? "var(--ab-royal)",
          borderRadius: "20px", padding: "3px 12px",
          fontSize: "11px", fontWeight: 600, whiteSpace: "nowrap",
        }}>
          {statusLabels[status]}
        </span>
      </div>

      {isResolved && (
        <div style={{
          background: "rgba(30,111,217,0.06)", borderRadius: "8px",
          padding: "8px 12px", marginBottom: "12px", display: "inline-block",
        }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--ab-royal)" }}>
            Result: {outcomeLabels[result]}
          </span>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
        <div style={{ textAlign: "center", background: "var(--ab-ice)", borderRadius: "8px", padding: "8px" }}>
          <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", textTransform: "uppercase" }}>Total</p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--ab-navy)", margin: 0 }}>${formatUSDC(totalStaked)}</p>
        </div>
        <div style={{ textAlign: "center", background: "rgba(0,200,150,0.06)", borderRadius: "8px", padding: "8px" }}>
          <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", textTransform: "uppercase" }}>Home</p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--ab-win)", margin: 0 }}>${formatUSDC(homeStake)}</p>
        </div>
        <div style={{ textAlign: "center", background: "rgba(30,111,217,0.06)", borderRadius: "8px", padding: "8px" }}>
          <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", textTransform: "uppercase" }}>Draw</p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--ab-royal)", margin: 0 }}>${formatUSDC(drawStake)}</p>
        </div>
        <div style={{ textAlign: "center", background: "rgba(255,140,0,0.06)", borderRadius: "8px", padding: "8px" }}>
          <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", textTransform: "uppercase" }}>Away</p>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "var(--ab-live)", margin: 0 }}>${formatUSDC(awayStake)}</p>
        </div>
      </div>

      <p style={{ fontSize: "11px", color: "#aaa", margin: "10px 0 0", textAlign: "right" }}>
        {formatDate(startTime)}
      </p>
    </div>
  );
}