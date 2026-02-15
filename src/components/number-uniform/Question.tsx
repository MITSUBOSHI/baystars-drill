"use client";

import { useReducer } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { PlayerType } from "@/types/Player";
import { VStack, Container } from "@chakra-ui/react";
import {
  initDrillState,
  reducer,
  generateQuestionWithOperators,
  generateDrillQuestion,
} from "@/lib/drill";
import DrillSettings from "./DrillSettings";
import DrillQuestion from "./DrillQuestion";
import DrillResult from "./DrillResult";

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

  return (
    <Container maxW="container.md" py={8}>
      <VStack gap={6} align="stretch">
        <DrillSettings
          mode={drillState.mode}
          onModeChange={(mode) => dispatch({ type: "settings", mode })}
        />

        <DrillQuestion
          question={question}
          inputValue={drillState.inputValue}
          showResult={drillState.showResult}
          onAnswer={() => {
            dispatch({ type: "answered" });
            sendGAEvent("event", "drill_answer", {
              is_correct: question.correctNumber === drillState.answeredNumber,
              operators: drillState.mode.operators.join(","),
              player_num: drillState.mode.playerNum,
            });
          }}
          onInputChange={(value, valueAsNumber) => {
            dispatch({ type: "answering", value, valueAsNumber });
          }}
          onRetry={() => {
            dispatch({ type: "retry", allPlayers: players });
          }}
        />

        {drillState.showResult && (
          <DrillResult isCorrected={isCorrected} question={question} />
        )}
      </VStack>
    </Container>
  );
};

export default Question;
