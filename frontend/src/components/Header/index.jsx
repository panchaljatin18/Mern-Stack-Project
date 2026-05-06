"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const baseLinks = [
  { to: "/", label: "Home", icon: "fa-house" },
  { to: "/About-us", label: "About", icon: "fa-circle-info" },
];

const protectedLinks = [
  { to: "/favourites", label: "Favourites", icon: "fa-heart" },
  { to: "/bookings", label: "Bookings", icon: "fa-calendar-check" },
];

const adminLinks = [
  { to: "/host/add-home", label: "Add Home", icon: "fa-plus" },
  { to: "/admin", label: "Admin", icon: "fa-shield-halved" },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    // Check login state
    try {
      const adminStored = localStorage.getItem("admin");
      const userStored = localStorage.getItem("user");

      if (adminStored) {
        setUser(JSON.parse(adminStored));
        setIsAdmin(true);
      } else if (userStored) {
        setUser(JSON.parse(userStored));
        setIsAdmin(false);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    } catch { }
  }, [pathname, mounted]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("admin");
    setUser(null);
    setIsAdmin(false);
    window.location.href = "/login";
  };

  // Determine which links to show
  const currentLinks = [...baseLinks];
  if (user) {
    currentLinks.push(...protectedLinks);
    if (isAdmin) {
      currentLinks.push(...adminLinks);
    }
  }

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        transition: "all 0.4s ease",
        background: scrolled
          ? "rgba(15,23,42,0.92)"
          : "linear-gradient(135deg,#0f172a,#1e1b4b)",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(99,102,241,0.2)" : "none",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <nav style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              className="animate-pulse-glow"
              style={{
                width: 38, height: 38, borderRadius: "50%",
                background: "linear-gradient(135deg,#f43f5e,#fb923c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, flexShrink: 0,
              }}
            >
              <i className="fas fa-home" style={{ color: "#fff" }} />
            </div>
            <span
              className="gradient-text animate-fade-down"
              style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.5px" }}
            >
              airbnb
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <ul
          style={{ display: "flex", gap: 4, listStyle: "none", margin: 0, padding: 0, alignItems: "center" }}
          className="hidden-mobile"
        >
          {currentLinks.map((link, i) => {
            const active = pathname === link.to;
            return (
              <li key={link.to} className={`animate-fade-down delay-${(i + 1) * 100}`}>
                <Link
                  href={link.to}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 10, textDecoration: "none",
                    fontSize: 13, fontWeight: 600,
                    color: active ? "#fff" : "rgba(255,255,255,0.65)",
                    background: active ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                    boxShadow: active ? "0 4px 15px rgba(99,102,241,0.4)" : "none",
                    transition: "all 0.25s ease",
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.08)"; e.currentTarget.style.color = "#fff"; } }}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; } }}
                >
                  <i className={`fas ${link.icon}`} style={{ fontSize: 11 }} />
                  {link.label}
                </Link>
              </li>
            );
          })}

          {/* Auth button */}
          <li className="animate-fade-down delay-600" style={{ marginLeft: 8 }}>
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "6px 12px", borderRadius: 10,
                  background: "rgba(34,197,94,0.12)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%",
                    background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, color: "#fff", fontWeight: 800,
                  }}>
                    {(user.name || "U")[0].toUpperCase()}
                  </div>
                  <span style={{ color: "#22c55e", fontSize: 12, fontWeight: 700 }}>
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: "7px 12px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.3)",
                    background: "rgba(239,68,68,0.1)", color: "#ef4444",
                    fontSize: 12, fontWeight: 700, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  <i className="fas fa-right-from-bracket" style={{ fontSize: 10 }} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "8px 16px", borderRadius: 10, textDecoration: "none",
                  fontSize: 13, fontWeight: 700,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  color: "#fff",
                  boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                }}
              >
                <i className="fas fa-right-to-bracket" style={{ fontSize: 11 }} />
                Login
              </Link>
            )}
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "none", background: "rgba(255,255,255,0.1)",
            border: "none", borderRadius: 8, padding: "8px 12px",
            color: "#fff", fontSize: 18, cursor: "pointer",
          }}
          className="show-mobile"
        >
          <i className={`fas ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="animate-fade-down"
          style={{ background: "rgba(15,23,42,0.98)", borderTop: "1px solid rgba(99,102,241,0.2)", padding: "12px 24px 20px" }}
        >
          {currentLinks.map((link) => {
            const active = pathname === link.to;
            return (
              <Link key={link.to} href={link.to} onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "12px 16px", borderRadius: 10, textDecoration: "none",
                  color: active ? "#fff" : "rgba(255,255,255,0.7)",
                  background: active ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "transparent",
                  marginBottom: 4, fontWeight: 600, fontSize: 14,
                }}
              >
                <i className={`fas ${link.icon}`} />{link.label}
              </Link>
            );
          })}
          {/* Mobile auth */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", marginTop: 8, paddingTop: 12 }}>
            {user ? (
              <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", fontWeight: 600, fontSize: 14, width: "100%", cursor: "pointer" }}
              >
                <i className="fas fa-right-from-bracket" />Logout ({user.name})
              </button>
            ) : (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", color: "#fff", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
              >
                <i className="fas fa-right-to-bracket" />Login / Register
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: block !important; }
        }
      `}</style>
    </header>
  );
}
