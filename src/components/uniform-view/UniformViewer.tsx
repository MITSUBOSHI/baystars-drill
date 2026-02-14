"use client";

import { useState, useCallback, useEffect } from "react";
import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import { sendGAEvent } from "@next/third-parties/google";
import { PlayerType, Role } from "@/types/Player";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import UniformBack from "./UniformBack";

type Props = {
  players: PlayerType[];
};

function getUniformDisplayName(player: PlayerType): string {
  if (player.uniform_name) return player.uniform_name;
  const familyName = player.name_kana.split(" ")[0] || player.name_kana;
  return familyName;
}

export default function UniformViewer({ players }: Props) {
  const rosterPlayers = players
    .filter((p) => p.role === Role.Roster)
    .sort((a, b) => a.number_calc - b.number_calc);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentPlayer = rosterPlayers[currentIndex];

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : rosterPlayers.length - 1));
  }, [rosterPlayers.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < rosterPlayers.length - 1 ? prev + 1 : 0));
  }, [rosterPlayers.length]);

  const handlePrev = useCallback(() => {
    sendGAEvent("event", "uniform_swipe", {
      direction: "prev",
      player_number: currentPlayer?.number_disp,
    });
    goToPrev();
  }, [goToPrev, currentPlayer]);

  const handleNext = useCallback(() => {
    sendGAEvent("event", "uniform_swipe", {
      direction: "next",
      player_number: currentPlayer?.number_disp,
    });
    goToNext();
  }, [goToNext, currentPlayer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  if (rosterPlayers.length === 0) {
    return <Text color="text.secondary">選手データがありません</Text>;
  }

  const displayName = getUniformDisplayName(currentPlayer);

  return (
    <Box w="100%" maxW="400px" mx="auto" userSelect="none">
      <Box textAlign="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="text.primary">
          {currentPlayer.name}
        </Text>
        <Text fontSize="sm" color="text.secondary">
          No.{currentPlayer.number_disp} / {currentPlayer.name_kana}
        </Text>
      </Box>

      <Flex align="center" justify="center" gap={2}>
        <IconButton
          aria-label="前の選手"
          onClick={handlePrev}
          variant="ghost"
          size="lg"
          color="interactive.primary"
          _hover={{ bg: "surface.brand" }}
        >
          <FiChevronLeft size={28} />
        </IconButton>

        <UniformBack
          uniformName={displayName}
          numberDisp={currentPlayer.number_disp}
        />

        <IconButton
          aria-label="次の選手"
          onClick={handleNext}
          variant="ghost"
          size="lg"
          color="interactive.primary"
          _hover={{ bg: "surface.brand" }}
        >
          <FiChevronRight size={28} />
        </IconButton>
      </Flex>

      <Text textAlign="center" mt={4} fontSize="sm" color="text.secondary">
        {currentIndex + 1} / {rosterPlayers.length}
      </Text>
    </Box>
  );
}
