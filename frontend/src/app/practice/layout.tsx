import Navbar from "@/components/layout/Navbar";
import PracticeSidebar from "@/components/layout/PracticeSidebar";

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="prac-layout">
        <PracticeSidebar />
        <main className="prac-main" style={{ background: "#f0f7fd", minHeight: "calc(100vh - 62px)" }}>
          {children}
        </main>
      </div>
    </>
  );
}
