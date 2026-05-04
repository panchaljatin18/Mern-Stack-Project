"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function LoginPageSection() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await api.login(form);
      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
      {/* Background orbs */}
      <div
        className="animate-blob"
        style={{
          position: "absolute",
          top: "-10%",
          left: "10%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        className="animate-blob delay-400"
        style={{
          position: "absolute",
          bottom: "5%",
          right: "10%",
          width: 350,
          height: 350,
          background: "radial-gradient(circle, rgba(244,63,94,0.12) 0%, transparent 70%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      <div
        className="animate-scale-in"
        style={{
          width: "100%",
          maxWidth: 460,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
              <div
                className="animate-pulse-glow"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #f43f5e, #fb923c)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                }}
              >
                🏠
              </div>
              <span
                className="gradient-text"
                style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px" }}
              >
                airbnb
              </span>
            </div>
          </Link>
        </div>

        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.03)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 28,
            padding: "44px 36px",
            boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
          }}
        >
          <h1
            className="animate-fade-up"
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "#fff",
              margin: "0 0 8px",
              letterSpacing: "-0.5px",
            }}
          >
            Welcome Back
          </h1>
          <p
            className="animate-fade-up delay-100"
            style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 32px" }}
          >
            Sign in to your account to continue
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="animate-fade-up delay-200" style={{ marginBottom: 20 }}>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                <i className="fas fa-envelope" style={{ marginRight: 6, color: "#6366f1" }} />
                Email Address
              </label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                style={{
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
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#6366f1";
                  e.currentTarget.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Password */}
            <div className="animate-fade-up delay-300" style={{ marginBottom: 12 }}>
              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.6)",
                  marginBottom: 8,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}
              >
                <i className="fas fa-lock" style={{ marginRight: 6, color: "#6366f1" }} />
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: "14px 48px 14px 16px",
                    borderRadius: 14,
                    border: "2px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.05)",
                    color: "#fff",
                    fontSize: 14,
                    outline: "none",
                    transition: "all 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 14,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255,255,255,0.4)",
                    cursor: "pointer",
                    fontSize: 14,
                    padding: 4,
                  }}
                >
                  <i className={`fas fa-eye${showPassword ? "-slash" : ""}`} />
                </button>
              </div>
            </div>

            {/* Forgot password link */}
            <div
              className="animate-fade-up delay-300"
              style={{ textAlign: "right", marginBottom: 24 }}
            >
              <Link
                href="/forgot-password"
                style={{
                  color: "#6366f1",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div
                className="animate-fade-up"
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "#ef4444",
                  fontSize: 13,
                  fontWeight: 600,
                  marginBottom: 20,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <i className="fas fa-circle-exclamation" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-press animate-fade-up delay-400"
              style={{
                width: "100%",
                padding: "15px",
                borderRadius: 14,
                border: "none",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
                fontWeight: 800,
                fontSize: 15,
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
                opacity: loading ? 0.7 : 1,
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fas fa-right-to-bracket" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div
            className="animate-fade-up delay-500"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              margin: "28px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 600 }}>
              OR
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
          </div>

          {/* Register link */}
          <p
            className="animate-fade-up delay-500"
            style={{ textAlign: "center", margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 14 }}
          >
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              style={{
                color: "#6366f1",
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Sign Up
            </Link>
          </p>

          {/* Admin link */}
          <p
            className="animate-fade-up delay-600"
            style={{
              textAlign: "center",
              margin: "16px 0 0",
              color: "rgba(255,255,255,0.3)",
              fontSize: 12,
            }}
          >
            <Link
              href="/admin-login"
              style={{
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              <i className="fas fa-shield-halved" style={{ marginRight: 4 }} />
              Admin Panel
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
