import Link from "next/link";
import {
  Heading,
  VStack,
  Image,
  Box,
  Text,
  SimpleGrid,
} from "@chakra-ui/react";
import Logo from "./baystars_drill.png";
import { registeredYears } from "@/constants/player";

const maxYear = Math.max(...registeredYears);

const features = [
  {
    title: "選手名鑑",
    description: "背番号・選手情報を一覧で確認",
    href: `/player-directory/${maxYear}`,
    icon: "📖",
  },
  {
    title: "背番号計算ドリル",
    description: "背番号を使った計算問題に挑戦",
    href: `/number-drill/${maxYear}`,
    icon: "🖋",
  },
  {
    title: "スタメン作成",
    description: "オリジナルのスタメンを組み立てよう",
    href: `/lineup-maker/${maxYear}`,
    icon: "⚾",
  },
];

export default function Home() {
  return (
    <VStack justify="center" gap={8} py={8} px={4}>
      <Image src={Logo.src} h="160px" alt="Baystars Drill Logo" />
      <VStack gap={2}>
        <Heading size="5xl">Baystars Drill</Heading>
        <Text color="text.secondary" fontSize="lg">
          横浜DeNAベイスターズの背番号で遊ぼう!
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} gap={6} w="100%" maxW="900px">
        {features.map((feature) => (
          <Link key={feature.href} href={feature.href}>
            <Box
              p={6}
              borderWidth="1px"
              borderRadius="lg"
              borderColor="border.card"
              bg="surface.card"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                borderColor: "interactive.primary",
                transform: "translateY(-2px)",
                boxShadow: "md",
              }}
              h="100%"
            >
              <VStack gap={3} align="start">
                <Text fontSize="3xl">{feature.icon}</Text>
                <Heading size="md">{feature.title}</Heading>
                <Text color="text.secondary" fontSize="sm">
                  {feature.description}
                </Text>
              </VStack>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
