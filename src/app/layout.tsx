import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import Provider from "./provider";
import AppBreadcrumb from "@/components/common/Breadcrumb";

const gaId = "G-EW129H86JD";
export const metadata: Metadata = {
  title: "Baystars Drill",
  description: "ベイスターズファンのための暇潰しサイト",
  icons: "/favicon.ico",
  keywords: ["横浜DeNAベイスターズ", "Baystars", "ベイスターズ"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <meta
          name="google-site-verification"
          content="vlzDVPRDmQPcycgM2kxNfnsjt5eA2wGV40ksGd7LRRI"
        />
      </head>
      <GoogleAnalytics gaId={gaId} />
      <body>
        <Provider>
          <AppBreadcrumb />
          {children}
        </Provider>
      </body>
    </html>
  );
}
