import { Box, VStack, Text, Heading, Button, Flex } from "@chakra-ui/react";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import Ruby from "@/components/common/Ruby";
import type { QuestionType } from "@/lib/drill";

type Props = {
  question: QuestionType;
  inputValue: string;
  showResult: boolean;
  onAnswer: () => void;
  onInputChange: (value: string, valueAsNumber: number) => void;
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
        <Ruby reading="もんだい">問題</Ruby>
      </Heading>
      <VStack gap={4} align="stretch">
        <Box
          p={3}
          bg="surface.card.subtle"
          borderRadius="md"
          borderWidth="1px"
          borderColor="border.card"
          aria-live="polite"
        >
          <Text fontSize="md" fontWeight="bold">
            {question.questionSentence}
          </Text>
        </Box>
        <Box>
          <Text mb={2} fontWeight="bold">
            <Ruby reading="こた">答</Ruby>えを
            <Ruby reading="にゅうりょく">入力</Ruby>してください：
          </Text>
          <NumberInputRoot
            size="lg"
            width="100%"
            min={-2000}
            max={2000}
            value={inputValue}
            onValueChange={(details: {
              value: string;
              valueAsNumber: number;
            }) => {
              onInputChange(details.value, details.valueAsNumber);
            }}
          >
            <NumberInputField
              disabled={!!showResult}
              placeholder="背番号の合計を入力..."
              aria-label="答えの入力欄"
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
          disabled={showResult || inputValue === ""}
        >
          <Ruby reading="かいとう">解答</Ruby>する
        </Button>
        <Button
          fontWeight="bold"
          color="white"
          bg="interactive.primary"
          _hover={{ bg: "interactive.primary.hover" }}
          onClick={onRetry}
          flex="1"
        >
          <Ruby reading="さいちょうせん">再挑戦</Ruby>
        </Button>
      </Flex>
    </Box>
  );
}
