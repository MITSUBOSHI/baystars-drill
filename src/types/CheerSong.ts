export type SongCategory =
  | "right_pitcher"
  | "left_pitcher"
  | "foreign_pitcher"
  | "individual_batter"
  | "pinch_hitter"
  | "catcher"
  | "right_batter"
  | "left_batter"
  | "manager";

export type ApplicablePlayer = {
  name: string;
  callName: string;
  number: string;
};

export type CheerSongType = {
  id: string;
  title: string;
  category: SongCategory;
  year: number;
  lyrics: string[];
  playerName?: string;
  playerNumber?: string;
  namePlaceholder?: string;
  applicablePlayers?: ApplicablePlayer[];
  url?: string;
  isCommon: boolean;
};
