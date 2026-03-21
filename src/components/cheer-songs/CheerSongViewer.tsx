"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { CheerSongType } from "@/types/CheerSong";
import { useFurigana } from "@/contexts/FuriganaContext";
import CheerSongCard from "./CheerSongCard";

type CategoryTab =
  | "pitcher"
  | "individual"
  | "other"
  | "manager"
  | "chance"
  | "anthem";

const tabs: { key: CategoryTab; label: string }[] = [
  { key: "pitcher", label: "投手共通" },
  { key: "individual", label: "野手個人" },
  { key: "other", label: "その他共通" },
  { key: "manager", label: "監督" },
  { key: "chance", label: "チャンステーマ" },
  { key: "anthem", label: "球団歌" },
];

const categoryToTab: Record<string, CategoryTab> = {
  right_pitcher: "pitcher",
  left_pitcher: "pitcher",
  foreign_pitcher: "pitcher",
  individual_batter: "individual",
  pinch_hitter: "other",
  catcher: "other",
  right_batter: "other",
  left_batter: "other",
  manager: "manager",
  chance: "chance",
  anthem: "anthem",
};

function filterByTab(songs: CheerSongType[], tab: CategoryTab) {
  switch (tab) {
    case "pitcher":
      return songs.filter((s) =>
        ["right_pitcher", "left_pitcher", "foreign_pitcher"].includes(
          s.category,
        ),
      );
    case "individual":
      return songs.filter((s) => s.category === "individual_batter");
    case "other":
      return songs.filter((s) =>
        ["pinch_hitter", "catcher", "right_batter", "left_batter"].includes(
          s.category,
        ),
      );
    case "manager":
      return songs.filter((s) => s.category === "manager");
    case "chance":
      return songs.filter((s) => s.category === "chance");
    case "anthem":
      return songs.filter((s) => s.category === "anthem");
  }
}

type CheerSongViewerProps = {
  songs: CheerSongType[];
  year: number;
};

export default function CheerSongViewer({ songs, year }: CheerSongViewerProps) {
  const { furigana: showRuby } = useFurigana();
  const searchParams = useSearchParams();
  const numberParam = searchParams.get("number");

  // number パラメータに該当する曲を検索
  const targetSong = numberParam
    ? songs.find(
        (s) =>
          s.playerNumber === numberParam ||
          s.applicablePlayers?.some((p) => p.number === numberParam),
      )
    : null;

  const initialTab = targetSong
    ? categoryToTab[targetSong.category] ?? "pitcher"
    : "pitcher";

  const [activeTab, setActiveTab] = useState<CategoryTab>(initialTab);

  // number パラメータの曲にスクロール
  useEffect(() => {
    if (!targetSong) return;
    const elementId = `song-${targetSong.id}`;
    // レンダリング後にスクロール
    const timer = setTimeout(() => {
      const el = document.getElementById(elementId);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
    return () => clearTimeout(timer);
  }, [targetSong]);

  const filteredSongs = filterByTab(songs, activeTab);

  return (
    <VStack gap={4} w="100%">
      <Box
        position="sticky"
        top={0}
        zIndex={5}
        bg="surface.card"
        w="100%"
        py={3}
        borderBottomWidth="1px"
        borderColor="border.card"
      >
        <VStack gap={3} w="100%">
          <Box
            w="100%"
            overflowX="auto"
            css={{
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <HStack gap={2} minW="max-content" role="tablist" aria-label="応援歌カテゴリ">
              {tabs.map((tab) => (
                <Box
                  key={tab.key}
                  as="button"
                  role="tab"
                  id={`tab-${tab.key}`}
                  aria-selected={activeTab === tab.key}
                  aria-controls={`tabpanel-${tab.key}`}
                  px={4}
                  py={3}
                  borderRadius="md"
                  fontWeight={activeTab === tab.key ? "bold" : "normal"}
                  bg={
                    activeTab === tab.key
                      ? "interactive.primary"
                      : "transparent"
                  }
                  color={activeTab === tab.key ? "white" : "text.secondary"}
                  borderWidth="1px"
                  borderColor={
                    activeTab === tab.key ? "border.brand" : "border.card"
                  }
                  cursor="pointer"
                  transition="all 0.2s"
                  whiteSpace="nowrap"
                  _hover={{
                    borderColor: "interactive.primary",
                  }}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <Text fontSize="sm">{tab.label}</Text>
                </Box>
              ))}
            </HStack>
          </Box>
        </VStack>
      </Box>

      <VStack
        gap={4}
        w="100%"
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {filteredSongs.map((song) => (
          <CheerSongCard
            key={song.id}
            id={`song-${song.id}`}
            song={song}
            showRuby={showRuby}
            defaultOpen={targetSong?.id === song.id}
            year={year}
          />
        ))}
      </VStack>
    </VStack>
  );
}
