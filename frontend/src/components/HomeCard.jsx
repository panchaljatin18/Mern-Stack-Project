"use client";

export default function HomeCard({ home, children }) {
  return (
    <article
      className="card-lift"
      style={{
        width: 320,
        borderRadius: 20,
        overflow: "hidden",
        background: "#fff",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "#e2e8f0" }}>
        <img
          src={home.photoUrl}
          alt={home.houseName}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            display: "block",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x450?text=No+Image";
          }}
        />

        {/* Featured badge with shimmer */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 800,
            padding: "5px 12px",
            borderRadius: 999,
            boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
            letterSpacing: "0.5px",
          }}
        >
          ✦ Featured
        </div>

        {/* Rating badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            color: "#fbbf24",
            fontSize: 12,
            fontWeight: 800,
            padding: "5px 10px",
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          <i className="fas fa-star" style={{ fontSize: 10 }} />
          {home.rating}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3
          style={{
            fontSize: 17,
            fontWeight: 800,
            color: "#0f172a",
            margin: "0 0 6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {home.houseName}
        </h3>

        <p
          style={{
            fontSize: 13,
            color: "#64748b",
            margin: "0 0 14px",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <i className="fas fa-map-marker-alt" style={{ color: "#f43f5e", fontSize: 11 }} />
          <span
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {home.location}
          </span>
        </p>

        {/* Price row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
            borderRadius: 12,
            padding: "10px 14px",
            marginBottom: 16,
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <div>
            <span style={{ fontSize: 20, fontWeight: 900, color: "#0f172a" }}>
              ₹{home.price}
            </span>
            <span style={{ fontSize: 12, color: "#94a3b8", marginLeft: 4 }}>/night</span>
          </div>
          <div
            style={{
              background: "linear-gradient(135deg,#fef3c7,#fde68a)",
              borderRadius: 8,
              padding: "4px 10px",
              fontSize: 12,
              fontWeight: 700,
              color: "#92400e",
            }}
          >
            ⭐ {home.rating}
          </div>
        </div>

        <div style={{ marginTop: "auto" }}>{children}</div>
      </div>
    </article>
  );
}
