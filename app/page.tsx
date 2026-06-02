"use client";
import { useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import Navbar from "@/components/Navbar";
import MatchCard from "@/components/MatchCard";
import DepositWithdraw from "@/components/DepositWithdraw";
import UserBets from "@/components/UserBets";
import LiveMatches from "@/components/LiveMatches";
import Footer from "@/components/Footer";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  const { data: matchCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "matchCount",
    query: { refetchInterval: 5000 },
  });

  const count = matchCount ? Number(matchCount) : 0;
  const matchIds = Array.from({ length: count }, (_, i) => BigInt(i));

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />

      {/* Hero */}
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

      {/* Content */}
      <div style={{
        maxWidth: "1200px", margin: "0 auto",
        padding: "2rem",
        display: "grid",
        gridTemplateColumns: isConnected ? "1fr 320px" : "1fr",
        gap: "2rem",
        alignItems: "start",
      }}>
        {/* Left: Live Scores + Matches */}
        <div>
          <LiveMatches />

          <p style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "20px", color: "var(--ab-navy)",
            margin: "0 0 1rem",
          }}>
            Active Matches
          </p>

          <ActiveMatches matchIds={matchIds} onBetPlaced={refetchCount} />
        </div>

        {/* Right: Wallet + Bets (only when connected) */}
        {isConnected && (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <DepositWithdraw />
            <UserBets />
          </div>
        )}
      </div>

      {/* Connect prompt if not connected */}
      {!isConnected && (
        <div style={{ textAlign: "center", padding: "1rem 2rem 3rem" }}>
          <p style={{ fontSize: "14px", color: "#888" }}>
            Connect your wallet to deposit USDC and start betting
          </p>
        </div>
      )}

      <Footer />
    </main>
  );
}

function ActiveMatches({ matchIds, onBetPlaced }: { matchIds: bigint[]; onBetPlaced?: () => void }) {
  if (matchIds.length === 0) {
    return (
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
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "1rem",
    }}>
      {matchIds.map(id => (
        <MatchItem key={id.toString()} matchId={id} onBetPlaced={onBetPlaced} />
      ))}
    </div>
  );
}

function MatchItem({ matchId, onBetPlaced }: { matchId: bigint; onBetPlaced?: () => void }) {
  const { data: raw, isLoading, isError } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getMatch",
    args: [matchId],
    query: { refetchInterval: 5000 },
  });

  if (isLoading) return (
    <div style={{
      background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
      borderRadius: "16px", padding: "1.25rem", textAlign: "center",
      minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <p style={{ color: "#888", fontSize: "14px" }}>Loading match...</p>
    </div>
  );

  if (isError || !raw) return (
    <div style={{
      background: "#fff", border: "0.5px solid rgba(255,77,106,0.2)",
      borderRadius: "16px", padding: "1.25rem", textAlign: "center",
      minHeight: "200px", display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <p style={{ color: "var(--ab-loss)", fontSize: "14px" }}>
        Failed to load match #{matchId.toString()}
      </p>
    </div>
  );

  const match = raw as any;
  const status = Number(match?.status ?? 0);

  // Hide resolved (2) and cancelled (3) matches from home page
  if (status === 2 || status === 3) return null;

  return (
    <MatchCard
      match={{
        id: BigInt(match.id ?? 0),
        sport: Number(match.sport ?? 0),
        homeTeam: String(match.homeTeam ?? ""),
        awayTeam: String(match.awayTeam ?? ""),
        league: String(match.league ?? ""),
        startTime: BigInt(match.startTime ?? 0),
        status: Number(match.status ?? 0),
        result: Number(match.result ?? 0),
        totalStakedUSDC: BigInt(match.totalStakedUSDC ?? 0),
      }}
      onBetPlaced={onBetPlaced}
    />
  );
}