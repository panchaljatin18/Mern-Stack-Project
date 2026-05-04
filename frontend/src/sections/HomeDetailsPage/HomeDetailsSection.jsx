"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import BookingPopup from "../../components/BookingPopup";
import Toast from "../../components/Toast";
import { api } from "../../lib/api";

export default function HomeDetailsSection({ homeId }) {
  const [home, setHome] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingHome, setBookingHome] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    api.getHome(homeId)
      .then(setHome)
      .catch(() => setHome(null))
      .finally(() => setLoading(false));
  }, [homeId]);

  const addToFavourite = async () => {
    try {
      const data = await api.addFavourite(homeId);
      if (data.success) {
        setToast("❤️ Added to Favourites!");
        setTimeout(() => setToast(""), 3000);
      }
    } catch { /* silently fail */ }
  };

  if (loading) {
    return (
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div className="shimmer" style={{ borderRadius: 20, height: 420 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[80, 40, 60, 100, 120].map((w, i) => (
              <div key={i} className="shimmer" style={{ borderRadius: 10, height: 24, width: `${w}%` }} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!home) {
    return (
      <main
        className="animate-scale-in"
        style={{ maxWidth: 500, margin: "80px auto", textAlign: "center", padding: "0 24px" }}
      >
        <div style={{ fontSize: 80, marginBottom: 16 }}>🏚️</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#0f172a", marginBottom: 12 }}>
          Home not found
        </h1>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 28px",
            borderRadius: 12,
            background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          <i className="fas fa-arrow-left" />
          Back to Homes
        </Link>
      </main>
    );
  }

  return (
    <>
      <Toast message={toast} />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 32,
            alignItems: "start",
          }}
        >
          {/* Image */}
          <div
            className="animate-slide-left"
            style={{
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(0,0,0,0.15)",
              position: "relative",
            }}
          >
            <img
              src={home.photoUrl}
              alt={home.houseName}
              style={{ width: "100%", minHeight: 380, objectFit: "cover", display: "block" }}
              onError={(e) => { e.currentTarget.src = "https://placehold.co/800x500?text=No+Image"; }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top,rgba(0,0,0,0.3) 0%,transparent 50%)",
              }}
            />
          </div>

          {/* Details card */}
          <div
            className="animate-slide-right"
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "36px 32px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "linear-gradient(135deg,rgba(99,102,241,0.1),rgba(139,92,246,0.1))",
                border: "1px solid rgba(99,102,241,0.2)",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 11,
                fontWeight: 800,
                color: "#6366f1",
                marginBottom: 16,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
              }}
            >
              <i className="fas fa-house" />
              Home Details
            </div>

            <h1
              style={{
                fontSize: "clamp(1.8rem,3vw,2.5rem)",
                fontWeight: 900,
                color: "#0f172a",
                margin: "0 0 10px",
                letterSpacing: "-0.5px",
              }}
            >
              {home.houseName}
            </h1>

            <p style={{ color: "#64748b", fontSize: 16, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
              <i className="fas fa-map-marker-alt" style={{ color: "#f43f5e" }} />
              {home.location}
            </p>

            {/* Price & rating chips */}
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
              <div
                style={{
                  background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
                  color: "#fff",
                  borderRadius: 14,
                  padding: "12px 20px",
                  fontWeight: 900,
                  fontSize: 20,
                }}
              >
                ₹{home.price}
                <span style={{ fontSize: 13, fontWeight: 500, opacity: 0.7, marginLeft: 4 }}>/night</span>
              </div>
              <div
                style={{
                  background: "linear-gradient(135deg,#fef3c7,#fde68a)",
                  color: "#92400e",
                  borderRadius: 14,
                  padding: "12px 20px",
                  fontWeight: 900,
                  fontSize: 18,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <i className="fas fa-star" style={{ color: "#f59e0b" }} />
                {home.rating}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: "linear-gradient(90deg,transparent,rgba(99,102,241,0.2),transparent)",
                marginBottom: 28,
              }}
            />

            {/* Action buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button
                onClick={addToFavourite}
                className="btn-press"
                style={{
                  padding: "14px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "none",
                  boxShadow: "0 6px 20px rgba(244,63,94,0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 28px rgba(244,63,94,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(244,63,94,0.3)";
                }}
              >
                <i className="fas fa-heart" style={{ marginRight: 8 }} />
                Add to Favourites
              </button>
              <button
                onClick={() => setBookingHome(home)}
                className="btn-press animate-pulse-glow"
                style={{
                  padding: "14px",
                  borderRadius: 14,
                  border: "none",
                  background: "linear-gradient(135deg,#22c55e,#15803d)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 15,
                  cursor: "none",
                  boxShadow: "0 6px 20px rgba(34,197,94,0.3)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 28px rgba(34,197,94,0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(34,197,94,0.3)";
                }}
              >
                <i className="fas fa-calendar-check" style={{ marginRight: 8 }} />
                Book Now
              </button>
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "12px",
                  borderRadius: 14,
                  border: "2px solid #e2e8f0",
                  color: "#64748b",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <i className="fas fa-arrow-left" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      {bookingHome && (
        <BookingPopup
          home={bookingHome}
          onClose={() => setBookingHome(null)}
          onSuccess={() => {
            setToast("🎉 Booking Confirmed!");
            setTimeout(() => setToast(""), 3000);
          }}
        />
      )}
    </>
  );
}
