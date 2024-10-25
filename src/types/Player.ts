import { registeredYears } from "@/constants/player";

export type Year = (typeof registeredYears)[number];
export enum Role {
  Coach = "coach",
  Roster = "roster",
  Training = "training",
}
export const NameByRole: Record<Role, string> = {
  [Role.Coach]: "監督・コーチ",
  [Role.Roster]: "支配下登録",
  [Role.Training]: "育成枠",
};
export type PlayerType = {
  year: Year;
  name: string;
  name_kana: string;
  number_calc: number;
  number_disp: string;
  role: Role;
  url: string;
};
