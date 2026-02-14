"use client";

import { Box, Flex, HStack, Text, Link as ChakraLink } from "@chakra-ui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

type BreadcrumbItemType = {
  label: string;
  href: string;
  isCurrentPage: boolean;
};

const pathMap: Record<string, string> = {
  "player-directory": "選手名鑑",
  "number-drill": "背番号計算ドリル",
  "lineup-maker": "スタメン作成",
  "uniform-view": "ユニフォームビュー",
  "uniform-number": "背番号",
  drill: "計算ドリル",
  gallery: "選手名鑑",
  lineup: "スタメン作成",
};

export default function AppBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbItems = useMemo(() => {
    const pathSegments = pathname.split("/").filter(Boolean);

    const items: BreadcrumbItemType[] = [
      { label: "Top", href: "/", isCurrentPage: pathname === "/" },
    ];

    let currentPath = "";
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      const isLast = i === pathSegments.length - 1;

      const label = pathMap[pathSegments[i]] || pathSegments[i];

      items.push({
        label,
        href: currentPath,
        isCurrentPage: isLast,
      });
    }

    return items;
  }, [pathname]);

  if (breadcrumbItems.length === 1) {
    return null;
  }

  return (
    <nav aria-label="パンくずリスト">
      <Flex w="100%" maxW="1200px" mx="auto" mb={4} px={4} pt={4}>
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
                  {item.label}
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
                  {item.label}
                </ChakraLink>
              )}
            </Box>
          ))}
        </HStack>
      </Flex>
    </nav>
  );
}
