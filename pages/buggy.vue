<script setup lang="ts">
import { createSearchFetchOptions } from '~/shared/search-options'

const keyword = ref('')

// 意図的なバグは shared/search-options.ts にある。
const { data, status } = await useFetch('/api/search', createSearchFetchOptions(keyword))
</script>

<template>
  <main>
    <h1>検索（buggy）</h1>
    <label>
      キーワード
      <input v-model="keyword" aria-label="キーワード">
    </label>
    <p data-testid="status">status: {{ status }}</p>
    <p data-testid="keyword">入力値: {{ keyword }}</p>
    <ul data-testid="results">
      <li v-for="item in data?.items ?? []" :key="item.id">{{ item.title }}</li>
    </ul>
  </main>
</template>
