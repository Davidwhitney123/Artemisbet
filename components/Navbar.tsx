"use client";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

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
      <style>{`
        .desktop-nav { display: flex; }
        .mobile-right { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-right { display: flex !important; }
          .navbar-inner { padding: 0 1rem !important; }
        }
      `}</style>

      <nav style={{
        background: "var(--ab-navy)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 20px rgba(10,31,92,0.3)",
        width: "100%",
      }}>
        <div className="navbar-inner" style={{
          padding: "0 2rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: "100%",
          overflow: "hidden",
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center" }}>
            <Image
              src="/logo.svg"
              alt="Artemis Bet"
              width={200}
              height={52}
              style={{ objectFit: "contain" }}
              priority
            />
          </Link>

          {/* Desktop Links */}
          <div className="desktop-nav" style={{ alignItems: "center", gap: "1.5rem" }}>
            <Link href="/" style={linkStyle("/")}>⚽ Matches</Link>
            <Link href="/bridge" style={linkStyle("/bridge")}>🌉 Bridge</Link>
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

          {/* Mobile Right: Hamburger only */}
          <div className="mobile-right" style={{ alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "rgba(255,255,255,0.1)", border: "none",
                borderRadius: "8px", padding: "8px 10px", cursor: "pointer",
                color: "#fff", fontSize: "20px", lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0,
          background: "var(--ab-navy)", zIndex: 99,
          padding: "12px 16px 24px",
          boxShadow: "0 8px 32px rgba(10,31,92,0.4)",
          borderTop: "0.5px solid rgba(255,255,255,0.1)",
          animation: "slideDown 0.2s ease",
        }}>
          <div style={{ padding: "8px 16px 12px", borderBottom: "0.5px solid rgba(255,255,255,0.1)", marginBottom: "8px" }}>
            <ConnectKitButton />
          </div>
          <Link href="/" style={mobileLinkStyle("/")} onClick={() => setMenuOpen(false)}>⚽ Matches</Link>
          <Link href="/bridge" style={mobileLinkStyle("/bridge")} onClick={() => setMenuOpen(false)}>🌉 Bridge</Link>
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