"use client";
import Navbar from "@/components/Navbar";
import DepositWithdraw from "@/components/DepositWithdraw";
import { useAccount } from "wagmi";

export default function WalletPage() {
  const { isConnected } = useAccount();

  return (
    <main style={{ minHeight: "100vh", background: "var(--ab-white)" }}>
      <Navbar />
      <div style={{ maxWidth: "480px", margin: "0 auto", padding: "2rem" }}>
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 800,
          fontSize: "24px", color: "var(--ab-navy)", margin: "0 0 1.5rem"
        }}>
          My Wallet
        </p>
        {!isConnected ? (
          <div style={{
            textAlign: "center", padding: "4rem 2rem",
            background: "#fff", borderRadius: "16px",
            border: "0.5px solid rgba(30,111,217,0.15)"
          }}>
            <p style={{ color: "#888", fontSize: "16px" }}>
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