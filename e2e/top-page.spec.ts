import { test, expect } from "@playwright/test";

test.describe("トップページ", () => {
  test("基本要素が表示される", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Baystars Drill" })).toBeVisible();
    await expect(page.getByText("横浜DeNAベイスターズの背番号で遊ぼう!")).toBeVisible();
    await expect(page.getByAltText("Baystars Drill Logo")).toBeVisible();
    await expect(page.getByText("個人が運営するファンサイト", { exact: false })).toBeVisible();
  });

  test("各機能ページへのリンクが存在する", async ({ page }) => {
    await page.goto("/");

    const features = [
      { name: "選手名鑑", href: "/player-directory/2025" },
      { name: "背番号計算ドリル", href: "/number-drill/2025" },
      { name: "スタメン作成", href: "/lineup-maker/2025" },
      { name: "ユニフォームビュー", href: "/uniform-view/2025" },
      { name: "背番号タイマー", href: "/number-count/2025" },
    ];

    for (const feature of features) {
      const link = page.getByRole("link", { name: new RegExp(feature.name) });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", feature.href);
    }
  });

  test("トップページから選手名鑑に遷移できる", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: /選手名鑑/ }).click();
    await page.waitForURL("**/player-directory/2025");

    await expect(page.getByRole("heading", { name: "選手名鑑" })).toBeVisible();
  });
});
