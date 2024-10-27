import Link from "next/link";
import { Heading, VStack, Button } from "@chakra-ui/react";
import { registeredYears } from "@/constants/player";

export default function Index() {
  const maxYear = Math.max(...registeredYears);

  return (
    <VStack justify={"center"}>
      <Heading size="4xl">⚾️ 背番号 ⚾️</Heading>
      <Link href={`/uniform-number/gallery/${maxYear}`}>
        <Button
          as="a"
          size="xl"
          variant="outline"
          colorPalette={"blue"}
          width={"200px"}
        >
          選手図鑑
        </Button>
      </Link>
      <Link href={`/uniform-number/drill/${maxYear}`}>
        <Button
          as="a"
          size="xl"
          variant="outline"
          colorPalette={"blue"}
          width={"200px"}
        >
          計算ドリル
        </Button>
      </Link>
    </VStack>
  );
}
