import { cheerSongsByYear, cheerSongYears } from "./cheerSongs";

describe("cheerSongYears", () => {
  it("曲データに存在する年を昇順・重複なしで返す", () => {
    expect(cheerSongYears.length).toBeGreaterThan(0);
    const sorted = [...cheerSongYears].sort((a, b) => a - b);
    expect(cheerSongYears).toEqual(sorted);
    expect(new Set(cheerSongYears).size).toBe(cheerSongYears.length);
  });
});

describe("cheerSongsByYear", () => {
  it("指定した年の曲と年に紐づかない共通曲だけを返す", () => {
    for (const year of cheerSongYears) {
      const songs = cheerSongsByYear(year);
      expect(songs.length).toBeGreaterThan(0);
      for (const song of songs) {
        expect(song.year == null || song.year === year).toBe(true);
      }
    }
  });

  it("存在しない年では年に紐づかない共通曲のみ返す", () => {
    const songs = cheerSongsByYear(1900);
    for (const song of songs) {
      expect(song.year == null).toBe(true);
    }
  });
});
