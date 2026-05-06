"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function AdminPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [homes, setHomes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");

    if (!storedAdmin || storedAdmin === "undefined") {
      router.push("/admin-login");
      return;
    }

    try {
      const parsedAdmin = JSON.parse(storedAdmin);

      setAdmin(parsedAdmin);

      fetchData(parsedAdmin);
    } catch (error) {
      console.error("Invalid admin data:", error);

      localStorage.removeItem("admin");
      localStorage.removeItem("token");

      router.push("/admin-login");
    }
  }, []);

  const fetchData = async (adminData) => {
    try {
      setLoading(true);

      // Fetch admins if super admin
      if (adminData?.role === "super_admin") {
        const adminRes = await api.listAdmins();

        if (adminRes.success) {
          setAdmins(adminRes.admins);
        }
      }

      // Fetch homes
      const homesRes = await api.getHomes();

      setHomes(
        Array.isArray(homesRes)
          ? homesRes
          : homesRes.homes || []
      );

      // Fetch bookings
      const bookingsRes = await api.getBookings();

      setBookings(
        Array.isArray(bookingsRes)
          ? bookingsRes
          : bookingsRes.bookings || []
      );
    } catch (err) {
      console.error("Dashboard fetch error:", err);
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

      fetchData(admin);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#fff",
          fontSize: "20px",
          fontWeight: "700",
        }}
      >
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#fff",
        display: "flex",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 280,
          background: "rgba(255,255,255,0.03)",
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          flexDirection: "column",
          padding: "24px 0",
        }}
      >
        <div
          style={{
            padding: "0 24px",
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "linear-gradient(135deg, #ef4444, #f97316)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className="fas fa-shield-halved" />
          </div>

          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
            }}
          >
            ADMIN PANEL
          </span>
        </div>

        <nav
          style={{
            flex: 1,
            padding: "0 12px",
          }}
        >
          {[
            {
              id: "overview",
              label: "Overview",
            },
            {
              id: "admins",
              label: "Manage Admins",
              superOnly: true,
            },
            {
              id: "homes",
              label: "Homes",
            },
            {
              id: "bookings",
              label: "Bookings",
            },
          ].map((item) => {
            if (item.superOnly && admin?.role !== "super_admin") {
              return null;
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "14px 16px",
                  borderRadius: 12,
                  border: "none",
                  marginBottom: 8,
                  cursor: "pointer",
                  fontWeight: "700",
                  background:
                    activeTab === item.id
                      ? "rgba(239,68,68,0.2)"
                      : "transparent",
                  color:
                    activeTab === item.id
                      ? "#ef4444"
                      : "rgba(255,255,255,0.6)",
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: 24 }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 12,
              border: "none",
              background: "#ef4444",
              color: "#fff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main
        style={{
          flex: 1,
          padding: 40,
        }}
      >
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            marginBottom: 12,
          }}
        >
          Welcome {admin?.name}
        </h1>

        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            marginBottom: 40,
          }}
        >
          Role: {admin?.role}
        </p>

        {activeTab === "overview" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
              gap: 20,
            }}
          >
            <div
              style={{
                padding: 24,
                borderRadius: 20,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <h2>Total Homes</h2>

              <h1>{homes.length}</h1>
            </div>

            <div
              style={{
                padding: 24,
                borderRadius: 20,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <h2>Total Bookings</h2>

              <h1>{bookings.length}</h1>
            </div>

            <div
              style={{
                padding: 24,
                borderRadius: 20,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <h2>Admins</h2>

              <h1>{admins.length || 1}</h1>
            </div>
          </div>
        )}

        {activeTab === "admins" &&
          admin?.role === "super_admin" && (
            <div style={{ marginTop: 30 }}>
              <h2
                style={{
                  marginBottom: 20,
                }}
              >
                Manage Admins
              </h2>

              {admins.map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.03)",
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <h3>{a.name}</h3>

                    <p>{a.email}</p>

                    <small>{a.role}</small>
                  </div>

                  {a.id !== admin.id && (
                    <button
                      onClick={() => toggleAdmin(a.id)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 10,
                        border: "none",
                        background: a.isActive
                          ? "#ef4444"
                          : "#22c55e",
                        color: "#fff",
                        cursor: "pointer",
                        fontWeight: "700",
                      }}
                    >
                      {a.isActive ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}