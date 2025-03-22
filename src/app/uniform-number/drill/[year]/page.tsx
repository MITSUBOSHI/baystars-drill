import { registeredYears } from "@/constants/player";
import Players2020 from "@/data/2020-players.jsonl.json";
import Players2021 from "@/data/2021-players.jsonl.json";
import Players2022 from "@/data/2022-players.jsonl.json";
import Players2023 from "@/data/2023-players.jsonl.json";
import Players2024 from "@/data/2024-players.jsonl.json";
import Players2025 from "@/data/2025-players.jsonl.json";
import { PlayerType, Year } from "@/types/Player";
import { Heading, VStack, Box, Flex } from "@chakra-ui/react";
import Question from "@/components/number-uniform/Question";
import YearSelector from "@/components/common/YearSelector";

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
      <Heading size="4xl">🖋 計算ドリル 🖋</Heading>
      <Flex align="center" justify="center">
        <Heading size="2xl" display="inline">
          Year
        </Heading>
        <YearSelector
          currentYear={currentYear}
          baseUrl="/uniform-number/drill"
          label={""}
          isInline={true}
        />
      </Flex>
      <Box w="100%" maxW={{ base: "100%", md: "800px" }} px={4}>
        <Question players={players} />
      </Box>
    </VStack>
  );
}
