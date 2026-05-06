"use client";
import { ConnectKitButton } from "connectkit";
import Link from "next/link";
import { useAccount, useReadContract } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS } from "@/lib/contract";

export default function Navbar() {
  const { isConnected, address } = useAccount();

  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "owner",
  });

  const isOwner = address && owner && address.toLowerCase() === (owner as string).toLowerCase();

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

      <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
        <Link href="/" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
          ⚽ Matches
        </Link>
        {isConnected && (
          <>
            <Link href="/bets" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
              My Bets
            </Link>
            <Link href="/wallet" style={{ color: "rgba(255,255,255,0.75)", textDecoration: "none", fontSize: "14px", fontWeight: 500 }}>
              Wallet
            </Link>
            {isOwner && (
              <Link href="/admin" style={{ color: "var(--ab-sky)", textDecoration: "none", fontSize: "14px", fontWeight: 700 }}>
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