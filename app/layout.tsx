import type { Metadata } from "next";
import { Imbue, Victor_Mono } from "next/font/google";
import "./globals.css";

const imbue = Imbue({
  variable: "--font-imbue",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const victorMono = Victor_Mono({
  variable: "--font-victor-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "HH | ID Card Generator",
  description:
    "Generate your official branded HH Goa 2026 Builder Pass, download your ID card PNG, and share on X with #FrameInGoa.",
  keywords: [
    "HH Goa 2026",
    "Hacker House Goa",
    "Builder ID Card Generator",
    "FrameInGoa",
    "Goa Hackathon",
  ],
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/assets/logo.svg", type: "image/svg+xml" },
    ],
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    title: "HH Goa 2026 — Builder ID Card Generator",
    description:
      "Generate your official branded HH Goa 2026 Builder Pass, download your ID card PNG, and share on X with #FrameInGoa.",
    siteName: "HH Goa 2026",
    url: siteUrl,
    images: [
      {
        url: "/OG.png",
        width: 1200,
        height: 630,
        alt: "HH Goa 2026 — Builder ID Card Generator",
        type: "image/png",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 — Builder ID Card Generator",
    description:
      "Generate your official branded HH Goa 2026 Builder Pass, download your ID card PNG, and share on X with #FrameInGoa.",
    images: ["/OG.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${imbue.variable} ${victorMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col antialiased selection:bg-[#FF0080] selection:text-white">
        {children}
      </body>
    </html>
  );
}
