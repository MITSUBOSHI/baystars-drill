/*
 * ドラフトデータのマニフェスト。チーム所有（同期対象外）。
 * 年の範囲はチームごとに異なるため、共有ロジック（src/lib/draft.ts）は
 * この map だけに依存する。
 */
import Draft2012 from "@/data/draft/2012.jsonl.json";
import Draft2013 from "@/data/draft/2013.jsonl.json";
import Draft2014 from "@/data/draft/2014.jsonl.json";
import Draft2015 from "@/data/draft/2015.jsonl.json";
import Draft2016 from "@/data/draft/2016.jsonl.json";
import Draft2017 from "@/data/draft/2017.jsonl.json";
import Draft2018 from "@/data/draft/2018.jsonl.json";
import Draft2019 from "@/data/draft/2019.jsonl.json";
import Draft2020 from "@/data/draft/2020.jsonl.json";
import Draft2021 from "@/data/draft/2021.jsonl.json";
import Draft2022 from "@/data/draft/2022.jsonl.json";
import Draft2023 from "@/data/draft/2023.jsonl.json";
import Draft2024 from "@/data/draft/2024.jsonl.json";
import Draft2025 from "@/data/draft/2025.jsonl.json";
import { DraftPick, DraftYear } from "@/types/DraftPick";

export const draftByYearMap: Record<DraftYear, DraftPick[]> = {
  2012: Draft2012 as DraftPick[],
  2013: Draft2013 as DraftPick[],
  2014: Draft2014 as DraftPick[],
  2015: Draft2015 as DraftPick[],
  2016: Draft2016 as DraftPick[],
  2017: Draft2017 as DraftPick[],
  2018: Draft2018 as DraftPick[],
  2019: Draft2019 as DraftPick[],
  2020: Draft2020 as DraftPick[],
  2021: Draft2021 as DraftPick[],
  2022: Draft2022 as DraftPick[],
  2023: Draft2023 as DraftPick[],
  2024: Draft2024 as DraftPick[],
  2025: Draft2025 as DraftPick[],
};
