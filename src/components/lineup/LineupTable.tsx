"use client";

import { PlayerType } from "@/types/Player";
import { LineupSpot } from "./LineupCreator";
import { Box, Text, Flex, Badge } from "@chakra-ui/react";

type Props = {
  lineup: LineupSpot[];
  startingPitcher: PlayerType | null;
};

export default function LineupTable({ lineup, startingPitcher }: Props) {
  // 打順が設定されているラインナップのみ表示
  const activeLineup = lineup.filter((spot) => spot.order !== null);

  // 設定されていないポジションの数
  const unassignedCount = lineup.filter((spot) => spot.order === null).length;

  return (
    <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
      <Flex justify="space-between" mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          スターティングメンバー
        </Text>
        <Box>
          <Text fontSize="sm">先発投手:</Text>
          <Badge colorScheme="blue" fontSize="md">
            {startingPitcher
              ? `${startingPitcher.number_disp} ${startingPitcher.name}`
              : "未選択"}
          </Badge>
        </Box>
      </Flex>

      {activeLineup.length > 0 ? (
        <Box overflowX="auto">
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
                    width: "15%",
                  }}
                >
                  背番号
                </th>
                <th
                  style={{
                    padding: "8px",
                    textAlign: "left",
                    borderBottom: "1px solid #e2e8f0",
                    width: "30%",
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
                  ポジション
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
                  }}
                >
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {spot.order}番
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {spot.player ? spot.player.number_disp : "-"}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {spot.player ? spot.player.name : "未選択"}
                  </td>
                  <td
                    style={{
                      padding: "8px",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    {spot.position}
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

      {unassignedCount > 0 && activeLineup.length > 0 && (
        <Box mt={4} p={2} bg="gray.50" borderRadius="md">
          <Text fontSize="sm" color="gray.600">
            残り{unassignedCount}ポジションが打順未設定です
          </Text>
        </Box>
      )}

      {activeLineup.length === 9 && (
        <Box mt={4} p={2} bg="green.50" borderRadius="md">
          <Text fontSize="sm" fontWeight="bold" color="green.600">
            打順設定完了 ⚾
          </Text>
        </Box>
      )}
    </Box>
  );
}
