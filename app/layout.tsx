import type { Metadata } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  variable: "--font-pixel",
  subsets: ["latin"],
  display: "swap",
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-terminal",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alternate Life — What if you'd spent those hours differently?",
  description:
    "Enter your gaming hours. See the alternate version of yourself — the one who spent those hours building real skills.",
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
      className={`${pressStart2P.variable} ${vt323.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
