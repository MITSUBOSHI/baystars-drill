import Link from "next/link";

export default function Index() {
  return (
    <>
      <h1>⚾️ 背番号 ⚾️</h1>
      <div>
        <Link href="/uniform-number/gallery">選手図鑑</Link>
        <a>計算ドリル</a>
      </div>
    </>
  );
}
