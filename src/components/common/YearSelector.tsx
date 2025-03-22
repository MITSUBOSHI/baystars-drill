"use client";

import { registeredYears } from "@/constants/player";
import { Text, Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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

  // 降順でソートした年のリスト
  const sortedYears = useMemo(() => {
    return [...registeredYears].sort((a, b) => b - a);
  }, []);

  // ドロップダウンの開閉を切り替える
  const toggleDropdown = () => setIsOpen(!isOpen);

  // 年を選択したときの処理
  const handleYearChange = (year: number) => {
    if (year !== currentYear) {
      router.push(`${baseUrl}/${year}`);
    }
    setIsOpen(false);
  };

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
    <Box position="relative" {...containerStyle}>
      {!isInline && (
        <Text fontSize="sm" mb={2} fontWeight="500">
          {label}
        </Text>
      )}

      {/* 選択ボタン */}
      <Button
        w="100%"
        onClick={toggleDropdown}
        colorScheme="blue"
        variant="outline"
        justifyContent="space-between"
        alignItems="center"
        bg="blue.50"
        borderColor="blue.200"
        _hover={{ bg: "blue.100" }}
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
          bgColor="white"
          borderWidth="1px"
          borderColor="blue.200"
          borderRadius="md"
          boxShadow="md"
          zIndex={10}
        >
          {sortedYears.map((year) => (
            <Box
              key={year}
              p={isInline ? 2 : 3}
              cursor="pointer"
              bg={year === currentYear ? "blue.100" : "white"}
              fontWeight={year === currentYear ? "bold" : "normal"}
              _hover={{ bg: "blue.50" }}
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
