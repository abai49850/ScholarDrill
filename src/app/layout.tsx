import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ScholarEdge - AI-Powered Test Prep for Australian Students",
  description:
    "ScholarEdge helps Australian students prepare for NAPLAN, selective school exams, scholarships, ICAS, VCE and more.",
  authors: [{ name: "ScholarEdge" }],
  keywords: [
    "NAPLAN practice tests",
    "selective school exams",
    "Australian scholarships",
    "AI test prep",
    "ScholarEdge",
  ],
  openGraph: {
    title: "ScholarEdge - Ace Every Test",
    description:
      "Personalised AI-powered practice for NAPLAN, scholarships and selective school exams.",
    type: "website",
    url: "https://scholaredge.com.au",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ScholarEdge",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <Suspense fallback={null}>
          <Providers>{children}</Providers>
        </Suspense>
      </body>
    </html>
  );
}
