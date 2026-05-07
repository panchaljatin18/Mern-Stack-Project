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
  const publicRoutes = [
    "/",
    "/About-us",
    "/login",
    "/register",
    "/admin-login",
    "/forgot-password",
    "/complete-registration",
  ];
  const isPublicPage = publicRoutes.includes(pathname) || pathname.startsWith("/reset-password");

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token && !isPublicPage) {
      // Not logged in and trying to access protected page
      setIsAuthorized(false);
      router.push("/login");
    } else if (token && isPublicPage && pathname !== "/admin-login") {
      // Already logged in but on a public auth page (except admin login)
      setIsAuthorized(true);
      router.push("/");
    } else {
      // Logged in OR accessing public page
      setIsAuthorized(true);
    }
    setCheckingAuth(false);
  }, [pathname, isPublicPage, router]);

  // If we are still checking auth or not authorized (and not on an auth page), show nothing or a loader
  if (checkingAuth) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0f172a", color: "#fff" }}>
        <div style={{ fontSize: 24, fontWeight: 700 }}>Checking Access...</div>
      </div>
    );
  }

  // Show the content only if authorized or it's a public page
  if (!isAuthorized && !isPublicPage) {
    return null; // This will be handled by the router.push above
  }

  const pureAuthPages = ["/login", "/register", "/admin-login", "/forgot-password"];
  const isPureAuthPage = pureAuthPages.includes(pathname) || pathname.startsWith("/reset-password");

  return (
    <div className={isPureAuthPage ? "auth-layout-wrapper" : ""} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CustomCursor />
      <Header />
      <main style={{ 
        flex: 1,
        minHeight: isPureAuthPage ? "100vh" : "auto", 
        paddingBottom: isPureAuthPage ? 0 : 40,
        background: isPureAuthPage ? "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)" : "#0f172a"
      }}>
        {children}
      </main>
      {!isPureAuthPage && <Footer />}
    </div>
  );
}
