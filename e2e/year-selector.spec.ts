import { test, expect } from "@playwright/test";

test.describe("YearSelector", () => {
  test("各ページで YearSelector が表示される", async ({ page }) => {
    const pages = [
      "/player-directory/2025",
      "/number-drill/2025",
      "/lineup-maker/2025",
      "/uniform-view/2025",
      "/number-count/2025",
    ];

    for (const url of pages) {
      await page.goto(url);
      const button = page.getByRole("button", { name: /年を選択/ });
      await expect(button).toBeVisible();
      await expect(button).toContainText("2025");
    }
  });

  test("全年度のオプションが表示される", async ({ page }) => {
    await page.goto("/player-directory/2025");

    // ドロップダウンを開く
    await page.getByRole("button", { name: /年を選択/ }).click();

    const listbox = page.getByRole("listbox");
    await expect(listbox).toBeVisible();

    // 2020-2025 の6つのオプション
    const years = [2025, 2024, 2023, 2022, 2021, 2020];
    for (const year of years) {
      await expect(listbox.getByRole("option", { name: String(year) })).toBeVisible();
    }

    // 2025 が選択状態
    await expect(listbox.getByRole("option", { name: "2025" })).toHaveAttribute("aria-selected", "true");
  });

  test("年度を切り替えると対応するページに遷移する", async ({ page }) => {
    await page.goto("/player-directory/2025");

    await page.getByRole("button", { name: /年を選択/ }).click();
    await page.getByRole("option", { name: "2024" }).click();

    await page.waitForURL("**/player-directory/2024");
    await expect(page.getByRole("heading", { name: "選手名鑑" })).toBeVisible();
  });
});
