import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ApexSkill AI - Personalized Soft Skills Platform",
  description: "AI-powered personalized soft-skills learning platform for executive presence, storytelling, negotiation, and adaptive leadership.",
  keywords: ["soft skills", "executive communication", "leadership platform", "AI learning", "negotiation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col selection:bg-brand-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
