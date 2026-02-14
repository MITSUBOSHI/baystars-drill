import { PlayerType, Role } from "@/types/Player";
import type { NameDisplayMode } from "@/types/common";

export const DEFAULT_PLAYER_SELECTION_NUMBER = 2;
export type ModeRoleType = "roster" | "all";
export type Operator = "+" | "-" | "*" | "/";
export const OPERATORS: Record<Operator, string> = {
  "+": "＋",
  "-": "－",
  "*": "×",
  "/": "÷",
};
export type Mode = {
  role: ModeRoleType;
  playerNum: 2 | 3 | 4;
  operators: Operator[];
  nameDisplay: NameDisplayMode;
};
export type Action =
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
export type DrillStateType = {
  currentDrillPlayers: PlayerType[];
  answeredNumber: number | null;
  showResult: boolean;
  mode: Mode;
  inputValue: string;
  currentOperatorSequence: Operator[];
};
export const initDrillState: DrillStateType = {
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
export const reducer = (
  prev: DrillStateType,
  action: Action,
): DrillStateType => {
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
export function selecteRandomizedPlayers(
  players: PlayerType[],
  mode: Mode,
): PlayerType[] {
  const usingRoles = RolesByModeRole[mode.role];
  const filteredPlayers = players.filter((p) => usingRoles.includes(p.role));
  const shuffledPlayers = shufflePlayers(filteredPlayers);
  const count = mode.playerNum;

  return shuffledPlayers.slice(0, count);
}
export type QuestionType = {
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

export function getDisplayName(
  player: PlayerType,
  mode: NameDisplayMode,
): string {
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

export function generateQuestionWithOperators(
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

export function generateDrillQuestion(
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
