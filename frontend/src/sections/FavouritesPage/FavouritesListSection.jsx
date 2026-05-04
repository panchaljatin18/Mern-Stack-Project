"use client";

import { useEffect, useState } from "react";
import BookingPopup from "../../components/BookingPopup";
import HomeCard from "../../components/HomeCard";
import Toast from "../../components/Toast";
import PageHero from "../../components/PageHero";
import { api } from "../../lib/api";

export default function FavouritesListSection() {
  const [homes, setHomes] = useState([]);
  const [bookingHome, setBookingHome] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(true);

  const loadFavourites = () => {
    api.getFavourites()
      .then((data) => { setHomes(data); setLoading(false); })
      .catch(() => { setHomes([]); setLoading(false); });
  };

  useEffect(() => { loadFavourites(); }, []);

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const confirmRemove = async () => {
    if (!removeTarget) return;
    setIsRemoving(true);
    try {
      await api.removeFavourite(removeTarget.id);
      setRemoveTarget(null);
      showSuccess("🗑️ Removed from Favourites!");
      loadFavourites();
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <>
      <Toast message={successMsg} />
      <PageHero title="Your Favourites" subtitle="Shortlisted stays ready to book" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        {/* Stats bar */}
        <div
          className="animate-fade-up"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 40,
            padding: "20px 28px",
            borderRadius: 20,
            background: "linear-gradient(135deg,#0f172a,#1e1b4b)",
            boxShadow: "0 8px 32px rgba(15,23,42,0.2)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                background: "linear-gradient(135deg,#f43f5e,#e11d48)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 4px 16px rgba(244,63,94,0.4)",
              }}
            >
              ❤️
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#fff" }}>
                {homes.length}
                <span style={{ fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginLeft: 6 }}>
                  saved homes
                </span>
              </div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                Your personal wishlist
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shimmer" style={{ borderRadius: 20, height: 380 }} />
            ))}
          </div>
        ) : homes.length === 0 ? (
          <div
            className="animate-scale-in"
            style={{
              maxWidth: 480,
              margin: "0 auto",
              textAlign: "center",
              padding: "60px 32px",
              borderRadius: 24,
              background: "#fff",
              border: "2px dashed rgba(244,63,94,0.2)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
            }}
          >
            <div
              className="animate-float"
              style={{ fontSize: 72, marginBottom: 20, lineHeight: 1 }}
            >
              🤍
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: "#0f172a", marginBottom: 10 }}>
              No favourites yet
            </h2>
            <p style={{ color: "#64748b", fontSize: 15, lineHeight: 1.7, margin: 0 }}>
              Browse homes on the homepage and save the ones you love.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {homes.map((home, i) => (
              <div key={home.id} className={`animate-fade-up delay-${Math.min((i % 6 + 1) * 100, 600)}`}>
                <HomeCard home={home}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setRemoveTarget(home)}
                      className="btn-press"
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,
                        border: "2px solid rgba(244,63,94,0.2)",
                        background: "rgba(244,63,94,0.06)",
                        color: "#e11d48",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "none",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(244,63,94,0.12)";
                        e.currentTarget.style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(244,63,94,0.06)";
                        e.currentTarget.style.transform = "translateY(0)";
                      }}
                    >
                      <i className="fas fa-trash-can" style={{ marginRight: 6 }} />
                      Remove
                    </button>
                    <button
                      onClick={() => setBookingHome(home)}
                      className="btn-press"
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(135deg,#22c55e,#15803d)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "none",
                        boxShadow: "0 4px 12px rgba(34,197,94,0.3)",
                        transition: "transform 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                    >
                      <i className="fas fa-calendar-check" style={{ marginRight: 6 }} />
                      Book
                    </button>
                  </div>
                </HomeCard>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Remove confirm modal */}
      {removeTarget && (
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
            <div style={{ position: "relative", height: 160 }}>
              <img
                src={removeTarget.photoUrl}
                alt={removeTarget.houseName}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                onError={(e) => { e.currentTarget.src = "https://placehold.co/600x320?text=Saved+Home"; }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.5),transparent)" }} />
              <button
                onClick={() => setRemoveTarget(null)}
                style={{
                  position: "absolute", top: 12, right: 12,
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.9)", border: "none",
                  cursor: "none", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 14, color: "#0f172a",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <i className="fas fa-xmark" />
              </button>
            </div>
            <div style={{ padding: "24px 28px 28px" }}>
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  background: "rgba(244,63,94,0.08)", border: "1px solid rgba(244,63,94,0.2)",
                  borderRadius: 999, padding: "6px 14px", fontSize: 12,
                  fontWeight: 700, color: "#e11d48", marginBottom: 12,
                }}
              >
                <i className="fas fa-trash-can" />
                Remove favourite
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", marginBottom: 6 }}>
                Remove this stay?
              </h3>
              <p style={{ color: "#f43f5e", fontWeight: 700, fontSize: 14, marginBottom: 6 }}>
                {removeTarget.houseName}
              </p>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
                This home will leave your favourites list.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={confirmRemove}
                  disabled={isRemoving}
                  className="btn-press"
                  style={{
                    flex: 1, padding: "13px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                    color: "#fff", fontWeight: 800, fontSize: 14, cursor: "none",
                    boxShadow: "0 6px 20px rgba(239,68,68,0.3)",
                    opacity: isRemoving ? 0.7 : 1,
                  }}
                >
                  <i className="fas fa-trash-can" style={{ marginRight: 8 }} />
                  {isRemoving ? "Removing..." : "Remove"}
                </button>
                <button
                  onClick={() => setRemoveTarget(null)}
                  disabled={isRemoving}
                  style={{
                    flex: 1, padding: "13px", borderRadius: 12,
                    border: "2px solid #e2e8f0", background: "#fff",
                    color: "#64748b", fontWeight: 700, fontSize: 14, cursor: "none",
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {bookingHome && (
        <BookingPopup
          home={bookingHome}
          onClose={() => setBookingHome(null)}
          onSuccess={() => showSuccess("🎉 Booking Confirmed!")}
        />
      )}
    </>
  );
}
