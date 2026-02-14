import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Box, Text } from "@chakra-ui/react";
import Provider from "./provider";
import AppBreadcrumb from "@/components/common/Breadcrumb";

const gaId = "G-EW129H86JD";
export const metadata: Metadata = {
  title: "Baystars Drill",
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
  ],
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
          <Box as="footer" py={4} px={6} textAlign="center">
            <Text fontSize="xs" color="gray.500">
              本サイトは個人が運営するファンサイトであり、株式会社横浜DeNAベイスターズとは一切関係ありません。
            </Text>
          </Box>
        </Provider>
      </body>
    </html>
  );
}
