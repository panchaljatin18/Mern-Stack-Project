"use client";

export default function Footer() {
  return (
    <footer
      style={{
        background: "linear-gradient(135deg,#0f172a 0%,#1e1b4b 50%,#0f172a 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated blobs */}
      <div
        className="animate-blob"
        style={{
          position: "absolute",
          top: -60,
          left: -60,
          width: 200,
          height: 200,
          background: "rgba(99,102,241,0.12)",
          borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%",
          pointerEvents: "none",
        }}
      />
      <div
        className="animate-blob delay-300"
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          width: 160,
          height: 160,
          background: "rgba(244,63,94,0.1)",
          borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "60px 24px 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Top row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 40,
            justifyContent: "space-between",
            marginBottom: 48,
          }}
        >
          {/* Brand */}
          <div className="animate-fade-up">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#f43f5e,#fb923c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                🏠
              </div>
              <span
                className="gradient-text"
                style={{ fontSize: 24, fontWeight: 900 }}
              >
                airbnb
              </span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, maxWidth: 260, lineHeight: 1.7 }}>
              Discover beautiful homes, save your favourites, and book your next perfect stay.
            </p>
            {/* Social icons */}
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              {["fa-twitter", "fa-instagram", "fa-facebook", "fa-github"].map((icon) => (
                <div
                  key={icon}
                  className="btn-press"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 14,
                    cursor: "none",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "linear-gradient(135deg,#6366f1,#8b5cf6)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.borderColor = "transparent";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <i className={`fab ${icon}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {[
            {
              title: "Explore",
              items: ["Browse Homes", "Favourites", "Bookings", "About Us"],
            },
            {
              title: "Host",
              items: ["List Your Home", "Manage Listings", "Edit Property", "Dashboard"],
            },
          ].map((col, i) => (
            <div key={col.title} className={`animate-fade-up delay-${(i + 1) * 200}`}>
              <h4
                style={{
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                  marginBottom: 16,
                  letterSpacing: "0.5px",
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {col.items.map((item) => (
                  <li key={item} style={{ marginBottom: 10 }}>
                    <span
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 14,
                        cursor: "none",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#f43f5e")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Stats */}
          <div className="animate-fade-up delay-400">
            <h4 style={{ color: "#fff", fontWeight: 800, fontSize: 15, marginBottom: 16 }}>
              Platform Stats
            </h4>
            {[
              { label: "Homes Listed", value: "2,400+" },
              { label: "Happy Guests", value: "18K+" },
              { label: "Cities", value: "120+" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  marginBottom: 14,
                  padding: "10px 16px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="gradient-text"
                  style={{ fontSize: 20, fontWeight: 900 }}
                >
                  {stat.value}
                </div>
                <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 12 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.4),transparent)",
            marginBottom: 24,
          }}
        />

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 13, margin: 0 }}>
            © {new Date().getFullYear()} airbnb clone · Built with Next.js & MERN
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <span
                key={item}
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontSize: 13,
                  cursor: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#6366f1")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
