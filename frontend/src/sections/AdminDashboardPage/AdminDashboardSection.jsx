"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function AdminDashboardSection() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [homes, setHomes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "admins" | "homes" | "bookings"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    if (!storedAdmin) {
      router.push("/admin-login");
      return;
    }
    setAdmin(JSON.parse(storedAdmin));
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch admins if super_admin
      const adminData = JSON.parse(localStorage.getItem("admin"));
      if (adminData.role === "super_admin") {
        const adminRes = await api.listAdmins();
        if (adminRes.success) setAdmins(adminRes.admins);
      }

      // Fetch homes & bookings (global list)
      const homesRes = await api.getHomes();
      setHomes(homesRes);

      const bookingsRes = await api.getBookings();
      setBookings(bookingsRes);

    } catch (err) {
      console.error("Fetch dashboard data error:", err);
      // Don't set error here as it might be due to role restrictions
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.push("/admin-login");
  };

  const toggleAdmin = async (id) => {
    try {
      await api.toggleAdminStatus(id);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading && !admin) return <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#fff" }}>Loading Admin...</div>;

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "#fff", display: "flex" }}>
      {/* Sidebar */}
      <aside style={{ width: 280, background: "rgba(255,255,255,0.03)", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 24px", marginBottom: 40, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #ef4444, #f97316)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <i className="fas fa-shield-halved" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.5px" }}>ADMIN PANEL</span>
        </div>

        <nav style={{ flex: 1, padding: "0 12px" }}>
          {[
            { id: "overview", label: "Overview", icon: "fa-chart-pie" },
            { id: "admins", label: "Manage Admins", icon: "fa-users-gear", superOnly: true },
            { id: "homes", label: "Total Homes", icon: "fa-house" },
            { id: "bookings", label: "All Bookings", icon: "fa-calendar-check" },
          ].map((item) => {
            if (item.superOnly && admin?.role !== "super_admin") return null;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: "100%", textAlign: "left", padding: "14px 16px", borderRadius: 12, border: "none",
                  background: activeTab === item.id ? "rgba(239,68,68,0.1)" : "transparent",
                  color: activeTab === item.id ? "#ef4444" : "rgba(255,255,255,0.5)",
                  fontWeight: activeTab === item.id ? 700 : 500, fontSize: 14, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 12, marginBottom: 4, transition: "all 0.2s"
                }}
              >
                <i className={`fas ${item.icon}`} style={{ width: 18 }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: "24px" }}>
          <button onClick={handleLogout} style={{
            width: "100%", padding: "12px", borderRadius: 12, border: "1px solid rgba(239,68,68,0.3)",
            background: "transparent", color: "#ef4444", fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}>
            <i className="fas fa-right-from-bracket" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 40, overflowY: "auto" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 4px" }}>Dashboard</h1>
            <p style={{ color: "rgba(255,255,255,0.4)", margin: 0 }}>Welcome back, <span style={{ color: "#ef4444" }}>{admin?.name}</span> ({admin?.role})</p>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 10px #22c55e" }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>System Live</span>
            </div>
          </div>
        </header>

        {activeTab === "overview" && (
          <div className="animate-fade-up">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 40 }}>
              {[
                { label: "Total Homes", value: homes.length, icon: "fa-house", color: "#3b82f6" },
                { label: "Total Bookings", value: bookings.length, icon: "fa-calendar-check", color: "#ef4444" },
                { label: "Active Admins", value: admins.length || 1, icon: "fa-shield", color: "#f97316" },
              ].map((stat, i) => (
                <div key={i} style={{ padding: 24, background: "rgba(255,255,255,0.03)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, background: `${stat.color}15`, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>
                      <i className={`fas ${stat.icon}`} />
                    </div>
                  </div>
                  <h3 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 4px" }}>{stat.value}</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: 600, margin: 0 }}>{stat.label}</p>
                </div>
              ))}
            </div>
            {/* Quick Actions or Recent stuff could go here */}
          </div>
        )}

        {activeTab === "admins" && admin?.role === "super_admin" && (
          <div className="animate-fade-up">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Administrator Management</h2>
              <button style={{ padding: "10px 20px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, cursor: "pointer" }}>
                + Add Admin
              </button>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 24, border: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.02)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <th style={{ textAlign: "left", padding: "16px 24px" }}>Name</th>
                    <th style={{ textAlign: "left", padding: "16px 24px" }}>Email</th>
                    <th style={{ textAlign: "left", padding: "16px 24px" }}>Role</th>
                    <th style={{ textAlign: "left", padding: "16px 24px" }}>Status</th>
                    <th style={{ textAlign: "right", padding: "16px 24px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <td style={{ padding: "16px 24px", fontWeight: 600 }}>{a.name}</td>
                      <td style={{ padding: "16px 24px", color: "rgba(255,255,255,0.5)" }}>{a.email}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{ padding: "4px 10px", borderRadius: 8, background: a.role === "super_admin" ? "rgba(249,115,22,0.1)" : "rgba(59,130,246,0.1)", color: a.role === "super_admin" ? "#f97316" : "#3b82f6", fontSize: 12, fontWeight: 700 }}>
                          {a.role.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: a.isActive ? "#22c55e" : "#ef4444" }} />
                          {a.isActive ? "Active" : "Deactivated"}
                        </div>
                      </td>
                      <td style={{ padding: "16px 24px", textAlign: "right" }}>
                        {a.id !== admin.id && (
                          <button 
                            onClick={() => toggleAdmin(a.id)}
                            style={{ padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", cursor: "pointer", fontSize: 12 }}
                          >
                            {a.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {(activeTab === "homes" || activeTab === "bookings") && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.03)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px", color: "rgba(255,255,255,0.2)" }}>
              <i className="fas fa-hammer" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 8px" }}>Module Under Development</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", maxWidth: 300, margin: "0 auto" }}>We are working on bringing full management for {activeTab} here soon.</p>
          </div>
        )}
      </main>
    </div>
  );
}
