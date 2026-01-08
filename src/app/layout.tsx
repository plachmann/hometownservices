import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SearchWrapper from "@/components/search/SearchWrapper";

export const dynamic = "force-dynamic";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hometown Services - Home Improvement & Construction",
  description:
    "Professional home services including construction, maintenance, and specialty work. Serving your local community with quality craftsmanship.",
  keywords: [
    "home services",
    "construction",
    "renovation",
    "plumbing",
    "electrical",
    "HVAC",
    "roofing",
    "flooring",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SearchWrapper>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SearchWrapper>
        <Analytics />
      </body>
    </html>
  );
}
