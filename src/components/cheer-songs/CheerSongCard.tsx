"use client";

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
} from "@chakra-ui/react";
import { useState } from "react";
import { CheerSongType, YouTubeUrl } from "@/types/CheerSong";
import { replaceNamePlaceholder } from "@/lib/rubyParser";
import LyricLine from "./LyricLine";

function extractYouTubeVideoId(url: YouTubeUrl): string | null {
  const longMatch = url.match(/[?&]v=([^&]+)/);
  if (longMatch) return longMatch[1];
  const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
  if (shortMatch) return shortMatch[1];
  return null;
}

type CheerSongCardProps = {
  song: CheerSongType;
  showRuby: boolean;
  selectedPlayerName?: string;
};

const categoryLabel: Record<string, { text: string; kana: string }> = {
  right_pitcher: { text: "右投手共通", kana: "みぎとうしゅきょうつう" },
  left_pitcher: { text: "左投手共通", kana: "ひだりとうしゅきょうつう" },
  foreign_pitcher: {
    text: "外国人投手共通",
    kana: "がいこくじんとうしゅきょうつう",
  },
  individual_batter: { text: "野手個人", kana: "やしゅこじん" },
  pinch_hitter: { text: "代打", kana: "だいだ" },
  catcher: { text: "捕手", kana: "ほしゅ" },
  right_batter: { text: "右打者共通", kana: "みぎだしゃきょうつう" },
  left_batter: { text: "左打者共通", kana: "ひだりだしゃきょうつう" },
  manager: { text: "監督", kana: "かんとく" },
};

export default function CheerSongCard({
  song,
  showRuby,
  selectedPlayerName,
}: CheerSongCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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
              {showRuby && song.playerNameKana ? (
                <>
                  {song.title.split(/\s+/).map((part, i, arr) => {
                    const kanaWords = song.playerNameKana!.split(/\s+/);
                    return (
                      <span key={i}>
                        <ruby>
                          {part}
                          <rt style={{ fontSize: "0.6em", lineHeight: 1 }}>
                            {kanaWords[i] || ""}
                          </rt>
                        </ruby>
                        {i < arr.length - 1 ? " " : ""}
                      </span>
                    );
                  })}
                </>
              ) : (
                song.title
              )}
            </Heading>
          </VStack>
          <HStack gap={2}>
            <Badge colorPalette="blue" variant="subtle">
              {showRuby && categoryLabel[song.category] ? (
                <ruby>
                  {categoryLabel[song.category].text}
                  <rt style={{ fontSize: "0.6em", lineHeight: 1 }}>
                    {categoryLabel[song.category].kana}
                  </rt>
                </ruby>
              ) : (
                categoryLabel[song.category]?.text || song.category
              )}
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
          {song.url && (() => {
            const videoId = extractYouTubeVideoId(song.url);
            if (!videoId) return null;
            return (
              <>
                <Box
                  as="button"
                  mt={3}
                  display="inline-flex"
                  alignItems="center"
                  gap={1}
                  color="interactive.primary"
                  fontSize="sm"
                  cursor="pointer"
                  _hover={{ textDecoration: "underline" }}
                  onClick={() => setShowVideo(!showVideo)}
                >
                  {showVideo ? "▲ 動画を閉じる" : "▶ 動画を見る"}
                </Box>
                {showVideo && (
                  <Box mt={2} position="relative" w="100%" pt="56.25%">
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title={`${song.title} 応援歌`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        borderRadius: "8px",
                      }}
                    />
                  </Box>
                )}
              </>
            );
          })()}
        </Box>
      )}
    </Box>
  );
}
