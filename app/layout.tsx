import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "ElevateOS - Build Apps with AI",
  description: "Build, launch, and scale your apps with AI-powered tools",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${plusJakarta.className} antialiased bg-[#F7F8FA]`}>
        <div className="min-h-screen">
          {/* Header */}
          <header className="bg-white border-b border-[#E4E4E4] sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
              <a href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#009FE2] to-[#00C4FF] rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(0,159,226,0.3)]">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-[18px] text-[#11142D]">ElevateOS</span>
                  <p className="text-[11px] text-[#808191]">App Builder Platform</p>
                </div>
              </a>
              
              <nav className="flex items-center gap-6">
                <a href="/" className="text-sm font-medium text-[#808191] hover:text-[#11142D]">Dashboard</a>
                <a href="/templates" className="text-sm font-medium text-[#808191] hover:text-[#11142D]">Templates</a>
              </nav>
            </div>
          </header>
          
          {/* Main Content */}
          <main>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
