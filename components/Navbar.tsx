"use client";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { isConnected, address } = useAccount();
  const pathname = usePathname();

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
  });

  return (
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
      <Link href="/" style={{ textDecoration: "none" }}>
        <span style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: "20px",
          color: "#fff",
          letterSpacing: "0.06em",
        }}>
          ARTEMIS <span style={{ color: "var(--ab-sky)" }}>BET</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <Link href="/" style={linkStyle("/")}>⚽ Matches</Link>
        <Link href="/leaderboard" style={linkStyle("/leaderboard")}>🏆 Leaderboard</Link>
        <Link href="/history" style={linkStyle("/history")}>📋 History</Link>
        {isConnected && (
          <>
            <Link href="/bets" style={linkStyle("/bets")}>My Bets</Link>
            <Link href="/profile" style={linkStyle("/profile")}>👤 Profile</Link>
            <Link href="/wallet" style={linkStyle("/wallet")}>Wallet</Link>
            {isOwner && (
              <Link href="/admin" style={{ ...linkStyle("/admin"), color: "var(--ab-sky)" }}>
                ⚙ Admin
              </Link>
            )}
          </>
        )}
        <ConnectKitButton />
      </div>
    </nav>
  );
}