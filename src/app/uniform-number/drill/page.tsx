import { redirect } from "next/navigation";
import { registeredYears } from "@/constants/player";

export default function DrillRedirect() {
  const maxYear = Math.max(...registeredYears);

  const redirectUrl = `/uniform-number/drill/${maxYear}`;
  redirect(redirectUrl);

  // リダイレクトが失敗した場合のフォールバック（通常は実行されない）
  return null;
}
