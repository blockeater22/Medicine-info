import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { ReadingProgressBar } from "@/components/layout/reading-progress";
import { BackToTop } from "@/components/layout/back-to-top";
import { SkipLink } from "@/components/layout/skip-link";
import { StickyMobileAd } from "@/components/ads/ad-placeholder";
import { CookieConsent } from "@/components/monetization/cookie-consent";
import { GoogleAnalytics } from "@/components/monetization/analytics";
import { AdSenseScript } from "@/components/monetization/adsense-script";
import { organizationSchema, websiteSchema, JsonLd } from "@/lib/seo";
import { SITE } from "@/lib/constants";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.domain),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  keywords: ["medical information India", "medicine guide", "disease symptoms", "lab tests", "health calculators"],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.domain,
    siteName: SITE.name,
    title: SITE.name,
    description: SITE.description,
    images: [{ url: "/og-default.svg", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  verification: {
    google: "iigqyi__6otBwMaDmBhu7xE5WtXDLnNz745RiLIl0fs",
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0b5ba8" },
    { media: "(prefers-color-scheme: dark)", color: "#1e3a5f" },
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  alternates: {
    types: {
      "application/rss+xml": `${SITE.domain}/feed.xml`,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
        <SkipLink />
        <ThemeProvider>
          <Navbar />
          <ReadingProgressBar />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <BackToTop />
          <StickyMobileAd />
          <CookieConsent />
          <GoogleAnalytics />
          <AdSenseScript />
        </ThemeProvider>
      </body>
    </html>
  );
}
