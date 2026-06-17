import type { Metadata } from "next";
import "@/styles/globals.css";
import ClientProviders from "@/lib/ClientProviders";

export const metadata: Metadata = {
  title: "MITA — Nền Tảng Học Tập",
  description: "Hệ thống luyện thi TSA, HSA, THPTQG của MITA Education",
  icons: {
    icon: "/logo-mita.png",
    apple: "/logo-mita.png",
  },
};

const themeInitScript = `
(() => {
  try {
    const stored = window.localStorage.getItem("mita-theme");
    const theme = stored === "light" || stored === "dark" ? stored : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
