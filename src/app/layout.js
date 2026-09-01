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

export const metadata = {
  title: {
    default: "Shree Labh Dhatu | Aluminium, Brass, Copper & Stainless Steel",
    template: "%s | Shree Labh Dhatu",
  },

  description:
    "Shree Labh Dhatu is a manufacturer and supplier of high-quality aluminium, brass, copper and stainless steel products for industrial and commercial applications.",

  keywords: [
    "Shree Labh Dhatu",
    "aluminium products",
    "aluminium manufacturer",
    "aluminium supplier",
    "brass products",
    "brass manufacturer",
    "brass supplier",
    "copper products",
    "copper manufacturer",
    "copper supplier",
    "stainless steel products",
    "stainless steel manufacturer",
    "stainless steel supplier",
    "metal products manufacturer",
    "metal products supplier",
  ],

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "Shree Labh Dhatu | Aluminium, Brass, Copper & Stainless Steel",
    description:
      "Manufacturer and supplier of aluminium, brass, copper and stainless steel products.",
    type: "website",
    siteName: "Shree Labh Dhatu",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
