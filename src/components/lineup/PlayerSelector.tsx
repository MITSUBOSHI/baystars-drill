"use client";

import { PlayerType } from "@/types/Player";
import { Position } from "./LineupCreator";
import { Box, Button, Flex, Text, Badge, Input } from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";

type Props = {
  players: PlayerType[];
  onSelectPlayer: (player: PlayerType | null) => void;
  selectedPlayer: PlayerType | null;
  position: Position;
  getDisplayName: (player: PlayerType | null) => string;
};

export default function PlayerSelector({
  players,
  onSelectPlayer,
  selectedPlayer,
  position,
  getDisplayName,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Toggle the dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Focus on search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      // Small timeout to ensure the DOM is ready
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter players based on search term
  const filteredPlayers = players.filter(
    (player) =>
      player.name.includes(searchTerm) ||
      player.name_kana.includes(searchTerm) ||
      String(player.number_disp).includes(searchTerm),
  );

  // 選手を選択する
  const handleSelectPlayer = (player: PlayerType) => {
    onSelectPlayer(player);
    setIsOpen(false);
    setSearchTerm("");
  };

  // 選手の選択を解除する
  const handleClearSelection = () => {
    onSelectPlayer(null);
  };

  return (
    <Box position="relative">
      {/* 選択済みの場合は選手情報を表示 */}
      {selectedPlayer ? (
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Badge colorScheme="blue" fontSize="md" mr={2}>
              {selectedPlayer.number_disp}
            </Badge>
            <Text>{getDisplayName(selectedPlayer)}</Text>
          </Flex>
          <Button size="xs" colorScheme="red" onClick={handleClearSelection}>
            クリア
          </Button>
        </Flex>
      ) : (
        // 未選択の場合はドロップダウンボタンを表示
        <Button
          w="100%"
          onClick={toggleDropdown}
          colorScheme="gray"
          variant="outline"
          justifyContent="space-between"
          alignItems="center"
        >
          <Text>{position}の選手を選択</Text>
          <Box
            as="span"
            transform={isOpen ? "rotate(180deg)" : "none"}
            transition="transform 0.2s"
          >
            ▼
          </Box>
        </Button>
      )}

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <Box
          position="absolute"
          w="100%"
          maxH="300px"
          overflowY="auto"
          mt={2}
          bgColor="white"
          borderWidth="1px"
          borderRadius="md"
          boxShadow="md"
          zIndex={10}
        >
          <Box p={2}>
            <Input
              placeholder="検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              mb={2}
              color="black"
              _dark={{
                color: "black",
              }}
              ref={searchInputRef}
            />

            {filteredPlayers.length > 0 ? (
              filteredPlayers.map((player) => (
                <Box
                  key={`${player.year}-${player.number_disp}`}
                  p={2}
                  cursor="pointer"
                  _hover={{ bg: "gray.100" }}
                  onClick={() => handleSelectPlayer(player)}
                >
                  <Flex align="center">
                    <Badge colorScheme="blue" fontSize="sm" mr={2}>
                      {player.number_disp}
                    </Badge>
                    <Text
                      color="black"
                      _dark={{
                        color: "black",
                      }}
                    >
                      {getDisplayName(player)}
                    </Text>
                  </Flex>
                </Box>
              ))
            ) : (
              <Text p={2} color="gray.500">
                選手が見つかりません
              </Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
