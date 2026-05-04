"use client";

const features = [
  { icon: "fa-house", title: "List Properties", desc: "Hosts can easily add and manage their properties with our intuitive dashboard.", color: "#6366f1" },
  { icon: "fa-magnifying-glass", title: "Browse Homes", desc: "Guests can explore hundreds of handpicked homes across 120+ cities.", color: "#f43f5e" },
  { icon: "fa-calendar-check", title: "Easy Booking", desc: "Book your perfect stay in seconds with our streamlined booking system.", color: "#22c55e" },
  { icon: "fa-heart", title: "Save Favourites", desc: "Keep your shortlisted stays in one place and book whenever you're ready.", color: "#fb923c" },
];

export default function AboutSecond() {
  return (
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
      {/* What we do */}
      <div
        className="animate-fade-up"
        style={{
          borderRadius: 24,
          overflow: "hidden",
          marginBottom: 60,
          background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
          padding: "48px 40px",
          position: "relative",
        }}
      >
        <div
          className="animate-blob"
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 250,
            height: 250,
            background: "radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem,3vw,2.5rem)",
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 16px",
              letterSpacing: "-0.5px",
            }}
          >
            What We Do
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.8, maxWidth: 600, margin: 0 }}>
            Hosts can add properties, guests can browse homes, and bookings stay organized in one place.
            We make the entire process seamless from listing to checkout.
          </p>
        </div>
      </div>

      {/* Feature cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
          gap: 20,
        }}
      >
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`card-lift animate-fade-up delay-${(i + 1) * 100}`}
            style={{
              borderRadius: 20,
              padding: "28px 24px",
              background: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: `${f.color}18`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                fontSize: 22,
                color: f.color,
              }}
            >
              <i className={`fas ${f.icon}`} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>
              {f.title}
            </h3>
            <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, margin: 0 }}>
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
