"use client";

import { PlayerType } from "@/types/Player";
import { LineupSpot } from "./LineupCreator";
import { Box, Text, Flex, Badge } from "@chakra-ui/react";

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
  // 打順が設定されているラインナップのみ表示
  const activeLineup = lineup.filter((spot) => spot.order !== null);

  // 設定されていないポジションの数
  const unassignedCount = lineup.filter((spot) => spot.order === null).length;

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Flex justify="space-between" mb={4}>
        <Text
          fontSize="xl"
          fontWeight="bold"
          _dark={{
            color: isForImage ? "black" : "white",
          }}
        >
          {title}
        </Text>
        <Box>
          <Text
            fontSize="sm"
            _dark={{
              color: isForImage ? "black" : "white",
            }}
          >
            先発投手:
          </Text>
          {/* html2canvasでpaddingBottomを指定しないと表示ズレが起きる */}
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
        <Box
          overflowX="auto"
          _dark={{
            color: isForImage ? "black" : "white",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
                    width: "10%",
                  }}
                >
                  打順
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
                    width: "10%",
                  }}
                >
                  位置
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
                    width: "55%",
                  }}
                >
                  選手名
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
                    width: "25%",
                  }}
                >
                  背番号
                </th>
              </tr>
            </thead>
            <tbody>
              {activeLineup.map((spot) => (
                <tr
                  key={spot.position}
                  style={{
                    backgroundColor:
                      spot.order && spot.order % 2 === 0 ? "#f7fafc" : "white",
                    color: "black",
                  }}
                >
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {spot.order}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {spot.position[0]}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {spot.player ? getDisplayName(spot.player) : "未選択"}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {spot.player ? spot.player.number_disp : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      ) : (
        <Box textAlign="center" p={4}>
          <Text color="gray.500">打順が設定されていません</Text>
        </Box>
      )}

      {!isForImage && unassignedCount > 0 && activeLineup.length > 0 && (
        <Box mt={4} p={2} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" color="gray.600">
            残り{unassignedCount}ポジションが打順未設定です
          </Text>
        </Box>
      )}

      {!isForImage && activeLineup.length === 9 && (
        <Box mt={4} p={2} bg="green.50" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold" color="green.600">
            打順設定完了 ⚾
          </Text>
        </Box>
      )}

      {isForImage && (
        <Text fontSize="xs" color="gray.200">
          Generated by: Baystars Drill
        </Text>
      )}
    </Box>
  );
}
