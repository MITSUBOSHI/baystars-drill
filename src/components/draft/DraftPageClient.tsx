"use client";

import { DraftPick } from "@/types/DraftPick";
import DraftFilters from "@/components/draft/DraftFilters";
import DraftTable from "@/components/draft/DraftTable";

type DraftPageClientProps = {
  singleYearPicks: DraftPick[];
  allPicks: DraftPick[];
};

export default function DraftPageClient({
  singleYearPicks,
  allPicks,
}: DraftPageClientProps) {
  return (
    <DraftFilters singleYearPicks={singleYearPicks} allPicks={allPicks}>
      {(filteredPicks, showAllYears) => (
        <DraftTable picks={filteredPicks} showYearColumn={showAllYears} />
      )}
    </DraftFilters>
  );
}
