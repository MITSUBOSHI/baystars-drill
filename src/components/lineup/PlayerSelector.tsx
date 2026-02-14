"use client";

import { PlayerType } from "@/types/Player";
import { Position } from "./LineupCreator";
import { Box, Button, Flex, Text, Badge, Input } from "@chakra-ui/react";
import { useState, useRef, useEffect, useCallback } from "react";

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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Toggle the dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Focus on search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    if (!isOpen) {
      setHighlightedIndex(-1);
    }
  }, [isOpen]);

  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filter players based on search term
  const filteredPlayers = players.filter(
    (player) =>
      player.name.includes(searchTerm) ||
      player.name_kana.includes(searchTerm) ||
      String(player.number_disp).includes(searchTerm),
  );

  // 選手を選択する
  const handleSelectPlayer = useCallback(
    (player: PlayerType) => {
      onSelectPlayer(player);
      setIsOpen(false);
      setSearchTerm("");
    },
    [onSelectPlayer],
  );

  // 選手の選択を解除する
  const handleClearSelection = () => {
    onSelectPlayer(null);
  };

  // キーボードナビゲーション
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm("");
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredPlayers.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredPlayers.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (
            highlightedIndex >= 0 &&
            highlightedIndex < filteredPlayers.length
          ) {
            handleSelectPlayer(filteredPlayers[highlightedIndex]);
          }
          break;
      }
    },
    [isOpen, filteredPlayers, highlightedIndex, handleSelectPlayer],
  );

  // ハイライト中の項目をスクロールに追従
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <Box position="relative" ref={containerRef}>
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
          onKeyDown={handleKeyDown}
          colorScheme="gray"
          variant="outline"
          justifyContent="space-between"
          alignItems="center"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-label={`${position}の選手を選択`}
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
          bgColor="surface.card.subtle"
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
              onKeyDown={handleKeyDown}
              mb={2}
              ref={searchInputRef}
              aria-label="選手を検索"
            />

            <Box role="listbox" ref={listRef} aria-label={`${position}の選手`}>
              {filteredPlayers.length > 0 ? (
                filteredPlayers.map((player, index) => (
                  <Box
                    key={`${player.year}-${player.number_disp}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    p={2}
                    cursor="pointer"
                    bg={
                      index === highlightedIndex
                        ? "surface.brand"
                        : "transparent"
                    }
                    _hover={{ bg: "surface.brand" }}
                    onClick={() => handleSelectPlayer(player)}
                  >
                    <Flex align="center">
                      <Badge colorScheme="blue" fontSize="sm" mr={2}>
                        {player.number_disp}
                      </Badge>
                      <Text>{getDisplayName(player)}</Text>
                    </Flex>
                  </Box>
                ))
              ) : (
                <Text p={2} color="text.secondary">
                  選手が見つかりません
                </Text>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
