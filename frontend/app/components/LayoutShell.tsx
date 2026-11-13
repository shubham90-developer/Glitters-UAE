"use client";

import { usePathname } from "next/navigation";
import React from "react";

import TopHeader from "./TopHeader";
import Header from "./Header";
import MenuHeader from "./MenuHeader";
import Footer from "./Footer";
import MobileBottomNav from "./MobileBottomNav";
import WhatsAppFloat from "./wpFloat";

interface LayoutShellProps {
  children: React.ReactNode;
}

const LayoutShell = ({ children }: LayoutShellProps) => {
  const pathname = usePathname();

  // Hide complete header/footer on search page
  const hideLayout = pathname === "/search" || pathname.startsWith("/search/");

  return (
    <>
      {!hideLayout && (
        <>
          <TopHeader />
          <Header />
          <MenuHeader />
        </>
      )}

      <main className="flex-1">{children}</main>

      {!hideLayout && <Footer />}
      {!hideLayout && <WhatsAppFloat />}
      <MobileBottomNav />
    </>
  );
};

export default LayoutShell;
