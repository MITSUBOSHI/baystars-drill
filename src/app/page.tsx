"use client";

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
import { navItems } from "@/constants/navigation";
import Ruby from "@/components/common/Ruby";

const descriptionMap: Record<string, { description: string; descReading: string }> = {
  "選手名鑑": {
    description: "背番号・選手情報を一覧で確認",
    descReading: "せばんごう・せんしゅじょうほうをいちらんでかくにん",
  },
  "背番号計算ドリル": {
    description: "背番号を使った計算問題に挑戦",
    descReading: "せばんごうをつかったけいさんもんだいにちょうせん",
  },
  "スタメン作成": {
    description: "オリジナルのスタメンを組み立てよう",
    descReading: "おりじなるのすためんをくみたてよう",
  },
  "ユニフォームビュー": {
    description: "ユニフォーム背面の選手名と背番号を表示",
    descReading: "ゆにふぉーむはいめんのせんしゅめいとせばんごうをひょうじ",
  },
  "背番号タイマー": {
    description: "秒数を選手名で読み上げてカウント",
    descReading: "びょうすうをせんしゅめいでよみあげてかうんと",
  },
  "応援歌": {
    description: "選手の応援歌の歌詞を閲覧（ふりがな付き）",
    descReading: "せんしゅのおうえんかのかしをえつらん（ふりがなつき）",
  },
};

const features = navItems.map((item) => ({
  ...item,
  ...descriptionMap[item.title],
}));

export default function Home() {
  return (
    <VStack justify="center" gap={8} py={8} px={4}>
      <Image src={Logo.src} h="160px" alt="Baystars Drill Logo" />
      <VStack gap={2}>
        <Heading size="5xl">Baystars Drill</Heading>
        <Text color="text.secondary" fontSize="lg">
          <Ruby reading="よこはま">横浜</Ruby>DeNA
          <Ruby reading="べいすたーず">ベイスターズ</Ruby>の
          <Ruby reading="せばんごう">背番号</Ruby>で
          <Ruby reading="あそ">遊</Ruby>ぼう!
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6} w="100%" maxW="900px">
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
                <Heading size="md">
                  <Ruby reading={feature.titleReading}>{feature.title}</Ruby>
                </Heading>
                <Text color="text.secondary" fontSize="sm">
                  <Ruby reading={feature.descReading}>
                    {feature.description}
                  </Ruby>
                </Text>
              </VStack>
            </Box>
          </Link>
        ))}
      </SimpleGrid>
    </VStack>
  );
}
