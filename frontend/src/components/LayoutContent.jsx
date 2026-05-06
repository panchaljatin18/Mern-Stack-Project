"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  // Routes that don't require login
  const authRoutes = ["/login", "/register", "/admin-login", "/forgot-password"];
  const isAuthPage = authRoutes.includes(pathname) || pathname.startsWith("/reset-password");

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && !isAuthPage) {
      // Not logged in and trying to access protected page
      setIsAuthorized(false);
      router.push("/login");
    } else {
      // Logged in OR accessing public auth page
      setIsAuthorized(true);
    }
    setCheckingAuth(false);
  }, [pathname, isAuthPage, router]);

  // If we are still checking auth or not authorized (and not on an auth page), show nothing or a loader
  if (checkingAuth) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#fff" }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Checking Access...</div>
      </div>
    );
  }

  // Show the content only if authorized or it's an auth page
  if (!isAuthorized && !isAuthPage) {
    return null; // This will be handled by the router.push above
  }

  return (
    <div className={isAuthPage ? "auth-layout-wrapper" : ""}>
      <CustomCursor />
      <Header />
      <main style={{ 
        minHeight: isAuthPage ? "100vh" : "60vh", 
        paddingBottom: isAuthPage ? 0 : 80,
        background: isAuthPage ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" : "transparent"
      }}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
}
