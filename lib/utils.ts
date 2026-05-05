// Format USDC amount (6 decimals)
export function formatUSDC(amount: bigint): string {
  return (Number(amount) / 1_000_000).toFixed(2);
}

// Parse USDC amount to bigint
export function parseUSDC(amount: string): bigint {
  return BigInt(Math.floor(parseFloat(amount) * 1_000_000));
}

// Format timestamp to readable date
export function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) * 1000).toLocaleString();
}

// Get sport label
export function getSportLabel(sport: number): string {
  return sport === 0 ? "⚽ Football" : "🏀 Basketball";
}

// Get outcome label
export function getOutcomeLabel(outcome: number): string {
  const labels = ["Home Win", "Draw", "Away Win"];
  return labels[outcome] ?? "Unknown";
}

// Get match status label
export function getStatusLabel(status: number): string {
  const labels = ["Open", "Closed", "Resolved", "Cancelled"];
  return labels[status] ?? "Unknown";
}

// Get status color
export function getStatusColor(status: number): string {
  const colors = [
    "text-green-500",   // Open
    "text-yellow-500",  // Closed
    "text-blue-500",    // Resolved
    "text-red-500",     // Cancelled
  ];
  return colors[status] ?? "text-gray-500";
}