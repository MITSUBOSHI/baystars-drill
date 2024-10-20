type Year = 2024;
export enum Role {
  Coach = 'coach',
  Roster = 'roster',
  Training = 'training'
}
export type PlayerType = {
  year: Year,
  name: string;
  name_kana: string;
  number_calc: number;
  number_disp: string;
  role: Role;
  url: string;
};
