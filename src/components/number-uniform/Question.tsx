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
      const { operatorSequence } = generateQuestionWithOperators(
        action.players,
        prev.mode.operators,
        prev.mode.nameDisplay,
      );
      return {
        ...initDrillState,
        mode: prev.mode,
        currentDrillPlayers: action.players,
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

// 演算子の優先順位を定義
const OPERATOR_PRECEDENCE: Record<Operator, number> = {
  "*": 2,
  "/": 2,
  "+": 1,
  "-": 1,
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

function calculateResultWithPrecedence(
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

  // 掛け算・割り算を先に処理
  const currentPlayers = [...players];
  const currentOperators = [...operators];
  let i = 0;

  while (i < currentOperators.length) {
    const op = currentOperators[i];
    if (OPERATOR_PRECEDENCE[op] === 2) {
      // 掛け算または割り算
      const result = calculateResult(
        currentPlayers[i].number_calc,
        currentPlayers[i + 1].number_calc,
        op,
      );

      if (result !== null) {
        // 計算結果を新しいプレイヤーとして置き換え
        const combinedPlayer: PlayerType = {
          ...currentPlayers[i],
          name: `${getDisplayName(currentPlayers[i], nameDisplay)} ${OPERATORS[op]} ${getDisplayName(currentPlayers[i + 1], nameDisplay)}`,
          name_kana: `${currentPlayers[i].name_kana} ${OPERATORS[op]} ${currentPlayers[i + 1].name_kana}`,
          number_calc: result,
          number_disp: `${result}`,
        };

        currentPlayers.splice(i, 2, combinedPlayer);
        currentOperators.splice(i, 1);
        i--;
      }
    }
    i++;
  }

  // 残りの加算・減算を処理
  const expression = getDisplayName(players[0], nameDisplay);
  const explanationExpression = `${players[0].number_disp}（${getDisplayName(players[0], nameDisplay)}）`;
  let result = players[0].number_calc;

  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    const nextNumber = players[i + 1].number_calc;
    const calculatedResult = calculateResult(result, nextNumber, operator);

    if (calculatedResult !== null) {
      result = calculatedResult;
    } else {
      // 計算できない場合は加算を使用
      result += nextNumber;
    }
  }

  let displayExpression = expression;
  let displayExplanation = explanationExpression;

  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i];
    displayExpression += ` ${OPERATORS[operator]} ${getDisplayName(players[i + 1], nameDisplay)}`;
    displayExplanation += ` ${OPERATORS[operator]} ${players[i + 1].number_disp}（${getDisplayName(players[i + 1], nameDisplay)}）`;
  }

  return {
    result,
    expression: displayExpression,
    explanationExpression: displayExplanation,
  };
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
    const { result, expression, explanationExpression } =
      calculateResultWithPrecedence(
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

  const { result, expression, explanationExpression } =
    calculateResultWithPrecedence(players, operatorSequence, nameDisplay);

  return {
    questionSentence: expression,
    correctNumber: result,
    explanationSentence: explanationExpression,
    operatorSequence,
  };
}

type Props = {
  players: PlayerType[];
};

const Question: React.FC<Props> = ({ players }) => {
  const [drillState, dispatch] = useReducer(
    reducer,
    (() => {
      const initialPlayers = selecteRandomizedPlayers(
        players,
        initDrillState.mode,
      );
      const { operatorSequence } = generateQuestionWithOperators(
        initialPlayers,
        initDrillState.mode.operators,
        initDrillState.mode.nameDisplay,
      );
      return {
        ...initDrillState,
        currentDrillPlayers: initialPlayers,
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
      players: selecteRandomizedPlayers(players, drillState.mode),
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
              <RadioGroup
                value={drillState.mode.nameDisplay}
                onValueChange={(e: { value: string }) => {
                  dispatch({
                    type: "settings",
                    mode: {
                      ...drillState.mode,
                      nameDisplay: e.value as NameDisplayMode,
                    },
                  });
                }}
              >
                <HStack gap={4}>
                  <Radio value="kanji">漢字のみ</Radio>
                  <Radio value="kana">ひらがなのみ</Radio>
                  <Radio value="both">両方</Radio>
                </HStack>
              </RadioGroup>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                対象選手
              </Text>
              <RadioGroup
                value={drillState.mode.role}
                onValueChange={(e: { value: string }) => {
                  dispatch({
                    type: "settings",
                    mode: { ...drillState.mode, role: e.value } as Mode,
                  });
                }}
              >
                <HStack gap={4}>
                  <Radio value="roster">支配下選手のみ</Radio>
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
                onValueChange={(e: { value: string }) => {
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
                  <Radio value="2">Easy</Radio>
                  <Radio value="3">Normal</Radio>
                  <Radio value="4">Hard</Radio>
                </HStack>
              </RadioGroup>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>
                使用する演算子
              </Text>
              <HStack gap={4}>
                {(Object.entries(OPERATORS) as [Operator, string][]).map(
                  ([value, label]) => (
                    <Box key={value}>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={drillState.mode.operators.includes(value)}
                          onChange={() => handleOperatorChange(value)}
                          style={{ width: "1.2rem", height: "1.2rem" }}
                        />
                        <span>
                          {value === "+" && "足し算"}
                          {value === "-" && "引き算"}
                          {value === "*" && "掛け算"}
                          {value === "/" && "割り算"}（{label}）
                        </span>
                      </label>
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
