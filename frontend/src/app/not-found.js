import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        className="animate-blob"
        style={{
          position: "absolute",
          top: "20%",
          left: "10%",
          width: 300,
          height: 300,
          background: "radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        className="animate-blob delay-400"
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          width: 250,
          height: 250,
          background: "radial-gradient(circle,rgba(244,63,94,0.15) 0%,transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{ textAlign: "center", padding: "0 24px", position: "relative", zIndex: 1 }}
      >
        <div
          className="animate-float"
          style={{ fontSize: 100, marginBottom: 8, lineHeight: 1 }}
        >
          🏚️
        </div>
        <h1
          className="animate-fade-up gradient-text"
          style={{
            fontSize: "clamp(5rem,15vw,10rem)",
            fontWeight: 900,
            margin: "0 0 8px",
            lineHeight: 1,
            background: "linear-gradient(135deg,#6366f1,#f43f5e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </h1>
        <p
          className="animate-fade-up delay-200"
          style={{ fontSize: 22, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 32 }}
        >
          Oops! Page Not Found
        </p>
        <Link
          href="/"
          className="btn-press animate-pulse-glow animate-fade-up delay-300"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "16px 36px",
            borderRadius: 14,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: 15,
            boxShadow: "0 8px 32px rgba(99,102,241,0.4)",
          }}
        >
          <i className="fas fa-house" />
          Go Back Home
        </Link>
      </div>
    </main>
  );
}
