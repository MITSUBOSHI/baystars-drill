import { registeredYears } from "@/constants/player";
import Players2020 from "@/data/2020-players.jsonl.json";
import Players2021 from "@/data/2021-players.jsonl.json";
import Players2022 from "@/data/2022-players.jsonl.json";
import Players2023 from "@/data/2023-players.jsonl.json";
import Players2024 from "@/data/2024-players.jsonl.json";
import Players2025 from "@/data/2025-players.jsonl.json";
import { PlayerType, Year } from "@/types/Player";
import {
  Button,
  Heading,
  HStack,
  VStack,
  Box,
} from "@chakra-ui/react";
import Link from "next/link";
import PlayerTable from "@/components/player-table/PlayerTable";

function playersByYear(year: Year): PlayerType[] {
  switch (year) {
    case 2020:
      return Players2020 as PlayerType[];
    case 2021:
      return Players2021 as PlayerType[];
    case 2022:
      return Players2022 as PlayerType[];
    case 2023:
      return Players2023 as PlayerType[];
    case 2024:
      return Players2024 as PlayerType[];
    case 2025:
      return Players2025 as PlayerType[];
  }
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
  const currentYear = Number(year) as Year; // TODO: path paramsがデフォstring。type castの設定は要確認。
  const players = playersByYear(currentYear);

  return (
    <VStack justify={"center"} w="100%" gap={6} py={4}>
      <Heading size="4xl">📖 選手名鑑 📖</Heading>
      <Heading size="2xl"> Year {currentYear} </Heading>
      <HStack gap={2} flexWrap="wrap" justify="center" px={4}>
        {registeredYears.map((year) => (
          <Link key={year} href={`/uniform-number/gallery/${year}`}>
            <Button as="span" size="sm" variant="ghost" colorPalette={"blue"}>
              {year}
            </Button>
          </Link>
        ))}
      </HStack>
      <Box w="100%" maxW={{ base: "100%", md: "800px" }} px={4}>
        <PlayerTable players={players} />
      </Box>
    </VStack>
  );
}
