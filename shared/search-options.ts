import type { Ref } from 'vue'

type SearchFetchOptions = {
  query: { q: Ref<string> }
  watch: false | [Ref<string>]
}

// 意図的なバグ: reactiveなqueryの変更による再取得を止めている。
export const createSearchFetchOptions = (keyword: Ref<string>): SearchFetchOptions => ({
  query: { q: keyword },
  watch: false,
})
