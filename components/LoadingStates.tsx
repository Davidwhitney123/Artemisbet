"use client";

// Skeleton card for match loading
export function MatchCardSkeleton() {
  return (
    <div className="skeleton-card animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div className="skeleton" style={{ width: "120px", height: "14px" }} />
        <div className="skeleton" style={{ width: "60px", height: "22px", borderRadius: "20px" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px", alignItems: "center", margin: "8px 0" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div className="skeleton" style={{ width: "80px", height: "18px" }} />
          <div className="skeleton" style={{ width: "40px", height: "12px" }} />
        </div>
        <div className="skeleton" style={{ width: "48px", height: "32px", borderRadius: "8px" }} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
          <div className="skeleton" style={{ width: "80px", height: "18px" }} />
          <div className="skeleton" style={{ width: "40px", height: "12px" }} />
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderTop: "0.5px solid var(--ab-border)" }}>
        <div className="skeleton" style={{ width: "70px", height: "14px" }} />
        <div className="skeleton" style={{ width: "90px", height: "14px" }} />
        <div className="skeleton" style={{ width: "60px", height: "14px" }} />
      </div>
      <div className="skeleton" style={{ width: "100%", height: "42px", borderRadius: "10px" }} />
    </div>
  );
}

// Skeleton for bet rows
export function BetRowSkeleton() {
  return (
    <div className="animate-fade-in" style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "12px 14px", borderRadius: "10px",
      background: "var(--ab-ice)", gap: "12px",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
        <div className="skeleton" style={{ width: "160px", height: "14px" }} />
        <div className="skeleton" style={{ width: "120px", height: "12px" }} />
      </div>
      <div className="skeleton" style={{ width: "60px", height: "28px", borderRadius: "20px" }} />
    </div>
  );
}

// Skeleton for leaderboard rows
export function LeaderboardRowSkeleton() {
  return (
    <div className="animate-fade-in" style={{
      display: "grid", gridTemplateColumns: "48px 1fr 80px 80px 100px",
      gap: "12px", padding: "14px 16px",
      background: "var(--ab-royal)", borderRadius: "12px",
      border: "0.5px solid var(--ab-border)",
      alignItems: "center",
    }}>
      <div className="skeleton" style={{ width: "28px", height: "28px", borderRadius: "50%" }} />
      <div className="skeleton" style={{ width: "120px", height: "14px" }} />
      <div className="skeleton" style={{ width: "40px", height: "14px", margin: "0 auto" }} />
      <div className="skeleton" style={{ width: "30px", height: "14px", margin: "0 auto" }} />
      <div className="skeleton" style={{ width: "60px", height: "14px", marginLeft: "auto" }} />
    </div>
  );
}

// Full page loading spinner
export function PageLoader() {
  return (
    <div style={{
      minHeight: "60vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "16px",
    }}>
      <div className="spinner spinner-dark" style={{ width: "36px", height: "36px", borderWidth: "3px" }} />
      <p style={{ color: "var(--ab-text-secondary)", fontSize: "14px", fontFamily: "var(--font-display)" }}>Loading...</p>
    </div>
  );
}

// Toast notification
export function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" | "info" }) {
  const colors = {
    success: { bg: "rgba(34,197,94,0.95)", border: "rgba(34,197,94,0.4)" },
    error:   { bg: "rgba(239,68,68,0.95)", border: "rgba(239,68,68,0.4)" },
    info:    { bg: "rgba(6,182,212,0.95)", border: "rgba(6,182,212,0.4)" },
  };
  const icons = { success: "✓", error: "✕", info: "ℹ" };

  return (
    <div className="animate-slide-down" style={{
      position: "fixed", top: "80px", right: "20px", zIndex: 9999,
      background: colors[type].bg,
      border: `0.5px solid ${colors[type].border}`,
      borderRadius: "12px", padding: "12px 20px",
      display: "flex", alignItems: "center", gap: "10px",
      color: "var(--ab-text-primary)", fontSize: "14px", fontWeight: 600,
      boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
      maxWidth: "320px",
    }}>
      <span style={{ fontSize: "16px" }}>{icons[type]}</span>
      {message}
    </div>
  );
}
