"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../lib/api";

function CompleteRegistrationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [form, setForm] = useState({ name: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.password || !form.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!token) {
      setError("Invalid session. Please start registration again.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await api.register({ ...form, token });
      if (data.success) {
        setSuccess(true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => router.push("/"), 3000);
      }
    } catch (err) {
      setError(err.message || "Failed to complete registration.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 14, border: "2px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: 14, outline: "none",
  };

  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", padding: 20 }}>
      <div style={{ maxWidth: 480, width: "100%", padding: 40, background: "rgba(255,255,255,0.03)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 32 }}>
        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(34,197,94,0.1)", color: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, margin: "0 auto 24px" }}>
              <i className="fas fa-check-circle" />
            </div>
            <h2 style={{ color: "#fff", fontWeight: 900, marginBottom: 12 }}>Welcome!</h2>
            <p style={{ color: "rgba(255,255,255,0.6)" }}>Your account is ready. Redirecting to home...</p>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Complete Profile</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, marginBottom: 24 }}>Verified: <b>{email}</b></p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase" }}>Full Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="John Doe" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase" }}>Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} placeholder="Choose a secure password" style={inputStyle} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 8, textTransform: "uppercase" }}>Confirm Password</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({...form, confirmPassword: e.target.value})} placeholder="Repeat password" style={inputStyle} />
              </div>

              {error && <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 20 }}>{error}</div>}

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "15px", borderRadius: 14, background: "#6366f1", color: "#fff", fontWeight: 800, cursor: loading ? "wait" : "pointer" }}>
                {loading ? "Completing..." : "Complete Registration"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}

export default function CompleteRegistrationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CompleteRegistrationContent />
    </Suspense>
  );
}
