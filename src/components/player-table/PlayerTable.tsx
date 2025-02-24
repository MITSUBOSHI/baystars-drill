"use client";

import { NameByRole } from "@/constants/player";
import { PlayerType } from "@/types/Player";
import {
  Table,
  Box,
  HStack,
  IconButton,
  Link as ChakraLink,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

type SortOrder = "asc" | "desc" | null;

function sortPlayers(
  players: PlayerType[],
  sortOrder: SortOrder,
): PlayerType[] {
  if (!sortOrder) return players;

  return [...players].sort((a, b) => {
    const aNum = parseInt(a.number_disp);
    const bNum = parseInt(b.number_disp);
    return sortOrder === "asc" ? aNum - bNum : bNum - aNum;
  });
}

type Props = {
  players: PlayerType[];
};

export default function PlayerTable({ players }: Props) {
  const [sortOrder, setSortOrder] = useState<SortOrder>(null);
  const sortedPlayers = sortPlayers(players, sortOrder);

  const handleSort = () => {
    setSortOrder((current) => {
      if (current === null) return "asc";
      if (current === "asc") return "desc";
      return null;
    });
  };

  const SortIcon = () => {
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
                  onClick={handleSort}
                  size="sm"
                  variant="ghost"
                >
                  <Icon as={SortIcon()} />
                </IconButton>
              </HStack>
            </Table.ColumnHeader>
            <Table.ColumnHeader width={{ base: "60%", md: "65%" }}>
              名前
            </Table.ColumnHeader>
            <Table.ColumnHeader width={{ base: "20%", md: "20%" }}>
              ロール
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sortedPlayers.map((player, i) => (
            <Table.Row key={i}>
              <Table.Cell>{player.number_disp}</Table.Cell>
              <Table.Cell>
                <ChakraLink
                  href={player.url}
                  variant={"underline"}
                  colorPalette={"blue"}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  {player.name}
                  <Box
                    as="span"
                    display={{ base: "block", md: "inline" }}
                    fontSize="sm"
                  >
                    （{player.name_kana}）
                  </Box>
                </ChakraLink>
              </Table.Cell>
              <Table.Cell>{NameByRole[player.role]}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Table.ScrollArea>
  );
}
