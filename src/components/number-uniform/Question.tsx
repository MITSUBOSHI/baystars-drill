"use client";

import React, { useReducer } from "react";
import { PlayerType, Role } from "@/types/Player";
import {
  Button,
  HStack,
  Box,
  VStack,
  Text,
  Container,
  Flex,
  Badge,
  Heading,
} from "@chakra-ui/react";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import { Radio, RadioGroup } from "@/components/ui/radio";

const DEFAULT_PLAYER_SELECTION_NUMBER = 2;
type ModeRoleType = "rooster" | "all";
type Mode = {
  role: ModeRoleType;
  playerNum: 2 | 3 | 4;
};
type Action =
  | {
      type: "init";
      players: PlayerType[];
    }
  | {
      type: "retry";
      players: PlayerType[];
    }
  | {
      type: "settings";
      mode: Mode;
    }
  | {
      type: "answering";
      value: number;
    }
  | {
      type: "answered";
    };
type DrillStateType = {
  currentDrillPlayers: PlayerType[];
  answeredNumber: number | null;
  showResult: boolean;
  mode: Mode;
  inputValue: string;
};
const initDrillState = {
  currentDrillPlayers: [],
  answeredNumber: null,
  showResult: false,
  inputValue: "",
  mode: {
    role: "rooster",
    playerNum: DEFAULT_PLAYER_SELECTION_NUMBER,
  } as Mode,
};
const reducer = (prev: DrillStateType, action: Action): DrillStateType => {
  switch (action.type) {
    case "init":
    case "retry":
      return {
        ...initDrillState,
        mode: prev.mode,
        currentDrillPlayers: action.players,
      };
    case "settings":
      return {
        ...prev,
        mode: action.mode,
      };
    case "answering":
      return {
        ...prev,
        answeredNumber: action.value,
        showResult: false,
        inputValue: String(action.value),
      };
    case "answered":
      return { ...prev, showResult: true };
    default:
      throw new Error("unsupported action type is given");
  }
};

const RolesByModeRole: Record<ModeRoleType, Partial<Role[]>> = {
  rooster: [Role.Roster],
  all: [Role.Coach, Role.Roster, Role.Training],
};
const shufflePlayers = (players: PlayerType[]) =>
  players.sort(() => Math.random() - Math.random());
function selecteRandomizedPlayers(
  players: PlayerType[],
  mode: Mode,
): PlayerType[] {
  const result: PlayerType[] = [];
  const usingRoles = RolesByModeRole[mode.role];
  const filteredPlayers = players.filter((p) => usingRoles.includes(p.role));
  const shuffledPlayers = shufflePlayers(filteredPlayers);
  const count = mode.playerNum;

  for (let step = 0; step < count; step++) {
    const player = shuffledPlayers[step];

    if (player) {
      result.push(player);
    }
  }

  return result;
}
type QuestionType = {
  questionSentence: string;
  correctNumber: number;
  explanationSentence: string;
};
function generateQuestion(players: PlayerType[]): QuestionType {
  const questionSentence = players
    .map((p) => `${p.name}（${p.name_kana}）`)
    .join(" ＋ ");
  const correctNumber = players.reduce((sum, p) => sum + p.number_calc, 0);
  const explanationSentence = players
    .map((p) => `${p.number_disp}（${p.name}）`)
    .join(" ＋ ");

  return {
    questionSentence,
    correctNumber,
    explanationSentence,
  };
}

type Props = {
  players: PlayerType[];
};

const Question: React.FC<Props> = ({ players }) => {
  const [drillState, dispatch] = useReducer(reducer, {
    ...initDrillState,
    currentDrillPlayers: selecteRandomizedPlayers(players, initDrillState.mode),
  });
  const question = generateQuestion(drillState.currentDrillPlayers);
  const isCorrected = question.correctNumber === drillState.answeredNumber;

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        {/* Settings Section */}
        <Box bg="blue.50" p={6} borderRadius="lg" borderWidth="1px">
          <Heading size="md" mb={4}>
            ⚙️ ドリル設定
          </Heading>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontWeight="bold" mb={2}>
                対象選手
              </Text>
              <RadioGroup
                value={drillState.mode.role}
                onValueChange={(e) => {
                  dispatch({
                    type: "settings",
                    mode: { ...drillState.mode, role: e.value } as Mode,
                  });
                }}
              >
                <HStack gap={4}>
                  <Radio value="rooster">支配下選手のみ</Radio>
                  <Radio value="all">すべて</Radio>
                </HStack>
              </RadioGroup>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                難易度
              </Text>
              <RadioGroup
                value={String(drillState.mode.playerNum)}
                onValueChange={(e) => {
                  dispatch({
                    type: "settings",
                    mode: {
                      ...drillState.mode,
                      playerNum: Number(e.value),
                    } as Mode,
                  });
                }}
              >
                <HStack gap={4}>
                  <Radio value="2">
                    <Badge colorScheme="green">Easy</Badge>
                  </Radio>
                  <Radio value="3">
                    <Badge colorScheme="yellow">Normal</Badge>
                  </Radio>
                  <Radio value="4">
                    <Badge colorScheme="red">Hard</Badge>
                  </Radio>
                </HStack>
              </RadioGroup>
            </Box>
          </VStack>
        </Box>

        {/* Question Section */}
        <Box bg="gray.50" p={6} borderRadius="lg" borderWidth="1px">
          <Heading size="md" mb={4}>
            🎯 問題
          </Heading>
          <VStack gap={4} align="stretch">
            <Box p={3} bg="white" borderRadius="md" borderWidth="1px">
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
                />
              </NumberInputRoot>
            </Box>
          </VStack>
          <HStack gap={4} mt={6}>
            <Button
              backgroundColor="blue.300"
              fontWeight="bold"
              onClick={() => {
                dispatch({ type: "answered" });
              }}
              flex="1"
              disabled={drillState.showResult}
            >
              解答する
            </Button>
            <Button
              backgroundColor="blue.300"
              fontWeight="bold"
              onClick={() => {
                dispatch({
                  type: "retry",
                  players: selecteRandomizedPlayers(players, drillState.mode),
                });
              }}
              flex="1"
            >
              再挑戦
            </Button>
          </HStack>
        </Box>

        {/* Result Section */}
        {drillState.showResult && (
          <Box
            bg={isCorrected ? "green.50" : "red.50"}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
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
                borderColor={isCorrected ? "green.200" : "red.200"}
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
