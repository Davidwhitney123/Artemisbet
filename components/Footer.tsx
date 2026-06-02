"use client";
import { useState } from "react";

export default function Footer() {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([
    {
      role: "assistant",
      text: "👋 Hi! I'm the Artemis Bet Support AI. I can help answer questions about sports betting, how to place bets, bridge USDC to Arc, and more. What would you like to know?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMsg = inputValue;
    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call an API)
    setTimeout(() => {
      let response = "";
      const lowerMsg = userMsg.toLowerCase();

      if (lowerMsg.includes("how to") || lowerMsg.includes("place") || lowerMsg.includes("bet")) {
        response =
          "To place a bet:\n1. Connect your wallet using ConnectKit\n2. Deposit USDC via the Bridge page\n3. Select a match from the home page\n4. Choose your outcome (Home Win, Draw, or Away Win)\n5. Enter your bet amount\n6. Click 'Place Bet'\n\nPayouts are calculated based on total staked amounts in each outcome pool.";
      } else if (lowerMsg.includes("bridge") || lowerMsg.includes("usdc")) {
        response =
          "To bridge USDC to Arc Testnet:\n1. Go to the Bridge page (🌉 Bridge in navigation)\n2. Select your source chain (Ethereum Sepolia, Base Sepolia, or Avalanche Fuji)\n3. Connect your wallet\n4. Enter the amount you want to bridge\n5. Approve the transaction\n6. Wait for Circle CCTP to complete (~30 seconds)\n7. Your USDC will arrive on Arc as native gas currency!";
      } else if (lowerMsg.includes("wallet") || lowerMsg.includes("connect")) {
        response =
          "To connect your wallet:\n1. Look for the ConnectKit button in the top right\n2. Click it and select your preferred wallet (MetaMask, WalletConnect, etc.)\n3. Approve the connection in your wallet\n4. You're now connected and can start betting!\n\nMake sure you're on Arc Testnet (Chain ID 5042002).";
      } else if (lowerMsg.includes("admin") || lowerMsg.includes("create") || lowerMsg.includes("match")) {
        response =
          "Admin panel features:\n• Import Live Fixtures - One-click import from sports APIs\n• World Cup 2026 - Pre-curated FIFA World Cup matches\n• Manual Create - Add custom matches with specific details\n• Manage Matches - Close betting, resolve matches, cancel if needed\n\nOnly the contract owner can access the admin panel.";
      } else if (lowerMsg.includes("payout") || lowerMsg.includes("earn") || lowerMsg.includes("win")) {
        response =
          "Payout Mechanics:\n• All bets go into a shared pool per match outcome\n• When a match resolves, winners split the total pool\n• Formula: Your Stake × (Total Pool / Your Outcome Total)\n• For example: If $100 pool with $10 bet on winning side with $50 total on that side, you win $20\n\nNo house fee - all bets go to winners!";
      } else if (lowerMsg.includes("support") || lowerMsg.includes("help") || lowerMsg.includes("contact")) {
        response =
          "Need help? Here are your options:\n💬 Support AI: Ask me anything about Artemis Bet (that's me!)\n𝕏 Twitter: @Artbets12 - Follow for updates\n🔗 GitHub: github.com/Davidwhitney123/Artemisbet - View source code\n\nWhat else can I help with?";
      } else if (lowerMsg.includes("arc") || lowerMsg.includes("testnet")) {
        response =
          "About Arc Testnet:\n• Chain ID: 5042002\n• Native Gas: USDC (6 decimals)\n• RPC: https://rpc.testnet.arc.network\n• Benefits: Stable fees, fast finality (~1 second)\n• Perfect for USDC-first applications\n\nArtemis Bet runs exclusively on Arc for optimal USDC integration.";
      } else {
        response =
          "I can help with questions about:\n• Placing bets & payouts\n• Bridging USDC to Arc\n• Wallet connection\n• Admin features\n• How Artemis Bet works\n\nFeel free to ask me anything! 🎯";
      }

      setMessages(prev => [...prev, { role: "assistant", text: response }]);
      setIsLoading(false);
    }, 600);
  };

  const iconStyle = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "18px",
    transition: "all 0.3s ease",
    border: "1px solid rgba(30,111,217,0.2)",
  };

  const containerStyle = {
    background: "var(--ab-white)",
    borderTop: "0.5px solid rgba(30,111,217,0.15)",
    padding: "2rem",
    textAlign: "center" as const,
    marginTop: "3rem",
  };

  const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    transition: "all 0.3s ease",
  };

  return (
    <>
      <footer style={containerStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "14px",
          color: "var(--ab-navy)",
          margin: "0 0 1.5rem",
        }}>
          Support & Community
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}>
          {/* Support AI Chatbox Icon */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            style={{
              ...linkStyle,
              background: "none",
              border: "none",
              padding: 0,
            }}
            title="Open Support AI"
          >
            <div
              style={iconStyle as React.CSSProperties}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(30,111,217,0.1)";
                (e.currentTarget as HTMLElement).style.color = "var(--ab-royal)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "inherit";
              }}
            >
              💬
            </div>
          </button>

          {/* Twitter Icon */}
          <a
            href="https://x.com/Artbets12"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            title="Follow on Twitter"
          >
            <div
              style={iconStyle as React.CSSProperties}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(30,111,217,0.1)";
                (e.currentTarget as HTMLElement).style.color = "var(--ab-royal)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "inherit";
              }}
            >
              𝕏
            </div>
          </a>

          {/* GitHub Icon */}
          <a
            href="https://github.com/Davidwhitney123/Artemisbet"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            title="View on GitHub"
          >
            <div
              style={iconStyle as React.CSSProperties}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(30,111,217,0.1)";
                (e.currentTarget as HTMLElement).style.color = "var(--ab-royal)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
                (e.currentTarget as HTMLElement).style.color = "inherit";
              }}
            >
              🔗
            </div>
          </a>
        </div>

        <p style={{
          fontSize: "12px",
          color: "#aaa",
          margin: 0,
        }}>
          © 2026 Artemis Bet · Sports Prediction on Arc Testnet
        </p>
      </div>
    </footer>

    {/* Support AI Chatbox Modal */}
    {chatOpen && (
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "380px",
          maxHeight: "500px",
          background: "#fff",
          borderRadius: "16px",
          border: "1px solid rgba(30,111,217,0.2)",
          boxShadow: "0 10px 40px rgba(30,111,217,0.15)",
          display: "flex",
          flexDirection: "column",
          zIndex: 999,
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, var(--ab-navy) 0%, var(--ab-royal) 100%)",
            padding: "1rem",
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p
            style={{
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              margin: 0,
              fontSize: "14px",
            }}
          >
            💬 Support AI
          </p>
          <button
            onClick={() => setChatOpen(false)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#fff",
              borderRadius: "6px",
              width: "28px",
              height: "28px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            minHeight: "300px",
            maxHeight: "380px",
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: msg.role === "user" ? "var(--ab-royal)" : "rgba(30,111,217,0.08)",
                  color: msg.role === "user" ? "#fff" : "var(--ab-navy)",
                  fontSize: "13px",
                  lineHeight: "1.4",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap" as const,
                }}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "12px",
                  background: "rgba(30,111,217,0.08)",
                  color: "var(--ab-navy)",
                  fontSize: "13px",
                }}
              >
                ⏳ Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div
          style={{
            borderTop: "1px solid rgba(30,111,217,0.1)",
            padding: "12px",
            display: "flex",
            gap: "8px",
          }}
        >
          <input
            type="text"
            placeholder="Ask me anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            style={{
              flex: 1,
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(30,111,217,0.2)",
              fontSize: "13px",
              color: "var(--ab-navy)",
              fontFamily: "inherit",
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            style={{
              background: "var(--ab-electric)",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              padding: "8px 16px",
              cursor: inputValue.trim() && !isLoading ? "pointer" : "not-allowed",
              fontSize: "13px",
              fontWeight: 600,
              fontFamily: "var(--font-display)",
              opacity: inputValue.trim() && !isLoading ? 1 : 0.6,
            }}
          >
            Send
          </button>
        </div>
      </div>
    )}
  </>
  );
}
