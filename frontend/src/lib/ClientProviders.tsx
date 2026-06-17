"use client";

import { SidebarProvider } from "@/lib/SidebarContext";
import { ThemeProvider } from "@/lib/ThemeContext";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </ThemeProvider>
  );
}
