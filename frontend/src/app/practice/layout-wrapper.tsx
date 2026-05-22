"use client";

import Navbar from "@/components/layout/Navbar";
import PracticeSidebar from "@/components/practice/PracticeSidebar";
import Footer from "@/components/layout/Footer";

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "calc(100vh - 60px)", background: "#fff" }}>
        <PracticeSidebar />
        <main style={{ padding: "28px 32px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
      <Footer />
    </>
  );
}
