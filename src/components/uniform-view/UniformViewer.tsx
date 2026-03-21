"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Box, Text, Flex, IconButton } from "@chakra-ui/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { sendGAEvent } from "@next/third-parties/google";
import { PlayerType, Role } from "@/types/Player";
import {
  FiChevronLeft,
  FiChevronRight,
  FiLink,
  FiCheck,
  FiMusic,
  FiExternalLink,
} from "react-icons/fi";
import { Switch } from "@/components/ui/switch";
import { useFurigana } from "@/contexts/FuriganaContext";
import Ruby from "@/components/common/Ruby";
import UniformBack from "./UniformBack";

type Props = {
  players: PlayerType[];
  year: number;
  cheerSongNumbers?: Set<string>;
};

export default function UniformViewer({ players, year, cheerSongNumbers }: Props) {
  const { furigana } = useFurigana();
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

  const numberParam = searchParams.get("number");
  const appliedNumberParam = useRef<string | null>(null);
  useEffect(() => {
    if (!numberParam || numberParam === appliedNumberParam.current) return;
    appliedNumberParam.current = numberParam;
    if (filteredPlayers.length > 0) {
      const index = filteredPlayers.findIndex(
        (p) => p.number_disp === numberParam,
      );
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [numberParam, filteredPlayers]);

  const currentPlayer = filteredPlayers[currentIndex];

  useEffect(() => {
    if (currentPlayer) {
      setNumberSelectValue(currentPlayer.number_disp);
    }
  }, [currentPlayer]);

  const handleNumberSelect = useCallback(
    (value: string) => {
      setNumberSelectValue(value);
      const index = filteredPlayers.findIndex((p) => p.number_disp === value);
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
      sendGAEvent("event", "uniform_copy_link", {
        player_number: currentPlayer.number_disp,
      });
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
          {furigana ? (
            <Ruby reading={currentPlayer.name_kana}>{currentPlayer.name}</Ruby>
          ) : (
            currentPlayer.name
          )}
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
              onBlur={() => setNumberSelectValue(currentPlayer.number_disp)}
              aria-label="背番号を選択"
              style={{
                width: "48px",
                fontSize: "14px",
                padding: "1px 4px",
                border: "1px solid var(--chakra-colors-border-card, #ccc)",
                borderRadius: "4px",
                background: "var(--chakra-colors-surface-card-subtle, white)",
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
          {cheerSongNumbers?.has(currentPlayer.number_disp) && (
            <Link
              href={`/cheer-songs/${year}?number=${currentPlayer.number_disp}`}
              title="応援歌を見る"
            >
              <IconButton
                aria-label={`${currentPlayer.name}の応援歌を見る`}
                size="xs"
                variant="ghost"
                color="interactive.primary"
              >
                <FiMusic />
              </IconButton>
            </Link>
          )}
          {currentPlayer.url && (
            <a
              href={currentPlayer.url}
              target="_blank"
              rel="noopener noreferrer"
              title="NPB選手ページ"
            >
              <IconButton
                aria-label={`${currentPlayer.name}のNPBページを開く`}
                size="xs"
                variant="ghost"
                color="interactive.primary"
                asChild
              >
                <span>
                  <FiExternalLink />
                </span>
              </IconButton>
            </a>
          )}
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
          pl={2}
          onClick={handlePrev}
          aria-label="前の選手"
          role="button"
          _hover={{ "& > .nav-arrow": { opacity: 1, bg: "blackAlpha.200" } }}
          transition="background 0.15s"
          borderRadius="md"
        >
          <Box
            className="nav-arrow"
            bg="blackAlpha.100"
            borderRadius="full"
            p={1}
            opacity={0.7}
            transition="all 0.2s"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiChevronLeft size={32} color="#004B98" />
          </Box>
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
          pr={2}
          onClick={handleNext}
          aria-label="次の選手"
          role="button"
          _hover={{ "& > .nav-arrow": { opacity: 1, bg: "blackAlpha.200" } }}
          transition="background 0.15s"
          borderRadius="md"
        >
          <Box
            className="nav-arrow"
            bg="blackAlpha.100"
            borderRadius="full"
            p={1}
            opacity={0.7}
            transition="all 0.2s"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiChevronRight size={32} color="#004B98" />
          </Box>
        </Flex>
      </Box>

      <Text textAlign="center" mt={4} fontSize="sm" color="text.secondary">
        {currentIndex + 1} / {filteredPlayers.length}
      </Text>
    </Box>
  );
}
