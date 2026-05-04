"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function RegisterPageSection() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { level: 0, label: "", color: "" };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;

    if (score <= 2) return { level: score, label: "Weak", color: "#ef4444" };
    if (score <= 3) return { level: score, label: "Medium", color: "#f59e0b" };
    return { level: score, label: "Strong", color: "#22c55e" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.register(form);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();

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

  const focusHandlers = {
    onFocus: (e) => {
      e.currentTarget.style.borderColor = "#6366f1";
      e.currentTarget.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)";
    },
    onBlur: (e) => {
      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
      e.currentTarget.style.boxShadow = "none";
    },
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="animate-blob" style={{ position: "absolute", top: "-10%", right: "15%", width: 400, height: 400, background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />
      <div className="animate-blob delay-400" style={{ position: "absolute", bottom: "5%", left: "10%", width: 350, height: 350, background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", borderRadius: "50%", pointerEvents: "none" }} />

      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 460, position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <div className="animate-pulse-glow" style={{ width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #f43f5e, #fb923c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏠</div>
              <span className="gradient-text" style={{ fontSize: 28, fontWeight: 900 }}>airbnb</span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "40px 36px", boxShadow: "0 32px 64px rgba(0,0,0,0.4)" }}>
          <h1 className="animate-fade-up" style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>
            Create Account
          </h1>
          <p className="animate-fade-up delay-100" style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 28px" }}>
            Join us and find your perfect stay
          </p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="animate-fade-up delay-100" style={{ marginBottom: 18 }}>
              <label htmlFor="reg-name" style={labelStyle}>
                <i className="fas fa-user" style={{ marginRight: 6, color: "#22c55e" }} />Full Name
              </label>
              <input id="reg-name" type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" autoComplete="name" style={inputStyle} {...focusHandlers} />
            </div>

            {/* Email */}
            <div className="animate-fade-up delay-200" style={{ marginBottom: 18 }}>
              <label htmlFor="reg-email" style={labelStyle}>
                <i className="fas fa-envelope" style={{ marginRight: 6, color: "#6366f1" }} />Email Address
              </label>
              <input id="reg-email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" style={inputStyle} {...focusHandlers} />
            </div>

            {/* Password */}
            <div className="animate-fade-up delay-300" style={{ marginBottom: 6 }}>
              <label htmlFor="reg-password" style={labelStyle}>
                <i className="fas fa-lock" style={{ marginRight: 6, color: "#f59e0b" }} />Password
              </label>
              <div style={{ position: "relative" }}>
                <input id="reg-password" type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min 6 chars, 1 uppercase, 1 number" autoComplete="new-password" style={{ ...inputStyle, paddingRight: 48 }} {...focusHandlers} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 14, padding: 4 }}>
                  <i className={`fas fa-eye${showPassword ? "-slash" : ""}`} />
                </button>
              </div>
              {/* Password strength */}
              {form.password && (
                <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${(strength.level / 5) * 100}%`, height: "100%", borderRadius: 99, background: strength.color, transition: "all 0.3s" }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: strength.color }}>{strength.label}</span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="animate-fade-up delay-400" style={{ marginBottom: 24, marginTop: 12 }}>
              <label htmlFor="reg-confirm" style={labelStyle}>
                <i className="fas fa-lock" style={{ marginRight: 6, color: "#f59e0b" }} />Confirm Password
              </label>
              <input id="reg-confirm" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Retype your password" autoComplete="new-password" style={inputStyle} {...focusHandlers} />
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p style={{ color: "#ef4444", fontSize: 12, fontWeight: 600, margin: "6px 0 0" }}>
                  <i className="fas fa-circle-exclamation" style={{ marginRight: 4 }} />Passwords do not match
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontSize: 13, fontWeight: 600, marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}>
                <i className="fas fa-circle-exclamation" />{error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn-press animate-fade-up delay-500" style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #22c55e, #15803d)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: loading ? "wait" : "pointer", boxShadow: "0 8px 24px rgba(34,197,94,0.35)", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? (<><i className="fas fa-spinner fa-spin" />Creating account...</>) : (<><i className="fas fa-user-plus" />Create Account</>)}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 600 }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>

          <p style={{ textAlign: "center", margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#6366f1", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
