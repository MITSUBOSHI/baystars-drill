"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { PlayerType, Role } from "@/types/Player";
import { FiChevronLeft, FiChevronRight, FiLink, FiCheck } from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import UniformBack from "./UniformBack";

type Props = {
  players: PlayerType[];
};

export default function UniformViewer({ players }: Props) {
  const searchParams = useSearchParams();
  const [rosterOnly, setRosterOnly] = useState(false);
  const [numberSelectValue, setNumberSelectValue] = useState("");
  const [copied, setCopied] = useState(false);

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

  useEffect(() => {
    if (currentPlayer) {
      setNumberSelectValue(currentPlayer.number_disp);
    }
  }, [currentPlayer]);

  const handleNumberSelect = useCallback(
    (value: string) => {
      setNumberSelectValue(value);
      const index = filteredPlayers.findIndex(
        (p) => p.number_disp === value,
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    },
    [filteredPlayers],
  );

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

  const handleCopyLink = useCallback(async () => {
    if (!currentPlayer) return;
    const url = `${window.location.origin}${window.location.pathname}?number=${currentPlayer.number_disp}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      console.warn("Clipboard API not available");
    }
  }, [currentPlayer]);

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
      </Flex>

      <Box textAlign="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="text.primary">
          {currentPlayer.name}
        </Text>
        <Flex justify="center" align="center" gap={2}>
          <Flex align="center" gap={1}>
            <Text fontSize="sm" color="text.secondary">
              No.
            </Text>
            <input
              list="player-numbers"
              value={numberSelectValue}
              onChange={(e) => handleNumberSelect(e.target.value)}
              onFocus={() => setNumberSelectValue("")}
              onClick={() => setNumberSelectValue("")}
              onBlur={() =>
                setNumberSelectValue(currentPlayer.number_disp)
              }
              aria-label="背番号を選択"
              style={{
                width: "48px",
                fontSize: "14px",
                padding: "1px 4px",
                border:
                  "1px solid var(--chakra-colors-border-card, #ccc)",
                borderRadius: "4px",
                background:
                  "var(--chakra-colors-surface-card-subtle, white)",
                color: "var(--chakra-colors-text-primary, #000)",
                textAlign: "center",
              }}
            />
            <datalist id="player-numbers">
              {filteredPlayers.map((p) => (
                <option key={p.number_disp} value={p.number_disp} />
              ))}
            </datalist>
            <Text fontSize="sm" color="text.secondary">
              / {currentPlayer.name_kana}
            </Text>
          </Flex>
          <button
            onClick={handleCopyLink}
            aria-label="URLをコピー"
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {copied ? (
              <FiCheck size={16} color="#28a745" />
            ) : (
              <FiLink size={16} color="#004B98" style={{ opacity: 0.6 }} />
            )}
          </button>
        </Flex>
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
