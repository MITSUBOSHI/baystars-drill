import type { Metadata } from "next";
import { registeredYears } from "@/constants/player";
import { playersByYear } from "@/lib/players";
import { Year } from "@/types/Player";
import { Heading, VStack, Box, Flex } from "@chakra-ui/react";
import NumberCounter from "@/components/number-count/NumberCounter";
import YearSelector from "@/components/common/YearSelector";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: Year }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `${year}年 背番号タイマー | Baystars Drill`,
    description: `横浜DeNAベイスターズ${year}年の背番号タイマー。背番号順に選手名を読み上げてカウント。`,
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
      <Heading size="4xl">背番号タイマー</Heading>
      <Flex align="center" justify="center">
        <Heading size="2xl" display="inline">
          Year
        </Heading>
        <YearSelector
          currentYear={currentYear}
          baseUrl="/number-count"
          label={""}
          isInline={true}
        />
      </Flex>
      <Box w="100%" maxW={{ base: "100%", md: "500px" }} px={4}>
        <NumberCounter players={players} />
      </Box>
    </VStack>
  );
}
