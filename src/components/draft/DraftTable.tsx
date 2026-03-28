"use client";

import { DraftPick } from "@/types/DraftPick";

type DraftTableProps = {
  picks: DraftPick[];
  showYearColumn: boolean;
};

export default function DraftTable({ picks, showYearColumn }: DraftTableProps) {
  if (picks.length === 0) {
    return (
      <p className="text-center text-[var(--text-secondary)] py-8">
        該当する選手がいません
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-[var(--interactive-primary)] text-white sticky top-0 z-10">
            {showYearColumn && (
              <th className="px-3 py-2 text-left whitespace-nowrap">年</th>
            )}
            <th className="px-3 py-2 text-left whitespace-nowrap">種別</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">順位</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">名前</th>
            <th className="px-3 py-2 text-left whitespace-nowrap">
              ポジション
            </th>
            <th className="px-3 py-2 text-left whitespace-nowrap">出身</th>
          </tr>
        </thead>
        <tbody>
          {picks.map((pick, index) => (
            <tr
              key={`${pick.year}-${pick.category}-${pick.round}`}
              className={
                index % 2 === 0
                  ? "bg-[var(--surface-card)]"
                  : "bg-[var(--surface-card-subtle)]"
              }
            >
              {showYearColumn && (
                <td className="px-3 py-2 whitespace-nowrap">{pick.year}</td>
              )}
              <td className="px-3 py-2 whitespace-nowrap">
                <span
                  className={`inline-block text-xs px-1.5 py-0.5 rounded ${
                    pick.category === "regular"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  }`}
                >
                  {pick.category === "regular" ? "新人" : "育成"}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap">
                <span className="flex items-center gap-1">
                  {pick.round}位
                  {pick.isLotteryLoss && (
                    <span className="inline-block text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 font-bold">
                      ハズレ
                    </span>
                  )}
                </span>
              </td>
              <td className="px-3 py-2 whitespace-nowrap font-medium">
                {pick.name}
              </td>
              <td className="px-3 py-2 whitespace-nowrap">{pick.position}</td>
              <td className="px-3 py-2">{pick.team}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-xs text-[var(--text-secondary)] mt-2 text-right">
        データソース:{" "}
        <a
          href="https://draft.npb.jp/draft/2025/draftlist_db.html"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          NPB公式ドラフト会議
        </a>{" "}
        (https://draft.npb.jp/draft/$&#123;year&#125;/draftlist_db.html)
      </p>
    </div>
  );
}
