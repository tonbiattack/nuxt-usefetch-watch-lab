export default defineEventHandler((event) => {
  const query = getQuery(event)
  const keyword = String(query.q ?? '')

  const catalog = [
    { id: 1, title: 'NuxtのSSRデータ取得', tags: ['nuxt', 'ssr'] },
    { id: 2, title: 'Vueのwatchとcomputed', tags: ['vue', 'reactivity'] },
    { id: 3, title: 'TypeScriptの型安全な検索', tags: ['typescript'] },
  ]

  const items = keyword === ''
    ? catalog
    : catalog.filter((item) => `${item.title} ${item.tags.join(' ')}`.toLowerCase().includes(keyword.toLowerCase()))

  return { keyword, items }
})
