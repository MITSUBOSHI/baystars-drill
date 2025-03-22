"use client";

import { PlayerType } from "@/types/Player";
import { Position } from "./LineupCreator";
import { Box, Button, Flex, Text, Badge, Input } from "@chakra-ui/react";
import { useState } from "react";

type Props = {
  players: PlayerType[];
  onSelectPlayer: (player: PlayerType | null) => void;
  selectedPlayer: PlayerType | null;
  position: Position;
};

export default function PlayerSelector({
  players,
  onSelectPlayer,
  selectedPlayer,
  position,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  // 選手名で検索
  const filteredPlayers = players.filter(
    (player) =>
      player.name.includes(searchTerm) ||
      player.name_kana.includes(searchTerm) ||
      player.number_disp.includes(searchTerm),
  );

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const playerId = e.target.value;
    if (playerId === "") {
      onSelectPlayer(null);
      return;
    }

    // IDから年度と背番号を抽出
    const [year, numberDisp] = playerId.split("-");
    const selectedPlayer = players.find(
      (p) => p.year.toString() === year && p.number_disp === numberDisp,
    );

    if (selectedPlayer) {
      onSelectPlayer(selectedPlayer);
    }
  };

  const clearSelection = () => {
    onSelectPlayer(null);
  };

  // 選手ごとにユニークなID値を生成
  const getPlayerId = (player: PlayerType) =>
    `${player.year}-${player.number_disp}`;

  return (
    <Box>
      {selectedPlayer && (
        <Flex align="center" mb={2}>
          <Badge colorScheme="green" mr={2}>
            {selectedPlayer.number_disp}
          </Badge>
          <Text>{selectedPlayer.name}</Text>
          <Button
            aria-label="Clear selection"
            size="xs"
            ml={2}
            onClick={clearSelection}
            variant="ghost"
          >
            ✕
          </Button>
        </Flex>
      )}

      <Box mb={2}>
        <Input
          placeholder="選手名・背番号で検索"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="sm"
        />
      </Box>

      <select
        style={{
          width: "100%",
          padding: "8px",
          borderWidth: "1px",
          borderRadius: "6px",
        }}
        onChange={handleSelectChange}
        value={selectedPlayer ? getPlayerId(selectedPlayer) : ""}
      >
        <option value="">{position}の選手を選択</option>
        {filteredPlayers.map((player, index) => (
          <option
            key={`${getPlayerId(player)}-${index}`}
            value={getPlayerId(player)}
          >
            {player.number_disp} - {player.name}
          </option>
        ))}
      </select>
    </Box>
  );
}
