"use client";
import { useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import DepositWithdraw from "@/components/DepositWithdraw";
import UserBets from "@/components/UserBets";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  const { data: matchCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "matchCount",
  });

  const matchIds = matchCount
    ? Array.from({ length: Number(matchCount) }, (_, i) => BigInt(i))
    : [];

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />

      <div style={{
        background: "linear-gradient(135deg, var(--ab-navy) 0%, var(--ab-royal) 100%)",
        padding: "3rem 2rem",
        textAlign: "center",
      }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "clamp(28px, 5vw, 48px)",
          color: "#fff", margin: "0 0 8px", letterSpacing: "0.02em",
        }}>
          Predict. Stake. Win.
        </p>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: 0 }}>
          Sports prediction on Arc Testnet · Powered by USDC
        </p>
      </div>

      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "2rem",
        display: "grid",
        gridTemplateColumns: isConnected ? "1fr 320px" : "1fr",
        gap: "2rem",
        alignItems: "start",
      }}>
        <div>
          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "20px", color: "var(--ab-navy)",
            margin: "0 0 1rem",
          }}>
            {matchIds.length > 0 ? `${matchIds.length} Active Matches` : "Upcoming Matches"}
          </p>

          {matchIds.length === 0 ? (
            <div style={{
              background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
              borderRadius: "16px", padding: "3rem", textAlign: "center",
            }}>
              <p style={{ fontSize: "32px", margin: "0 0 8px" }}>⚽</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ab-navy)", margin: "0 0 4px" }}>
                No Matches Yet
              </p>
              <p style={{ fontSize: "14px", color: "#888", margin: 0 }}>
                The admin will add matches soon. Check back later!
              </p>
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1rem",
            }}>
              {matchIds.map(id => (
                <MatchItem key={id.toString()} matchId={id} onBetPlaced={refetchCount} />
              ))}
            </div>
          )}
        </div>

        {isConnected && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <DepositWithdraw />
            <UserBets />
          </div>
        )}
      </div>

      {!isConnected && (
        <div style={{ textAlign: "center", padding: "1rem 2rem 3rem" }}>
          <p style={{ fontSize: "14px", color: "#888" }}>
            Connect your wallet to deposit USDC and start betting
          </p>
        </div>
      )}
    </main>
  );
}

function MatchItem({ matchId, onBetPlaced }: { matchId: bigint; onBetPlaced?: () => void }) {
  const { data: raw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getMatch",
    args: [matchId],
  });

  if (!raw) return null;

  const [id, sport, homeTeam, awayTeam, league, startTime, status, result, totalStakedUSDC] = raw as any;

  return (
    <MatchCard
      match={{ id, sport, homeTeam, awayTeam, league, startTime, status, result, totalStakedUSDC }}
      onBetPlaced={onBetPlaced}
    />
  );
}