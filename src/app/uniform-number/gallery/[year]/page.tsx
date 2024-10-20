import { registeredYears } from "@/constants/player";
import { Year } from "@/types/Player";
import Players2022 from "@/data/2022-players.jsonl.json";
import Players2023 from "@/data/2023-players.jsonl.json";
import Players2024 from "@/data/2024-players.jsonl.json";

function playersByYear(year: Year) {
  switch (year) {
    case 2022:
      return Players2022;
    case 2023:
      return Players2023;
    case 2024:
      return Players2024;
  }
}

export async function generateStaticParams() {
  return registeredYears.map((y) => ({ year: y.toString() }));
}

export default function Page({ params }: { params: { year: Year } }) {
  const currentYear = Number(params.year) as Year; // TODO: path paramsがデフォstring。type castの設定は要確認。
  const players = playersByYear(currentYear);

  return (
    <>
      <h1>📖 選手図鑑 📖</h1>
      <h2> Year {currentYear} </h2>
      {players.map((player) => {
        return (
          <div key={player.number_disp}>
            {player.number_disp} |{" "}
            <a href={player.url}>
              {player.name}（{player.name_kana}）
            </a>
          </div>
        );
      })}
    </>
  );
}
