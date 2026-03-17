"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheerSongType } from "@/types/CheerSong";
import { replaceNamePlaceholder } from "@/lib/rubyParser";
import LyricLine from "./LyricLine";

type CheerSongCardProps = {
  song: CheerSongType;
  showRuby: boolean;
  selectedPlayerName?: string;
};

const categoryLabel: Record<string, string> = {
  right_pitcher: "右投手共通",
  left_pitcher: "左投手共通",
  foreign_pitcher: "外国人投手共通",
  individual_batter: "野手個人",
  pinch_hitter: "代打",
  catcher: "捕手",
  right_batter: "右打者共通",
  left_batter: "左打者共通",
  manager: "監督",
};

export default function CheerSongCard({
  song,
  showRuby,
  selectedPlayerName,
}: CheerSongCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    selectedPlayerName && song.namePlaceholder ? selectedPlayerName : undefined;

  const lyricsToDisplay = song.lyrics.map((line) =>
    displayName ? replaceNamePlaceholder(line, displayName) : line,
  );

  return (
    <Box
      w="100%"
      borderWidth="1px"
      borderRadius="lg"
      borderColor="border.card"
      bg="surface.card"
      overflow="hidden"
    >
      <Box
        p={4}
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        _hover={{ bg: "surface.card.subtle" }}
        transition="background 0.2s"
      >
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading size="md">
              {song.playerNumber && (
                <Text as="span" color="interactive.primary" mr={2}>
                  #{song.playerNumber}
                </Text>
              )}
              {song.title}
            </Heading>
          </VStack>
          <HStack gap={2}>
            <Badge colorPalette="blue" variant="subtle">
              {categoryLabel[song.category] || song.category}
            </Badge>
            <Text
              fontSize="xl"
              color="text.secondary"
              transform={isOpen ? "rotate(180deg)" : "rotate(0deg)"}
              transition="transform 0.2s"
            >
              ▼
            </Text>
          </HStack>
        </HStack>
        {song.isCommon && song.applicablePlayers && !isOpen && (
          <HStack mt={2} gap={1} flexWrap="wrap">
            {song.applicablePlayers.map((p) => (
              <Badge key={p.number} variant="outline" size="sm">
                {p.callName}
              </Badge>
            ))}
          </HStack>
        )}
      </Box>

      {isOpen && (
        <Box px={4} pb={4}>
          {song.isCommon && song.applicablePlayers && (
            <HStack mb={3} gap={2} flexWrap="wrap">
              {song.applicablePlayers.map((p) => (
                <Badge
                  key={p.number}
                  variant={
                    selectedPlayerName === p.callName ? "solid" : "outline"
                  }
                  colorPalette={
                    selectedPlayerName === p.callName ? "blue" : "gray"
                  }
                  cursor="pointer"
                  size="sm"
                >
                  #{p.number} {p.callName}
                </Badge>
              ))}
            </HStack>
          )}
          <VStack align="start" gap={0}>
            {lyricsToDisplay.map((line, i) => (
              <LyricLine key={i} line={line} showRuby={showRuby} />
            ))}
          </VStack>
          {song.url && (
            <Link
              href={song.url}
              target="_blank"
              rel="noopener noreferrer"
              mt={3}
              display="inline-flex"
              alignItems="center"
              gap={1}
              color="interactive.primary"
              fontSize="sm"
              _hover={{ textDecoration: "underline" }}
            >
              ▶ 動画を見る
            </Link>
          )}
        </Box>
      )}
    </Box>
  );
}
