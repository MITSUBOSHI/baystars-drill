"use client";

import React, { useReducer } from "react";
import { sendGAEvent } from "@next/third-parties/google";
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
  Input,
} from "@chakra-ui/react";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";

const DEFAULT_PLAYER_SELECTION_NUMBER = 2;
type ModeRoleType = "roster" | "all";
type Operator = "+" | "-" | "*" | "/";
type NameDisplayMode = "kanji" | "kana" | "both";
const OPERATORS: Record<Operator, string> = {
  "+": "＋",
  "-": "－",
  "*": "×",
  "/": "÷",
};
type Mode = {
  role: ModeRoleType;
  playerNum: 2 | 3 | 4;
  operators: Operator[];
  nameDisplay: NameDisplayMode;
};
type Action =
  | {
      type: "init";
      allPlayers: PlayerType[];
    }
  | {
      type: "retry";
      allPlayers: PlayerType[];
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
  currentOperatorSequence: Operator[];
};
const initDrillState = {
  currentDrillPlayers: [],
  answeredNumber: null,
  showResult: false,
  inputValue: "",
  mode: {
    role: "roster",
    playerNum: DEFAULT_PLAYER_SELECTION_NUMBER,
    operators: ["+"],
    nameDisplay: "both" as NameDisplayMode,
  } as Mode,
  currentOperatorSequence: [],
};
const reducer = (prev: DrillStateType, action: Action): DrillStateType => {
  switch (action.type) {
    case "init":
    case "retry": {
      const { selectedPlayers, operatorSequence } = generateDrillQuestion(
        action.allPlayers,
        prev.mode,
      );
      return {
        ...initDrillState,
        mode: prev.mode,
        currentDrillPlayers: selectedPlayers,
        currentOperatorSequence: operatorSequence,
      };
    }
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

const RolesByModeRole: Record<ModeRoleType, Role[]> = {
  roster: [Role.Roster],
  all: [Role.Coach, Role.Roster, Role.Training],
};
const shufflePlayers = (players: PlayerType[]) =>
  players.sort(() => Math.random() - Math.random());
function selecteRandomizedPlayers(
  players: PlayerType[],
  mode: Mode,
): PlayerType[] {
  const usingRoles = RolesByModeRole[mode.role];
  const filteredPlayers = players.filter((p) => usingRoles.includes(p.role));
  const shuffledPlayers = shufflePlayers(filteredPlayers);
  const count = mode.playerNum;

  return shuffledPlayers.slice(0, count);
}
type QuestionType = {
  questionSentence: string;
  correctNumber: number;
  explanationSentence: string;
};

function calculateResult(
  a: number,
  b: number,
  operator: Operator,
): number | null {
  switch (operator) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      // 割り切れる場合のみ除算を許可
      return b !== 0 && Number.isInteger(a / b) ? a / b : null;
  }
}

function getDisplayName(player: PlayerType, mode: NameDisplayMode): string {
  switch (mode) {
    case "kanji":
      return player.name;
    case "kana":
      return player.name_kana;
    case "both":
      return `${player.name}（${player.name_kana}）`;
  }
}

function calculateExpression(
  players: PlayerType[],
  operators: Operator[],
  nameDisplay: NameDisplayMode,
): {
  result: number;
  expression: string;
  explanationExpression: string;
} {
  if (players.length === 1) {
    return {
      result: players[0].number_calc,
      expression: getDisplayName(players[0], nameDisplay),
      explanationExpression: `${players[0].number_disp}（${getDisplayName(players[0], nameDisplay)}）`,
    };
  }

  // 左から右へ順番に計算
  let result = players[0].number_calc;
  let expression = getDisplayName(players[0], nameDisplay);
  let explanationExpression = `${players[0].number_disp}（${getDisplayName(players[0], nameDisplay)}）`;

  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    const nextNumber = players[i + 1].number_calc;
    const calculatedResult = calculateResult(result, nextNumber, operator);

    if (calculatedResult !== null) {
      result = calculatedResult;
    } else {
      result += nextNumber;
    }

    expression += ` ${OPERATORS[operator]} ${getDisplayName(players[i + 1], nameDisplay)}`;
    explanationExpression += ` ${OPERATORS[operator]} ${players[i + 1].number_disp}（${getDisplayName(players[i + 1], nameDisplay)}）`;
  }

  return { result, expression, explanationExpression };
}

function generateQuestionWithOperators(
  players: PlayerType[],
  operators: Operator[],
  nameDisplay: NameDisplayMode,
  fixedOperatorSequence?: Operator[],
): QuestionType & { operatorSequence: Operator[] } {
  if (
    fixedOperatorSequence &&
    fixedOperatorSequence.length === players.length - 1
  ) {
    const { result, expression, explanationExpression } = calculateExpression(
      players,
      fixedOperatorSequence,
      nameDisplay,
    );

    return {
      questionSentence: expression,
      correctNumber: result,
      explanationSentence: explanationExpression,
      operatorSequence: fixedOperatorSequence,
    };
  }

  // 新しい演算子シーケンスを生成
  const shuffledOperators = [...operators].sort(() => Math.random() - 0.5);
  const operatorSequence: Operator[] = [];

  let currentResult = players[0].number_calc;
  for (let i = 1; i < players.length; i++) {
    const nextNumber = players[i].number_calc;
    let validOperatorFound = false;

    for (const op of shuffledOperators) {
      const tempResult = calculateResult(currentResult, nextNumber, op);
      if (
        tempResult !== null &&
        tempResult >= 0 &&
        Number.isInteger(tempResult)
      ) {
        currentResult = tempResult;
        operatorSequence.push(op);
        validOperatorFound = true;
        break;
      }
    }

    if (!validOperatorFound) {
      currentResult += nextNumber;
      operatorSequence.push("+");
    }
  }

  const { result, expression, explanationExpression } = calculateExpression(
    players,
    operatorSequence,
    nameDisplay,
  );

  return {
    questionSentence: expression,
    correctNumber: result,
    explanationSentence: explanationExpression,
    operatorSequence,
  };
}

function generateDrillQuestion(
  allPlayers: PlayerType[],
  mode: Mode,
): { selectedPlayers: PlayerType[]; operatorSequence: Operator[] } {
  const maxAttempts = 10;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const selectedPlayers = selecteRandomizedPlayers(allPlayers, mode);
    const { operatorSequence } = generateQuestionWithOperators(
      selectedPlayers,
      mode.operators,
      mode.nameDisplay,
    );
    // 生成された演算子がすべてユーザー選択の演算子に含まれているか確認
    if (operatorSequence.every((op) => mode.operators.includes(op))) {
      return { selectedPlayers, operatorSequence };
    }
  }
  // 最大試行回数に達した場合、最後の結果をそのまま使う
  const selectedPlayers = selecteRandomizedPlayers(allPlayers, mode);
  const { operatorSequence } = generateQuestionWithOperators(
    selectedPlayers,
    mode.operators,
    mode.nameDisplay,
  );
  return { selectedPlayers, operatorSequence };
}

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
          bg="blue.50"
          _dark={{
            bg: "blue.900",
            borderColor: "blue.700",
          }}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="blue.200"
        >
          <Heading size="md" mb={4}>
            ⚙️ ドリル設定
          </Heading>
          <VStack gap={4} align="stretch">
            <Box>
              <Text fontWeight="bold" mb={2}>
                選手名の表示
              </Text>
              <HStack gap="24px">
                {[
                  { value: "kanji", label: "漢字のみ" },
                  { value: "kana", label: "ひらがなのみ" },
                  { value: "both", label: "両方" },
                ].map((option) => (
                  <Box
                    key={option.value}
                    as="label"
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={
                      drillState.mode.nameDisplay === option.value
                        ? "blue.500"
                        : "gray.200"
                    }
                    bg={
                      drillState.mode.nameDisplay === option.value
                        ? "blue.500"
                        : "white"
                    }
                    color={
                      drillState.mode.nameDisplay === option.value
                        ? "white"
                        : "black"
                    }
                    cursor="pointer"
                    _hover={{ borderColor: "blue.300" }}
                  >
                    <Input
                      type="radio"
                      name="nameDisplay"
                      value={option.value}
                      checked={drillState.mode.nameDisplay === option.value}
                      onChange={() => {
                        dispatch({
                          type: "settings",
                          mode: {
                            ...drillState.mode,
                            nameDisplay: option.value as NameDisplayMode,
                          },
                        });
                      }}
                      hidden
                    />
                    {option.label}
                  </Box>
                ))}
              </HStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                対象選手
              </Text>
              <HStack gap="24px">
                {[
                  { value: "roster", label: "支配下選手のみ" },
                  { value: "all", label: "すべて" },
                ].map((option) => (
                  <Box
                    key={option.value}
                    as="label"
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={
                      drillState.mode.role === option.value
                        ? "blue.500"
                        : "gray.200"
                    }
                    bg={
                      drillState.mode.role === option.value
                        ? "blue.500"
                        : "white"
                    }
                    color={
                      drillState.mode.role === option.value ? "white" : "black"
                    }
                    cursor="pointer"
                    _hover={{ borderColor: "blue.300" }}
                  >
                    <Input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={drillState.mode.role === option.value}
                      onChange={() => {
                        dispatch({
                          type: "settings",
                          mode: {
                            ...drillState.mode,
                            role: option.value as ModeRoleType,
                          },
                        });
                      }}
                      hidden
                    />
                    {option.label}
                  </Box>
                ))}
              </HStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                難易度
              </Text>
              <HStack gap="24px">
                {[
                  { value: "2", label: "Easy" },
                  { value: "3", label: "Normal" },
                  { value: "4", label: "Hard" },
                ].map((option) => (
                  <Box
                    key={option.value}
                    as="label"
                    p={2}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={
                      String(drillState.mode.playerNum) === option.value
                        ? "blue.500"
                        : "gray.200"
                    }
                    bg={
                      String(drillState.mode.playerNum) === option.value
                        ? "blue.500"
                        : "white"
                    }
                    color={
                      String(drillState.mode.playerNum) === option.value
                        ? "white"
                        : "black"
                    }
                    cursor="pointer"
                    _hover={{ borderColor: "blue.300" }}
                  >
                    <Input
                      type="radio"
                      name="playerNum"
                      value={option.value}
                      checked={
                        String(drillState.mode.playerNum) === option.value
                      }
                      onChange={() => {
                        dispatch({
                          type: "settings",
                          mode: {
                            ...drillState.mode,
                            playerNum: Number(option.value) as 2 | 3 | 4,
                          },
                        });
                      }}
                      hidden
                    />
                    {option.label}
                  </Box>
                ))}
              </HStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                使用する演算子
              </Text>
              <HStack gap={4} flexWrap="wrap">
                {(Object.entries(OPERATORS) as [Operator, string][]).map(
                  ([value, label]) => (
                    <Box
                      key={value}
                      as="label"
                      p={2}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={
                        drillState.mode.operators.includes(value)
                          ? "blue.500"
                          : "gray.200"
                      }
                      bg={
                        drillState.mode.operators.includes(value)
                          ? "blue.500"
                          : "white"
                      }
                      color={
                        drillState.mode.operators.includes(value)
                          ? "white"
                          : "black"
                      }
                      cursor="pointer"
                      _hover={{ borderColor: "blue.300" }}
                    >
                      <Input
                        type="checkbox"
                        checked={drillState.mode.operators.includes(value)}
                        onChange={() => handleOperatorChange(value)}
                        hidden
                      />
                      {value === "+" && "足し算"}
                      {value === "-" && "引き算"}
                      {value === "*" && "掛け算"}
                      {value === "/" && "割り算"}（{label}）
                    </Box>
                  ),
                )}
              </HStack>
            </Box>
          </VStack>
        </Box>

        {/* Question Section */}
        <Box
          bg="gray.50"
          _dark={{
            bg: "gray.800",
            borderColor: "gray.600",
          }}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor="gray.200"
        >
          <Heading size="md" mb={4}>
            🎯 問題
          </Heading>
          <VStack gap={4} align="stretch">
            <Box
              p={3}
              bg="white"
              _dark={{
                bg: "gray.700",
                borderColor: "gray.600",
              }}
              borderRadius="md"
              borderWidth="1px"
              borderColor="gray.200"
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
                  bg="white"
                  data-testid="number-input"
                  _dark={{
                    bg: "gray.700",
                  }}
                  _placeholder={{
                    color: "gray.500",
                    _dark: {
                      color: "gray.400",
                    },
                  }}
                />
              </NumberInputRoot>
            </Box>
          </VStack>
          <HStack gap={4} mt={6}>
            <Button
              fontWeight="bold"
              color="white"
              backgroundColor="blue.300"
              _dark={{
                bg: "white",
                color: "black",
              }}
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
              backgroundColor="blue.300"
              _dark={{
                bg: "white",
                color: "black",
              }}
              onClick={handleRetry}
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
            _dark={{
              bg: isCorrected ? "green.900" : "red.900",
              borderColor: isCorrected ? "green.700" : "red.700",
            }}
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={isCorrected ? "green.200" : "red.200"}
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
                _dark={{
                  borderColor: isCorrected ? "green.700" : "red.700",
                }}
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
