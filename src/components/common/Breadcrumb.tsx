"use client";

import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, useEffect, useRef } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { useFurigana } from "@/contexts/FuriganaContext";
import Ruby from "@/components/common/Ruby";
import { navItems } from "@/constants/navigation";

type BreadcrumbItemType = {
  label: string;
  reading?: string;
  href: string;
  isCurrentPage: boolean;
};

const pathMap: Record<string, { label: string; reading: string }> = {
  "player-directory": { label: "選手名鑑", reading: "せんしゅめいかん" },
  "number-drill": {
    label: "背番号計算ドリル",
    reading: "せばんごうけいさんどりる",
  },
  "lineup-maker": { label: "スタメン作成", reading: "すためんさくせい" },
  "uniform-view": {
    label: "ユニフォームビュー",
    reading: "ゆにふぉーむびゅー",
  },
  "number-count": { label: "背番号タイマー", reading: "せばんごうたいまー" },
  "cheer-songs": { label: "応援歌", reading: "おうえんか" },
  "uniform-number": { label: "背番号", reading: "せばんごう" },
  drill: { label: "計算ドリル", reading: "けいさんどりる" },
  gallery: { label: "選手名鑑", reading: "せんしゅめいかん" },
  lineup: { label: "スタメン作成", reading: "すためんさくせい" },
};

function BreadcrumbLabel({
  label,
  reading,
}: {
  label: string;
  reading?: string;
}) {
  if (!reading) return <>{label}</>;
  return <Ruby reading={reading}>{label}</Ruby>;
}

export default function AppBreadcrumb() {
  const pathname = usePathname();
  const { furigana, setFurigana } = useFurigana();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // パス変更時にメニューを閉じる
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // メニュー外クリックで閉じる
  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [menuOpen]);

  const breadcrumbItems = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);

    const items: BreadcrumbItemType[] = [
      {
        label: "トップ",
        reading: "とっぷ",
        href: "/",
        isCurrentPage: pathname === "/",
      },
    ];

    let currentPath = "";
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      const isLast = i === pathSegments.length - 1;

      const segment = pathSegments[i];
      const mapped = pathMap[segment];
      const label = mapped
        ? mapped.label
        : /^\d{4}$/.test(segment)
          ? `${segment}年`
          : segment;
      const reading = mapped
        ? mapped.reading
        : /^\d{4}$/.test(segment)
          ? `${segment}ねん`
          : undefined;

      items.push({
        label,
        reading,
        href: currentPath,
        isCurrentPage: isLast,
      });
    }

    return items;
  }, [pathname]);

  return (
    <Box position="relative" ref={menuRef}>
      <Flex
        w="100%"
        maxW="1200px"
        mx="auto"
        mb={4}
        px={4}
        pt={4}
        justify="space-between"
        align="center"
      >
        <HStack gap={2}>
          <Button
            display={{ base: "flex", md: "none" }}
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="メニューを開く"
            aria-expanded={menuOpen}
            p={1}
          >
            {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </Button>

          {breadcrumbItems.length > 1 ? (
            <nav aria-label="パンくずリスト">
              <HStack as="ol" gap="8px" listStyleType="none">
                {breadcrumbItems.map((item, index) => (
                  <Box as="li" key={index} display="flex" alignItems="center">
                    {index > 0 && (
                      <Text mx={2} color="text.secondary" aria-hidden="true">
                        &gt;
                      </Text>
                    )}
                    {item.isCurrentPage ? (
                      <Text
                        fontWeight="bold"
                        color="interactive.primary"
                        aria-current="page"
                      >
                        <BreadcrumbLabel
                          label={item.label}
                          reading={item.reading}
                        />
                      </Text>
                    ) : (
                      <ChakraLink
                        as={Link}
                        href={item.href}
                        color="text.secondary"
                        _hover={{
                          color: "interactive.primary",
                          textDecoration: "underline",
                        }}
                      >
                        <BreadcrumbLabel
                          label={item.label}
                          reading={item.reading}
                        />
                      </ChakraLink>
                    )}
                  </Box>
                ))}
              </HStack>
            </nav>
          ) : (
            <Box />
          )}
        </HStack>

        <Button
          size="xs"
          variant={furigana ? "solid" : "outline"}
          colorPalette="blue"
          onClick={() => setFurigana(!furigana)}
          aria-pressed={furigana}
          aria-label="ふりがなモード切り替え"
          borderRadius="full"
          px={3}
        >
          ふりがな{furigana ? "ON" : "OFF"}
        </Button>
      </Flex>

      {menuOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          position="absolute"
          top="100%"
          left={0}
          right={0}
          zIndex={50}
          bg="surface.card"
          borderBottomWidth="1px"
          borderColor="border.card"
          boxShadow="md"
        >
          <VStack as="nav" aria-label="メニュー" gap={0} align="stretch">
            <ChakraLink
              as={Link}
              href="/"
              display="flex"
              alignItems="center"
              gap={3}
              px={6}
              py={3}
              _hover={{ bg: "surface.card.subtle" }}
              fontWeight={pathname === "/" ? "bold" : "normal"}
              color={pathname === "/" ? "interactive.primary" : "text.primary"}
              textDecoration="none"
            >
              <Text fontSize="lg">🏠</Text>
              <Ruby reading="とっぷ">トップ</Ruby>
            </ChakraLink>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(
                item.href.replace(/\/\d{4}$/, ""),
              );
              return (
                <ChakraLink
                  key={item.href}
                  as={Link}
                  href={item.href}
                  display="flex"
                  alignItems="center"
                  gap={3}
                  px={6}
                  py={3}
                  _hover={{ bg: "surface.card.subtle" }}
                  fontWeight={isActive ? "bold" : "normal"}
                  color={isActive ? "interactive.primary" : "text.primary"}
                  textDecoration="none"
                >
                  <Text fontSize="lg">{item.icon}</Text>
                  <Ruby reading={item.titleReading}>{item.title}</Ruby>
                </ChakraLink>
              );
            })}
          </VStack>
        </Box>
      )}
    </Box>
  );
}
