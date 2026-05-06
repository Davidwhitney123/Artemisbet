export const CONTRACT_ADDRESS = "0xa0c9f29BF93Cabf58d45b19Ca2b19e11e613d303" as `0x${string}`;
export const USDC_ADDRESS = "0x3600000000000000000000000000000000000000" as `0x${string}`;

export const ARTEMIS_ABI = [
  {
    name: "matchCount",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "placeBet",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "outcome", type: "uint8" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "getBalance",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "deposit",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },
  {
    name: "getUserBets",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "uint256[]" }],
  },
  {
    name: "bets",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "betId", type: "uint256" }],
    outputs: [
      { name: "bettor", type: "address" },
      { name: "matchId", type: "uint256" },
      { name: "prediction", type: "uint8" },
      { name: "amountUSDC", type: "uint256" },
      { name: "claimed", type: "bool" },
    ],
  },
  {
    name: "getMatch",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "matchId", type: "uint256" }],
    outputs: [
      { name: "id", type: "uint256" },
      { name: "sport", type: "uint8" },
      { name: "homeTeam", type: "string" },
      { name: "awayTeam", type: "string" },
      { name: "league", type: "string" },
      { name: "startTime", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "result", type: "uint8" },
      { name: "totalStakedUSDC", type: "uint256" },
    ],
  },
  {
    name: "claimWinnings",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "betId", type: "uint256" }],
    outputs: [],
  },

  // ── Admin functions ───────────────────────────────────────
  {
    name: "createMatch",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "sport", type: "uint8" },
      { name: "homeTeam", type: "string" },
      { name: "awayTeam", type: "string" },
      { name: "league", type: "string" },
      { name: "startTimestamp", type: "uint256" },
    ],
    outputs: [],
  },
  {
    name: "closeMatch",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "matchId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "resolveMatch",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "matchId", type: "uint256" },
      { name: "result", type: "uint8" },
    ],
    outputs: [],
  },
  {
    name: "cancelMatch",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "matchId", type: "uint256" }],
    outputs: [],
  },
  {
    name: "withdrawFees",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [{ name: "amount", type: "uint256" }],
    outputs: [],
  },

  // ── Owner ───────────────────────────────────────────────
  {
    name: "owner",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
  },
] as const;

export const USDC_ABI = [
  {
    name: "approve",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
  },
  {
    name: "allowance",
    type: "function",
    stateMutability: "view",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;