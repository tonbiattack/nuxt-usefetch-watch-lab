import { nextTick, ref, watch, type Ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { createSearchFetchOptions } from '../shared/search-options'

type SearchResult = { keyword: string }
type FetchOptions = ReturnType<typeof createSearchFetchOptions>

type Harness = {
  keyword: Ref<string>
  data: Ref<SearchResult>
}

function fakeUseFetch(options: FetchOptions): Harness {
  const keyword = options.query.q
  const data = ref<SearchResult>({ keyword: keyword.value })

  if (options.watch !== false) {
    watch(keyword, (value) => {
      data.value = { keyword: value }
    })
  }

  return { keyword, data }
}

describe('検索キーワードとuseFetchのreactive query', () => {
  it('キーワード変更後、検索結果も新しいキーワードになる', async () => {
    const keyword = ref('')
    const state = fakeUseFetch(createSearchFetchOptions(keyword))

    keyword.value = 'nuxt'
    await nextTick()

    // 利用者が期待する振る舞い。バグ状態ではここで失敗する。
    expect(state.data.value.keyword).toBe('nuxt')
  })
})
