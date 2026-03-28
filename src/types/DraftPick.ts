import { draftYears } from "@/constants/draft";

export type DraftYear = (typeof draftYears)[number];
export type DraftCategory = "regular" | "development";
export type DraftPick = {
  year: DraftYear;
  category: DraftCategory;
  round: number;
  name: string;
  position: string;
  team: string;
  isLotteryLoss: boolean;
};
