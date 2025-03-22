import { redirect } from "next/navigation";
import { registeredYears } from "@/constants/player";

export default function GalleryRedirect() {
  const maxYear = Math.max(...registeredYears);
  const redirectUrl = `/uniform-number/gallery/${maxYear}`;
  redirect(redirectUrl);

  // リダイレクトが失敗した場合のフォールバック（通常は実行されない）
  return null;
}
