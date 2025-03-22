"use client";

import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LineupSpot, Position } from "./LineupCreator";

type DraggableLineupProps = {
  orderedPlayers: LineupSpot[];
  onDragEnd: (result: DropResult) => void;
  removePlayerFromOrder: (position: Position) => void;
};

export default function DraggableLineup({
  orderedPlayers,
  onDragEnd,
  removePlayerFromOrder,
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
      <Box borderWidth="1px" borderRadius="md" padding={2} minHeight="100px">
        <Text textAlign="center" p={4} color="gray.500">
          ドラッグ＆ドロップ機能を読み込み中...
        </Text>
      </Box>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable-batting-order">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            borderWidth="1px"
            borderRadius="md"
            padding={2}
          >
            {orderedPlayers.map((spot, index) => (
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
                    p={3}
                    mb={2}
                    borderWidth="1px"
                    borderRadius="md"
                    bg={snapshot.isDragging ? "blue.50" : "white"}
                    boxShadow={snapshot.isDragging ? "md" : "none"}
                  >
                    <Flex justify="space-between" align="center">
                      <Flex align="center">
                        <Text fontWeight="bold" mr={2}>
                          {spot.order}番:{" "}
                        </Text>
                        <Text>{spot.position}</Text>
                      </Flex>
                      {spot.player && (
                        <Text>
                          {spot.player.number_disp} {spot.player.name}
                        </Text>
                      )}
                      <Button
                        size="xs"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => removePlayerFromOrder(spot.position)}
                      >
                        削除
                      </Button>
                    </Flex>
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
}
