import Link from "next/link";
import { registeredYears } from "@/constants/player";

export default function Index() {
  const maxYear = Math.max(...registeredYears);

  return (
    <>
      <h1>⚾️ 背番号 ⚾️</h1>
      <div>
        <Link href={`/uniform-number/gallery/${maxYear}`}>選手図鑑</Link>
        <a>計算ドリル</a>
      </div>
    </>
  );
}
