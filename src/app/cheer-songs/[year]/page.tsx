import type { Metadata } from "next";
import { Year } from "@/types/Player";
import { Heading, VStack, Text, Box } from "@chakra-ui/react";
import YearSelector from "@/components/common/YearSelector";
import CheerSongViewer from "@/components/cheer-songs/CheerSongViewer";
import { cheerSongsByYear, cheerSongYears } from "@/lib/cheerSongs";
import { playersByYear } from "@/lib/players";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: Year }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `${year}年 応援歌`,
    description: `横浜DeNAベイスターズ${year}年の応援歌・歌詞一覧`,
  };
}

export async function generateStaticParams() {
  return cheerSongYears.map((y) => ({ year: y.toString() }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ year: Year }>;
}) {
  const { year } = await params;
  const currentYear = Number(year) as Year;
  const players = playersByYear(currentYear);
  const songs = cheerSongsByYear(currentYear).map((song) => {
    if (song.playerNumber) {
      const player = players.find((p) => p.number_disp === song.playerNumber);
      if (player) {
        return { ...song, playerNameKana: player.name_kana };
      }
    }
    return song;
  });

  return (
    <VStack justify={"center"} w="100%" gap={6} py={4}>
      <Heading size="4xl">応援歌</Heading>
      <YearSelector
        currentYear={currentYear}
        baseUrl="/cheer-songs"
        years={cheerSongYears}
      />
      <Box w="100%" maxW={{ base: "100%", md: "800px" }} mx="auto" px={4}>
        {songs.length > 0 ? (
          <CheerSongViewer songs={songs} />
        ) : (
          <Text color="text.secondary" fontSize="lg">
            {currentYear}年の応援歌データはまだありません。
          </Text>
        )}
      </Box>
    </VStack>
  );
}
