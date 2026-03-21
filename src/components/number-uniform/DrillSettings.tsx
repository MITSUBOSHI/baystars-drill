import { Box, VStack, Text, Collapsible, Flex } from "@chakra-ui/react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import OptionGroup from "@/components/common/OptionGroup";
import Ruby from "@/components/common/Ruby";
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
      borderRadius="lg"
      borderWidth="1px"
      borderColor="border.brand"
    >
      <Collapsible.Root>
        <Collapsible.Trigger asChild>
          <Flex
            as="button"
            w="100%"
            p={4}
            align="center"
            justify="space-between"
            cursor="pointer"
            fontWeight="bold"
            fontSize="md"
            _open={{
              "& > .chevron-down": { display: "inline" },
              "& > .chevron-right": { display: "none" },
            }}
            _closed={{
              "& > .chevron-down": { display: "none" },
              "& > .chevron-right": { display: "inline" },
            }}
          >
            <Ruby reading="せってい">設定</Ruby>
            <FiChevronRight className="chevron-right" />
            <FiChevronDown className="chevron-down" />
          </Flex>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <VStack gap={4} align="stretch" px={6} pb={6}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                <Ruby reading="たいしょうせんしゅ">対象選手</Ruby>
              </Text>
              <OptionGroup
                name="role"
                options={[
                  {
                    value: "roster",
                    label: (
                      <>
                        <Ruby reading="しはいか">支配下</Ruby>
                        <Ruby reading="せんしゅ">選手</Ruby>のみ
                      </>
                    ),
                  },
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
                <Ruby reading="なんいど">難易度</Ruby>
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
                <Ruby reading="しようする">使用する</Ruby>
                <Ruby reading="えんざんし">演算子</Ruby>
              </Text>
              <OptionGroup
                name="operators"
                options={[
                  {
                    value: "+",
                    label: (
                      <>
                        <Ruby reading="た">足</Ruby>し<Ruby reading="ざん">算</Ruby>（＋）
                      </>
                    ),
                  },
                  {
                    value: "-",
                    label: (
                      <>
                        <Ruby reading="ひ">引</Ruby>き<Ruby reading="ざん">算</Ruby>（－）
                      </>
                    ),
                  },
                  {
                    value: "*",
                    label: (
                      <>
                        <Ruby reading="か">掛</Ruby>け<Ruby reading="ざん">算</Ruby>（×）
                      </>
                    ),
                  },
                  {
                    value: "/",
                    label: (
                      <>
                        <Ruby reading="わ">割</Ruby>り<Ruby reading="ざん">算</Ruby>（÷）
                      </>
                    ),
                  },
                ]}
                selectedValues={mode.operators}
                onChange={(value) => handleOperatorChange(value as Operator)}
                multiple
              />
            </Box>
          </VStack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
