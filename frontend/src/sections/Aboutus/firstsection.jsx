export default function FirstSection() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "100px 24px 80px",
        textAlign: "center",
        background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
      }}
    >
      <div
        className="animate-blob"
        style={{
          position: "absolute",
          top: -100,
          left: "30%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 700, margin: "0 auto" }}>
        <div
          className="animate-fade-down glass"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 999,
            marginBottom: 28,
            fontSize: 13,
            fontWeight: 700,
            color: "rgba(255,255,255,0.8)",
          }}
        >
          <i className="fas fa-circle-info" style={{ color: "#6366f1" }} />
          Our Story
        </div>
        <h1
          className="animate-fade-up"
          style={{
            fontSize: "clamp(2.5rem,6vw,4.5rem)",
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 20px",
            letterSpacing: "-2px",
          }}
        >
          About{" "}
          <span
            className="gradient-text"
            style={{
              background: "linear-gradient(135deg,#6366f1,#f43f5e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Us
          </span>
        </h1>
        <p
          className="animate-fade-up delay-200"
          style={{ color: "rgba(255,255,255,0.6)", fontSize: 18, lineHeight: 1.7, margin: 0 }}
        >
          Discover stays, manage listings, and book homes with a simple Airbnb-style experience.
        </p>
      </div>
    </section>
  );
}
