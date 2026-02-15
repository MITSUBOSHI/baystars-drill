"use client";

import { Box, HStack, Input } from "@chakra-ui/react";

type Option = {
  value: string;
  label: string;
};

type OptionGroupProps = {
  name: string;
  options: Option[];
  selectedValues: string[];
  onChange: (value: string) => void;
  multiple?: boolean;
  gap?: string;
};

export default function OptionGroup({
  name,
  options,
  selectedValues,
  onChange,
  multiple = false,
  gap: gapProp = "24px",
}: OptionGroupProps) {
  return (
    <HStack
      gap={gapProp}
      flexWrap="wrap"
      role={multiple ? "group" : "radiogroup"}
      aria-label={name}
    >
      {options.map((option) => {
        const isSelected = selectedValues.includes(option.value);
        return (
          <Box
            key={option.value}
            as="label"
            p={2}
            borderWidth="1px"
            borderRadius="md"
            borderColor={isSelected ? "interactive.primary" : "border.card"}
            bg={isSelected ? "interactive.primary" : "surface.card.subtle"}
            color={isSelected ? "white" : "text.primary"}
            cursor="pointer"
            transition="all 0.15s"
            _hover={{ borderColor: "interactive.primary.hover" }}
            role={multiple ? "checkbox" : "radio"}
            aria-checked={isSelected}
          >
            <Input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              hidden
            />
            {option.label}
          </Box>
        );
      })}
    </HStack>
  );
}
