"use client";
import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import Navbar from "@/components/Navbar";
import { formatUSDC } from "@/lib/utils";

const statusLabels = ["Open", "Closed", "Resolved", "Cancelled"];

interface ApiFixture {
  id: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  odds: { home: number | null; draw: number | null; away: number | null } | null;
}

export default function AdminPage() {
  const { address } = useAccount();

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "owner",
  });

  const isOwner =
    address &&
    owner &&
    address.toLowerCase() === (owner as string).toLowerCase();

  const { data: matchCount, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "matchCount",
  });

  const count = matchCount ? Number(matchCount) : 0;
  const matchIds = Array.from({ length: count }, (_, i) => BigInt(i));

  const [form, setForm] = useState({
    sport: "0",
    homeTeam: "",
    awayTeam: "",
    league: "",
    startTime: "",
  });
  const [createStatus, setCreateStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [createError, setCreateError] = useState("");

  // Live fixtures from API
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [fixturesLoading, setFixturesLoading] = useState(true);
  const [importingId, setImportingId] = useState<string | null>(null);
  const [importedIds, setImportedIds] = useState<Set<string>>(new Set());

  const { writeContractAsync: wc } = useWriteContract();
  const writeContractAsync = wc as any;

  useEffect(() => {
    fetch("/api/matches")
      .then(r => r.json())
      .then(data => {
        setFixtures(data.upcoming ?? []);
        setFixturesLoading(false);
      })
      .catch(() => setFixturesLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!form.homeTeam || !form.awayTeam || !form.league || !form.startTime) {
      return setCreateError("All fields are required");
    }
    try {
      setCreateError("");
      setCreateStatus("loading");
      const startTimestamp = BigInt(
        Math.floor(new Date(form.startTime).getTime() / 1000)
      );
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "createMatch",
        args: [Number(form.sport), form.homeTeam, form.awayTeam, form.league, startTimestamp],
      });
      setCreateStatus("done");
      setForm({ sport: "0", homeTeam: "", awayTeam: "", league: "", startTime: "" });
      refetch();
      setTimeout(() => setCreateStatus("idle"), 2000);
    } catch (err: any) {
      setCreateError(err?.message?.slice(0, 120) || "Transaction failed");
      setCreateStatus("error");
    }
  };

  const handleImport = async (fixture: ApiFixture) => {
    try {
      setImportingId(fixture.id);
      const sportNum = fixture.sport === "basketball" ? 1 : 0;
      const startTimestamp = BigInt(Math.floor(new Date(fixture.startTime).getTime() / 1000));
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "createMatch",
        args: [sportNum, fixture.homeTeam, fixture.awayTeam, fixture.league, startTimestamp],
      });
      setImportedIds(prev => new Set([...prev, fixture.id]));
      refetch();
    } catch (err: any) {
      alert(err?.message?.slice(0, 120) || "Import failed");
    } finally {
      setImportingId(null);
    }
  };

  if (!address)
    return (
      <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
        <Navbar />
        <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
          <p style={{ color: "#888", fontSize: "16px" }}>Connect your wallet to access admin panel.</p>
        </div>
      </main>
    );

  if (!isOwner)
    return (
      <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
        <Navbar />
        <div style={{ maxWidth: "600px", margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
          <p style={{ fontSize: "32px", margin: "0 0 12px" }}>🔒</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--ab-navy)", fontSize: "18px" }}>Access Denied</p>
          <p style={{ color: "#888", fontSize: "14px" }}>Only the contract owner can access this page.</p>
        </div>
      </main>
    );

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "24px", color: "var(--ab-navy)", margin: "0 0 2rem" }}>
          ⚙ Admin Panel
        </p>

        {/* Import from Live Fixtures */}
        <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <div>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: "0 0 2px" }}>
                ⚡ Import from Live Fixtures
              </p>
              <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
                One-click import upcoming matches directly to the contract
              </p>
            </div>
            <button
              onClick={() => {
                setFixturesLoading(true);
                fetch("/api/matches")
                  .then(r => r.json())
                  .then(data => { setFixtures(data.upcoming ?? []); setFixturesLoading(false); })
                  .catch(() => setFixturesLoading(false));
              }}
              style={{ padding: "6px 14px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.2)", background: "var(--ab-ice)", color: "var(--ab-royal)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
            >
              🔄 Refresh
            </button>
          </div>

          {fixturesLoading ? (
            <p style={{ color: "#888", fontSize: "14px", textAlign: "center", padding: "1rem" }}>Loading fixtures...</p>
          ) : fixtures.length === 0 ? (
            <p style={{ color: "#888", fontSize: "14px", textAlign: "center", padding: "1rem" }}>No upcoming fixtures available right now.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {fixtures.map(fixture => {
                const isImported = importedIds.has(fixture.id);
                const isImporting = importingId === fixture.id;
                const startDate = new Date(fixture.startTime);
                return (
                  <div key={fixture.id} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 16px", borderRadius: "12px",
                    background: isImported ? "rgba(0,200,150,0.04)" : "var(--ab-ice)",
                    border: `0.5px solid ${isImported ? "rgba(0,200,150,0.2)" : "rgba(30,111,217,0.1)"}`,
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                        <span style={{ fontSize: "11px", color: "var(--ab-royal)", fontWeight: 500 }}>
                          {fixture.league}
                        </span>
                        <span style={{ fontSize: "11px", color: "#aaa" }}>
                          {startDate.toLocaleDateString()} {startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--ab-navy)", margin: "0 0 4px" }}>
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </p>
                      {fixture.odds && (
                        <div style={{ display: "flex", gap: "8px" }}>
                          {fixture.odds.home && <span style={{ fontSize: "11px", color: "var(--ab-win)", fontWeight: 600 }}>H: {fixture.odds.home}</span>}
                          {fixture.odds.draw && <span style={{ fontSize: "11px", color: "var(--ab-royal)", fontWeight: 600 }}>D: {fixture.odds.draw}</span>}
                          {fixture.odds.away && <span style={{ fontSize: "11px", color: "var(--ab-live)", fontWeight: 600 }}>A: {fixture.odds.away}</span>}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleImport(fixture)}
                      disabled={isImporting || isImported}
                      style={{
                        padding: "8px 16px", borderRadius: "8px", border: "none",
                        background: isImported ? "var(--ab-win)" : isImporting ? "rgba(30,111,217,0.3)" : "var(--ab-electric)",
                        color: "#fff", fontSize: "13px", fontWeight: 700,
                        cursor: isImporting || isImported ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap", marginLeft: "12px",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {isImported ? "✓ Imported" : isImporting ? "Importing..." : "⚡ Import"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Manual Create Match */}
        <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "16px", padding: "1.5rem", marginBottom: "2rem" }}>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: "0 0 1.25rem" }}>
            + Create Match Manually
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ fontSize: "12px", color: "#888", fontWeight: 500, display: "block", marginBottom: "4px" }}>Sport</label>
              <select
                value={form.sport}
                onChange={(e) => setForm((f) => ({ ...f, sport: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", color: "var(--ab-navy)", background: "#fff" }}
              >
                <option value="0">⚽ Football</option>
                <option value="1">🏀 Basketball</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888", fontWeight: 500, display: "block", marginBottom: "4px" }}>League</label>
              <input
                placeholder="e.g. Premier League"
                value={form.league}
                onChange={(e) => setForm((f) => ({ ...f, league: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", color: "var(--ab-navy)", boxSizing: "border-box" as const }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888", fontWeight: 500, display: "block", marginBottom: "4px" }}>Home Team</label>
              <input
                placeholder="e.g. Arsenal"
                value={form.homeTeam}
                onChange={(e) => setForm((f) => ({ ...f, homeTeam: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", color: "var(--ab-navy)", boxSizing: "border-box" as const }}
              />
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "#888", fontWeight: 500, display: "block", marginBottom: "4px" }}>Away Team</label>
              <input
                placeholder="e.g. Chelsea"
                value={form.awayTeam}
                onChange={(e) => setForm((f) => ({ ...f, awayTeam: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", color: "var(--ab-navy)", boxSizing: "border-box" as const }}
              />
            </div>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ fontSize: "12px", color: "#888", fontWeight: 500, display: "block", marginBottom: "4px" }}>Start Time</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "14px", color: "var(--ab-navy)", boxSizing: "border-box" as const }}
              />
            </div>
          </div>

          {createError && (
            <div style={{ background: "rgba(255,77,106,0.08)", border: "0.5px solid rgba(255,77,106,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px" }}>
              <p style={{ color: "var(--ab-loss)", fontSize: "13px", margin: 0 }}>{createError}</p>
            </div>
          )}

          <button
            onClick={handleCreate}
            disabled={createStatus === "loading"}
            style={{
              background: createStatus === "done" ? "var(--ab-win)" : "var(--ab-electric)",
              color: "#fff", border: "none", borderRadius: "10px",
              padding: "12px 24px", fontSize: "14px", fontWeight: 700,
              fontFamily: "var(--font-display)",
              cursor: createStatus === "loading" ? "not-allowed" : "pointer",
            }}
          >
            {createStatus === "loading" ? "Creating..." : createStatus === "done" ? "✓ Match Created!" : "+ Create Match"}
          </button>
        </div>

        {/* Matches List */}
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: "0 0 1rem" }}>
          All Matches ({count})
        </p>

        {count === 0 ? (
          <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "16px", padding: "3rem", textAlign: "center" }}>
            <p style={{ color: "#888", fontSize: "14px" }}>No matches yet. Import or create one above.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {matchIds.map((id) => (
              <AdminMatchRow key={id.toString()} matchId={id} onAction={refetch} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function AdminMatchRow({ matchId, onAction }: { matchId: bigint; onAction: () => void }) {
  const [resolveOutcome, setResolveOutcome] = useState<string>("0");
  const [actionStatus, setActionStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const { writeContractAsync: wc } = useWriteContract();
  const writeContractAsync = wc as any;

  const { data: raw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getMatch",
    args: [matchId],
  });

  if (!raw) return null;

  const m = raw as any;
  const id: bigint = BigInt(m.id ?? 0);
  const homeTeam: string = String(m.homeTeam ?? "");
  const awayTeam: string = String(m.awayTeam ?? "");
  const league: string = String(m.league ?? "");
  const status: number = Number(m.status ?? 0);
  const totalStaked: bigint = BigInt(m.totalStakedUSDC ?? 0);

  const isOpen = status === 0;
  const isClosed = status === 1;

  const doAction = async (fn: string, args: any[]) => {
    try {
      setError("");
      setActionStatus("loading");
      await writeContractAsync({ address: CONTRACT_ADDRESS, abi: ARTEMIS_ABI, functionName: fn, args });
      setActionStatus("done");
      onAction();
      setTimeout(() => setActionStatus("idle"), 2000);
    } catch (err: any) {
      setError(err?.message?.slice(0, 100) || "Failed");
      setActionStatus("error");
    }
  };

  const statusColors: Record<number, string> = {
    0: "rgba(0,200,150,0.1)", 1: "rgba(255,140,0,0.1)",
    2: "rgba(30,111,217,0.1)", 3: "rgba(255,77,106,0.1)",
  };
  const statusTextColors: Record<number, string> = {
    0: "var(--ab-win)", 1: "var(--ab-live)",
    2: "var(--ab-royal)", 3: "var(--ab-loss)",
  };

  return (
    <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "14px", padding: "1.25rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 4px" }}>
            {homeTeam} vs {awayTeam}
          </p>
          <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
            {league} · ID #{id.toString()} · Staked: ${formatUSDC(totalStaked)}
          </p>
        </div>
        <span style={{
          background: statusColors[status] ?? "var(--ab-ice)",
          color: statusTextColors[status] ?? "var(--ab-royal)",
          borderRadius: "20px", padding: "3px 12px",
          fontSize: "11px", fontWeight: 600,
        }}>
          {statusLabels[status]}
        </span>
      </div>

      {error && <p style={{ color: "var(--ab-loss)", fontSize: "12px", margin: "0 0 8px" }}>{error}</p>}

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        {isOpen && (
          <button onClick={() => doAction("closeMatch", [id])} disabled={actionStatus === "loading"}
            style={{ padding: "7px 16px", borderRadius: "8px", border: "1px solid rgba(255,140,0,0.4)", background: "rgba(255,140,0,0.08)", color: "var(--ab-live)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            Close Betting
          </button>
        )}
        {isClosed && (
          <>
            <select value={resolveOutcome} onChange={(e) => setResolveOutcome(e.target.value)}
              style={{ padding: "7px 12px", borderRadius: "8px", border: "1px solid rgba(30,111,217,0.25)", fontSize: "13px", color: "var(--ab-navy)", background: "#fff" }}>
              <option value="0">Home Win</option>
              <option value="1">Draw</option>
              <option value="2">Away Win</option>
            </select>
            <button onClick={() => doAction("resolveMatch", [id, Number(resolveOutcome)])} disabled={actionStatus === "loading"}
              style={{ padding: "7px 16px", borderRadius: "8px", border: "none", background: "var(--ab-royal)", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
              {actionStatus === "loading" ? "Resolving..." : "Resolve Match"}
            </button>
          </>
        )}
        {(isOpen || isClosed) && (
          <button onClick={() => doAction("cancelMatch", [id])} disabled={actionStatus === "loading"}
            style={{ padding: "7px 16px", borderRadius: "8px", border: "1px solid rgba(255,77,106,0.3)", background: "rgba(255,77,106,0.06)", color: "var(--ab-loss)", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
            Cancel Match
          </button>
        )}
        {actionStatus === "done" && <span style={{ fontSize: "13px", color: "var(--ab-win)", fontWeight: 600 }}>✓ Done</span>}
      </div>
    </div>
  );
}