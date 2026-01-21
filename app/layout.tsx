import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Sidebar, SidebarProvider, ToastProvider } from "@/components/ui";
import { MainContent } from "@/components/ui/MainContent";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  if (localStorage.getItem('darkMode') === 'true') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${plusJakarta.className} antialiased`}>
        <ToastProvider>
          <SidebarProvider>
            <div className="min-h-dvh flex">
              {/* Sidebar */}
              <Sidebar />
              
              {/* Main Content */}
              <MainContent>
                {children}
              </MainContent>
            </div>
          </SidebarProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
