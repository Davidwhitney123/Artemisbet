import { createConfig, http } from "wagmi";
import { getDefaultConfig } from "connectkit";

// Arc Testnet chain definition
export const arcTestnet = {
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "ArcScan",
      url: "https://testnet.arcscan.app",
    },
  },
  testnet: true,
} as const;

export const config = createConfig(
  getDefaultConfig({
    chains: [arcTestnet],
    transports: {
      [arcTestnet.id]: http("https://rpc.testnet.arc.network"),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    appName: "Artemis Bet",
    appDescription: "Sports Prediction Platform on Arc Testnet",
    appUrl: "https://artemisbet.vercel.app",
  })
);