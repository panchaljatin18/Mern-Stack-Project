"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHero from "../../components/PageHero";
import Toast from "../../components/Toast";
import { api } from "../../lib/api";

export default function HostHomesListSection() {
  const [homes, setHomes] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(true);

  const loadHomes = () => {
    api.getHostHomes()
      .then((data) => { setHomes(data); setLoading(false); })
      .catch(() => { setHomes([]); setLoading(false); });
  };

  useEffect(() => { loadHomes(); }, []);

  const confirmDelete = async () => {
    try {
      await api.deleteHome(deleteTarget);
      setDeleteTarget(null);
      setToast("🗑️ Home Deleted!");
      setTimeout(() => { setToast(""); loadHomes(); }, 2000);
    } catch { /* silently fail */ }
  };

  return (
    <>
      <Toast message={toast} tone="danger" />
      <PageHero title="Host Dashboard" subtitle="Manage your listed properties" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 24 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shimmer" style={{ borderRadius: 20, height: 340 }} />
            ))}
          </div>
        ) : homes.length === 0 ? (
          <div
            className="animate-scale-in"
            style={{ textAlign: "center", padding: "80px 24px" }}
          >
            <div style={{ fontSize: 72, marginBottom: 20 }}>🏚️</div>
            <p style={{ fontSize: 20, fontWeight: 700, color: "#64748b", marginBottom: 24 }}>
              No homes listed yet.
            </p>
            <Link
              href="/host/add-home"
              className="btn-press animate-pulse-glow"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 32px",
                borderRadius: 14,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 800,
                fontSize: 15,
                boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
              }}
            >
              <i className="fas fa-plus" />
              Add Your First Home
            </Link>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
              gap: 24,
            }}
          >
            {homes.map((home, i) => (
              <article
                key={home.id}
                className={`card-lift animate-fade-up delay-${Math.min((i % 6 + 1) * 100, 600)}`}
                style={{
                  borderRadius: 20,
                  overflow: "hidden",
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
                }}
              >
                <div style={{ position: "relative", overflow: "hidden" }}>
                  <img
                    src={home.photoUrl}
                    alt={home.houseName}
                    style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.06)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    onError={(e) => { e.currentTarget.src = "https://placehold.co/400x200?text=No+Image"; }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top,rgba(0,0,0,0.4),transparent)",
                    }}
                  />
                </div>
                <div style={{ padding: "20px 20px 22px" }}>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>
                    {home.houseName}
                  </h3>
                  <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 4px", display: "flex", alignItems: "center", gap: 6 }}>
                    <i className="fas fa-map-marker-alt" style={{ color: "#f43f5e", fontSize: 11 }} />
                    {home.location}
                  </p>
                  <p style={{ fontSize: 20, fontWeight: 900, color: "#0f172a", margin: "12px 0 16px" }}>
                    ₹{home.price}
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8", marginLeft: 4 }}>/night</span>
                  </p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link
                      href={`/host/edit-home/${home.id}`}
                      className="btn-press"
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "10px 0",
                        borderRadius: 10,
                        background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: 700,
                        fontSize: 13,
                        boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                      }}
                    >
                      <i className="fas fa-pen" style={{ marginRight: 6 }} />
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteTarget(home.id)}
                      className="btn-press"
                      style={{
                        flex: 1,
                        padding: "10px 0",
                        borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(135deg,#ef4444,#b91c1c)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 13,
                        cursor: "none",
                        boxShadow: "0 4px 12px rgba(239,68,68,0.3)",
                      }}
                    >
                      <i className="fas fa-trash" style={{ marginRight: 6 }} />
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* Delete modal */}
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
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg,rgba(239,68,68,0.1),rgba(185,28,28,0.1))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 20px",
                fontSize: 28,
              }}
            >
              🗑️
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 900, color: "#0f172a", marginBottom: 8 }}>
              Delete Home?
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
                <i className="fas fa-trash" style={{ marginRight: 8 }} />
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
