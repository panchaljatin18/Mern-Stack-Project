"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "../../lib/api";

export default function ForgotPasswordPageSection() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setError("Please enter your email."); return; }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const data = await api.forgotPassword(email);
      if (data.success) {
        setSuccess(data.message || "Reset link sent to your email!");
      }
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
      padding: "24px", position: "relative", overflow: "hidden",
    }}>
      <div className="animate-blob" style={{ position: "absolute", top: "20%", left: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #f59e0b, #d97706)",
            fontSize: 28, marginBottom: 16,
            boxShadow: "0 8px 24px rgba(245,158,11,0.3)",
          }}>
            <i className="fas fa-key" style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>
            Forgot Password?
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>

        <div style={{
          background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28,
          padding: "40px 36px", boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="forgot-email" style={{
                display: "block", fontSize: 12, fontWeight: 700,
                color: "rgba(255,255,255,0.6)", marginBottom: 8,
                textTransform: "uppercase", letterSpacing: "0.8px",
              }}>
                <i className="fas fa-envelope" style={{ marginRight: 6, color: "#f59e0b" }} />Email Address
              </label>
              <input id="forgot-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@example.com" autoComplete="email"
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 14,
                  border: "2px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)", color: "#fff",
                  fontSize: 14, outline: "none", boxSizing: "border-box",
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(245,158,11,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-circle-exclamation" />{error}
              </div>
            )}

            {success && (
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "#22c55e", fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-circle-check" />{success}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-press" style={{
              width: "100%", padding: "15px", borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "#fff", fontWeight: 800, fontSize: 15,
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 8px 24px rgba(245,158,11,0.35)",
              opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? (<><i className="fas fa-spinner fa-spin" />Sending...</>) : (<><i className="fas fa-paper-plane" />Send Reset Link</>)}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              <i className="fas fa-arrow-left" style={{ marginRight: 6 }} />Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
