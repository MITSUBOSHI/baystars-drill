'use client';

import React, { useState, useMemo } from 'react';
import { PlayerType, Year } from "@/types/Player";
import { Button, HStack, Box, VStack, Text, Input } from "@chakra-ui/react";
import Link from "next/link";


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
  questionSentence: string,
  correctNumber: number,
  explanationSentence: string
}
function generateQuestion(players: PlayerType[]): QuestionType {
  const questionSentence = players.map((p) => `${p.name}（${p.name_kana}）`).join(" ＋ ");
  const correctNumber = players.reduce((sum, p) => sum + p.number_calc, 0);
  const explanationSentence = players.map((p) => `${p.number_disp}（${p.name}）`).join(" ＋ ");

  return {
    questionSentence,
    correctNumber,
    explanationSentence
  };
}

type Props = {
  players: PlayerType[]
}

const Question: React.FC<Props> = ({ players }) => {
  const [session, setSession] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);
  const selectedPlayers = useMemo(() =>
    selecteRandomizedPlayers(
      players,
      PLAYER_SELECTION_NUMBER,
    )
  , [session]);
  const question = useMemo(() => generateQuestion(selectedPlayers), [selectedPlayers]);
  const handleonRetryClick = () => {
    setShowResult(false);
    setSession(false);
  };

  return (
    <VStack justify={"center"}>
      <Text>問題: {question.questionSentence}</Text>
      <Input type="number" maxWidth={"70%"} height={'50px'} min={1} onChange={(e) => (setInputValue(Number(e.target.value) ?? 0))} disabled={!!showResult}/>
      <HStack>
        <Button variant="outline" onClick={() => {setShowResult(true)}} width={'100px'}>解答する</Button>
        <Button variant="outline" onClick={async () => handleonRetryClick() } width={'100px'}>再挑戦</Button>
      </HStack>
      {showResult == true ? <>
        <Box bgColor="blue.300" width="400px" padding="10px">
          <Text>
            { (question.correctNumber === inputValue) ? '正解🎉' : '不正解😢' }
          </Text>
          <Text>
            {question.correctNumber} = {question.explanationSentence}
          </Text>
        </Box>
      </> : null}
    </VStack>
  );
}
export default Question;
