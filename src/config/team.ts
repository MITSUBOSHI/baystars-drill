import config from "./team.config.json";

export type DescriptionKey = keyof typeof config.descriptionTemplate;

export type SubtitleSegment = {
  text: string;
  reading?: string;
};

export type TeamConfig = typeof config & {
  subtitleSegments: SubtitleSegment[];
};

export const TEAM = config as TeamConfig;

export function describe(
  key: DescriptionKey,
  vars: Record<string, string | number> = {},
): string {
  return TEAM.descriptionTemplate[key].replace(/\{(\w+)\}/g, (_, k) =>
    String(vars[k] ?? ""),
  );
}

// 横浜ベイスターズ時代(DeNA以前)のドラフトは別URLテンプレート(draftlist_yb)。
// legacyDraftMaxYear 以前は legacy テンプレートを使う。
export function draftUrlForYear(year: number): string {
  const { npb } = TEAM;
  const useLegacy =
    typeof npb.legacyDraftMaxYear === "number" &&
    year <= npb.legacyDraftMaxYear &&
    typeof npb.legacyDraftUrlTemplate === "string";
  const template = useLegacy
    ? npb.legacyDraftUrlTemplate
    : npb.draftUrlTemplate;
  return template.replace("{year}", String(year));
}
