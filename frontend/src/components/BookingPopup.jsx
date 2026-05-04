"use client";

import { useState } from "react";
import { api } from "../lib/api";

export default function BookingPopup({ home, onClose, onSuccess }) {
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const confirm = async () => {
    if (!userName.trim()) { setError("Please enter your username."); return; }
    setError("");
    setIsSubmitting(true);
    try {
      const data = await api.bookHome(home.id, userName.trim());
      if (data.success) { onClose(); onSuccess(); }
      else setError("Booking could not be completed. Please try again.");
    } catch {
      setError("Booking could not be completed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(15,23,42,0.75)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="animate-scale-in"
        style={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 24,
          overflow: "hidden",
          background: "#fff",
          boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Image header */}
        <div style={{ position: "relative", height: 180 }}>
          <img
            src={home.photoUrl}
            alt={home.houseName}
            loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={(e) => { e.currentTarget.src = "https://placehold.co/600x320?text=Booking"; }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)",
            }}
          />
          <button
            onClick={onClose}
            aria-label="Close booking popup"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              border: "none",
              cursor: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              color: "#0f172a",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <i className="fas fa-xmark" />
          </button>
          <div
            style={{
              position: "absolute",
              bottom: 14,
              left: 16,
              color: "#fff",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 900 }}>{home.houseName}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>
              <i className="fas fa-map-marker-alt" style={{ marginRight: 4 }} />
              {home.location}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px 28px 28px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg,rgba(34,197,94,0.1),rgba(21,128,61,0.1))",
              border: "1px solid rgba(34,197,94,0.2)",
              borderRadius: 999,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 700,
              color: "#15803d",
              marginBottom: 16,
            }}
          >
            <i className="fas fa-calendar-check" />
            Confirm Booking
          </div>

          <label
            htmlFor="booking-username"
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}
          >
            <i className="fas fa-user" style={{ marginRight: 6, color: "#6366f1" }} />
            Your Username
          </label>
          <input
            id="booking-username"
            type="text"
            value={userName}
            onChange={(e) => { setUserName(e.target.value); setError(""); }}
            placeholder="Enter your username"
            autoComplete="username"
            style={{
              width: "100%",
              border: "2px solid #e2e8f0",
              borderRadius: 12,
              padding: "13px 16px",
              fontSize: 14,
              outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#22c55e";
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(34,197,94,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.boxShadow = "none";
            }}
            onKeyDown={(e) => { if (e.key === "Enter") confirm(); }}
          />
          {error && (
            <p style={{ color: "#ef4444", fontSize: 13, fontWeight: 600, marginTop: 8 }}>
              <i className="fas fa-circle-exclamation" style={{ marginRight: 6 }} />
              {error}
            </p>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button
              onClick={confirm}
              disabled={isSubmitting}
              className="btn-press"
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 12,
                border: "none",
                background: "linear-gradient(135deg,#22c55e,#15803d)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 14,
                cursor: "none",
                boxShadow: "0 6px 20px rgba(34,197,94,0.35)",
                opacity: isSubmitting ? 0.7 : 1,
                transition: "transform 0.2s",
              }}
            >
              <i className="fas fa-calendar-check" style={{ marginRight: 8 }} />
              {isSubmitting ? "Booking..." : "Confirm"}
            </button>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                flex: 1,
                padding: "13px",
                borderRadius: 12,
                border: "2px solid #e2e8f0",
                background: "#fff",
                color: "#64748b",
                fontWeight: 700,
                fontSize: 14,
                cursor: "none",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
