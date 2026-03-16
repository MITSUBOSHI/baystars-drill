import { redirect } from "next/navigation";
import { cheerSongYears } from "@/lib/cheerSongs";

export default function CheerSongsRedirect() {
  const maxYear = Math.max(...cheerSongYears);
  redirect(`/cheer-songs/${maxYear}`);
  return null;
}
