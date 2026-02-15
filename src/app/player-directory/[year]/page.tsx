import type { Metadata } from "next";
import { registeredYears } from "@/constants/player";
import { playersByYear } from "@/lib/players";
import { Year } from "@/types/Player";
import { Heading, VStack, Box } from "@chakra-ui/react";
import PlayerTable from "@/components/player-table/PlayerTable";
import YearSelector from "@/components/common/YearSelector";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: Year }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `${year}年 選手名鑑`,
    description: `横浜DeNAベイスターズ${year}年の選手一覧・背番号名鑑`,
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

  return (
    <VStack justify={"center"} w="100%" gap={6} py={4}>
      <Heading size="4xl">選手名鑑</Heading>
      <YearSelector
        currentYear={currentYear}
        baseUrl="/player-directory"
      />
      <Box w="100%" maxW={{ base: "100%", md: "800px" }} px={4}>
        <PlayerTable players={players} />
      </Box>
    </VStack>
  );
}
