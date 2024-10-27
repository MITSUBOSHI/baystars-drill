"use client";

import React, { useRef, useEffect, useReducer } from "react";
import { PlayerType } from "@/types/Player";
import { Button, HStack, Box, VStack, Text } from "@chakra-ui/react";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";

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
};
const initDrillState = {
  currentDrillPlayers: [],
  answeredNumber: null,
  showResult: false,
};
const reducer = (prev: DrillStateType, action: Action): DrillStateType => {
  switch (action.type) {
    case "init":
    case "retry":
      return {
        ...prev,
        ...initDrillState,
        currentDrillPlayers: action.players,
      };
    case "answering":
      return { ...prev, answeredNumber: action.value, showResult: false };
    case "answered":
      return { ...prev, showResult: true };
    default:
      throw new Error("unsupported action type is given");
  }
};

const PLAYER_SELECTION_NUMBER = 3;
const shufflePlayers = (players: PlayerType[]) =>
  players.sort(() => Math.random() - Math.random());
function selecteRandomizedPlayers(
  players: PlayerType[],
  count: number,
): PlayerType[] {
  const result: PlayerType[] = [];
  const shuffledPlayers = shufflePlayers(players);

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
  const selectedPlayers = selecteRandomizedPlayers(
    players,
    PLAYER_SELECTION_NUMBER,
  );
  const [drillState, dispatch] = useReducer(reducer, {
    ...initDrillState,
    currentDrillPlayers: selectedPlayers,
  });
  const question = generateQuestion(drillState.currentDrillPlayers);
  const isCorrected = question.correctNumber === drillState.answeredNumber;

  useEffect(() => {
    inputRef.current.focus();
    inputRef.current.value = "";
  }, [drillState.currentDrillPlayers]);

  return (
    <VStack justify={"center"}>
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
            dispatch({ type: "retry", players: selectedPlayers });
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
