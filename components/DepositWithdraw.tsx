"use client";
import { useState } from "react";
import { useWriteContract, useReadContract, useAccount } from "wagmi";
import { ARTEMIS_ABI, CONTRACT_ADDRESS, USDC_ABI, USDC_ADDRESS } from "@/lib/contract";
import { formatUSDC, parseUSDC } from "@/lib/utils";

export default function DepositWithdraw({ onSuccess }: { onSuccess?: () => void }) {
  const { address } = useAccount();
  const [tab, setTab] = useState<"deposit" | "withdraw">("deposit");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const { writeContractAsync: writeContract } = useWriteContract();
const writeContractAsync = writeContract as any;

  const { data: contractBalance, refetch } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ARTEMIS_ABI,
    functionName: "getBalance",
    args: address ? [address] : undefined,
  });

  const { data: walletBalance } = useReadContract({
    address: USDC_ADDRESS,
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) return setError("Enter a valid amount");
    try {
      setError("");
      setStatus("loading");
      const usdcAmount = parseUSDC(amount);

      // Step 1: Approve
      await writeContractAsync({
        address: USDC_ADDRESS,
        abi: USDC_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS, usdcAmount],
      });

      // Step 2: Deposit
      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "deposit",
        args: [usdcAmount],
      });

      setStatus("done");
      setAmount("");
      refetch();
      onSuccess?.();
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      setError(err?.message?.slice(0, 100) || "Transaction failed");
      setStatus("error");
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) return setError("Enter a valid amount");
    try {
      setError("");
      setStatus("loading");
      const usdcAmount = parseUSDC(amount);

      await writeContractAsync({
        address: CONTRACT_ADDRESS,
        abi: ARTEMIS_ABI,
        functionName: "withdraw",
        args: [usdcAmount],
      });

      setStatus("done");
      setAmount("");
      refetch();
      onSuccess?.();
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err: any) {
      setError(err?.message?.slice(0, 100) || "Transaction failed");
      setStatus("error");
    }
  };

  return (
    <div style={{
      background: "#fff",
      border: "0.5px solid rgba(30,111,217,0.15)",
      borderRadius: "16px",
      padding: "1.5rem",
    }}>
      <p style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700, fontSize: "16px",
        color: "var(--ab-navy)", margin: "0 0 1rem",
      }}>
        My Wallet
      </p>

      {/* Balances */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "1.25rem" }}>
        <div style={{ background: "var(--ab-ice)", borderRadius: "10px", padding: "12px" }}>
          <p style={{ fontSize: "11px", color: "var(--ab-royal)", margin: "0 0 4px", fontWeight: 500 }}>Platform Balance</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: 0 }}>
            ${contractBalance ? formatUSDC(contractBalance) : "0.00"}
          </p>
          <p style={{ fontSize: "10px", color: "#888", margin: "2px 0 0" }}>USDC</p>
        </div>
        <div style={{ background: "#F5F8FF", borderRadius: "10px", padding: "12px", border: "0.5px solid rgba(30,111,217,0.1)" }}>
          <p style={{ fontSize: "11px", color: "var(--ab-royal)", margin: "0 0 4px", fontWeight: 500 }}>Wallet Balance</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "18px", color: "var(--ab-navy)", margin: 0 }}>
            ${walletBalance ? formatUSDC(walletBalance as bigint) : "0.00"}
          </p>
          <p style={{ fontSize: "10px", color: "#888", margin: "2px 0 0" }}>USDC</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1rem", background: "var(--ab-ice)", borderRadius: "10px", padding: "4px" }}>
        {(["deposit", "withdraw"] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); setAmount(""); setError(""); setStatus("idle"); }}
            style={{
              flex: 1, padding: "8px", borderRadius: "8px",
              border: "none",
              background: tab === t ? "var(--ab-royal)" : "transparent",
              color: tab === t ? "#fff" : "var(--ab-royal)",
              fontWeight: 600, fontSize: "13px",
              fontFamily: "var(--font-display)",
              cursor: "pointer",
              textTransform: "capitalize",
              transition: "all 0.15s",
            }}
          >
            {t === "deposit" ? "↓ Deposit" : "↑ Withdraw"}
          </button>
        ))}
      </div>

      {/* Amount */}
      <div style={{ position: "relative", marginBottom: "10px" }}>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 60px 12px 16px",
            borderRadius: "10px",
            border: "1px solid rgba(30,111,217,0.25)",
            fontSize: "16px",
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            color: "var(--ab-navy)",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <span style={{
          position: "absolute", right: "14px", top: "50%",
          transform: "translateY(-50%)",
          fontSize: "12px", fontWeight: 600, color: "var(--ab-royal)",
        }}>USDC</span>
      </div>

      {/* Quick amounts */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "1rem" }}>
        {["1", "5", "10", "20"].map(v => (
          <button
            key={v}
            onClick={() => setAmount(v)}
            style={{
              flex: 1, padding: "6px", borderRadius: "8px",
              border: "0.5px solid rgba(30,111,217,0.2)",
              background: amount === v ? "var(--ab-ice)" : "#fff",
              color: "var(--ab-royal)", fontSize: "12px", fontWeight: 500,
              cursor: "pointer",
            }}
          >
            ${v}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: "rgba(255,77,106,0.08)",
          border: "0.5px solid rgba(255,77,106,0.3)",
          borderRadius: "8px", padding: "10px 14px", marginBottom: "10px",
        }}>
          <p style={{ color: "var(--ab-loss)", fontSize: "13px", margin: 0 }}>{error}</p>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={tab === "deposit" ? handleDeposit : handleWithdraw}
        disabled={status === "loading"}
        style={{
          width: "100%",
          background: status === "done"
            ? "var(--ab-win)"
            : tab === "deposit" ? "var(--ab-electric)" : "var(--ab-navy)",
          color: "#fff", border: "none",
          borderRadius: "10px", padding: "13px",
          fontSize: "14px", fontWeight: 700,
          fontFamily: "var(--font-display)",
          cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {status === "loading" && "Processing..."}
        {status === "done" && "✓ Success!"}
        {status === "idle" && (tab === "deposit" ? "↓ Deposit USDC" : "↑ Withdraw USDC")}
        {status === "error" && "Try Again"}
      </button>
    </div>
  );
}