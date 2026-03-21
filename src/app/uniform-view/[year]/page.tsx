import { Suspense } from "react";
import type { Metadata } from "next";
import { registeredYears } from "@/constants/player";
import { playersByYear } from "@/lib/players";
import { cheerSongsByYear } from "@/lib/cheerSongs";
import { Year } from "@/types/Player";
import { VStack, Box } from "@chakra-ui/react";
import UniformViewer from "@/components/uniform-view/UniformViewer";
import YearSelector from "@/components/common/YearSelector";
import PageTitle from "@/components/common/PageTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: Year }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `${year}年 ユニフォームビュー`,
    description: `横浜DeNAベイスターズ${year}年のユニフォーム背面を再現。選手のユニフォーム名と背番号を表示。`,
  };
}

export async function generateStaticParams() {
  return registeredYears.map((y) => ({ year: y.toString() }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ year: Year }>;
}) {
  const { year } = await params;
  const currentYear = Number(year) as Year;
  const players = playersByYear(currentYear);
  const songs = cheerSongsByYear(currentYear);
  const cheerSongNumbers = new Set<string>();
  for (const song of songs) {
    if (song.playerNumber) cheerSongNumbers.add(song.playerNumber);
    if (song.applicablePlayers) {
      for (const p of song.applicablePlayers) cheerSongNumbers.add(p.number);
    }
  }

  return (
    <VStack justify={"center"} w="100%" gap={6} py={4}>
      <PageTitle title="ユニフォームビュー" reading="ゆにふぉーむびゅー" />
      <YearSelector currentYear={currentYear} baseUrl="/uniform-view" />
      <Box w="100%" maxW={{ base: "100%", md: "500px" }} px={4}>
        <Suspense>
          <UniformViewer
            players={players}
            year={currentYear}
            cheerSongNumbers={cheerSongNumbers}
          />
        </Suspense>
      </Box>
    </VStack>
  );
}
