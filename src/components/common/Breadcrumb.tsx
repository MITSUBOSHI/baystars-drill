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
  "uniform-number": "背番号",
  gallery: "選手名鑑",
  lineup: "スタメン作成",
  "number-uniform": "背番号ドリル",
  players: "選手一覧",
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
    <Flex w="100%" maxW="1200px" mx="auto" mb={4} px={4} pt={4}>
      <HStack gap="8px">
        {breadcrumbItems.map((item, index) => (
          <Box key={index} display="flex" alignItems="center">
            {index > 0 && (
              <Text mx={2} color="gray.500">
                &gt;
              </Text>
            )}
            {item.isCurrentPage ? (
              <Text fontWeight="bold" color="blue.500">
                {item.label}
              </Text>
            ) : (
              <ChakraLink
                as={Link}
                href={item.href}
                color="gray.500"
                _hover={{ color: "blue.400", textDecoration: "underline" }}
              >
                {item.label}
              </ChakraLink>
            )}
          </Box>
        ))}
      </HStack>
    </Flex>
  );
}
