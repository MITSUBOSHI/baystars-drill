"use client";

import { Heading } from "@chakra-ui/react";
import Ruby from "@/components/common/Ruby";

type PageTitleProps = {
  title: string;
  reading: string;
};

export default function PageTitle({ title, reading }: PageTitleProps) {
  return (
    <Heading size="4xl">
      <Ruby reading={reading}>{title}</Ruby>
    </Heading>
  );
}
