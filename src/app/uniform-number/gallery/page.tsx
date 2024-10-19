type DataType = {
  year: number;
  player: PlayerType;
};
type PlayerType = {
  name: string;
  name_kana: string;
  number_calc: number;
  number_disp: string;
};
const data: DataType[] = [
  {
    year: 2024,
    player: {
      name: "三浦 大輔",
      name_kana: "みうら だいすけ",
      number_calc: 81,
      number_disp: "81",
    },
  },
  {
    year: 2024,
    player: {
      name: "林 琢真",
      name_kana: "はやし たくま",
      number_calc: 0,
      number_disp: "00",
    },
  },
];

export default function Index() {
  const currentYear = 2024; // TODO
  return (
    <>
      <h1>📖 選手図鑑 📖</h1>
      <h2> Year {currentYear} </h2>
      {data.map((d) => {
        return (
          <div key={d.player.number_disp}>
            {d.player.number_disp} | {d.player.name}({d.player.name_kana})
          </div>
        );
      })}
    </>
  );
}
