import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Synergy Thermal-Shield | Case 05: The 4 PM Spike",
  description: "Campus Microgrid Thermal-Load Optimization & Dynamic Peak Mitigation Console",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
