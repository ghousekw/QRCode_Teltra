import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Code Product Catalogue Manager",
  description: "Create digital product catalogues with QR codes for easy sharing. Features full CRUD operations, image support, and real-time updates.",
  keywords: ["QR Code", "Product Catalogue", "Next.js", "TypeScript", "Tailwind CSS", "shadcn/ui", "Prisma", "PostgreSQL"],
  authors: [{ name: "QR Code Catalogue Team" }],
  openGraph: {
    title: "QR Code Product Catalogue Manager",
    description: "Create and share digital product catalogues with QR codes",
    url: "https://your-app.vercel.app",
    siteName: "QR Code Catalogue",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "QR Code Product Catalogue Manager",
    description: "Create and share digital product catalogues with QR codes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
