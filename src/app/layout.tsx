import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { FontSizeProvider } from "@/lib/font-size-context";

export const metadata: Metadata = {
  title: "TRIAGE - Visual OPD Token System",
  description: "Voice-enabled, multilingual, visual anatomical triage portal and OPD token system for public healthcare facilities.",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
  }
};

export const viewport: Viewport = {
  themeColor: "#065f46",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-white transition-colors duration-200 relative">
        {/* 3D Frosted Glass Medical Green Watermark Background */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-[0.12] dark:opacity-[0.08] transition-opacity duration-300"
          style={{
            backgroundImage: `url('/images/medical-bg.jpg')`,
            backgroundAttachment: "fixed",
          }}
        />

        <ThemeProvider>
          <FontSizeProvider>
            <div className="relative z-10 min-h-screen flex flex-col">
              {children}
            </div>
          </FontSizeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
