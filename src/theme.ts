import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#E6F0FA" },
          100: { value: "#B3D4F0" },
          200: { value: "#80B8E6" },
          300: { value: "#4D9CDC" },
          400: { value: "#2680D2" },
          500: { value: "#0055A5" },
          600: { value: "#004A91" },
          700: { value: "#003F7D" },
          800: { value: "#003469" },
          900: { value: "#002955" },
        },
      },
    },
    semanticTokens: {
      colors: {
        "surface.card": {
          value: { base: "{colors.gray.50}", _dark: "{colors.gray.800}" },
        },
        "surface.card.subtle": {
          value: { base: "{colors.white}", _dark: "{colors.gray.700}" },
        },
        "surface.brand": {
          value: { base: "{colors.brand.50}", _dark: "{colors.brand.900}" },
        },
        "surface.success": {
          value: { base: "{colors.green.50}", _dark: "{colors.green.900}" },
        },
        "surface.error": {
          value: { base: "{colors.red.50}", _dark: "{colors.red.900}" },
        },
        "border.card": {
          value: { base: "{colors.gray.200}", _dark: "{colors.gray.600}" },
        },
        "border.brand": {
          value: { base: "{colors.brand.200}", _dark: "{colors.brand.700}" },
        },
        "border.success": {
          value: { base: "{colors.green.200}", _dark: "{colors.green.700}" },
        },
        "border.error": {
          value: { base: "{colors.red.200}", _dark: "{colors.red.700}" },
        },
        "text.primary": {
          value: { base: "{colors.gray.900}", _dark: "{colors.gray.100}" },
        },
        "text.secondary": {
          value: { base: "{colors.gray.600}", _dark: "{colors.gray.400}" },
        },
        "text.success": {
          value: { base: "{colors.green.600}", _dark: "{colors.green.300}" },
        },
        "interactive.primary": {
          value: { base: "{colors.brand.500}", _dark: "{colors.brand.300}" },
        },
        "interactive.primary.hover": {
          value: { base: "{colors.brand.600}", _dark: "{colors.brand.200}" },
        },
      },
    },
  },
});

export const system = createSystem(defaultConfig, config);
