import { NameByRole, registeredYears } from "@/constants/player";
import Players2020 from "@/data/2020-players.jsonl.json";
import Players2021 from "@/data/2021-players.jsonl.json";
import Players2022 from "@/data/2022-players.jsonl.json";
import Players2023 from "@/data/2023-players.jsonl.json";
import Players2024 from "@/data/2024-players.jsonl.json";
import { PlayerType, Year } from "@/types/Player";
import {
  Button,
  Link as ChakraLink,
  Heading,
  HStack,
  Table,
  VStack,
} from "@chakra-ui/react";
import Link from "next/link";

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
  }
}

export async function generateStaticParams() {
  return registeredYears.map((y) => ({ year: y.toString() }));
}

export default async function Page({ params }: { params: Promise<{ year: Year }> }) {
  const { year } = await params;
  const currentYear = Number(year) as Year; // TODO: path paramsがデフォstring。type castの設定は要確認。
  const players = playersByYear(currentYear);

  return (
    <VStack justify={"center"}>
      <Heading size="4xl">📖 選手名鑑 📖</Heading>
      <Heading size="2xl"> Year {currentYear} </Heading>
      <HStack>
        {registeredYears.map((year) => (
          <Link key={year} href={`/uniform-number/gallery/${year}`}>
            <Button as="span" size="sm" variant="ghost" colorPalette={"blue"}>
              {year}
            </Button>
          </Link>
        ))}
      </HStack>
      <Table.ScrollArea borderWidth="1px" rounded="md" height={900}>
        <Table.Root maxWidth="100%" striped stickyHeader>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>背番号</Table.ColumnHeader>
              <Table.ColumnHeader>名前</Table.ColumnHeader>
              <Table.ColumnHeader>ロール</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {players.map((player, i) => (
              <Table.Row key={i}>
                <Table.Cell>{player.number_disp}</Table.Cell>
                <Table.Cell>
                  <ChakraLink
                    href={player.url}
                    variant={"underline"}
                    colorPalette={"blue"}
                  >
                    {player.name}（{player.name_kana}）
                  </ChakraLink>
                </Table.Cell>
                <Table.Cell>{NameByRole[player.role]}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>
    </VStack>
  );
}
