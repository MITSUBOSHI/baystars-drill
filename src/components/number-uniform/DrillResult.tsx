import { Box, VStack, Text, Flex, Badge } from "@chakra-ui/react";
import Ruby from "@/components/common/Ruby";
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
            {isCorrected ? (
              <>
                🎉 <Ruby reading="せいかい">正解</Ruby>！
              </>
            ) : (
              <>
                😢 <Ruby reading="ふせいかい">不正解</Ruby>...
              </>
            )}
          </Text>
          <Box flex="1" />
          <Badge
            colorPalette={isCorrected ? "green" : "red"}
            fontSize="md"
            px={3}
            py={1}
          >
            {isCorrected ? (
              <Ruby reading="せいかい">正解</Ruby>
            ) : (
              <Ruby reading="ふせいかい">不正解</Ruby>
            )}
          </Badge>
        </Flex>
        <Box
          borderTopWidth="1px"
          borderColor={isCorrected ? "border.success" : "border.error"}
          pt={4}
        >
          <Text fontWeight="bold" mb={2}>
            <Ruby reading="かいせつ">解説</Ruby>：
          </Text>
          <Text fontSize="lg">
            {question.correctNumber} = {question.explanationSentence}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}
