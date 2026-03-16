"use client";

import { useState } from "react";
import { VStack, HStack, Text, Box } from "@chakra-ui/react";
import { Switch } from "@/components/ui/switch";
import { CheerSongType } from "@/types/CheerSong";
import CheerSongCard from "./CheerSongCard";

type CategoryTab = "pitcher" | "individual" | "other" | "manager";

const tabs: { key: CategoryTab; label: string }[] = [
  { key: "pitcher", label: "投手共通" },
  { key: "individual", label: "野手個人" },
  { key: "other", label: "その他共通" },
  { key: "manager", label: "監督" },
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
    <VStack gap={4} w="100%" maxW={{ base: "100%", md: "800px" }} px={4}>
      <HStack justify="space-between" w="100%" flexWrap="wrap" gap={3}>
        <HStack gap={1}>
          {tabs.map((tab) => (
            <Box
              key={tab.key}
              as="button"
              px={4}
              py={2}
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
              _hover={{
                borderColor: "interactive.primary",
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <Text fontSize="sm">{tab.label}</Text>
            </Box>
          ))}
        </HStack>

        <Switch
          checked={showRuby}
          onCheckedChange={(e) => setShowRuby(e.checked)}
          colorPalette="blue"
        >
          ふりがなをつける
        </Switch>
      </HStack>

      <VStack gap={3} w="100%">
        {filteredSongs.map((song) => (
          <CheerSongCard key={song.id} song={song} showRuby={showRuby} />
        ))}
      </VStack>
    </VStack>
  );
}
