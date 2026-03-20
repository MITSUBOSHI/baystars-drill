"use client";

import { useState } from "react";
import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";
import { CheerSongType } from "@/types/CheerSong";
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
};

export default function CheerSongViewer({ songs }: CheerSongViewerProps) {
  const [showRuby, setShowRuby] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryTab>("pitcher");

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
            <HStack gap={2} minW="max-content">
              {tabs.map((tab) => (
                <Box
                  key={tab.key}
                  as="button"
                  px={4}
                  py={3}
                  borderRadius="md"
                  fontWeight={activeTab === tab.key ? "bold" : "normal"}
                  bg={activeTab === tab.key ? "surface.brand" : "transparent"}
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

          <HStack justify="flex-end" w="100%">
            <Switch
              checked={showRuby}
              onCheckedChange={(e) => setShowRuby(e.checked)}
              colorPalette="blue"
            >
              ふりがなをつける
            </Switch>
          </HStack>
        </VStack>
      </Box>

      <VStack gap={4} w="100%">
        {filteredSongs.map((song) => (
          <CheerSongCard key={song.id} song={song} showRuby={showRuby} />
        ))}
      </VStack>
    </VStack>
  );
}
