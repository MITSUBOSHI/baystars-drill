"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Box, Button, Flex, Text, Badge } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LineupSpot, Position } from "./LineupCreator";
import { PlayerType } from "@/types/Player";

type DraggableLineupProps = {
  orderedPlayers: LineupSpot[];
  onDragEnd: (result: DropResult) => void;
  removePlayerFromOrder: (position: Position) => void;
  getDisplayName: (player: PlayerType | null) => string;
};

export default function DraggableLineup({
  orderedPlayers,
  onDragEnd,
  removePlayerFromOrder,
  getDisplayName,
}: DraggableLineupProps) {
  // マウント状態を追跡する
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのみ実行されるようにする
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // マウントされるまでは空のコンテンツを返す
  if (!mounted) {
    return (
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={4}
        bg="surface.card"
        minHeight="100px"
      >
        <Text textAlign="center" color="text.secondary">
          ドラッグ＆ドロップ領域を読み込み中...
        </Text>
      </Box>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-batting-order">
        {(provided, snapshot) => (
          <Box
            {...provided.droppableProps}
            ref={provided.innerRef}
            borderWidth="1px"
            borderRadius="md"
            bg={
              snapshot.isDraggingOver ? "surface.brand" : "surface.card.subtle"
            }
            p={3}
            minHeight="50px"
          >
            {orderedPlayers.length === 0 ? (
              <Text textAlign="center" color="text.secondary" py={2}>
                打順が設定されていません
              </Text>
            ) : (
              orderedPlayers.map((spot, index) => (
                <Draggable
                  key={spot.position}
                  draggableId={spot.position}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      mb={2}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={
                        snapshot.isDragging ? "border.brand" : "border.card"
                      }
                      bg={
                        snapshot.isDragging
                          ? "surface.brand"
                          : "surface.card.subtle"
                      }
                      boxShadow={snapshot.isDragging ? "md" : "none"}
                    >
                      <Flex align="center" justify="space-between">
                        <Flex align="center">
                          <Text
                            fontWeight="bold"
                            mr={3}
                            color="blue.500"
                            fontSize="lg"
                          >
                            {spot.order}番
                          </Text>
                          <Badge mr={2} colorScheme="gray">
                            {spot.position}
                          </Badge>
                          <Text fontWeight="bold">
                            {spot.player && (
                              <Flex align="center">
                                <Badge colorScheme="blue" mr={2}>
                                  {spot.player.number_disp}
                                </Badge>
                                {getDisplayName(spot.player)}
                              </Flex>
                            )}
                          </Text>
                        </Flex>
                        <Button
                          size="xs"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => removePlayerFromOrder(spot.position)}
                        >
                          削除
                        </Button>
                      </Flex>
                    </Box>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
