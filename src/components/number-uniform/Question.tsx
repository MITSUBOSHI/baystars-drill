"use client";

import React, { useRef, useEffect, useReducer } from "react";
import { PlayerType, Role } from "@/types/Player";
import { Button, HStack, Box, VStack, Text } from "@chakra-ui/react";
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
};
const initDrillState = {
  currentDrillPlayers: [],
  answeredNumber: null,
  showResult: false,
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
      return { ...prev, answeredNumber: action.value, showResult: false };
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
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;
  const [drillState, dispatch] = useReducer(reducer, {
    ...initDrillState,
    currentDrillPlayers: selecteRandomizedPlayers(players, initDrillState.mode),
  });
  const question = generateQuestion(drillState.currentDrillPlayers);
  const isCorrected = question.correctNumber === drillState.answeredNumber;

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.value = "";
  }, [drillState.currentDrillPlayers]);

  return (
    <VStack justify={"center"}>
      <VStack>
        <RadioGroup
          value={drillState.mode.role}
          onValueChange={(e) => {
            dispatch({
              type: "settings",
              mode: { ...drillState.mode, role: e.value } as Mode,
            });
          }}
        >
          <Text>設定: 対象範囲</Text>
          <Radio value="rooster">支配下選手のみ</Radio>
          <Radio value="all">すべて</Radio>
        </RadioGroup>
        <RadioGroup
          value={String(drillState.mode.playerNum)}
          onValueChange={(e) => {
            dispatch({
              type: "settings",
              mode: { ...drillState.mode, playerNum: Number(e.value) } as Mode,
            });
          }}
        >
          <Text>設定: 難易度</Text>
          <Radio value="2">Easy</Radio>
          <Radio value="3">Normal</Radio>
          <Radio value="4">Hard</Radio>
        </RadioGroup>
      </VStack>
      <Text>問題: {question.questionSentence}</Text>
      <NumberInputRoot
        size={"lg"}
        width="300px"
        defaultValue=""
        min={0}
        max={2000}
      >
        <NumberInputField
          ref={inputRef}
          onChange={(e) => {
            dispatch({ type: "answering", value: Number(e.target.value) });
          }}
          disabled={!!drillState.showResult}
        />
      </NumberInputRoot>
      <HStack>
        <Button
          variant="outline"
          onClick={() => {
            dispatch({ type: "answered" });
          }}
          width={"100px"}
        >
          解答する
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            dispatch({
              type: "retry",
              players: selecteRandomizedPlayers(players, drillState.mode),
            });
          }}
          width={"100px"}
        >
          再挑戦
        </Button>
      </HStack>
      {drillState.showResult == true ? (
        <>
          <Box
            bgColor={isCorrected ? "blue.300" : "red.300"}
            width="400px"
            padding="10px"
          >
            <Text>{isCorrected ? "正解🎉" : "不正解😢"}</Text>
            <Text>
              {question.correctNumber} = {question.explanationSentence}
            </Text>
          </Box>
        </>
      ) : null}
    </VStack>
  );
};
export default Question;
