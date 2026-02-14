import React from "react";
import { Box, VStack, Text, Heading, Button, Flex } from "@chakra-ui/react";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import type { QuestionType } from "@/lib/drill";

type Props = {
  question: QuestionType;
  inputValue: string;
  showResult: boolean;
  onAnswer: () => void;
  onInputChange: (value: number) => void;
  onRetry: () => void;
};

export default function DrillQuestion({
  question,
  inputValue,
  showResult,
  onAnswer,
  onInputChange,
  onRetry,
}: Props) {
  return (
    <Box
      bg="surface.card"
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border.card"
    >
      <Heading size="md" mb={4}>
        問題
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
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              onInputChange(Number(e.target.value));
            }}
          >
            <NumberInputField
              disabled={!!showResult}
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
          onClick={onAnswer}
          flex="1"
          disabled={showResult}
        >
          解答する
        </Button>
        <Button
          fontWeight="bold"
          color="white"
          bg="interactive.primary"
          _hover={{ bg: "interactive.primary.hover" }}
          onClick={onRetry}
          flex="1"
        >
          再挑戦
        </Button>
      </Flex>
    </Box>
  );
}
