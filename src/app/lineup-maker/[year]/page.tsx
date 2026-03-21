import { Suspense } from "react";
import type { Metadata } from "next";
import { registeredYears } from "@/constants/player";
import { playersByYear } from "@/lib/players";
import { Year } from "@/types/Player";
import LineupCreator from "@/components/lineup/LineupCreator";
import YearSelector from "@/components/common/YearSelector";
import PageTitle from "@/components/common/PageTitle";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ year: Year }>;
}): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `${year}年 スタメン作成`,
    description: `横浜DeNAベイスターズ${year}年の選手でオリジナルスタメンを作成`,
  };
}

export async function generateStaticParams() {
  return registeredYears.map((y) => ({ year: y.toString() }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ year: Year }>;
}) {
  const { year } = await params;
  const currentYear = Number(year) as Year;
  const players = playersByYear(currentYear);

  return (
    <div className="flex flex-col items-center w-full gap-6 py-4">
      <PageTitle title="スタメン作成" reading="すためんさくせい" />
      <YearSelector currentYear={currentYear} baseUrl="/lineup-maker" />
      <div className="w-full max-w-full md:max-w-[800px] px-4">
        <Suspense>
          <LineupCreator players={players} />
        </Suspense>
      </div>
    </div>
  );
}
