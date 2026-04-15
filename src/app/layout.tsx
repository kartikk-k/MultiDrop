import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MultiDrop — Pick multiple colors from any image",
  description:
    "Drop an image, pick multiple colors at once, and copy the annotated image with hex codes. Built for designers and developers who share colors with AI agents.",
  keywords: [
    "color picker",
    "hex color",
    "image color picker",
    "multiple colors",
    "design tool",
    "AI agent",
    "color dropper",
    "eyedropper",
  ],
  openGraph: {
    title: "MultiDrop — Pick multiple colors from any image",
    description:
      "Drop an image, pick multiple colors at once, and copy the annotated image with hex codes.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MultiDrop — Pick multiple colors from any image",
    description:
      "Drop an image, pick multiple colors at once, and copy the annotated image with hex codes.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
