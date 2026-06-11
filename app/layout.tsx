import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VisualStats.ai — Data That Tells Stories",
  description: "AI-powered dashboards, venture intelligence and visual reports in seconds."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
