import { Box, VStack, Text, Flex, Collapsible } from "@chakra-ui/react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import OptionGroup from "@/components/common/OptionGroup";

type CountDirection = "up" | "down";

type Props = {
  direction: CountDirection;
  onDirectionChange: (direction: CountDirection) => void;
  intervalMs: number;
  onIntervalMsChange: (ms: number) => void;
  countLimit: number;
  countLimitInput: string;
  onCountLimitSelect: (value: string) => void;
  onCountLimitFocus: () => void;
  onCountLimitBlur: () => void;
  speechEnabled: boolean;
  onSpeechEnabledChange: (enabled: boolean) => void;
  disabled: boolean;
};

const countLimitPresets = [10, 15, 20, 30, 45, 60, 90, 99];

const speedOptions = [
  { value: "2000", label: "ゆっくり (2秒)" },
  { value: "1000", label: "ふつう (1秒)" },
  { value: "500", label: "はやい (0.5秒)" },
];

export default function CounterSettings({
  direction,
  onDirectionChange,
  intervalMs,
  onIntervalMsChange,
  countLimit,
  countLimitInput,
  onCountLimitSelect,
  onCountLimitFocus,
  onCountLimitBlur,
  speechEnabled,
  onSpeechEnabledChange,
  disabled,
}: Props) {
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
            設定
            <FiChevronRight className="chevron-right" />
            <FiChevronDown className="chevron-down" />
          </Flex>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <VStack gap={4} align="stretch" px={6} pb={6}>
            <Box>
              <Text fontWeight="bold" mb={2}>
                カウント数
              </Text>
              <Flex align="center" gap={2}>
                <input
                  list="count-limit-options"
                  value={countLimitInput}
                  onChange={(e) => onCountLimitSelect(e.target.value)}
                  onFocus={onCountLimitFocus}
                  onClick={onCountLimitFocus}
                  onBlur={onCountLimitBlur}
                  disabled={disabled}
                  aria-label="カウント数"
                  style={{
                    width: "64px",
                    fontSize: "14px",
                    padding: "4px 8px",
                    border:
                      "1px solid var(--chakra-colors-border-card, #ccc)",
                    borderRadius: "4px",
                    background:
                      "var(--chakra-colors-surface-card-subtle, white)",
                    color: "var(--chakra-colors-text-primary, #000)",
                    textAlign: "center",
                  }}
                />
                <datalist id="count-limit-options">
                  {countLimitPresets.map((n) => (
                    <option key={n} value={n} />
                  ))}
                </datalist>
              </Flex>
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                方向
              </Text>
              <OptionGroup
                name="direction"
                options={[
                  { value: "up", label: "カウントアップ" },
                  { value: "down", label: "カウントダウン" },
                ]}
                selectedValues={[direction]}
                onChange={(value) =>
                  onDirectionChange(value as CountDirection)
                }
                gap="8px"
              />
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                速度
              </Text>
              <OptionGroup
                name="speed"
                options={speedOptions}
                selectedValues={[String(intervalMs)]}
                onChange={(value) => onIntervalMsChange(Number(value))}
                gap="8px"
              />
            </Box>

            <Box>
              <Text fontWeight="bold" mb={2}>
                音声
              </Text>
              <OptionGroup
                name="speech"
                options={[
                  { value: "on", label: "ON" },
                  { value: "off", label: "OFF" },
                ]}
                selectedValues={[speechEnabled ? "on" : "off"]}
                onChange={(value) => onSpeechEnabledChange(value === "on")}
                gap="8px"
              />
            </Box>
          </VStack>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  );
}
