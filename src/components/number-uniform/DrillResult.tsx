import { Box, VStack, Text, Flex, Badge } from "@chakra-ui/react";
import type { QuestionType } from "@/lib/drill";

type Props = {
  isCorrected: boolean;
  question: QuestionType;
};

export default function DrillResult({ isCorrected, question }: Props) {
  return (
    <Box
      bg={isCorrected ? "surface.success" : "surface.error"}
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={isCorrected ? "border.success" : "border.error"}
      role="alert"
      aria-live="polite"
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
          borderColor={isCorrected ? "border.success" : "border.error"}
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
  );
}
