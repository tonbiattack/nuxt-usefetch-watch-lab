# Nuxt 3 useFetch watch デバッグラボ

Nuxt 3 と TypeScript で、`useFetch` に reactive な query を渡したときの自動再取得契約を再現する最小教材です。

## 前提

Node.js 22 系、pnpm 11 系を使用します。Nuxt は `3.21.11`、Vue は `3.5.18`、Vitest は `3.2.4` に固定しています。Nuxt 3 の公式ドキュメントには 2026 年 7 月 31 日の EOL 表示があるため、教材の再現性のためにバージョンを固定しています。

## セットアップ

```bash
pnpm install
pnpm exec nuxt prepare
```

## 失敗の再現

バグ状態のGitコミットで次を実行します。

```bash
pnpm test
```

テストは、検索キーワードを変更したら結果の検索語も変更されるという利用者視点の振る舞いを検証します。バグ状態では `watch: false` によって `useFetch` の再取得が止まり、初期値が残るため失敗します。

アプリを起動する場合は次を実行し、`/buggy` で入力値だけが変わって結果が更新されないこと、`/fixed` で結果も更新されることを比較します。

```bash
pnpm dev
```

## 修正後の検証

```bash
pnpm test
pnpm typecheck
pnpm build
```

修正は `shared/search-options.ts` の `watch: false` を、reactive なキーワードを含む `watch: [keyword]` に変更するだけです。`useFetch` の自動監視を止める必要がある場合は `watch: false` を使えますが、入力値に応じた再取得が要件なら、既定の監視を維持するか、監視対象を明示します。

## 構成

| パス | 役割 |
|---|---|
| `pages/buggy.vue` | `watch: false` を使う再現ページ |
| `pages/fixed.vue` | 修正後の対照ページ |
| `shared/search-options.ts` | バグと修正の中心となるfetchオプション |
| `server/api/search.get.ts` | 決定的な検索APIスタブ |
| `tests/search-watch.test.ts` | 失敗ケースを残した振る舞いテスト |
| `docs/debugging-record.md` | 観測・仮説・修正の記録 |
