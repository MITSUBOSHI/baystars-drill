import { registeredYears } from "@/constants/player";
import { draftYears } from "@/constants/draft";

const maxYear = Math.max(...registeredYears);
const maxDraftYear = Math.max(...draftYears);

export const navItems = [
  {
    title: "選手名鑑",
    titleReading: "せんしゅめいかん",
    href: `/player-directory/${maxYear}`,
    icon: "📖",
  },
  {
    title: "背番号計算ドリル",
    titleReading: "せばんごうけいさんどりる",
    href: `/number-drill/${maxYear}`,
    icon: "🖋",
  },
  {
    title: "スタメン作成",
    titleReading: "すためんさくせい",
    href: `/lineup-maker/${maxYear}`,
    icon: "⚾",
  },
  {
    title: "ユニフォームビュー",
    titleReading: "ゆにふぉーむびゅー",
    href: `/uniform-view/${maxYear}`,
    icon: "👕",
  },
  {
    title: "背番号タイマー",
    titleReading: "せばんごうたいまー",
    href: `/number-count/${maxYear}`,
    icon: "🔢",
  },
  {
    title: "応援歌",
    titleReading: "おうえんか",
    href: `/cheer-songs/${maxYear}`,
    icon: "🎵",
  },
  {
    title: "ドラフト一覧",
    titleReading: "どらふといちらん",
    href: `/draft/${maxDraftYear}`,
    icon: "📋",
  },
] as const;
