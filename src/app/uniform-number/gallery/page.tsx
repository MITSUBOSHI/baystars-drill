import Players2024 from '@/data/2024-players.jsonl.json';

export default function Index() {
  const currentYear = 2024; // TODO
  return (
    <>
      <h1>📖 選手図鑑 📖</h1>
      <h2> Year {currentYear} </h2>
      {Players2024.map((player) => {
        return (
          <div key={player.number_disp}>
            {player.number_disp} | {player.name}({player.name_kana})
          </div>
        );
      })}
    </>
  );
}
