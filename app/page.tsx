"use client";
import { useState } from "react";
import { useWriteContract, useAccount } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import Navbar from "@/components/Navbar";

export default function AdminPage() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync: writeContract } = useWriteContract();
const writeContractAsync = writeContract as any;

  const [sport, setSport] = useState("0");
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [league, setLeague] = useState("");
  const [startTime, setStartTime] = useState("");
  const [status, setStatus] = useState("");

  const [resolveMatchId, setResolveMatchId] = useState("");
  const [resolveResult, setResolveResult] = useState("0");
  const [closeMatchId, setCloseMatchId] = useState("");
  const [cancelMatchId, setCancelMatchId] = useState("");

  const handleCreateMatch = async () => {
    try {
      setStatus("Creating match...");
      const unixTime = BigInt(Math.floor(new Date(startTime).getTime() / 1000));
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "createMatch",
        args: [Number(sport), homeTeam, awayTeam, league, unixTime],
      });
      setStatus("✅ Match created successfully!");
      setHomeTeam(""); setAwayTeam(""); setLeague(""); setStartTime("");
    } catch (err: any) {
      setStatus("❌ " + (err?.message?.slice(0, 100) || "Failed"));
    }
  };

  const handleResolve = async () => {
    try {
      setStatus("Resolving match...");
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "resolveMatch",
        args: [BigInt(resolveMatchId), Number(resolveResult)],
      });
      setStatus("✅ Match resolved!");
    } catch (err: any) {
      setStatus("❌ " + (err?.message?.slice(0, 100) || "Failed"));
    }
  };

  const handleClose = async () => {
    try {
      setStatus("Closing match...");
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "closeMatch",
        args: [BigInt(closeMatchId)],
      });
      setStatus("✅ Match closed!");
    } catch (err: any) {
      setStatus("❌ " + (err?.message?.slice(0, 100) || "Failed"));
    }
  };

  const handleCancel = async () => {
    try {
      setStatus("Cancelling match...");
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "cancelMatch",
        args: [BigInt(cancelMatchId)],
      });
      setStatus("✅ Match cancelled!");
    } catch (err: any) {
      setStatus("❌ " + (err?.message?.slice(0, 100) || "Failed"));
    }
  };

  if (!isConnected) return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />
      <div style={{ textAlign: "center", padding: "4rem" }}>
        <p style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--ab-navy)" }}>
          Connect your wallet to access Admin Dashboard
        </p>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "28px", color: "var(--ab-navy)", margin: "0 0 0.25rem",
        }}>
          Admin Dashboard
        </p>
        <p style={{ fontSize: "13px", color: "#888", margin: "0 0 2rem" }}>
          Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>

        {/* Status */}
        {status && (
          <div style={{
            background: status.includes("✅") ? "rgba(0,200,150,0.08)" : status.includes("❌") ? "rgba(255,77,106,0.08)" : "var(--ab-ice)",
            border: `0.5px solid ${status.includes("✅") ? "rgba(0,200,150,0.3)" : status.includes("❌") ? "rgba(255,77,106,0.3)" : "rgba(30,111,217,0.2)"}`,
            borderRadius: "10px", padding: "12px 16px", marginBottom: "1.5rem",
          }}>
            <p style={{ margin: 0, fontSize: "14px", fontWeight: 500, color: "var(--ab-navy)" }}>{status}</p>
          </div>
        )}

        {/* Create Match */}
        <div style={{
          background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
          borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem",
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 1rem" }}>
            ➕ Create New Match
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>Sport</label>
              <select value={sport} onChange={e => setSport(e.target.value)} style={inputStyle}>
                <option value="0">⚽ Football</option>
                <option value="1">🏀 Basketball</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>League</label>
              <input value={league} onChange={e => setLeague(e.target.value)} placeholder="e.g. Premier League" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>Home Team</label>
              <input value={homeTeam} onChange={e => setHomeTeam(e.target.value)} placeholder="e.g. Arsenal" style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>Away Team</label>
              <input value={awayTeam} onChange={e => setAwayTeam(e.target.value)} placeholder="e.g. Chelsea" style={inputStyle} />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: "12px", color: "#888", display: "block", marginBottom: "4px" }}>Match Start Time</label>
              <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} style={inputStyle} />
            </div>
          </div>

          <button onClick={handleCreateMatch} style={btnStyle("var(--ab-royal)")}>
            Create Match →
          </button>
        </div>

        {/* Close Match */}
        <div style={{
          background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
          borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem",
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 1rem" }}>
            🔒 Close Match
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={closeMatchId} onChange={e => setCloseMatchId(e.target.value)} placeholder="Match ID" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={handleClose} style={btnStyle("var(--ab-electric)")}>Close</button>
          </div>
        </div>

        {/* Resolve Match */}
        <div style={{
          background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
          borderRadius: "16px", padding: "1.5rem", marginBottom: "1.5rem",
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 1rem" }}>
            ✅ Resolve Match
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: "10px" }}>
            <input value={resolveMatchId} onChange={e => setResolveMatchId(e.target.value)} placeholder="Match ID" style={inputStyle} />
            <select value={resolveResult} onChange={e => setResolveResult(e.target.value)} style={inputStyle}>
              <option value="0">Home Win</option>
              <option value="1">Draw</option>
              <option value="2">Away Win</option>
            </select>
            <button onClick={handleResolve} style={btnStyle("var(--ab-win)")}>Resolve</button>
          </div>
        </div>

        {/* Cancel Match */}
        <div style={{
          background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
          borderRadius: "16px", padding: "1.5rem",
        }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 1rem" }}>
            ❌ Cancel Match
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <input value={cancelMatchId} onChange={e => setCancelMatchId(e.target.value)} placeholder="Match ID" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={handleCancel} style={btnStyle("var(--ab-loss)")}>Cancel</button>
          </div>
        </div>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "8px",
  border: "1px solid rgba(30,111,217,0.25)",
  fontSize: "14px",
  color: "var(--ab-navy)",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "var(--font-body)",
  background: "#fff",
};

const btnStyle = (bg: string): React.CSSProperties => ({
  background: bg,
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "14px",
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "var(--font-display)",
  whiteSpace: "nowrap",
});