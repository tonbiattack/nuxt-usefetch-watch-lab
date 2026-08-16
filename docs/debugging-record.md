# デバッグ記録: reactive queryの変更で検索結果が更新されない

## 症状

入力欄の `keyword` は更新されるが、`useFetch` で取得した検索結果が初期値のまま残る。バグ状態では `/buggy`、修正後は `/fixed` で比較できる。

## 固定条件

| 項目 | 値 |
|---|---|
| Nuxt | 3.21.11 |
| Vue | 3.5.18 |
| Node.js | 22.13.0 |
| 検索API | `server/api/search.get.ts` の固定カタログ |
| 初期query | 空文字列 |
| 変更query | `nuxt` |

## 観測事実

失敗テストでは、キーワードを空文字列から `nuxt` へ変更して `nextTick()` を待った後も、取得結果に保持された検索語は空文字列だった。

```text
expected '' to be 'nuxt'
```

修正後は同じテストが成功し、変更後の検索語が `nuxt` になった。`pnpm typecheck` と `pnpm build` も成功した。

## 仮説の比較

| 仮説 | 予測 | 最小実験 | 結果 | 判定 |
|---|---|---|---|---|
| APIのフィルタ条件が誤っている | 初回取得から `nuxt` が検索できない | 固定APIを直接確認する | 空文字列では全件、`nuxt` では該当件が返る | 棄却 |
| `v-model` が入力値を更新していない | テスト後の `keyword` refも空文字列のまま | ref変更後の値を確認する | `keyword` は `nuxt` になっている | 棄却 |
| reactive queryの監視が無効化されている | queryは変わるが取得結果が初期値のまま | `watch: false` を `watch: [keyword]` に変える | 結果が `nuxt` に更新される | 採用 |

## 根本原因

`useFetch` は reactive なURLやfetch optionの変更を監視し、変更時に再取得できる。しかし `watch: false` はその監視を明示的に停止する設定である。したがって、queryに `keyword` refを渡していても、`watch: false` を併用すると入力変更は再取得の契機にならない。

これは型エラーではない。`watch: false` は有効な設定であり、ネットワーク障害でもない。要件である「入力値変更に応じた再取得」と設定の意味が衝突していた。

## 最小修正

```diff
-  watch: false,
+  watch: [keyword],
```

`watch: false` を削除して既定の監視へ戻す方法もある。今回の修正では「何を監視しているか」をコード上で明示するため、`keyword` を配列で指定した。監視対象が増える場合には、検索に関係するreactive sourceだけを指定する。

## 回帰確認

元の失敗テストは削除せず、そのまま修正後の成功テストとして残した。検証コマンドは次のとおり。

```bash
pnpm test
pnpm typecheck
pnpm build
```
