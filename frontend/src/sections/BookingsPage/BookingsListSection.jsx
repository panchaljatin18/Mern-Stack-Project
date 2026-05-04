"use client";

import { useEffect, useState } from "react";
import PageHero from "../../components/PageHero";
import Toast from "../../components/Toast";
import { api } from "../../lib/api";

export default function BookingsListSection() {
  const [bookings, setBookings] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const loadBookings = () => {
    api.getBookings()
      .then((data) => { setBookings(data); setLoading(false); })
      .catch(() => { setBookings([]); setLoading(false); });
  };

  useEffect(() => { loadBookings(); }, []);

  const confirmDelete = async () => {
    try {
      await api.deleteBooking(deleteTarget.id, deleteTarget.bookedAt);
      setDeleteTarget(null);
      setToast("🗑️ Booking Deleted!");
      setTimeout(() => { setToast(""); loadBookings(); }, 2000);
    } catch { /* silently fail */ }
  };

  return (
    <>
      <Toast message={toast} tone="danger" />
      <PageHero title="All Bookings" subtitle="Track all confirmed reservations" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shimmer" style={{ borderRadius: 20, height: 360 }} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="animate-scale-in" style={{ textAlign: "center", padding: "80px 24px" }}>
            <div style={{ fontSize: 72, marginBottom: 16 }}>📅</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#64748b" }}>No bookings yet.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {bookings.map((home, i) => (
              <article
                key={`${home.id}-${i}`}
                className={`card-lift animate-fade-up delay-${Math.min((i % 6 + 1) * 100, 600)}`}
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                }}
              >
                <div style={{ position: "relative" }}>
                  <img
                    src={home.photoUrl}
                    alt={home.houseName}
                    style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x200?text=No+Image"; }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top,rgba(0,0,0,0.45),transparent)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      right: 12,
                      background: "linear-gradient(135deg,#22c55e,#15803d)",
                      color: "#fff",
                      fontSize: 11,
                      fontWeight: 800,
                      padding: "5px 12px",
                      borderRadius: 999,
                      boxShadow: "0 4px 12px rgba(34,197,94,0.4)",
                    }}
                  >
                    ✓ Booked
                  </div>
                </div>
                <div style={{ padding: "20px 20px 22px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                    {home.houseName}
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fas fa-map-marker-alt" style={{ color: "#f43f5e", fontSize: 11 }} />
                    {home.location}
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", margin: "12px 0 0" }}>
                    ₹{home.price}
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginLeft: 4 }}>/night</span>
                  </p>

                  <div
                    style={{
                      margin: "14px 0 16px",
                      padding: "12px 14px",
                      borderRadius: 12,
                      background: "linear-gradient(135deg,#f8fafc,#f1f5f9)",
                      border: "1px solid rgba(0,0,0,0.05)",
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", margin: "0 0 4px" }}>
                      <i className="fas fa-user" style={{ marginRight: 6, color: "#6366f1" }} />
                      {home.userName}
                    </p>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                      <i className="fas fa-clock" style={{ marginRight: 6 }} />
                      {home.bookedAt}
                    </p>
                  </div>

                  <button
                    onClick={() => setDeleteTarget(home)}
                    className="btn-press"
                    style={{
                      width: "100%",
                      padding: "11px",
                      borderRadius: 12,
                      border: "none",
                      background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                      color: "#fff",
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: "none",
                      boxShadow: "0 4px 12px rgba(239,68,68,0.25)",
                    }}
                  >
                    <i className="fas fa-trash" style={{ marginRight: 6 }} />
                    Delete Booking
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {deleteTarget && (
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
              maxWidth: 420,
              borderRadius: 24,
              background: "#fff",
              padding: "36px 32px",
              boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 52, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
              Delete Booking?
            </h3>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 28 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={confirmDelete}
                className="btn-press"
                style={{
                  flex: 1,
                  padding: "13px",
                  borderRadius: 12,
                  border: "none",
                  background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: "none",
                  boxShadow: "0 6px 20px rgba(239,68,68,0.3)",
                }}
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
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
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
