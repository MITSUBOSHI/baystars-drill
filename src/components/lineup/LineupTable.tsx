"use client";

import { PlayerType } from "@/types/Player";
import { LineupSpot } from "./LineupCreator";
import { Box, Text, Flex, Badge, Table } from "@chakra-ui/react";

type Props = {
  lineup: LineupSpot[];
  startingPitcher: PlayerType | null;
  getDisplayName: (player: PlayerType | null) => string;
  title?: string;
  isForImage?: boolean;
};

export default function LineupTable({
  lineup,
  startingPitcher,
  getDisplayName,
  title = "スタメンジェネレータ",
  isForImage = false,
}: Props) {
  const activeLineup = lineup.filter((spot) => spot.order !== null);
  const unassignedCount = lineup.filter((spot) => spot.order === null).length;
  const textColor = isForImage ? "black" : "text.primary";

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold" color={textColor}>
          {title}
        </Text>
        <Box>
          <Text fontSize="sm" color={textColor}>
            先発投手:
          </Text>
          <Badge
            colorPalette="gray"
            fontSize="md"
            paddingBottom={isForImage ? 2 : 0}
          >
            {startingPitcher ? getDisplayName(startingPitcher) : "未選択"}
          </Badge>
        </Box>
      </Flex>

      {activeLineup.length > 0 ? (
        <Box overflowX="auto" color={textColor}>
          <Table.Root size="sm">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader width="10%">打順</Table.ColumnHeader>
                <Table.ColumnHeader width="10%">位置</Table.ColumnHeader>
                <Table.ColumnHeader width="55%">選手名</Table.ColumnHeader>
                <Table.ColumnHeader width="25%">背番号</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {activeLineup.map((spot) => (
                <Table.Row
                  key={spot.position}
                  bg={
                    isForImage
                      ? spot.order && spot.order % 2 === 0
                        ? "#f7fafc"
                        : "white"
                      : spot.order && spot.order % 2 === 0
                        ? "surface.card"
                        : "surface.card.subtle"
                  }
                  color={textColor}
                >
                  <Table.Cell>{spot.order}</Table.Cell>
                  <Table.Cell>{spot.position[0]}</Table.Cell>
                  <Table.Cell>
                    {spot.player ? getDisplayName(spot.player) : "未選択"}
                  </Table.Cell>
                  <Table.Cell>
                    {spot.player ? spot.player.number_disp : "-"}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      ) : (
        <Box textAlign="center" p={4}>
          <Text color="text.secondary">打順が設定されていません</Text>
        </Box>
      )}

      {!isForImage && unassignedCount > 0 && activeLineup.length > 0 && (
        <Box mt={4} p={2} bg="surface.card" borderRadius="md">
          <Text fontSize="sm" color="text.secondary">
            残り{unassignedCount}ポジションが打順未設定です
          </Text>
        </Box>
      )}

      {!isForImage && activeLineup.length === 9 && (
        <Box mt={4} p={2} bg="surface.success" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold" color="text.success">
            打順設定完了 ⚾
          </Text>
        </Box>
      )}

      {isForImage && (
        <Text fontSize="xs" color="text.secondary">
          Baystars Drill で作成
        </Text>
      )}
    </Box>
  );
}
