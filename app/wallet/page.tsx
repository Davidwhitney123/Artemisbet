"use client";
import Navbar from "@/components/Navbar";
import DepositWithdraw from "@/components/DepositWithdraw";
import { useAccount } from "wagmi";

export default function WalletPage() {
  const { isConnected } = useAccount();

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-navy)" }}>
      <Navbar />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "24px", color: "var(--ab-text-primary)", margin: "0 0 1.5rem"
        }}>
          My Wallet
        </p>
        {!isConnected ? (
          <div style={{
            textAlign: "center", padding: "4rem 2rem",
            background: "var(--ab-royal)", borderRadius: "16px",
            border: "0.5px solid var(--ab-border)"
          }}>
            <p style={{ color: "var(--ab-text-secondary)", fontSize: "16px" }}>
              Connect your wallet to manage funds.
            </p>
          </div>
        ) : (
          <DepositWithdraw />
        )}
      </div>
    </main>
  );
}
