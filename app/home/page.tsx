"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LandingPage() {
  const [activeDoc, setActiveDoc] = useState<string | null>(null);

  const docs = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "🚀",
      content: `
**1. Connect Your Wallet**
Connect MetaMask or any EVM-compatible wallet. Make sure you're on Arc Testnet (Chain ID: 5042002).

**2. Get USDC on Arc Testnet**
Use ArtemisBank (/bridge) to bridge USDC from Ethereum Sepolia, Base Sepolia, or Avalanche Fuji to Arc Testnet using Circle's CCTP protocol.

**3. Deposit to Platform**
Go to Wallet (/wallet) and deposit your USDC into the Artemis Bet platform to start betting.

**4. Place Your First Bet**
Browse active matches on the home page, select your predicted outcome, enter your stake amount, and confirm.

**5. Claim Winnings**
After a match is resolved, go to My Bets to claim your winnings instantly.
      `
    },
    {
      id: "how-betting-works",
      title: "How Betting Works",
      icon: "🎯",
      content: `
**Parimutuel Betting System**
Artemis Bet uses a parimutuel (pool-based) system — all bets on a match go into a single pool. Winners share the entire pool proportionally based on their stake.

**Placing a Bet**
1. Select a match from the home page
2. Choose your prediction: Home Win, Draw, or Away Win
3. Enter your USDC stake amount
4. Review and confirm the transaction

**Winning**
If your prediction is correct, your payout = (Your Stake / Total Winning Stakes) × Total Pool × 0.98

The more unique your winning prediction, the higher your payout. A 2% platform fee applies.

**Claiming**
After a match is resolved by the admin, a "Claim →" button appears on your bet. Click it to receive your USDC.
      `
    },
    {
      id: "bridge",
      title: "ArtemisBank Bridge",
      icon: "🌉",
      content: `
**Cross-Chain USDC Bridging**
ArtemisBank uses Circle's Cross-Chain Transfer Protocol (CCTP) to bridge native USDC from multiple chains to Arc Testnet.

**Supported Source Chains**
- Ethereum Sepolia
- Base Sepolia  
- Avalanche Fuji

**How It Works**
1. USDC is burned on the source chain
2. Circle's attestation service signs the burn proof (~30 seconds)
3. Native USDC is minted on Arc Testnet
4. No wrapped tokens — always native USDC

**After Bridging**
Your USDC arrives in your wallet on Arc Testnet. Then deposit it into the Artemis Bet platform to start betting.
      `
    },
    {
      id: "smart-contract",
      title: "Smart Contract",
      icon: "📜",
      content: `
**ArtemisB Contract**
The Artemis Bet smart contract is deployed on Arc Testnet and handles all betting logic transparently on-chain.

**Key Functions**
- createMatch() — Admin creates a new match
- placeBet() — Users place bets with USDC
- resolveMatch() — Admin resolves match result
- claimWinnings() — Winners claim their payout
- deposit() / withdraw() — Manage platform balance

**Security**
- All funds are held in the smart contract
- Only the contract owner can create/resolve matches
- Winnings are calculated transparently on-chain
- Users can withdraw their balance at any time

**USDC Integration**
The contract uses Circle's native USDC on Arc Testnet for all transactions — no custom tokens.
      `
    },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#0F172A", color: "#FBFAFC" }}>

      {/* Navbar */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "rgba(15,23,42,0.9)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid #334155",
        padding: "0 2rem", height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Image src="/logo.svg" alt="Artemis Bet" width={160} height={44} style={{ objectFit: "contain" }} priority />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <a href="#features" style={{ color: "#9AA3BB", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Features</a>
          <a href="#how-it-works" style={{ color: "#9AA3BB", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>How It Works</a>
          <a href="#docs" style={{ color: "#9AA3BB", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>Docs</a>
          <a href="https://x.com/Artbets12" target="_blank" rel="noopener noreferrer"
            style={{ color: "#9AA3BB", fontSize: "14px", fontWeight: 500, textDecoration: "none" }}>
            𝕏 Twitter
          </a>
          <Link href="/home" style={{
            background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
            color: "#fff", padding: "8px 20px", borderRadius: "10px",
            fontSize: "14px", fontWeight: 700, fontFamily: "'Syne', sans-serif",
            textDecoration: "none", boxShadow: "0 4px 16px rgba(59,130,246,0.3)",
          }}>
            Launch App →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "6rem 2rem 4rem",
        background: "radial-gradient(ellipse at 50% 0%, rgba(29,78,216,0.2) 0%, transparent 70%), #0F172A",
        textAlign: "center", position: "relative", overflow: "hidden",
      }}>
        {/* Background grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(51,65,85,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(51,65,85,0.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 0%, transparent 70%)",
        }} />

        {/* Built on Arc badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          background: "rgba(29,78,216,0.15)", border: "1px solid rgba(59,130,246,0.3)",
          borderRadius: "20px", padding: "6px 16px", marginBottom: "2rem",
          fontSize: "13px", fontWeight: 600, color: "#60A5FA",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22C55E", display: "inline-block" }} />
          Built on Arc Testnet · Powered by Circle USDC
        </div>

        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(40px, 7vw, 80px)", lineHeight: 1.1,
          color: "#FBFAFC", margin: "0 0 1.5rem", maxWidth: "900px",
          letterSpacing: "-0.02em",
        }}>
          Predict. Stake.{" "}
          <span style={{ background: "linear-gradient(135deg, #3B82F6, #60A5FA)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Win.
          </span>
        </h1>

        <p style={{
          fontSize: "clamp(16px, 2vw, 20px)", color: "#9AA3BB",
          maxWidth: "600px", lineHeight: 1.6, margin: "0 0 2.5rem",
        }}>
          The first decentralised sports prediction platform on Arc Testnet. Bridge USDC from any chain, bet on live matches, and claim winnings — all powered by Circle's native USDC.
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", marginBottom: "4rem" }}>
          <Link href="/home" style={{
            background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
            color: "#fff", padding: "14px 32px", borderRadius: "12px",
            fontSize: "16px", fontWeight: 700, fontFamily: "'Syne', sans-serif",
            textDecoration: "none", boxShadow: "0 8px 32px rgba(59,130,246,0.4)",
            transition: "transform 0.2s",
          }}>
            🚀 Launch App
          </Link>
          <a href="#docs" style={{
            background: "rgba(30,41,59,0.8)", border: "1px solid #334155",
            color: "#FBFAFC", padding: "14px 32px", borderRadius: "12px",
            fontSize: "16px", fontWeight: 600, fontFamily: "'Syne', sans-serif",
            textDecoration: "none",
          }}>
            📖 Read Docs
          </a>
          <a href="https://x.com/Artbets12" target="_blank" rel="noopener noreferrer" style={{
            background: "rgba(30,41,59,0.8)", border: "1px solid #334155",
            color: "#FBFAFC", padding: "14px 32px", borderRadius: "12px",
            fontSize: "16px", fontWeight: 600, fontFamily: "'Syne', sans-serif",
            textDecoration: "none", display: "flex", alignItems: "center", gap: "8px",
          }}>
            𝕏 Follow Us
          </a>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center",
          padding: "1.5rem 2.5rem",
          background: "rgba(30,41,59,0.6)", border: "1px solid #334155",
          borderRadius: "16px", backdropFilter: "blur(8px)",
        }}>
          {[
            { label: "Chain", value: "Arc Testnet" },
            { label: "Currency", value: "Native USDC" },
            { label: "Protocol", value: "Circle CCTP" },
            { label: "Contract", value: "On-Chain" },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: "center", minWidth: "100px" }}>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "18px", color: "#FBFAFC", margin: "0 0 4px" }}>{stat.value}</p>
              <p style={{ fontSize: "12px", color: "#9AA3BB", margin: 0, textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <p style={{ fontSize: "13px", color: "#3B82F6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
            Everything you need
          </p>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#FBFAFC", margin: "0 0 16px" }}>
            Built different. Built better.
          </h2>
          <p style={{ color: "#9AA3BB", fontSize: "18px", maxWidth: "500px", margin: "0 auto" }}>
            A complete sports betting ecosystem powered by Circle's infrastructure
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {[
            { icon: "⚽", title: "Live Sports Betting", desc: "Bet on real football and basketball matches with live scores and odds powered by The Odds API. New fixtures imported directly from live data." },
            { icon: "🌉", title: "ArtemisBank Bridge", desc: "Bridge USDC from Ethereum, Base, or Avalanche to Arc Testnet using Circle's CCTP. Native USDC — no wrapped tokens, no third-party risk." },
            { icon: "🏆", title: "Pool-Based Payouts", desc: "Winners share the entire betting pool proportionally. The fewer correct predictions, the bigger your winnings. Transparent on-chain calculations." },
            { icon: "🔒", title: "Fully On-Chain", desc: "All bets, payouts, and balances are managed by a smart contract on Arc Testnet. Trustless, transparent, and verifiable by anyone." },
            { icon: "📊", title: "Leaderboard & History", desc: "Track top bettors on the leaderboard, view full match history with pool breakdowns, and manage your profile and betting stats." },
            { icon: "💳", title: "Circle Payment Stack", desc: "Built entirely on Circle's technology — native USDC on Arc Testnet, CCTP bridging, and Circle Payments API for seamless onboarding." },
          ].map(feature => (
            <div key={feature.title} style={{
              background: "linear-gradient(145deg, #1E293B 0%, #162032 100%)",
              border: "1px solid #334155", borderRadius: "16px", padding: "1.75rem",
              transition: "transform 0.2s, border-color 0.2s, box-shadow 0.2s",
              cursor: "default",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(59,130,246,0.4)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 40px rgba(0,0,0,0.4)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLDivElement).style.borderColor = "#334155";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              <p style={{ fontSize: "36px", margin: "0 0 16px" }}>{feature.icon}</p>
              <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "#FBFAFC", margin: "0 0 8px" }}>
                {feature.title}
              </p>
              <p style={{ fontSize: "14px", color: "#9AA3BB", lineHeight: 1.6, margin: 0 }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: "6rem 2rem",
        background: "rgba(30,41,59,0.4)", borderTop: "1px solid #334155", borderBottom: "1px solid #334155",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <p style={{ fontSize: "13px", color: "#3B82F6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Simple steps</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#FBFAFC", margin: 0 }}>
              Start betting in minutes
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { step: "01", title: "Connect Wallet", desc: "Connect MetaMask or any EVM wallet and switch to Arc Testnet (Chain ID: 5042002).", color: "#3B82F6" },
              { step: "02", title: "Bridge USDC", desc: "Use ArtemisBank to bridge native USDC from Ethereum Sepolia, Base Sepolia, or Avalanche Fuji to Arc Testnet in ~30 seconds.", color: "#22C55E" },
              { step: "03", title: "Deposit & Bet", desc: "Deposit your USDC into the platform, browse live matches, pick your outcome, and place your bet.", color: "#A855F7" },
              { step: "04", title: "Win & Claim", desc: "After the match resolves, winners claim their share of the pool directly to their platform balance.", color: "#EAB308" },
            ].map(item => (
              <div key={item.step} style={{
                display: "flex", alignItems: "flex-start", gap: "1.5rem",
                background: "linear-gradient(145deg, #1E293B 0%, #162032 100%)",
                border: "1px solid #334155", borderRadius: "16px", padding: "1.5rem",
              }}>
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px", flexShrink: 0,
                  background: `${item.color}15`, border: `1px solid ${item.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "14px", color: item.color,
                }}>
                  {item.step}
                </div>
                <div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "#FBFAFC", margin: "0 0 6px" }}>
                    {item.title}
                  </p>
                  <p style={{ fontSize: "14px", color: "#9AA3BB", lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Built on Arc + Circle Section */}
      <section style={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#FBFAFC", margin: "0 0 16px" }}>
            Powered by the best infrastructure
          </h2>
          <p style={{ color: "#9AA3BB", fontSize: "18px", maxWidth: "500px", margin: "0 auto" }}>
            Artemis Bet is built on Arc Testnet and powered by Circle's industry-leading payment infrastructure
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
          {/* Arc Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(29,78,216,0.2) 0%, rgba(30,41,59,0.8) 100%)",
            border: "1px solid rgba(59,130,246,0.3)", borderRadius: "20px", padding: "2rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59,130,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                🔵
              </div>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "#FBFAFC", margin: 0 }}>Arc Testnet</p>
                <p style={{ fontSize: "12px", color: "#60A5FA", margin: 0 }}>Chain ID: 5042002</p>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#9AA3BB", lineHeight: 1.7, margin: "0 0 1rem" }}>
              Arc is a next-generation EVM-compatible blockchain designed for high-performance DeFi applications. Artemis Bet is one of the first betting platforms deployed on Arc Testnet, pioneering sports prediction on this innovative chain.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {["EVM Compatible", "Fast Finality", "Native USDC Support", "Low Gas Fees"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#22C55E", fontSize: "12px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "#9AA3BB" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Circle Card */}
          <div style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(30,41,59,0.8) 100%)",
            border: "1px solid rgba(34,197,94,0.2)", borderRadius: "20px", padding: "2rem",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.25rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34,197,94,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                ⭕
              </div>
              <div>
                <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "18px", color: "#FBFAFC", margin: 0 }}>Circle</p>
                <p style={{ fontSize: "12px", color: "#22C55E", margin: 0 }}>USDC · CCTP · Payments</p>
              </div>
            </div>
            <p style={{ fontSize: "14px", color: "#9AA3BB", lineHeight: 1.7, margin: "0 0 1rem" }}>
              Circle is the trusted issuer of USDC, the world's leading regulated digital dollar. Artemis Bet uses Circle's full payment stack — native USDC for betting, CCTP for cross-chain bridging, and the Payments API for seamless onboarding.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {["Native USDC on Arc", "CCTP Cross-Chain Bridge", "Circle Payments API", "Regulated & Trusted"].map(f => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ color: "#22C55E", fontSize: "12px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: "#9AA3BB" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Docs Section */}
      <section id="docs" style={{
        padding: "6rem 2rem",
        background: "rgba(30,41,59,0.4)", borderTop: "1px solid #334155",
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <p style={{ fontSize: "13px", color: "#3B82F6", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Documentation</p>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#FBFAFC", margin: "0 0 16px" }}>
              Everything you need to know
            </h2>
            <p style={{ color: "#9AA3BB", fontSize: "16px", margin: 0 }}>
              Click any section to expand
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {docs.map(doc => (
              <div key={doc.id} style={{
                background: "linear-gradient(145deg, #1E293B 0%, #162032 100%)",
                border: `1px solid ${activeDoc === doc.id ? "rgba(59,130,246,0.4)" : "#334155"}`,
                borderRadius: "14px", overflow: "hidden",
                transition: "border-color 0.2s",
              }}>
                <button
                  onClick={() => setActiveDoc(activeDoc === doc.id ? null : doc.id)}
                  style={{
                    width: "100%", padding: "1.25rem 1.5rem",
                    background: "none", border: "none", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "22px" }}>{doc.icon}</span>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "16px", color: "#FBFAFC" }}>
                      {doc.title}
                    </span>
                  </div>
                  <span style={{ color: "#9AA3BB", fontSize: "18px", transition: "transform 0.2s", transform: activeDoc === doc.id ? "rotate(180deg)" : "rotate(0)" }}>
                    ▼
                  </span>
                </button>

                {activeDoc === doc.id && (
                  <div style={{ padding: "0 1.5rem 1.5rem", borderTop: "1px solid #334155" }}>
                    <div style={{ paddingTop: "1rem" }}>
                      {doc.content.trim().split("\n").map((line, i) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return <p key={i} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "14px", color: "#60A5FA", margin: "12px 0 4px" }}>{line.replace(/\*\*/g, "")}</p>;
                        }
                        if (line.trim() === "") return null;
                        return <p key={i} style={{ fontSize: "14px", color: "#9AA3BB", lineHeight: 1.7, margin: "4px 0" }}>{line}</p>;
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "6rem 2rem", textAlign: "center",
        background: "radial-gradient(ellipse at 50% 50%, rgba(29,78,216,0.15) 0%, transparent 70%), #0F172A",
      }}>
        <h2 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 52px)", color: "#FBFAFC", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
          Ready to predict and win?
        </h2>
        <p style={{ color: "#9AA3BB", fontSize: "18px", margin: "0 0 2.5rem" }}>
          Join Artemis Bet — the first sports prediction platform on Arc Testnet
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/home" style={{
            background: "linear-gradient(135deg, #1D4ED8, #3B82F6)",
            color: "#fff", padding: "16px 40px", borderRadius: "12px",
            fontSize: "17px", fontWeight: 700, fontFamily: "'Syne', sans-serif",
            textDecoration: "none", boxShadow: "0 8px 32px rgba(59,130,246,0.4)",
          }}>
            🚀 Launch App
          </Link>
          <a href="https://x.com/Artbets12" target="_blank" rel="noopener noreferrer" style={{
            background: "rgba(30,41,59,0.8)", border: "1px solid #334155",
            color: "#FBFAFC", padding: "16px 40px", borderRadius: "12px",
            fontSize: "17px", fontWeight: 600, fontFamily: "'Syne', sans-serif",
            textDecoration: "none",
          }}>
            𝕏 Follow on Twitter
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "2rem", textAlign: "center",
        borderTop: "1px solid #334155",
        background: "#0B1120",
      }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <Link href="/home" style={{ color: "#9AA3BB", fontSize: "13px", textDecoration: "none" }}>App</Link>
          <Link href="/bridge" style={{ color: "#9AA3BB", fontSize: "13px", textDecoration: "none" }}>Bridge</Link>
          <Link href="/leaderboard" style={{ color: "#9AA3BB", fontSize: "13px", textDecoration: "none" }}>Leaderboard</Link>
          <a href="https://x.com/Artbets12" target="_blank" rel="noopener noreferrer" style={{ color: "#9AA3BB", fontSize: "13px", textDecoration: "none" }}>Twitter</a>
          <a href="https://arc.network" target="_blank" rel="noopener noreferrer" style={{ color: "#9AA3BB", fontSize: "13px", textDecoration: "none" }}>Arc Network</a>
          <a href="https://circle.com" target="_blank" rel="noopener noreferrer" style={{ color: "#9AA3BB", fontSize: "13px", textDecoration: "none" }}>Circle</a>
        </div>
        <p style={{ color: "#334155", fontSize: "12px", margin: 0 }}>
          © 2026 Artemis Bet · Built on Arc Testnet · Powered by Circle USDC · For demonstration purposes only
        </p>
      </footer>
    </main>
  );
}