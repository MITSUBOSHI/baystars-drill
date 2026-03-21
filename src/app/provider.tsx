"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { system } from "@/theme";
import { FuriganaProvider } from "@/contexts/FuriganaContext";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <FuriganaProvider>{props.children}</FuriganaProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
