import { registeredYears } from "@/constants/player";
import { playersByYear } from "@/lib/players";
import { Year } from "@/types/Player";
import { Heading, VStack, Box, Flex } from "@chakra-ui/react";
import LineupCreator from "@/components/lineup/LineupCreator";
import YearSelector from "@/components/common/YearSelector";

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
      <Heading size="4xl">⚾️ スタメン作成 ⚾️</Heading>
      <Flex align="center" justify="center">
        <Heading size="2xl" display="inline">
          Year
        </Heading>
        <YearSelector
          currentYear={currentYear}
          baseUrl="/uniform-number/lineup"
          label={""}
          isInline={true}
        />
      </Flex>
      <Box w="100%" maxW={{ base: "100%", md: "800px" }} px={4}>
        <LineupCreator players={players} />
      </Box>
    </VStack>
  );
}
