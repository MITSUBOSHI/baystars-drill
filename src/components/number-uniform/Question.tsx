"use client";

import React, { useReducer } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { PlayerType } from "@/types/Player";
import type { NameDisplayMode } from "@/types/common";
import {
  Button,
  Box,
  VStack,
  Text,
  Container,
  Flex,
  Badge,
  Heading,
} from "@chakra-ui/react";
import OptionGroup from "@/components/common/OptionGroup";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import {
  initDrillState,
  reducer,
  generateQuestionWithOperators,
  generateDrillQuestion,
  type Operator,
  type ModeRoleType,
} from "@/lib/drill";

type Props = {
  players: PlayerType[];
};

const Question: React.FC<Props> = ({ players }) => {
  const [drillState, dispatch] = useReducer(
    reducer,
    (() => {
      const { selectedPlayers, operatorSequence } = generateDrillQuestion(
        players,
        initDrillState.mode,
      );
      return {
        ...initDrillState,
        currentDrillPlayers: selectedPlayers,
        currentOperatorSequence: operatorSequence,
      };
    })(),
  );

  const question = generateQuestionWithOperators(
    drillState.currentDrillPlayers,
    drillState.mode.operators,
    drillState.mode.nameDisplay,
    drillState.currentOperatorSequence,
  );
  const isCorrected = question.correctNumber === drillState.answeredNumber;

  const handleOperatorChange = (operator: Operator) => {
    const currentOperators = drillState.mode.operators;
    const newOperators = currentOperators.includes(operator)
      ? currentOperators.filter((op) => op !== operator)
      : [...currentOperators, operator];

    // 少なくとも1つの演算子は選択されている必要がある
    const operators =
      newOperators.length > 0 ? newOperators : (["+"] as Operator[]);
    dispatch({
      type: "settings",
      mode: {
        ...drillState.mode,
        operators,
      },
    });
  };

  const handleRetry = () => {
    // 現在の設定で新しい問題を生成
    dispatch({
      type: "retry",
      allPlayers: players,
    });
  };

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        {/* Settings Section */}
        <Box
          bg="surface.brand"
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.brand"
        >
          <Heading size="md" mb={4}>
            ⚙️ ドリル設定
          </Heading>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontWeight="bold" mb={2}>
                選手名の表示
              </Text>
              <OptionGroup
                name="nameDisplay"
                options={[
                  { value: "kanji", label: "漢字のみ" },
                  { value: "kana", label: "ひらがなのみ" },
                  { value: "both", label: "両方" },
                ]}
                selectedValues={[drillState.mode.nameDisplay]}
                onChange={(value) => {
                  dispatch({
                    type: "settings",
                    mode: {
                      ...drillState.mode,
                      nameDisplay: value as NameDisplayMode,
                    },
                  });
                }}
              />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                対象選手
              </Text>
              <OptionGroup
                name="role"
                options={[
                  { value: "roster", label: "支配下選手のみ" },
                  { value: "all", label: "すべて" },
                ]}
                selectedValues={[drillState.mode.role]}
                onChange={(value) => {
                  dispatch({
                    type: "settings",
                    mode: {
                      ...drillState.mode,
                      role: value as ModeRoleType,
                    },
                  });
                }}
              />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                難易度
              </Text>
              <OptionGroup
                name="playerNum"
                options={[
                  { value: "2", label: "Easy" },
                  { value: "3", label: "Normal" },
                  { value: "4", label: "Hard" },
                ]}
                selectedValues={[String(drillState.mode.playerNum)]}
                onChange={(value) => {
                  dispatch({
                    type: "settings",
                    mode: {
                      ...drillState.mode,
                      playerNum: Number(value) as 2 | 3 | 4,
                    },
                  });
                }}
              />
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                使用する演算子
              </Text>
              <OptionGroup
                name="operators"
                options={[
                  { value: "+", label: "足し算（＋）" },
                  { value: "-", label: "引き算（－）" },
                  { value: "*", label: "掛け算（×）" },
                  { value: "/", label: "割り算（÷）" },
                ]}
                selectedValues={drillState.mode.operators}
                onChange={(value) => handleOperatorChange(value as Operator)}
                multiple
              />
            </Box>
          </VStack>
        </Box>

        {/* Question Section */}
        <Box
          bg="surface.card"
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="border.card"
        >
          <Heading size="md" mb={4}>
            🎯 問題
          </Heading>
          <VStack gap={4} align="stretch">
            <Box
              p={3}
              bg="surface.card.subtle"
              borderRadius="md"
              borderWidth="1px"
              borderColor="border.card"
            >
              <Text fontSize="md" fontWeight="bold">
                {question.questionSentence}
              </Text>
            </Box>
            <Box>
              <Text mb={2} fontWeight="bold">
                答えを入力してください：
              </Text>
              <NumberInputRoot
                size="lg"
                width="100%"
                min={0}
                max={2000}
                value={drillState.inputValue}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  dispatch({
                    type: "answering",
                    value: Number(e.target.value),
                  });
                }}
              >
                <NumberInputField
                  disabled={!!drillState.showResult}
                  placeholder="背番号の合計を入力..."
                  bg="surface.card.subtle"
                  data-testid="number-input"
                  _placeholder={{
                    color: "text.secondary",
                  }}
                />
              </NumberInputRoot>
            </Box>
          </VStack>
          <Flex gap={4} mt={6}>
            <Button
              fontWeight="bold"
              color="white"
              bg="interactive.primary"
              _hover={{ bg: "interactive.primary.hover" }}
              onClick={() => {
                dispatch({ type: "answered" });
                sendGAEvent("event", "drill_answer", {
                  is_correct:
                    question.correctNumber === drillState.answeredNumber,
                  operators: drillState.mode.operators.join(","),
                  player_num: drillState.mode.playerNum,
                });
              }}
              flex="1"
              disabled={drillState.showResult}
            >
              解答する
            </Button>
            <Button
              fontWeight="bold"
              color="white"
              bg="interactive.primary"
              _hover={{ bg: "interactive.primary.hover" }}
              onClick={handleRetry}
              flex="1"
            >
              再挑戦
            </Button>
          </Flex>
        </Box>

        {/* Result Section */}
        {drillState.showResult && (
          <Box
            bg={isCorrected ? "surface.success" : "surface.error"}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={isCorrected ? "border.success" : "border.error"}
          >
            <VStack gap={4} align="stretch">
              <Flex align="center">
                <Text fontSize="xl" fontWeight="bold">
                  {isCorrected ? "🎉 正解！" : "😢 不正解..."}
                </Text>
                <Box flex="1" />
                <Badge
                  colorScheme={isCorrected ? "green" : "red"}
                  fontSize="md"
                  px={3}
                  py={1}
                >
                  {isCorrected ? "Correct" : "Incorrect"}
                </Badge>
              </Flex>
              <Box
                borderTopWidth="1px"
                borderColor={isCorrected ? "border.success" : "border.error"}
                pt={4}
              >
                <Text fontWeight="bold" mb={2}>
                  解説：
                </Text>
                <Text fontSize="lg">
                  {question.correctNumber} = {question.explanationSentence}
                </Text>
              </Box>
            </VStack>
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Question;
