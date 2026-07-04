# Baystars Drill

See https://mitsuboshi.github.io/baystars-drill/

## 共有コードの運用（upstream）

このリポジトリは hawks-drill / lions-drill と共通のコードベースの**正本（upstream）**。
チーム差分は `src/config/team.config.json`・`src/config/theme.css`・`src/data/**` などの
チーム所有ファイルに閉じ込め、それ以外の共有コードは 3 リポジトリで同一に保つ。

- 共有/チーム所有の境界: `scripts/sync/shared-paths.txt`
- 共有コードの変更は**このリポジトリで**行い、以下で配布する:

```sh
bash scripts/sync/sync-shared.sh ../hawks-drill
bash scripts/sync/sync-shared.sh ../lions-drill
```

- 乖離検知: 各チームリポジトリの CI（`.github/workflows/shared-drift.yml`）が
  毎日 upstream と比較し、共有コードがズレていると fail する。
  手元では `bash scripts/sync/check-drift.sh <upstreamのパス>` で確認できる。
