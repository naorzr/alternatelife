import type { Metadata } from "next";
import { Press_Start_2P, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-terminal",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alternate Life — What if you'd spent those hours differently?",
  description:
    "Enter your gaming hours and see what you could have been. 70+ skills, 7 stats, one question.",
  openGraph: {
    title: "Alternate Life",
    description:
      "What if you'd spent those gaming hours on something real?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alternate Life",
    description:
      "What if you'd spent those gaming hours on something real?",
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
      className={`${pressStart2P.variable} ${spaceMono.variable}`}
    >
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
