import type { Ref } from 'vue'

type SearchFetchOptions = {
  query: { q: Ref<string> }
  watch: false | [Ref<string>]
}

// reactiveなqueryの変更をuseFetchの自動再取得へ伝える。
export const createSearchFetchOptions = (keyword: Ref<string>): SearchFetchOptions => ({
  query: { q: keyword },
  watch: [keyword],
})
