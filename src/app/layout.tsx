import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "ScholarDrill - AI-Powered Test Prep for Australian Students",
  description:
    "ScholarDrill helps Australian students prepare for NAPLAN, selective school exams, scholarships, ICAS, VCE and more.",
  authors: [{ name: "ScholarDrill" }],
  keywords: [
    "NAPLAN practice tests",
    "selective school exams",
    "Australian scholarships",
    "AI test prep",
    "ScholarDrill",
  ],
  openGraph: {
    title: "ScholarDrill - Ace Every Test",
    description:
      "Personalised AI-powered practice for NAPLAN, scholarships and selective school exams.",
    type: "website",
    url: "https://scholardrill.com.au",
  },
  twitter: {
    card: "summary_large_image",
    site: "@ScholarDrill",
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
