import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  title: "HHG | ID Card Generator",
  description:
    "Generate your official branded HH Goa 2026 Builder Pass, download your ID card PNG, and share on X with #FrameInGoa.",
  keywords: [
    "HH Goa 2026",
    "Hacker House Goa",
    "Builder ID Card Generator",
    "FrameInGoa",
    "Goa Hackathon",
  ],
  openGraph: {
    title: "HH Goa 2026 — Builder ID Card Generator",
    description:
      "Generate your official branded HH Goa 2026 Builder Pass, download your ID card PNG, and share on X with #FrameInGoa.",
    siteName: "HH Goa 2026",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HH Goa 2026 — Builder ID Card Generator",
    description:
      "Generate your official branded HH Goa 2026 Builder Pass, download your ID card PNG, and share on X with #FrameInGoa.",
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
      className={` h-full antialiased`}
    >
      <body className="min-h-full flex flex-col antialiased selection:bg-[#FF0080] selection:text-white">
        {children}
      </body>
    </html>
  );
}
