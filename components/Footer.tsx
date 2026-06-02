export default function Footer() {
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
    <footer style={containerStyle}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "14px",
          color: "var(--ab-navy)",
          margin: "0 0 1.5rem",
        }}>
          Feedback & Support
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}>
          {/* Feedback Icon */}
          <a
            href="mailto:feedback@artemisbet.com"
            style={linkStyle}
            title="Send Feedback"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
              const iconEl = e.currentTarget.querySelector("div") as HTMLElement;
              if (iconEl) {
                iconEl.style.background = "rgba(30,111,217,0.1)";
                iconEl.style.color = "var(--ab-royal)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              const iconEl = e.currentTarget.querySelector("div") as HTMLElement;
              if (iconEl) {
                iconEl.style.background = "transparent";
                iconEl.style.color = "inherit";
              }
            }}
          >
            <div style={iconStyle as React.CSSProperties}>
              💬
            </div>
          </a>

          {/* Support Icon */}
          <a
            href="https://discord.gg/artemisbet"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            title="Join Discord Support"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
              const iconEl = e.currentTarget.querySelector("div") as HTMLElement;
              if (iconEl) {
                iconEl.style.background = "rgba(30,111,217,0.1)";
                iconEl.style.color = "var(--ab-royal)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              const iconEl = e.currentTarget.querySelector("div") as HTMLElement;
              if (iconEl) {
                iconEl.style.background = "transparent";
                iconEl.style.color = "inherit";
              }
            }}
          >
            <div style={iconStyle as React.CSSProperties}>
              🎮
            </div>
          </a>

          {/* Help/Docs Icon */}
          <a
            href="/docs"
            style={linkStyle}
            title="View Documentation"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
              const iconEl = e.currentTarget.querySelector("div") as HTMLElement;
              if (iconEl) {
                iconEl.style.background = "rgba(30,111,217,0.1)";
                iconEl.style.color = "var(--ab-royal)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              const iconEl = e.currentTarget.querySelector("div") as HTMLElement;
              if (iconEl) {
                iconEl.style.background = "transparent";
                iconEl.style.color = "inherit";
              }
            }}
          >
            <div style={iconStyle as React.CSSProperties}>
              📖
            </div>
          </a>

          {/* Report Issue Icon */}
          <a
            href="https://github.com/artemisbet/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={linkStyle}
            title="Report an Issue"
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.1)";
              const iconEl = e.currentTarget.querySelector("div") as HTMLElement;
              if (iconEl) {
                iconEl.style.background = "rgba(255,77,106,0.1)";
                iconEl.style.color = "var(--ab-loss)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              const iconEl = e.currentTarget.querySelector("div") as HTMLElement;
              if (iconEl) {
                iconEl.style.background = "transparent";
                iconEl.style.color = "inherit";
              }
            }}
          >
            <div style={iconStyle as React.CSSProperties}>
              🐛
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
  );
}
