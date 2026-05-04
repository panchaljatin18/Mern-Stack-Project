"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import CustomCursor from "./CustomCursor";

const AUTH_PAGES = ["/login", "/register", "/admin-login", "/forgot-password"];

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PAGES.includes(pathname) || pathname.startsWith("/reset-password");

  return (
    <>
      <CustomCursor />
      {!isAuthPage && <Header />}
      <main style={{ minHeight: isAuthPage ? undefined : "60vh" }}>{children}</main>
      {!isAuthPage && <Footer />}
    </>
  );
}
