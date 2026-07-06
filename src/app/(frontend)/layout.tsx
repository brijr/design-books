import "../globals.css";

import { Manrope as Font } from "next/font/google";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";

import {
  HOME_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";

import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Bridger Tower", url: "https://bridger.to" }],
  creator: "Bridger Tower",
  publisher: "WIP",
  keywords: SITE_KEYWORDS,
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary",
    title: HOME_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const font = Font({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.className}>
      <body className="min-h-screen text-zinc-950 bg-zinc-50 selection:bg-orange-200">
        <main className="p-6 sm:p-12 grid gap-12 max-w-7xl">
          <Header />
          {children}
          <Footer />
        </main>
        <Analytics />
      </body>
    </html>
  );
}

const Header = () => {
  return (
    <nav>
      <h2 className="font-medium">
        <Link href="/" className="group">
          Design Books
          <span className="hidden group-hover:inline-block"> *</span>
        </Link>
      </h2>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="text-xs grid gap-1 text-zinc-400">
      <p>
        © designbooks.org / made by{" "}
        <a href="https://bridger.to" className="link">
          bridger
        </a>{" "}
        @{" "}
        <a href="https://wipdes.com" className="link">
          wip
        </a>{" "}
        / 2025
      </p>
    </footer>
  );
};
