"use client";

import { PlayerType } from "@/types/Player";
import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Button,
  Heading,
  Text,
  Flex,
  HStack,
  Stack,
  Input,
} from "@chakra-ui/react";
import LineupTable from "./LineupTable";
import PlayerSelector from "./PlayerSelector";
import dynamic from "next/dynamic";
import { type DropResult } from "@hello-pangea/dnd";

// 野球のポジション
export type Position =
  | "投手"
  | "捕手"
  | "一塁手"
  | "二塁手"
  | "三塁手"
  | "遊撃手"
  | "左翼手"
  | "中堅手"
  | "右翼手"
  | "DH";

// 選手名表示形式
export type NameDisplayMode = "kanji" | "kana" | "both";

// バッティングオーダーとポジションのタイプ
export type LineupSpot = {
  order: number | null;
  player: PlayerType | null;
  position: Position;
};

// デフォルトの各ポジション情報（打順はnullで初期化）
const DEFAULT_LINEUP: LineupSpot[] = [
  { order: null, player: null, position: "投手" },
  { order: null, player: null, position: "捕手" },
  { order: null, player: null, position: "一塁手" },
  { order: null, player: null, position: "二塁手" },
  { order: null, player: null, position: "三塁手" },
  { order: null, player: null, position: "遊撃手" },
  { order: null, player: null, position: "左翼手" },
  { order: null, player: null, position: "中堅手" },
  { order: null, player: null, position: "右翼手" },
];

// 動的インポートでSSRを無効化
const DraggableLineup = dynamic(() => import("./DraggableLineup"), {
  ssr: false,
});

type Props = {
  players: PlayerType[];
};

export default function LineupCreator({ players }: Props) {
  const [lineup, setLineup] = useState<LineupSpot[]>(DEFAULT_LINEUP);
  const [startingPitcher, setStartingPitcher] = useState<PlayerType | null>(
    null,
  );
  const [isMounted, setIsMounted] = useState(false);
  const [hasDH, setHasDH] = useState(false);
  const [nameDisplay, setNameDisplay] = useState<NameDisplayMode>("kanji");

  // クライアントサイドでのみレンダリングするためのフラグ
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // DHありなしが変更されたときにラインナップを更新
  useEffect(() => {
    if (hasDH) {
      // DHありの場合、投手を打順から外し、DHを追加
      setLineup((prevLineup) => {
        const newLineup = prevLineup.filter((spot) => spot.position !== "投手");
        // DHが既に存在するか確認
        const dhExists = newLineup.some((spot) => spot.position === "DH");
        if (!dhExists) {
          newLineup.push({ order: null, player: null, position: "DH" });
        }
        return newLineup;
      });
    } else {
      // DHなしの場合、DHを非表示にし、投手を追加
      setLineup((prevLineup) => {
        const newLineup = prevLineup.filter((spot) => spot.position !== "DH");
        // 投手が既に存在するか確認
        const pitcherExists = newLineup.some(
          (spot) => spot.position === "投手",
        );
        if (!pitcherExists) {
          newLineup.push({
            order: null,
            player: startingPitcher,
            position: "投手",
          });
        }
        return newLineup;
      });
    }
  }, [hasDH, startingPitcher]);

  // useMemoを使用してorderedPlayersを最適化し、不要な再レンダリングを防ぐ
  const orderedPlayers = useMemo(() => {
    return lineup
      .filter((spot) => spot.order !== null && spot.player !== null)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [lineup]);

  // 選手を選択したときの処理
  const handleSelectPlayer = (
    position: Position,
    player: PlayerType | null,
  ) => {
    setLineup((prevLineup) =>
      prevLineup.map((spot) =>
        spot.position === position ? { ...spot, player } : spot,
      ),
    );
  };

  // 先発投手を選択したときの処理
  const handleSelectPitcher = (player: PlayerType | null) => {
    setStartingPitcher(player);

    // 投手ポジションの選手も更新
    setLineup((prevLineup) =>
      prevLineup.map((spot) =>
        spot.position === "投手" ? { ...spot, player } : spot,
      ),
    );
  };

  // 打順を選択したときの処理
  const handleSelectOrder = (position: Position, order: number | null) => {
    setLineup((prevLineup) => {
      // 同じ打順が既に他のポジションに設定されている場合、その打順をnullにする
      const updatedLineup = prevLineup.map((spot) => {
        if (spot.order === order && spot.position !== position) {
          return { ...spot, order: null };
        }
        return spot;
      });

      // 選択されたポジションの打順を更新
      return updatedLineup.map((spot) =>
        spot.position === position ? { ...spot, order } : spot,
      );
    });
  };

  // ドラッグ＆ドロップ終了時の処理
  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    // ドロップ先がない場合や同じ位置の場合は何もしない
    if (!destination || destination.index === source.index) {
      return;
    }

    // 現在の打順付き選手リストをコピー
    const itemsCopy = [...orderedPlayers];

    // ドラッグされた選手を移動
    const [reorderedItem] = itemsCopy.splice(source.index, 1);
    itemsCopy.splice(destination.index, 0, reorderedItem);

    // 打順を1から順番に振り直す
    const updatedItems = itemsCopy.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    // 全ラインナップの打順を更新
    const updatedLineup = lineup.map((spot) => {
      const foundItem = updatedItems.find(
        (item) => item.position === spot.position,
      );
      if (foundItem) {
        return { ...spot, order: foundItem.order };
      }
      return spot;
    });

    // 状態を更新
    setLineup(updatedLineup);
  };

  // ラインナップをリセットする
  const resetLineup = () => {
    setLineup(DEFAULT_LINEUP);
    setStartingPitcher(null);
    if (typeof window !== "undefined") {
      alert("ラインナップをリセットしました");
    }
  };

  // 表示用に並び替えられたラインナップを取得
  const getSortedLineup = () => {
    const withOrder = lineup
      .filter((spot) => spot.order !== null)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const withoutOrder = lineup.filter((spot) => spot.order === null);
    return [...withOrder, ...withoutOrder];
  };

  // 選手を打順に追加する
  const addPlayerToOrder = (position: Position) => {
    const spot = lineup.find((s) => s.position === position);
    if (!spot || !spot.player) return;

    // 既に打順が設定されている場合は何もしない
    if (spot.order !== null) return;

    // 次の利用可能な打順を取得
    const usedOrders = lineup
      .filter((s) => s.order !== null)
      .map((s) => s.order);
    for (let i = 1; i <= 9; i++) {
      if (!usedOrders.includes(i)) {
        handleSelectOrder(position, i);
        break;
      }
    }
  };

  // 選手を打順から削除する
  const removePlayerFromOrder = (position: Position) => {
    handleSelectOrder(position, null);
  };

  // ドラッグ＆ドロップUIが表示されるかどうか
  const showDragDropUI = orderedPlayers.length > 0 && isMounted;

  // 選手名表示関数
  const getDisplayName = (player: PlayerType | null): string => {
    if (!player) return "未選択";

    switch (nameDisplay) {
      case "kanji":
        return player.name;
      case "kana":
        return player.name_kana;
      case "both":
        return `${player.name}（${player.name_kana}）`;
    }
  };

  // 表示形式オプション
  const options = [
    { value: "kanji", label: "漢字のみ" },
    { value: "kana", label: "ひらがなのみ" },
    { value: "both", label: "両方" },
  ];

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="8">
      <Heading size="lg">スタメンジェネレータ</Heading>

      <Box
        w="100%"
        maxW="800px"
        borderWidth="1px"
        borderRadius="lg"
        p={4}
        mb={4}
      >
        <Heading size="md" mb={4}>
          ⚙️ 設定
        </Heading>

        <Stack gap={4}>
          <Flex align="center">
            <Text mr={3}>DHあり</Text>
            <Box
              as="label"
              display="inline-flex"
              alignItems="center"
              cursor="pointer"
            >
              <Input
                type="checkbox"
                checked={hasDH}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setHasDH(e.target.checked)
                }
                hidden
              />
              <Box
                position="relative"
                display="inline-block"
                w="48px"
                h="24px"
                bg={hasDH ? "blue.500" : "gray.300"}
                rounded="full"
                transition="0.2s"
              >
                <Box
                  position="absolute"
                  transform={hasDH ? "translateX(24px)" : "translateX(0)"}
                  w="20px"
                  h="20px"
                  mt="2px"
                  ml="2px"
                  bg="white"
                  rounded="full"
                  transition="0.2s"
                />
              </Box>
            </Box>
          </Flex>

          <Box>
            <Text mb={2}>選手名表示形式</Text>
            <HStack gap="24px">
              {options.map((option) => (
                <Box
                  key={option.value}
                  as="label"
                  p={2}
                  borderWidth="1px"
                  borderRadius="md"
                  borderColor={
                    nameDisplay === option.value ? "blue.500" : "gray.200"
                  }
                  bg={nameDisplay === option.value ? "blue.500" : "white"}
                  color={nameDisplay === option.value ? "white" : "black"}
                  cursor="pointer"
                  _hover={{ borderColor: "blue.300" }}
                >
                  <Input
                    type="radio"
                    name="nameDisplay"
                    value={option.value}
                    checked={nameDisplay === option.value}
                    onChange={() =>
                      setNameDisplay(option.value as NameDisplayMode)
                    }
                    hidden
                  />
                  {option.label}
                </Box>
              ))}
            </HStack>
          </Box>
        </Stack>
      </Box>

      <Box w="100%" maxW="800px">
        <LineupTable
          lineup={getSortedLineup()}
          startingPitcher={startingPitcher}
          getDisplayName={getDisplayName}
        />
      </Box>

      {showDragDropUI && isMounted && (
        <Box w="100%" maxW="800px" mb={4}>
          <Heading size="md" mb={4}>
            打順（ドラッグ＆ドロップで並べ替え）
          </Heading>
          <DraggableLineup
            orderedPlayers={orderedPlayers}
            onDragEnd={handleDragEnd}
            removePlayerFromOrder={removePlayerFromOrder}
            getDisplayName={getDisplayName}
          />
        </Box>
      )}

      <Box w="100%" maxW="800px">
        <Box display="flex" flexDirection="column" gap="4">
          {/* 先発投手選択は常に表示 */}
          <Heading size="md">投手選択</Heading>
          <PlayerSelector
            players={players.filter((p) => p.role === "roster")}
            onSelectPlayer={handleSelectPitcher}
            selectedPlayer={startingPitcher}
            position="投手"
            getDisplayName={getDisplayName}
          />

          <Heading size="md">ポジション別選手設定</Heading>
          {lineup.map((spot) => (
            <Box key={spot.position} p={3} borderWidth="1px" borderRadius="md">
              <Flex align="center" justify="space-between" mb={2}>
                <Text fontWeight="bold">{spot.position}</Text>
                {spot.order !== null ? (
                  <Flex align="center">
                    <Text fontWeight="bold" color="blue.500">
                      {spot.order}番
                    </Text>
                    <Button
                      size="xs"
                      ml={2}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removePlayerFromOrder(spot.position)}
                    >
                      打順から削除
                    </Button>
                  </Flex>
                ) : (
                  spot.player && (
                    <Button
                      size="xs"
                      colorScheme="blue"
                      onClick={() => addPlayerToOrder(spot.position)}
                      disabled={orderedPlayers.length >= 9}
                    >
                      打順に追加
                    </Button>
                  )
                )}
              </Flex>
              <PlayerSelector
                players={players.filter((p) => p.role === "roster")}
                onSelectPlayer={(player: PlayerType | null) =>
                  handleSelectPlayer(spot.position, player)
                }
                selectedPlayer={spot.player}
                position={spot.position}
                getDisplayName={getDisplayName}
              />
            </Box>
          ))}
        </Box>
      </Box>

      <Button colorScheme="red" onClick={resetLineup}>
        リセット
      </Button>
    </Box>
  );
}
