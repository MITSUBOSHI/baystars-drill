"use client";

import { registeredYears } from "@/constants/player";
import { sendGAEvent } from "@next/third-parties/google";
import { Text, Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState, useRef, useEffect, useCallback } from "react";

interface YearSelectorProps {
  currentYear: number;
  baseUrl: string; // 例: '/uniform-number/lineup'
  label?: string;
  isInline?: boolean; // 横並び表示用のプロパティを追加
}

export default function YearSelector({
  currentYear,
  baseUrl,
  label = "年を選択",
  isInline = false, // デフォルトはfalse
}: YearSelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 降順でソートした年のリスト
  const sortedYears = useMemo(() => {
    return [...registeredYears].sort((a, b) => b - a);
  }, []);

  // ドロップダウンの開閉を切り替える
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 年を選択したときの処理
  const handleYearChange = useCallback(
    (year: number) => {
      if (year !== currentYear) {
        sendGAEvent("event", "year_change", {
          from_year: currentYear,
          to_year: year,
          page: baseUrl,
        });
        router.push(`${baseUrl}/${year}`);
      }
      setIsOpen(false);
    },
    [currentYear, baseUrl, router],
  );

  // ハイライトをリセット
  useEffect(() => {
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
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // キーボードナビゲーション
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsOpen(true);
          return;
        }
        return;
      }

      switch (e.key) {
        case "Escape":
          e.preventDefault();
          setIsOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < sortedYears.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : sortedYears.length - 1,
          );
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < sortedYears.length) {
            handleYearChange(sortedYears[highlightedIndex]);
          }
          break;
      }
    },
    [isOpen, sortedYears, highlightedIndex, handleYearChange],
  );

  // ハイライト中の項目をスクロールに追従
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[role="option"]');
      items[highlightedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  // 横並び表示用のスタイル調整
  const containerStyle = isInline
    ? {
        maxW: "150px",
        display: "inline-block",
        verticalAlign: "middle",
        ml: 3,
      }
    : {
        maxW: "220px",
      };

  // ボタンのスタイル調整
  const buttonStyle = isInline
    ? {
        height: "36px",
        fontSize: "1.2rem",
        px: 3,
      }
    : {
        height: "44px",
        fontSize: "18px",
      };

  return (
    <Box position="relative" ref={containerRef} {...containerStyle}>
      {!isInline && (
        <Text fontSize="sm" mb={2} fontWeight="500">
          {label}
        </Text>
      )}

      {/* 選択ボタン */}
      <Button
        w="100%"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        colorScheme="blue"
        variant="outline"
        justifyContent="space-between"
        alignItems="center"
        bg="surface.brand"
        borderColor="border.brand"
        _hover={{ bg: "interactive.primary.hover", color: "white" }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${label}: ${currentYear}`}
        {...buttonStyle}
      >
        <Text>{currentYear}</Text>
        <Box
          as="span"
          transform={isOpen ? "rotate(180deg)" : "none"}
          transition="transform 0.2s"
          color="blue.600"
          ml={2}
        >
          ▼
        </Box>
      </Button>

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
          borderColor="border.brand"
          borderRadius="md"
          boxShadow="md"
          zIndex={10}
          role="listbox"
          ref={listRef}
          aria-label={label}
        >
          {sortedYears.map((year, index) => (
            <Box
              key={year}
              role="option"
              aria-selected={year === currentYear}
              p={isInline ? 2 : 3}
              cursor="pointer"
              bg={
                index === highlightedIndex
                  ? "surface.brand"
                  : year === currentYear
                    ? "surface.brand"
                    : "surface.card.subtle"
              }
              fontWeight={year === currentYear ? "bold" : "normal"}
              _hover={{ bg: "surface.brand" }}
              onClick={() => handleYearChange(year)}
            >
              <Flex align="center">
                <Text fontSize={isInline ? "sm" : "md"}>{year}</Text>
              </Flex>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
