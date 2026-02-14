"use client";

import { Box } from "@chakra-ui/react";

type UniformBackProps = {
  uniformName: string;
  numberDisp: string;
};

const BAYSTARS_BLUE = "#004B98";
const GOLD = "#C9A84C";
const UNIFORM_PATH =
  "M 75,0 L 0,55 L 15,75 L 42,57 Q 44,120 48,160 L 48,380 Q 48,395 70,395 L 230,395 Q 252,395 252,380 L 252,160 Q 256,120 258,57 L 285,75 L 300,55 L 225,0 Z";

function getNameFontSize(name: string): string {
  if (name.length > 10) return "18";
  if (name.length > 8) return "22";
  if (name.length > 6) return "26";
  return "30";
}

function getNumberFontSize(numberDisp: string): string {
  if (numberDisp.length > 2) return "80";
  return "110";
}

export default function UniformBack({
  uniformName,
  numberDisp,
}: UniformBackProps) {
  return (
    <Box position="relative" w="100%" maxW="320px" mx="auto">
      <svg
        viewBox="0 0 300 400"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "auto" }}
        role="img"
        aria-label={`${uniformName} ${numberDisp}番のユニフォーム背面`}
      >
        <defs>
          <clipPath id="uniformClip">
            <path d={UNIFORM_PATH} />
          </clipPath>
        </defs>

        {/* ユニフォーム外形 */}
        <path
          d={UNIFORM_PATH}
          fill="#FFFFFF"
          stroke="#DDDDDD"
          strokeWidth="1.2"
        />

        {/* 首元のカーブ */}
        <path
          d="M 115,0 Q 150,35 185,0"
          fill="#FFFFFF"
          stroke="#DDDDDD"
          strokeWidth="1.2"
        />

        {/* クリッピングされたストライプ群 */}
        <g clipPath="url(#uniformClip)">
          {/* 肩の横ストライプ（ヨーク） */}
          <rect x="0" y="8" width="300" height="2" fill={GOLD} />
          <rect x="0" y="10" width="300" height="4" fill={BAYSTARS_BLUE} />
          <rect x="0" y="14" width="300" height="2" fill={GOLD} />

          {/* 縦ストライプ - 身頃全体に5本を等間隔配置 */}
          {/* ストライプ構成: 金1.5px + 青8px + 金1.5px = 計11px */}

          {/* ストライプ1 */}
          <rect x="72.5" y="16" width="1.5" height="379" fill={GOLD} />
          <rect x="74" y="16" width="8" height="379" fill={BAYSTARS_BLUE} />
          <rect x="82" y="16" width="1.5" height="379" fill={GOLD} />

          {/* ストライプ2 */}
          <rect x="106.5" y="16" width="1.5" height="379" fill={GOLD} />
          <rect x="108" y="16" width="8" height="379" fill={BAYSTARS_BLUE} />
          <rect x="116" y="16" width="1.5" height="379" fill={GOLD} />

          {/* ストライプ3（中央） */}
          <rect x="140.5" y="16" width="1.5" height="379" fill={GOLD} />
          <rect x="142" y="16" width="8" height="379" fill={BAYSTARS_BLUE} />
          <rect x="150" y="16" width="1.5" height="379" fill={GOLD} />

          {/* ストライプ4 */}
          <rect x="174.5" y="16" width="1.5" height="379" fill={GOLD} />
          <rect x="176" y="16" width="8" height="379" fill={BAYSTARS_BLUE} />
          <rect x="184" y="16" width="1.5" height="379" fill={GOLD} />

          {/* ストライプ5 */}
          <rect x="208.5" y="16" width="1.5" height="379" fill={GOLD} />
          <rect x="210" y="16" width="8" height="379" fill={BAYSTARS_BLUE} />
          <rect x="218" y="16" width="1.5" height="379" fill={GOLD} />

          {/* 左袖口ストライプ */}
          <line
            x1="0"
            y1="53"
            x2="42"
            y2="56"
            stroke={GOLD}
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1="55"
            x2="42"
            y2="58"
            stroke={BAYSTARS_BLUE}
            strokeWidth="3"
          />
          <line
            x1="0"
            y1="57"
            x2="42"
            y2="60"
            stroke={GOLD}
            strokeWidth="1.5"
          />

          {/* 右袖口ストライプ */}
          <line
            x1="258"
            y1="56"
            x2="300"
            y2="53"
            stroke={GOLD}
            strokeWidth="1.5"
          />
          <line
            x1="258"
            y1="58"
            x2="300"
            y2="55"
            stroke={BAYSTARS_BLUE}
            strokeWidth="3"
          />
          <line
            x1="258"
            y1="60"
            x2="300"
            y2="57"
            stroke={GOLD}
            strokeWidth="1.5"
          />
        </g>

        {/* uniform_name テキスト */}
        <text
          x="150"
          y="90"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-oswald), 'Oswald', sans-serif"
          fontWeight="700"
          fontSize={getNameFontSize(uniformName)}
          fill={BAYSTARS_BLUE}
          letterSpacing="3"
        >
          {uniformName}
        </text>

        {/* 背番号テキスト */}
        <text
          x="150"
          y="225"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="var(--font-oswald), 'Oswald', sans-serif"
          fontWeight="700"
          fontSize={getNumberFontSize(numberDisp)}
          fill={BAYSTARS_BLUE}
          stroke={BAYSTARS_BLUE}
          strokeWidth="0.5"
        >
          {numberDisp}
        </text>
      </svg>
    </Box>
  );
}
