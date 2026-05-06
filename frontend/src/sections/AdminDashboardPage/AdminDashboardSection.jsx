"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../lib/api";

export default function AdminPage() {
  const router = useRouter();

  const [admin, setAdmin] = useState(null);
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [homes, setHomes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null); // For edit modal

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

      // Fetch users
      const usersRes = await api.listUsers();
      setUsers(usersRes.users || []);

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

  const handleDeleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.adminDeleteUser(id);
      fetchData(admin);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.adminUpdateUser(editingUser._id, {
        name: editingUser.name,
        email: editingUser.email,
      });
      setEditingUser(null);
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
            {
              id: "users",
              label: "Manage Users",
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
              <h2>Total Users</h2>

              <h1>{users.length}</h1>
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
        {activeTab === "homes" && (
          <div style={{ marginTop: 30 }}>
            <h2 style={{ marginBottom: 20 }}>All Homes</h2>

            {homes.length === 0 ? (
              <p>No homes found.</p>
            ) : (
              homes.map((home) => (
                <div
                  key={home._id || home.id}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.03)",
                    marginBottom: 16,
                  }}
                >
                  <h3>{home.houseName}</h3>

                  <p>Location: {home.location}</p>

                  <p>Price: ₹{home.price}</p>

                  <p>Rating: {home.rating}</p>
                </div>
              ))
            )}
          </div>
        )}


        {activeTab === "bookings" && (
          <div style={{ marginTop: 30 }}>
            <h2 style={{ marginBottom: 20 }}>All Bookings</h2>

            {bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              bookings.map((booking) => (
                <div
                  key={booking._id || booking.id || `booking-${booking.bookedAt}-${booking.houseName}`}
                  style={{
                    padding: 20,
                    borderRadius: 16,
                    background: "rgba(255,255,255,0.03)",
                    marginBottom: 16,
                  }}
                >
                  <h3>{booking.houseName}</h3>

                  <p>User: {booking.userName}</p>

                  <p>Booked At: {booking.bookedAt}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "users" && (
          <div style={{ marginTop: 30 }}>
            <h2 style={{ marginBottom: 20 }}>Registered Users</h2>

            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              users.map((u) => (
                <div
                  key={u._id || u.id}
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
                    <h3>{u.name}</h3>
                    <p style={{ color: "rgba(255,255,255,0.6)" }}>{u.email}</p>
                    <small style={{ color: "rgba(255,255,255,0.4)" }}>Registered: {new Date(u.createdAt).toLocaleDateString()}</small>
                  </div>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{ padding: "8px 12px", borderRadius: 8, background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: 12, fontWeight: 700 }}>
                      USER
                    </div>
                    <button
                      onClick={() => setEditingUser(u)}
                      style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.05)", color: "#fff", cursor: "pointer", fontSize: 14 }}
                    >
                      <i className="fas fa-edit" />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id || u.id)}
                      style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "rgba(239,68,68,0.1)", color: "#ef4444", cursor: "pointer", fontSize: 14 }}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Edit User Modal */}
        {editingUser && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000, padding: 20 }}>
            <div className="animate-scale-in" style={{ background: "#1e1b4b", padding: 32, borderRadius: 24, width: "100%", maxWidth: 400, border: "1px solid rgba(255,255,255,0.1)" }}>
              <h2 style={{ marginBottom: 24, fontSize: 24, fontWeight: 800 }}>Edit User</h2>
              <form onSubmit={handleUpdateUser}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>NAME</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff" }}
                  />
                </div>
                <div style={{ marginBottom: 24 }}>
                  <label style={{ display: "block", marginBottom: 8, fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>EMAIL</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff" }}
                  />
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Cancel</button>
                  <button type="submit" style={{ flex: 1, padding: 12, borderRadius: 12, border: "none", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", cursor: "pointer", fontWeight: 700 }}>Save Changes</button>
                </div>
              </form>
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
                  key={a._id || a.id}
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

                  {(a._id || a.id) !== (admin._id || admin.id) && (
                    <button
                      onClick={() => toggleAdmin(a._id || a.id)}
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