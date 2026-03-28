import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Oswald } from "next/font/google";
import Provider from "./provider";
import AppBreadcrumb from "@/components/common/Breadcrumb";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: "700",
  display: "swap",
  variable: "--font-oswald",
});

const gaId = "G-EW129H86JD";
const basePath = process.env.CAPACITOR === "true" ? "" : "/baystars-drill";
const siteUrl = "https://mitsuboshi.github.io/baystars-drill";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Baystars Drill",
    template: "%s | Baystars Drill",
  },
  description:
    "横浜DeNAベイスターズの背番号計算ドリル・スタメン作成・選手名鑑を楽しめるファンサイト",
  icons: "/favicon.ico",
  keywords: [
    "横浜DeNAベイスターズ",
    "Baystars",
    "ベイスターズ",
    "背番号",
    "計算ドリル",
    "スタメン",
    "選手名鑑",
    "応援歌",
    "ユニフォーム",
    "歌詞",
    "ふりがな",
  ],
  openGraph: {
    type: "website",
    siteName: "Baystars Drill",
    locale: "ja_JP",
    title: "Baystars Drill",
    description:
      "横浜DeNAベイスターズの背番号計算ドリル・スタメン作成・選手名鑑を楽しめるファンサイト",
    images: [
      {
        url: "/baystars_drill.png",
        width: 512,
        height: 512,
        alt: "Baystars Drill Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Baystars Drill",
    description:
      "横浜DeNAベイスターズの背番号計算ドリル・スタメン作成・選手名鑑を楽しめるファンサイト",
    images: ["/baystars_drill.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={oswald.variable} suppressHydrationWarning>
      <head>
        <meta
          name="google-site-verification"
          content="vlzDVPRDmQPcycgM2kxNfnsjt5eA2wGV40ksGd7LRRI"
        />
        <link rel="manifest" href={`${basePath}/manifest.json`} />
        <link
          rel="apple-touch-icon"
          href={`${basePath}/icons/apple-touch-icon.png`}
        />
        <meta name="theme-color" content="#0046AB" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="default"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Baystars Drill",
              url: siteUrl,
              description:
                "横浜DeNAベイスターズの背番号計算ドリル・スタメン作成・選手名鑑を楽しめるファンサイト",
            }),
          }}
        />
      </head>
      <GoogleAnalytics gaId={gaId} />
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('${basePath}/sw.js');
                });
              }
            `,
          }}
        />
        <Provider>
          <AppBreadcrumb />
          {children}
          <footer className="py-4 px-6 text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              本サイトは個人が運営するファンサイトであり、株式会社横浜DeNAベイスターズとは一切関係ありません。
            </p>
          </footer>
        </Provider>
      </body>
    </html>
  );
}
