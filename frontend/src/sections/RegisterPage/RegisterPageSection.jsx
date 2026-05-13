"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function RegisterPageSection() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSendVerification = async () => {
    if (!form.email) {
      setError("Please enter an email address first.");
      return;
    }
    setSendingEmail(true);
    setError("");
    setSuccess("");
    try {
      const data = await api.sendVerification({ email: form.email });
      if (data.success) {
        setSuccess("Verification link sent! Check your inbox.");
      }
    } catch (err) {
      setError(err.message || "Failed to send email.");
    } finally {
      setSendingEmail(false);
    }
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
      // Step 2: Finalize registration (requires verification done via email link)
      // Note: We need a token to complete registration, but the user is already on this page.
      // A better way is to tell the user to check their email.
      setError("Please verify your email via the link sent to you before creating an account.");
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none", transition: "all 0.2s", boxSizing: "border-box",
  };

  const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.8px" };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)", padding: "24px" }}>
      <div className="animate-scale-in" style={{ width: "100%", maxWidth: 520 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", backdropFilter: "blur(24px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 28, padding: "40px 36px", boxShadow: "0 32px 64px rgba(0,0,0,0.4)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", margin: "0 0 8px" }}>Create Account</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, margin: "0 0 28px" }}>Join us and find your perfect stay</p>

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" style={inputStyle} />
            </div>

            {/* Email with Side Button */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Email Address</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" style={{ ...inputStyle, flex: 1 }} />
                <button 
                  type="button" 
                  onClick={handleSendVerification}
                  disabled={sendingEmail}
                  style={{ 
                    padding: "0 20px", borderRadius: 14, border: "none", 
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", 
                    fontWeight: 700, fontSize: 12, cursor: sendingEmail ? "wait" : "pointer",
                    whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(99,102,241,0.2)"
                  }}
                >
                  {sendingEmail ? "Sending..." : "Send Email"}
                </button>
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange} placeholder="Min 8 characters" style={{ ...inputStyle, paddingRight: 48 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                  <i className={`fas fa-eye${showPassword ? "-slash" : ""}`} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Retype password" style={inputStyle} />
            </div>

            {/* Success/Error messages */}
            {success && <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{success}</div>}
            {error && <div style={{ color: "#ef4444", fontSize: 13, fontWeight: 600, marginBottom: 20 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{ width: "100%", padding: "15px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, #22c55e, #15803d)", color: "#fff", fontWeight: 800, fontSize: 15, cursor: loading ? "wait" : "pointer" }}>
              {loading ? "Please wait..." : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
            Already have an account? <Link href="/login" style={{ color: "#6366f1", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
