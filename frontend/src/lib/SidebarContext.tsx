"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  sidebarOpen: true,
  toggleSidebar: () => {},
  closeSidebar: () => {},
});

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved));
    } else {
      // Default closed on mobile (first visit, no saved preference)
      setSidebarOpen(window.innerWidth > 768);
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => {
      const next = !prev;
      localStorage.setItem("sidebarOpen", JSON.stringify(next));
      return next;
    });
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    localStorage.setItem("sidebarOpen", JSON.stringify(false));
  };

  return (
    <SidebarContext.Provider value={{ sidebarOpen, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}
