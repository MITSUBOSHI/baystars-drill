import type { Metadata } from "next";
import Provider from "./provider";

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
        <meta name="google-site-verification" content="vlzDVPRDmQPcycgM2kxNfnsjt5eA2wGV40ksGd7LRRI" />
      </head>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
