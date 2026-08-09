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
      className={`${imbue.variable} ${victorMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col antialiased selection:bg-[#FF0080] selection:text-white">
        {children}
      </body>
    </html>
  );
}
