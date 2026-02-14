import { Box, VStack, Text, Heading } from "@chakra-ui/react";
import OptionGroup from "@/components/common/OptionGroup";
import type { NameDisplayMode } from "@/types/common";
import type { Mode, Operator, ModeRoleType } from "@/lib/drill";

type Props = {
  mode: Mode;
  onModeChange: (mode: Mode) => void;
};

export default function DrillSettings({ mode, onModeChange }: Props) {
  const handleOperatorChange = (operator: Operator) => {
    const currentOperators = mode.operators;
    const newOperators = currentOperators.includes(operator)
      ? currentOperators.filter((op) => op !== operator)
      : [...currentOperators, operator];

    const operators =
      newOperators.length > 0 ? newOperators : (["+"] as Operator[]);
    onModeChange({ ...mode, operators });
  };

  return (
    <Box
      bg="surface.brand"
      p={6}
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border.brand"
    >
      <Heading size="md" mb={4}>
        ドリル設定
      </Heading>
      <VStack gap={4} align="stretch">
        <Box>
          <Text fontWeight="bold" mb={2}>
            選手名の表示
          </Text>
          <OptionGroup
            name="nameDisplay"
            options={[
              { value: "kanji", label: "漢字のみ" },
              { value: "kana", label: "ひらがなのみ" },
              { value: "both", label: "両方" },
            ]}
            selectedValues={[mode.nameDisplay]}
            onChange={(value) => {
              onModeChange({
                ...mode,
                nameDisplay: value as NameDisplayMode,
              });
            }}
          />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            対象選手
          </Text>
          <OptionGroup
            name="role"
            options={[
              { value: "roster", label: "支配下選手のみ" },
              { value: "all", label: "すべて" },
            ]}
            selectedValues={[mode.role]}
            onChange={(value) => {
              onModeChange({
                ...mode,
                role: value as ModeRoleType,
              });
            }}
          />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            難易度
          </Text>
          <OptionGroup
            name="playerNum"
            options={[
              { value: "2", label: "Easy" },
              { value: "3", label: "Normal" },
              { value: "4", label: "Hard" },
            ]}
            selectedValues={[String(mode.playerNum)]}
            onChange={(value) => {
              onModeChange({
                ...mode,
                playerNum: Number(value) as 2 | 3 | 4,
              });
            }}
          />
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>
            使用する演算子
          </Text>
          <OptionGroup
            name="operators"
            options={[
              { value: "+", label: "足し算（＋）" },
              { value: "-", label: "引き算（－）" },
              { value: "*", label: "掛け算（×）" },
              { value: "/", label: "割り算（÷）" },
            ]}
            selectedValues={mode.operators}
            onChange={(value) => handleOperatorChange(value as Operator)}
            multiple
          />
        </Box>
      </VStack>
    </Box>
  );
}
