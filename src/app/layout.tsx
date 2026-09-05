import type { Metadata, Viewport } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@/lib/theme-context";
import { FontSizeProvider } from "@/lib/font-size-context";
import { LanguageProvider } from "@/lib/language-context";

export const metadata: Metadata = {
  title: "SwasthyaSetu - Smart Healthcare Kiosk",
  description: "Bridging every patient to better care. Voice-enabled, multilingual visual OPD token kiosk and hospital triage system.",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/swasthya-setu-logo.jpg",
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
      <body className="antialiased text-slate-900 dark:text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-white transition-colors duration-200 relative">
        {/* Doctor-Patient Background Image */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-[0.25] dark:opacity-[0.18] transition-opacity duration-300"
          style={{
            backgroundImage: `url('/images/doctor-patient-bg.jpg')`,
            backgroundAttachment: "fixed",
          }}
        />
        {/* Soft background tint with high clarity */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0 bg-slate-50/75 dark:bg-slate-950/85 transition-colors duration-300"
        />

        <ThemeProvider>
          <FontSizeProvider>
            <LanguageProvider>
              <div className="relative z-10 min-h-screen flex flex-col">
                {children}
              </div>
            </LanguageProvider>
          </FontSizeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
