"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function AdminLoginPageSection() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      const data = await api.adminLogin({ email: form.email, password: form.password });
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("admin", JSON.stringify(data.admin));
        router.push("/admin");
      }
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "2px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "block",
    fontSize: 12,
    fontWeight: 700,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1a0a2e 50%, #0f172a 100%)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Red/orange orbs for admin feel */}
      <div className="animate-blob" style={{ position: "absolute", top: "-5%", left: "20%", width: 350, height: 350, background: "radial-gradient(circle, rgba(239,68,68,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div className="animate-blob delay-400" style={{ position: "absolute", bottom: "10%", right: "15%", width: 300, height: 300, background: "radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
        {/* Admin badge */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 26, boxShadow: "0 8px 24px rgba(239,68,68,0.35)",
            }}>
              <i className="fas fa-shield-halved" style={{ color: "#fff" }} />
            </div>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>
            Admin Panel
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, margin: 0 }}>
            Secure administrative access
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(239,68,68,0.15)",
          borderRadius: 28,
          padding: "40px 36px",
          boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
        }}>
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label htmlFor="admin-email" style={labelStyle}>
                <i className="fas fa-envelope" style={{ marginRight: 6, color: "#ef4444" }} />Email
              </label>
              <input id="admin-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="admin@airbnb.com" autoComplete="email" style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(239,68,68,0.15)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="admin-password" style={labelStyle}>
                <i className="fas fa-lock" style={{ marginRight: 6, color: "#ef4444" }} />Password
              </label>
              <div style={{ position: "relative" }}>
                <input id="admin-password" type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="••••••••" autoComplete="current-password" style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "#ef4444"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(239,68,68,0.15)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, padding: 4 }}>
                  <i className={`fas fa-eye${showPassword ? "-slash" : ""}`} />
                </button>
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-circle-exclamation" />{error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-press" style={{
              width: "100%", padding: "15px", borderRadius: 14, border: "none",
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
              color: "#fff", fontWeight: 800, fontSize: 15,
              cursor: loading ? "wait" : "pointer",
              boxShadow: "0 8px 24px rgba(239,68,68,0.35)",
              opacity: loading ? 0.7 : 1,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              {loading ? (
                <><i className="fas fa-spinner fa-spin" />Signing in...</>
              ) : (
                <><i className="fas fa-shield-halved" />Admin Sign In</>
              )}
            </button>
          </form>

          {/* Back to user login */}
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/login" style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, textDecoration: "none", fontWeight: 600 }}>
              <i className="fas fa-arrow-left" style={{ marginRight: 6 }} />Back to User Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
