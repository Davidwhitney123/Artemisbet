"use client";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { isConnected, address } = useAccount();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "owner",
  });

  const isOwner = address && owner && address.toLowerCase() === (owner as string).toLowerCase();

  const linkStyle = (href: string) => ({
    color: pathname === href ? "#fff" : "rgba(255,255,255,0.65)",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: pathname === href ? 700 : 500,
    borderBottom: pathname === href ? "2px solid var(--ab-sky)" : "2px solid transparent",
    paddingBottom: "2px",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  });

  const mobileLinkStyle = (href: string) => ({
    color: pathname === href ? "#fff" : "rgba(255,255,255,0.75)",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: pathname === href ? 700 : 500,
    padding: "12px 16px",
    borderRadius: "10px",
    background: pathname === href ? "rgba(255,255,255,0.1)" : "transparent",
    display: "block",
    transition: "all 0.15s",
  });

  return (
    <>
      <nav style={{
        background: "var(--ab-navy)",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 20px rgba(10,31,92,0.3)",
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
          <span style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800, fontSize: "20px",
            color: "#fff", letterSpacing: "0.06em",
          }}>
            ARTEMIS <span style={{ color: "var(--ab-sky)" }}>BET</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }} className="desktop-nav">
          <style>{`
            @media (max-width: 768px) { .desktop-nav { display: none !important; } .mobile-menu-btn { display: flex !important; } }
            @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
          `}</style>
          <Link href="/" style={linkStyle("/")}>⚽ Matches</Link>
          <Link href="/leaderboard" style={linkStyle("/leaderboard")}>🏆 Leaderboard</Link>
          <Link href="/history" style={linkStyle("/history")}>📋 History</Link>
          {isConnected && (
            <>
              <Link href="/bets" style={linkStyle("/bets")}>My Bets</Link>
              <Link href="/profile" style={linkStyle("/profile")}>👤 Profile</Link>
              <Link href="/wallet" style={linkStyle("/wallet")}>Wallet</Link>
              {isOwner && (
                <Link href="/admin" style={{ ...linkStyle("/admin"), color: "var(--ab-sky)" }}>⚙ Admin</Link>
              )}
            </>
          )}
          <ConnectKitButton />
        </div>

        {/* Mobile: Connect + Hamburger */}
        <div className="mobile-menu-btn" style={{ display: "none", alignItems: "center", gap: "10px" }}>
          <ConnectKitButton />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255,255,255,0.1)", border: "none",
              borderRadius: "8px", padding: "8px", cursor: "pointer",
              color: "#fff", fontSize: "18px", lineHeight: 1,
              display: "flex", alignItems: "center", justifyContent: "center",
              width: "36px", height: "36px",
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="animate-slide-down" style={{
          position: "fixed", top: "64px", left: 0, right: 0,
          background: "var(--ab-navy)", zIndex: 99,
          padding: "12px 16px 20px",
          boxShadow: "0 8px 32px rgba(10,31,92,0.4)",
          borderTop: "0.5px solid rgba(255,255,255,0.1)",
        }}>
          <Link href="/" style={mobileLinkStyle("/")} onClick={() => setMenuOpen(false)}>⚽ Matches</Link>
          <Link href="/leaderboard" style={mobileLinkStyle("/leaderboard")} onClick={() => setMenuOpen(false)}>🏆 Leaderboard</Link>
          <Link href="/history" style={mobileLinkStyle("/history")} onClick={() => setMenuOpen(false)}>📋 History</Link>
          {isConnected && (
            <>
              <Link href="/bets" style={mobileLinkStyle("/bets")} onClick={() => setMenuOpen(false)}>My Bets</Link>
              <Link href="/profile" style={mobileLinkStyle("/profile")} onClick={() => setMenuOpen(false)}>👤 Profile</Link>
              <Link href="/wallet" style={mobileLinkStyle("/wallet")} onClick={() => setMenuOpen(false)}>Wallet</Link>
              {isOwner && (
                <Link href="/admin" style={{ ...mobileLinkStyle("/admin"), color: "var(--ab-sky)" }} onClick={() => setMenuOpen(false)}>⚙ Admin</Link>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}