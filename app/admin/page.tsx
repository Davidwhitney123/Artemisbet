"use client";
import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "../../lib/contract";
import Navbar from "../../components/Navbar";

const sportOptions = [
  { label: "⚽ Football", value: 0 },
  { label: "🏀 Basketball", value: 1 },
];

export default function AdminPage() {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [sport, setSport] = useState(0);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [league, setLeague] = useState("");
  const [startTime, setStartTime] = useState("");
  const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [createError, setCreateError] = useState("");

  const [actionMatchId, setActionMatchId] = useState("");
  const [resolveResult, setResolveResult] = useState(0);
  const [actionStatus, setActionStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [actionError, setActionError] = useState("");

  const { data: matchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "matchCount",
  });

  const handleCreateMatch = async () => {
    if (!homeTeam || !awayTeam || !league || !startTime) {
      return setCreateError("All fields are required");
    }
    try {
      setCreateError("");
      setCreateStatus("loading");
      const timestamp = BigInt(Math.floor(new Date(startTime).getTime() / 1000));
      await (writeContractAsync as any)({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "createMatch",
        args: [sport, homeTeam, awayTeam, league, timestamp],
      });
      setCreateStatus("done");
      setHomeTeam(""); setAwayTeam(""); setLeague(""); setStartTime("");
      setTimeout(() => setCreateStatus("idle"), 2000);
    } catch (err: any) {
      setCreateError(err?.message?.slice(0, 100) || "Transaction failed");
      setCreateStatus("error");
    }
  };

  const handleAction = async (action: "close" | "resolve" | "cancel") => {
    if (!actionMatchId) return setActionError("Enter a match ID");
    try {
      setActionError("");
      setActionStatus("loading");
      const matchId = BigInt(actionMatchId);
      if (action === "close") {
        await (writeContractAsync as any)({ address: CONTRACT_ADDRESS, abi: ARTEMIS_ABI, functionName: "closeMatch", args: [matchId] });
      } else if (action === "resolve") {
        await (writeContractAsync as any)({ address: CONTRACT_ADDRESS, abi: ARTEMIS_ABI, functionName: "resolveMatch", args: [matchId, resolveResult] });
      } else if (action === "cancel") {
        await (writeContractAsync as any)({ address: CONTRACT_ADDRESS, abi: ARTEMIS_ABI, functionName: "cancelMatch", args: [matchId] });
      }
      setActionStatus("done");
      setTimeout(() => setActionStatus("idle"), 2000);
    } catch (err: any) {
      setActionError(err?.message?.slice(0, 100) || "Transaction failed");
      setActionStatus("error");
    }
  };

  if (!isConnected) return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />
      <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
        <p style={{ fontSize: "16px", color: "#888" }}>Connect your wallet to access the admin panel.</p>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "24px", color: "var(--ab-navy)", margin: "0 0 4px" }}>
          Admin Panel
        </p>
        <p style={{ fontSize: "13px", color: "#888", margin: "0 0 2rem" }}>
          Total Matches: {matchCount?.toString() ?? "0"}
        </p>

        {/* Create Match */}
        <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 1rem" }}>
            Create Match
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "10px" }}>
            <div>
              <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Sport</label>
              <select value={sport} onChange={e => setSport(Number(e.target.value))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", marginTop: "4px" }}>
                {sportOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>League</label>
              <input value={league} onChange={e => setLeague(e.target.value)} placeholder="e.g. Premier League"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", marginTop: "4px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Home Team</label>
              <input value={homeTeam} onChange={e => setHomeTeam(e.target.value)} placeholder="e.g. Arsenal"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", marginTop: "4px", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Away Team</label>
              <input value={awayTeam} onChange={e => setAwayTeam(e.target.value)} placeholder="e.g. Chelsea"
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", marginTop: "4px", boxSizing: "border-box" }} />
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Start Time</label>
            <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", marginTop: "4px", boxSizing: "border-box" }} />
          </div>
          {createError && (
            <div style={{ background: "rgba(255,77,106,0.08)", border: "0.5px solid rgba(255,77,106,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
              <p style={{ color: "var(--ab-loss)", fontSize: "13px", margin: 0 }}>{createError}</p>
            </div>
          )}
          <button onClick={handleCreateMatch} disabled={createStatus === "loading"}
            style={{ width: "100%", background: createStatus === "done" ? "var(--ab-win)" : "var(--ab-royal)", color: "#fff", border: "none", borderRadius: "10px", padding: "13px", fontSize: "14px", fontWeight: 700, fontFamily: "var(--font-display)", cursor: "pointer" }}>
            {createStatus === "loading" ? "Creating..." : createStatus === "done" ? "✓ Match Created!" : "Create Match"}
          </button>
        </div>

        {/* Manage Match */}
        <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "16px", padding: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 1rem" }}>
            Manage Match
          </p>
          <div style={{ marginBottom: "10px" }}>
            <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Match ID</label>
            <input value={actionMatchId} onChange={e => setActionMatchId(e.target.value)} placeholder="e.g. 0"
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", marginTop: "4px", boxSizing: "border-box" }} />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontSize: "11px", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>Resolve Result</label>
            <select value={resolveResult} onChange={e => setResolveResult(Number(e.target.value))}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", marginTop: "4px" }}>
              <option value={0}>Home Win</option>
              <option value={1}>Draw</option>
              <option value={2}>Away Win</option>
            </select>
          </div>
          {actionError && (
            <div style={{ background: "rgba(255,77,106,0.08)", border: "0.5px solid rgba(255,77,106,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "10px" }}>
              <p style={{ color: "var(--ab-loss)", fontSize: "13px", margin: 0 }}>{actionError}</p>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
            <button onClick={() => handleAction("close")} disabled={actionStatus === "loading"}
              style={{ padding: "12px", borderRadius: "10px", border: "none", background: "var(--ab-navy)", color: "#fff", fontWeight: 700, fontSize: "13px", fontFamily: "var(--font-display)", cursor: "pointer" }}>
              Close Match
            </button>
            <button onClick={() => handleAction("resolve")} disabled={actionStatus === "loading"}
              style={{ padding: "12px", borderRadius: "10px", border: "none", background: "var(--ab-win)", color: "#fff", fontWeight: 700, fontSize: "13px", fontFamily: "var(--font-display)", cursor: "pointer" }}>
              {actionStatus === "done" ? "✓ Done!" : "Resolve Match"}
            </button>
            <button onClick={() => handleAction("cancel")} disabled={actionStatus === "loading"}
              style={{ padding: "12px", borderRadius: "10px", border: "none", background: "var(--ab-loss)", color: "#fff", fontWeight: 700, fontSize: "13px", fontFamily: "var(--font-display)", cursor: "pointer" }}>
              Cancel Match
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}