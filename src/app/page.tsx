import Link from "next/link";
import { Heading, VStack, Image, Button } from "@chakra-ui/react";
import Logo from "./baystars_drill.png";

export default function Home() {
  return (
    <VStack justify={"center"}>
      <Image src={Logo.src} h={"200px"} alt="Baystars Drill Logo" />
      <Heading size="6xl">Baystars Drill</Heading>
      <Link href="/uniform-number/">
        <Button as="a" size="xl" variant="outline" colorPalette={"blue"}>
          背番号ページ
        </Button>
      </Link>
    </VStack>
  );
}
