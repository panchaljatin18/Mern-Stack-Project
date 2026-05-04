"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";

export default function LayoutContent({ children }) {
  const pathname = usePathname();
  
  // Routes where we don't want the custom cursor
  const noCursorRoutes = ["/login", "/register", "/admin-login", "/forgot-password"];
  const isNoCursor = noCursorRoutes.includes(pathname) || pathname.startsWith("/reset-password");

  // Auth pages often have different spacing
  const isAuthPage = noCursorRoutes.includes(pathname) || pathname.startsWith("/reset-password");

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
      <Footer />
    </div>
  );
}
