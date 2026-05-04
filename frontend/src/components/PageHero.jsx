"use client";

export default function PageHero({ title, subtitle }) {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "72px 24px 60px",
        textAlign: "center",
        background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
      }}
    >
      {/* Orbs */}
      <div
        className="animate-blob"
        style={{
          position: "absolute",
          top: -80,
          left: "20%",
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
          bottom: -60,
          right: "15%",
          width: 250,
          height: 250,
          background: "radial-gradient(circle,rgba(244,63,94,0.15) 0%,transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.05) 1px,transparent 1px)",
          backgroundSize: "50px 50px",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1 }}>
        <h1
          className="animate-fade-up"
          style={{
            fontSize: "clamp(2rem,5vw,3.5rem)",
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 12px",
            letterSpacing: "-1px",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="animate-fade-up delay-200"
            style={{ color: "rgba(255,255,255,0.55)", fontSize: 16, margin: 0 }}
          >
            {subtitle}
          </p>
        )}

        {/* Decorative line */}
        <div
          className="animate-fade-up delay-300"
          style={{
            width: 60,
            height: 4,
            borderRadius: 999,
            background: "linear-gradient(135deg,#6366f1,#f43f5e)",
            margin: "20px auto 0",
          }}
        />
      </div>
    </section>
  );
}
