"use client";

import { PlayerType } from "@/types/Player";
import {
  Box,
  HStack,
  IconButton,
  Link as ChakraLink,
  Icon,
  Table,
} from "@chakra-ui/react";
import { useState } from "react";
import Link from "next/link";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { FiMusic } from "react-icons/fi";
import { GiClothes } from "react-icons/gi";
import { useFurigana } from "@/contexts/FuriganaContext";
import Ruby from "@/components/common/Ruby";

type SortOrder = "asc" | "desc" | null;

function sortPlayers(
  players: PlayerType[],
  sortOrder: SortOrder,
  sortColumn: string = "number_disp",
): PlayerType[] {
  if (!sortOrder) return players;

  return [...players].sort((a, b) => {
    switch (sortColumn) {
      case "date_of_birth":
        return sortOrder === "asc"
          ? new Date(a.date_of_birth).getTime() -
              new Date(b.date_of_birth).getTime()
          : new Date(b.date_of_birth).getTime() -
              new Date(a.date_of_birth).getTime();
      case "height_cm":
        const aHeight = a.height_cm ?? 0;
        const bHeight = b.height_cm ?? 0;
        return sortOrder === "asc" ? aHeight - bHeight : bHeight - aHeight;
      case "weight_kg":
        const aWeight = a.weight_kg ?? 0;
        const bWeight = b.weight_kg ?? 0;
        return sortOrder === "asc" ? aWeight - bWeight : bWeight - aWeight;
      default:
        const aNum = parseInt(a.number_disp);
        const bNum = parseInt(b.number_disp);
        return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
    }
  });
}

type Props = {
  players: PlayerType[];
  year: number;
  cheerSongNumbers?: Set<string>;
};

export default function PlayerTable({ players, year, cheerSongNumbers }: Props) {
  const { furigana } = useFurigana();
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [sortColumn, setSortColumn] = useState<string>("number_disp");
  const sortedPlayers = sortPlayers(players, sortOrder, sortColumn);

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return FaSort;
    if (sortOrder === "asc") return FaSortUp;
    if (sortOrder === "desc") return FaSortDown;
    return FaSort;
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const getAriaSort = (column: string): "ascending" | "descending" | "none" => {
    if (sortColumn !== column || !sortOrder) return "none";
    return sortOrder === "asc" ? "ascending" : "descending";
  };

  return (
    <Table.ScrollArea
      borderWidth="1px"
      rounded="md"
      height={{ base: 600, md: 900 }}
    >
      <Table.Root striped stickyHeader>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader
              width={{ base: "20%", md: "15%" }}
              aria-sort={getAriaSort("number_disp")}
            >
              <HStack gap={2}>
                <Box>
                  <Ruby reading="せばんごう">背番号</Ruby>
                </Box>
                <IconButton
                  aria-label="背番号でソート"
                  onClick={() => handleSort("number_disp")}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={getSortIcon("number_disp")} />
                </IconButton>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader width={{ base: "60%", md: "65%" }}>
              <Ruby reading="なまえ">名前</Ruby>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              width={{ base: "20%", md: "20%" }}
              aria-sort={getAriaSort("date_of_birth")}
            >
              <HStack gap={2}>
                <Box>
                  <Ruby reading="せいねんがっぴ">生年月日</Ruby>
                </Box>
                <IconButton
                  aria-label="生年月日でソート"
                  onClick={() => handleSort("date_of_birth")}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={getSortIcon("date_of_birth")} />
                </IconButton>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              width={{ base: "20%", md: "10%" }}
              aria-sort={getAriaSort("height_cm")}
            >
              <HStack gap={2}>
                <Box>
                  <Ruby reading="しんちょう">身長</Ruby>
                </Box>
                <IconButton
                  aria-label="身長でソート"
                  onClick={() => handleSort("height_cm")}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={getSortIcon("height_cm")} />
                </IconButton>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader
              width={{ base: "20%", md: "10%" }}
              aria-sort={getAriaSort("weight_kg")}
            >
              <HStack gap={2}>
                <Box>
                  <Ruby reading="たいじゅう">体重</Ruby>
                </Box>
                <IconButton
                  aria-label="体重でソート"
                  onClick={() => handleSort("weight_kg")}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={getSortIcon("weight_kg")} />
                </IconButton>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader width={{ base: "10%", md: "8%" }}>
              リンク
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedPlayers.map((player) => (
            <Table.Row key={player.number_disp}>
              <Table.Cell>{player.number_disp}</Table.Cell>
              <Table.Cell>
                <ChakraLink
                  href={player.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  _hover={{ textDecoration: "none" }}
                >
                  <Box
                    _hover={{
                      bg: "surface.brand",
                      transition: "background-color 0.2s",
                    }}
                    p={2}
                    rounded="md"
                  >
                    {furigana ? (
                      <Ruby reading={player.name_kana}>{player.name}</Ruby>
                    ) : (
                      <>
                        {player.name} ({player.name_kana})
                      </>
                    )}
                  </Box>
                </ChakraLink>
              </Table.Cell>
              <Table.Cell>{player.date_of_birth}</Table.Cell>
              <Table.Cell>
                {player.height_cm ? `${player.height_cm}cm` : "-"}
              </Table.Cell>
              <Table.Cell>
                {player.weight_kg ? `${player.weight_kg}kg` : "-"}
              </Table.Cell>
              <Table.Cell>
                <HStack gap={1}>
                  <Link
                    href={`/uniform-view/${year}?number=${player.number_disp}`}
                    title="ユニフォームを見る"
                  >
                    <IconButton
                      aria-label={`${player.name}のユニフォームを見る`}
                      size="xs"
                      variant="ghost"
                      color="interactive.primary"
                    >
                      <GiClothes />
                    </IconButton>
                  </Link>
                  {cheerSongNumbers?.has(player.number_disp) && (
                    <Link href={`/cheer-songs/${year}?number=${player.number_disp}`} title="応援歌を見る">
                      <IconButton
                        aria-label={`応援歌を見る`}
                        size="xs"
                        variant="ghost"
                        color="interactive.primary"
                      >
                        <FiMusic />
                      </IconButton>
                    </Link>
                  )}
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
