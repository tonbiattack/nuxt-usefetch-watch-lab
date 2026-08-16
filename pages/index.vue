<script setup lang="ts">
const links = [
  { href: '/buggy', label: 'バグ状態を開く' },
  { href: '/fixed', label: '修正版を開く' },
]
</script>

<template>
  <main>
    <h1>Nuxt useFetch watch デバッグラボ</h1>
    <p>reactiveなqueryを変更したとき、検索結果が再取得されるかを比較します。</p>
    <nav>
      <NuxtLink v-for="link in links" :key="link.href" :to="link.href">{{ link.label }}</NuxtLink>
    </nav>
  </main>
</template>
