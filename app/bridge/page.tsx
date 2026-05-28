"use client";
import { useState } from "react";
import { useAccount, useWalletClient, useConnectorClient } from "wagmi";
import { ConnectKitButton } from "connectkit";
import Navbar from "@/components/Navbar";

const SUPPORTED_SOURCES = [
  { id: "Ethereum_Sepolia", label: "Ethereum Sepolia", emoji: "⟠", chainId: 11155111 },
  { id: "Base_Sepolia", label: "Base Sepolia", emoji: "🔵", chainId: 84532 },
  { id: "Avalanche_Fuji", label: "Avalanche Fuji", emoji: "🔺", chainId: 43113 },
];

const STEPS = [
  { key: "approve", label: "Approve USDC", desc: "Allow the bridge to use your USDC" },
  { key: "burn", label: "Burn on Source", desc: "USDC is burned on the source chain" },
  { key: "attest", label: "Circle Attestation", desc: "Circle signs the burn message (~30s)" },
  { key: "mint", label: "Mint on Arc", desc: "USDC is minted natively on Arc Testnet" },
];

type StepStatus = "idle" | "loading" | "done" | "error";

export default function BridgePage() {
  const { address, isConnected } = useAccount();
  const { data: connectorClient } = useConnectorClient();

  const [sourceChain, setSourceChain] = useState(SUPPORTED_SOURCES[0]);
  const [amount, setAmount] = useState("");
  const [bridging, setBridging] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [txLinks, setTxLinks] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const updateStep = (key: string, status: StepStatus, txLink?: string) => {
    setStepStatuses(prev => ({ ...prev, [key]: status }));
    setCurrentStep(key);
    if (txLink) setTxLinks(prev => ({ ...prev, [key]: txLink }));
  };

  const handleBridge = async () => {
    if (!amount || parseFloat(amount) <= 0) return setError("Enter a valid amount");
    if (!address) return setError("Wallet not connected");

    try {
      setError("");
      setBridging(true);
      setDone(false);
      setStepStatuses({});
      setTxLinks({});

      // Dynamically import to avoid SSR issues
      const { BridgeKit } = await import("@circle-fin/bridge-kit");
      const { createAdapterFromProvider } = await import("@circle-fin/adapter-viem-v2");

      const kit = new BridgeKit();

      // Get provider from wagmi connector
      const provider = (connectorClient as any)?.transport?.value?.provider
        ?? (window as any).ethereum;

      if (!provider) throw new Error("No wallet provider found. Please connect your wallet.");

      const adapter = await createAdapterFromProvider({ provider });

      updateStep("approve", "loading");

      // Simulate step progress
      await new Promise(r => setTimeout(r, 1000));
      updateStep("approve", "done");

      updateStep("burn", "loading");
      await new Promise(r => setTimeout(r, 1000));
      updateStep("burn", "done");

      updateStep("attest", "loading");

      await kit.bridge({
        from: { adapter, chain: sourceChain.id as any },
        to: { adapter, chain: "Arc_Testnet" },
        amount,
      });

      updateStep("attest", "done");
      updateStep("mint", "loading");
      await new Promise(r => setTimeout(r, 1000));
      updateStep("mint", "done");

      // Mark all steps done
      STEPS.forEach(s => {
        setStepStatuses(prev => ({ ...prev, [s.key]: "done" }));
      });

      setDone(true);
      setBridging(false);
    } catch (err: any) {
      setError(err?.message?.slice(0, 200) || "Bridge failed");
      if (currentStep) {
        setStepStatuses(prev => ({ ...prev, [currentStep]: "error" }));
      }
      setBridging(false);
    }
  };

  const quickAmounts = ["10", "25", "50", "100"];

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, var(--ab-navy) 0%, #1a3a8f 50%, #1e6fd9 100%)",
        padding: "3rem 2rem", textAlign: "center",
      }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(24px, 4vw, 40px)", color: "#fff", margin: "0 0 8px" }}>
          🌉 ArtemisBank
        </p>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0 0 4px" }}>
          Bridge USDC to Arc Testnet in seconds
        </p>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", margin: 0 }}>
          Powered by Circle CCTP · Native USDC · No wrapped tokens
        </p>
      </div>

      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "2rem" }}>

        {!isConnected ? (
          <div style={{
            background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)",
            borderRadius: "20px", padding: "3rem", textAlign: "center",
          }}>
            <p style={{ fontSize: "40px", margin: "0 0 16px" }}>🔗</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: "0 0 8px" }}>
              Connect Your Wallet
            </p>
            <p style={{ color: "#888", fontSize: "14px", margin: "0 0 24px" }}>
              Connect MetaMask or any EVM wallet to bridge USDC to Arc Testnet.
            </p>
            <ConnectKitButton />
          </div>
        ) : done ? (
          <div style={{
            background: "#fff", border: "0.5px solid rgba(0,200,150,0.3)",
            borderRadius: "20px", padding: "2.5rem", textAlign: "center",
          }}>
            <p style={{ fontSize: "56px", margin: "0 0 16px" }}>🎉</p>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "24px", color: "var(--ab-win)", margin: "0 0 8px" }}>
              Bridge Complete!
            </p>
            <p style={{ color: "#555", fontSize: "14px", margin: "0 0 24px" }}>
              <strong>${amount} USDC</strong> has been bridged to your Arc Testnet wallet.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="/wallet" style={{
                display: "block", padding: "13px", borderRadius: "12px",
                background: "var(--ab-electric)", color: "#fff",
                fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px",
                textDecoration: "none", textAlign: "center",
              }}>
                → Deposit to Betting Platform
              </a>
              <button
                onClick={() => { setDone(false); setAmount(""); setStepStatuses({}); setTxLinks({}); }}
                style={{
                  padding: "13px", borderRadius: "12px",
                  border: "1px solid rgba(30,111,217,0.2)", background: "#fff",
                  color: "var(--ab-navy)", fontFamily: "var(--font-display)",
                  fontWeight: 600, fontSize: "14px", cursor: "pointer",
                }}
              >
                Bridge More
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Bridge Form */}
            <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "20px", padding: "1.5rem" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: "0 0 1.25rem" }}>
                Bridge USDC → Arc Testnet
              </p>

              {/* Source Chain */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "12px", color: "#888", fontWeight: 500, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  From
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {SUPPORTED_SOURCES.map(chain => (
                    <button key={chain.id} onClick={() => setSourceChain(chain)} style={{
                      flex: 1, padding: "10px 8px", borderRadius: "10px",
                      border: sourceChain.id === chain.id ? "2px solid var(--ab-electric)" : "1px solid rgba(30,111,217,0.2)",
                      background: sourceChain.id === chain.id ? "var(--ab-ice)" : "#fff",
                      cursor: "pointer", textAlign: "center", transition: "all 0.15s",
                    }}>
                      <p style={{ fontSize: "18px", margin: "0 0 2px" }}>{chain.emoji}</p>
                      <p style={{ fontSize: "10px", fontWeight: 600, color: sourceChain.id === chain.id ? "var(--ab-electric)" : "#888", margin: 0 }}>
                        {chain.label.split(" ")[0]}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "12px", color: "#888", fontWeight: 500, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  To
                </label>
                <div style={{
                  padding: "12px 16px", borderRadius: "10px",
                  background: "rgba(0,200,150,0.06)", border: "1px solid rgba(0,200,150,0.2)",
                  display: "flex", alignItems: "center", gap: "10px",
                }}>
                  <span style={{ fontSize: "20px" }}>🔵</span>
                  <div>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--ab-navy)", margin: 0 }}>Arc Testnet</p>
                    <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>Chain ID: 5042002 · Native USDC</p>
                  </div>
                  <span style={{ marginLeft: "auto", fontSize: "11px", color: "var(--ab-win)", fontWeight: 600, background: "rgba(0,200,150,0.1)", padding: "2px 8px", borderRadius: "20px" }}>
                    ✓ Destination
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontSize: "12px", color: "#888", fontWeight: 500, display: "block", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Amount
                </label>
                <div style={{ position: "relative", marginBottom: "8px" }}>
                  <input
                    type="number" placeholder="0.00" value={amount}
                    onChange={e => setAmount(e.target.value)} disabled={bridging}
                    style={{
                      width: "100%", padding: "14px 70px 14px 16px",
                      borderRadius: "10px", border: "1.5px solid rgba(30,111,217,0.25)",
                      fontSize: "20px", fontFamily: "var(--font-display)", fontWeight: 700,
                      color: "var(--ab-navy)", outline: "none", boxSizing: "border-box" as const,
                    }}
                  />
                  <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "13px", fontWeight: 600, color: "var(--ab-royal)" }}>
                    USDC
                  </span>
                </div>
                <div style={{ display: "flex", gap: "6px" }}>
                  {quickAmounts.map(v => (
                    <button key={v} onClick={() => setAmount(v)} disabled={bridging} style={{
                      flex: 1, padding: "7px", borderRadius: "8px",
                      border: amount === v ? "1.5px solid var(--ab-electric)" : "0.5px solid rgba(30,111,217,0.2)",
                      background: amount === v ? "var(--ab-ice)" : "#fff",
                      color: amount === v ? "var(--ab-electric)" : "var(--ab-royal)",
                      fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    }}>
                      ${v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Info box */}
              <div style={{ background: "var(--ab-ice)", borderRadius: "10px", padding: "10px 14px", marginBottom: "1rem", fontSize: "12px", color: "#555", lineHeight: "1.6" }}>
                <p style={{ margin: "0 0 4px", fontWeight: 600, color: "var(--ab-royal)" }}>ℹ️ How it works</p>
                <p style={{ margin: 0 }}>
                  Circle CCTP burns your USDC on {sourceChain.label} and mints native USDC on Arc Testnet. No wrapped tokens. Takes ~30 seconds.
                </p>
              </div>

              {error && (
                <div style={{ background: "rgba(255,77,106,0.08)", border: "0.5px solid rgba(255,77,106,0.3)", borderRadius: "8px", padding: "10px 14px", marginBottom: "1rem" }}>
                  <p style={{ color: "var(--ab-loss)", fontSize: "13px", margin: 0 }}>{error}</p>
                </div>
              )}

              <button
                onClick={handleBridge} disabled={bridging || !amount}
                style={{
                  width: "100%", padding: "14px", borderRadius: "12px", border: "none",
                  background: bridging ? "rgba(30,111,217,0.4)" : "var(--ab-electric)",
                  color: "#fff", fontFamily: "var(--font-display)", fontWeight: 700,
                  fontSize: "16px", cursor: bridging ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {bridging ? "Bridging..." : `🌉 Bridge ${amount ? `$${amount}` : ""} USDC to Arc`}
              </button>
            </div>

            {/* Progress Steps */}
            {bridging && (
              <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.15)", borderRadius: "16px", padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "16px", color: "var(--ab-navy)", margin: "0 0 1rem" }}>
                  Bridge Progress
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {STEPS.map((step, i) => {
                    const status = stepStatuses[step.key] ?? "idle";
                    return (
                      <div key={step.key} style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "10px 14px", borderRadius: "10px",
                        background: status === "done" ? "rgba(0,200,150,0.06)" : status === "loading" ? "rgba(30,111,217,0.06)" : status === "error" ? "rgba(255,77,106,0.06)" : "var(--ab-ice)",
                        border: `0.5px solid ${status === "done" ? "rgba(0,200,150,0.2)" : status === "loading" ? "rgba(30,111,217,0.2)" : status === "error" ? "rgba(255,77,106,0.2)" : "transparent"}`,
                        transition: "all 0.3s",
                      }}>
                        <div style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: status === "done" ? "var(--ab-win)" : status === "loading" ? "var(--ab-electric)" : status === "error" ? "var(--ab-loss)" : "rgba(30,111,217,0.15)",
                          fontSize: "12px", fontWeight: 700, color: status === "idle" ? "#aaa" : "#fff",
                        }}>
                          {status === "done" ? "✓" : status === "loading" ? "…" : status === "error" ? "✕" : i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "13px", color: "var(--ab-navy)", margin: 0 }}>{step.label}</p>
                          <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>{step.desc}</p>
                        </div>
                        {txLinks[step.key] && (
                          <a href={txLinks[step.key]} target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", color: "var(--ab-electric)", fontWeight: 600 }}>
                            View →
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* What's next */}
            <div style={{ background: "#fff", border: "0.5px solid rgba(30,111,217,0.1)", borderRadius: "16px", padding: "1.25rem" }}>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--ab-navy)", margin: "0 0 10px" }}>
                After bridging:
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[
                  { step: "1", text: "Bridge USDC to Arc Testnet (you're here)" },
                  { step: "2", text: "Deposit USDC into Artemis Bet platform" },
                  { step: "3", text: "Place bets on live matches" },
                ].map(item => (
                  <div key={item.step} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "50%", flexShrink: 0,
                      background: "var(--ab-ice)", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "11px", fontWeight: 700, color: "var(--ab-royal)",
                    }}>
                      {item.step}
                    </div>
                    <p style={{ fontSize: "13px", color: "#555", margin: 0 }}>{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}