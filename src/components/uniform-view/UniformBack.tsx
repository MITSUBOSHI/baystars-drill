"use client";

import { Box } from "@chakra-ui/react";

type UniformBackProps = {
  uniformName: string;
  numberDisp: string;
};

function getNameFontSize(name: string): string {
  if (name.length > 8) return "22";
  if (name.length > 6) return "28";
  return "34";
}

function getNumberFontSize(numberDisp: string): string {
  if (numberDisp.length > 2) return "90";
  return "120";
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
        {/* ユニフォーム外形 */}
        <path
          d="M 75,0 L 0,55 L 15,75 L 40,55 L 40,390 L 260,390 L 260,55 L 285,75 L 300,55 L 225,0 Z"
          fill="#FFFFFF"
          stroke="#CCCCCC"
          strokeWidth="1.5"
        />

        {/* 首元のカーブ */}
        <path
          d="M 120,0 Q 150,30 180,0"
          fill="none"
          stroke="#CCCCCC"
          strokeWidth="1.5"
        />

        {/* 肩の横ストライプ */}
        <rect x="75" y="0" width="150" height="3" fill="#C5A55A" />
        <rect x="75" y="3" width="150" height="5" fill="#0055A5" />
        <rect x="75" y="8" width="150" height="3" fill="#C5A55A" />

        {/* 左の縦ストライプ */}
        <rect x="127" y="11" width="2" height="379" fill="#C5A55A" />
        <rect x="129" y="11" width="14" height="379" fill="#0055A5" />
        <rect x="143" y="11" width="2" height="379" fill="#C5A55A" />

        {/* 右の縦ストライプ */}
        <rect x="155" y="11" width="2" height="379" fill="#C5A55A" />
        <rect x="157" y="11" width="14" height="379" fill="#0055A5" />
        <rect x="171" y="11" width="2" height="379" fill="#C5A55A" />

        {/* 袖口のストライプ */}
        <line x1="0" y1="55" x2="40" y2="55" stroke="#0055A5" strokeWidth="4" />
        <line
          x1="260"
          y1="55"
          x2="300"
          y2="55"
          stroke="#0055A5"
          strokeWidth="4"
        />

        {/* uniform_name テキスト */}
        <text
          x="150"
          y="80"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Oswald', sans-serif"
          fontWeight="700"
          fontSize={getNameFontSize(uniformName)}
          fill="#0055A5"
          stroke="#001F3F"
          strokeWidth="0.3"
          letterSpacing="2"
        >
          {uniformName}
        </text>

        {/* 背番号テキスト */}
        <text
          x="150"
          y="230"
          textAnchor="middle"
          dominantBaseline="central"
          fontFamily="'Oswald', sans-serif"
          fontWeight="700"
          fontSize={getNumberFontSize(numberDisp)}
          fill="#0055A5"
          stroke="#001F3F"
          strokeWidth="1"
        >
          {numberDisp}
        </text>
      </svg>
    </Box>
  );
}
