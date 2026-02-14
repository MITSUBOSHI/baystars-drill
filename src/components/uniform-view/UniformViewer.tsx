"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { PlayerType, Role } from "@/types/Player";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import UniformBack from "./UniformBack";

type Props = {
  players: PlayerType[];
};

export default function UniformViewer({ players }: Props) {
  const searchParams = useSearchParams();
  const [rosterOnly, setRosterOnly] = useState(false);
  const [numberInput, setNumberInput] = useState("");

  const filteredPlayers = useMemo(
    () =>
      players
        .filter((p) => !rosterOnly || p.role === Role.Roster)
        .sort((a, b) => a.number_calc - b.number_calc),
    [players, rosterOnly],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
  }, [rosterOnly]);

  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const numberParam = searchParams.get("number");
    if (numberParam && filteredPlayers.length > 0) {
      const index = filteredPlayers.findIndex(
        (p) => p.number_disp === numberParam,
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [searchParams, filteredPlayers]);

  const currentPlayer = filteredPlayers[currentIndex];

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev > 0 ? prev - 1 : filteredPlayers.length - 1,
    );
  }, [filteredPlayers.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev < filteredPlayers.length - 1 ? prev + 1 : 0,
    );
  }, [filteredPlayers.length]);

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

  const handleNumberJump = useCallback(() => {
    const trimmed = numberInput.trim();
    if (!trimmed) return;
    const index = filteredPlayers.findIndex(
      (p) => p.number_disp === trimmed,
    );
    if (index !== -1) {
      setCurrentIndex(index);
    }
    setNumberInput("");
  }, [numberInput, filteredPlayers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext]);

  if (filteredPlayers.length === 0) {
    return <Text color="text.secondary">選手データがありません</Text>;
  }

  return (
    <Box w="100%" maxW="400px" mx="auto" userSelect="none">
      <Flex justify="center" align="center" gap={4} mb={4}>
        <Switch
          checked={rosterOnly}
          onCheckedChange={(e) => setRosterOnly(e.checked)}
          size="sm"
        >
          支配下のみ
        </Switch>
        <input
          type="text"
          inputMode="numeric"
          value={numberInput}
          onChange={(e) => setNumberInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleNumberJump();
          }}
          placeholder="No."
          aria-label="背番号で検索"
          style={{
            width: "56px",
            fontSize: "12px",
            padding: "2px 6px",
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}
        />
      </Flex>

      <Box textAlign="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="text.primary">
          {currentPlayer.name}
        </Text>
        <Text fontSize="sm" color="text.secondary">
          No.{currentPlayer.number_disp} / {currentPlayer.name_kana}
        </Text>
      </Box>

      {/* ユニフォーム + 左右タップ領域 */}
      <Box position="relative" cursor="pointer">
        <UniformBack
          uniformName={currentPlayer.uniform_name}
          numberDisp={currentPlayer.number_disp}
        />

        {/* 左半分タップ領域 */}
        <Flex
          position="absolute"
          top="0"
          left="0"
          w="50%"
          h="100%"
          align="center"
          justify="flex-start"
          pl={1}
          onClick={handlePrev}
          aria-label="前の選手"
          role="button"
          _hover={{ bg: "blackAlpha.50" }}
          transition="background 0.15s"
          borderRadius="md"
        >
          <FiChevronLeft size={28} color="#004B98" opacity={0.5} />
        </Flex>

        {/* 右半分タップ領域 */}
        <Flex
          position="absolute"
          top="0"
          right="0"
          w="50%"
          h="100%"
          align="center"
          justify="flex-end"
          pr={1}
          onClick={handleNext}
          aria-label="次の選手"
          role="button"
          _hover={{ bg: "blackAlpha.50" }}
          transition="background 0.15s"
          borderRadius="md"
        >
          <FiChevronRight size={28} color="#004B98" opacity={0.5} />
        </Flex>
      </Box>

      <Text textAlign="center" mt={4} fontSize="sm" color="text.secondary">
        {currentIndex + 1} / {filteredPlayers.length}
      </Text>
    </Box>
  );
}
