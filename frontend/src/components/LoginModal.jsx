"use client";

import Link from "next/link";

export default function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      background: "rgba(15, 23, 42, 0.8)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20
    }}>
      <div className="animate-scale-in" style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%)",
        padding: 40,
        borderRadius: 28,
        maxWidth: 420,
        width: "100%",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: "linear-gradient(135deg, #f43f5e, #fb923c)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, color: "#fff", margin: "0 auto 24px",
          boxShadow: "0 10px 20px rgba(244,63,94,0.3)"
        }}>
          <i className="fas fa-lock" />
        </div>

        <h2 style={{ fontSize: 26, fontWeight: 900, color: "#fff", marginBottom: 12 }}>
          Login Required
        </h2>
        
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, lineHeight: 1.6, marginBottom: 32 }}>
          Please log in or create an account to view details, book homes, or save your favorites.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Link 
            href="/login" 
            style={{ 
              padding: "14px", borderRadius: 14, 
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)", 
              color: "#fff", textDecoration: "none", fontWeight: 800, fontSize: 15,
              boxShadow: "0 10px 20px rgba(99,102,241,0.3)"
            }}
          >
            Login Now
          </Link>
          <Link 
            href="/register" 
            style={{ 
              padding: "14px", borderRadius: 14, 
              background: "rgba(255,255,255,0.05)", 
              color: "#fff", textDecoration: "none", fontWeight: 700, fontSize: 15,
              border: "1px solid rgba(255,255,255,0.1)"
            }}
          >
            Create Account
          </Link>
          <button 
            onClick={onClose}
            style={{ 
              marginTop: 12, background: "none", border: "none", 
              color: "rgba(255,255,255,0.4)", cursor: "pointer", 
              fontWeight: 600, fontSize: 13 
            }}
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
