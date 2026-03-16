import { Text } from "@chakra-ui/react";
import { parseLyricLine } from "@/lib/rubyParser";

type LyricLineProps = {
  line: string;
  showRuby: boolean;
};

export default function LyricLine({ line, showRuby }: LyricLineProps) {
  const segments = parseLyricLine(line);

  return (
    <Text fontSize="lg" lineHeight="2.2">
      {segments.map((segment, i) => {
        if (segment.type === "text") {
          return <span key={i}>{segment.content}</span>;
        }
        if (showRuby) {
          return (
            <ruby key={i}>
              {segment.base}
              <rt>{segment.reading}</rt>
            </ruby>
          );
        }
        return <span key={i}>{segment.base}</span>;
      })}
    </Text>
  );
}
