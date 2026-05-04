"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function ResetPasswordPageSection({ params }) {
  const router = useRouter();
  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.password || !form.confirmPassword) { setError("Please fill all fields."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    setError("");
    try {
      const data = await api.resetPassword(params.token, form);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setSuccess("Password reset successful! Redirecting...");
        setTimeout(() => router.push("/"), 2000);
      }
    } catch (err) {
      setError(err.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)",
      padding: "24px", position: "relative", overflow: "hidden",
    }}>
      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", width: 64, height: 64, borderRadius: "50%",
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            alignItems: "center", justifyContent: "center", fontSize: 28, marginBottom: 16,
            boxShadow: "0 8px 24px rgba(99,102,241,0.3)",
          }}>
            <i className="fas fa-lock-open" style={{ color: "#fff" }} />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>Reset Password</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: 0 }}>Enter your new password below</p>
        </div>

        <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "40px 36px", boxShadow: "0 32px 64px rgba(0,0,0,0.4)" }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                <i className="fas fa-lock" style={{ marginRight: 6, color: "#6366f1" }} />New Password
              </label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(""); }} placeholder="Min 6 chars" style={{ width: "100%", padding: "14px 48px 14px 16px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                  <i className={`fas fa-eye${showPassword ? "-slash" : ""}`} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" }}>
                <i className="fas fa-lock" style={{ marginRight: 6, color: "#6366f1" }} />Confirm Password
              </label>
              <input type="password" value={form.confirmPassword} onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setError(""); }} placeholder="Retype password" style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }} />
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

            <button type="submit" disabled={loading} className="btn-press" style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: loading ? "wait" : "pointer", boxShadow: "0 8px 24px rgba(99,102,241,0.35)", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? (<><i className="fas fa-spinner fa-spin" />Resetting...</>) : (<><i className="fas fa-check" />Reset Password</>)}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
