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
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

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
};

export default function PlayerTable({ players }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const [sortColumn, setSortColumn] = useState<string>("number_disp");
  const sortedPlayers = sortPlayers(players, sortOrder, sortColumn);

  const SortIcon = ({ column }: { column: string }) => {
    if (sortColumn !== column) return FaSort;
    if (sortOrder === "asc") return FaSortUp;
    if (sortOrder === "desc") return FaSortDown;
    return FaSort;
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
            <Table.ColumnHeader width={{ base: "20%", md: "15%" }}>
              <HStack gap={2}>
                <Box>背番号</Box>
                <IconButton
                  aria-label="Sort by number"
                  onClick={() => {
                    setSortColumn("number_disp");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={SortIcon({ column: "number_disp" })} />
                </IconButton>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader width={{ base: "60%", md: "65%" }}>
              名前
            </Table.ColumnHeader>
            <Table.ColumnHeader width={{ base: "20%", md: "20%" }}>
              <HStack gap={2}>
                <Box>生年月日</Box>
                <IconButton
                  aria-label="Sort by date of birth"
                  onClick={() => {
                    setSortColumn("date_of_birth");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={SortIcon({ column: "date_of_birth" })} />
                </IconButton>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader width={{ base: "20%", md: "10%" }}>
              <HStack gap={2}>
                <Box>身長</Box>
                <IconButton
                  aria-label="Sort by height"
                  onClick={() => {
                    setSortColumn("height_cm");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={SortIcon({ column: "height_cm" })} />
                </IconButton>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader width={{ base: "20%", md: "10%" }}>
              <HStack gap={2}>
                <Box>体重</Box>
                <IconButton
                  aria-label="Sort by weight"
                  onClick={() => {
                    setSortColumn("weight_kg");
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                  }}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={SortIcon({ column: "weight_kg" })} />
                </IconButton>
              </HStack>
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
                  _hover={{ textDecoration: "none" }}
                >
                  <Box
                    _hover={{
                      bg: "gray.100",
                      transition: "background-color 0.2s",
                    }}
                    p={2}
                    rounded="md"
                  >
                    {player.name} ({player.name_kana})
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
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
