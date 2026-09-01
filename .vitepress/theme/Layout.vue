<template>
  <ReadingProgress />
  <PwaUpdatePrompt />
  <Layout :class="layoutClass">
    <template #home-features-after>
      <HomeDiscover />
    </template>
    <template #doc-after>
      <Comment />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import { defineAsyncComponent, shallowRef, watch } from 'vue'
import HomeDiscover from './components/HomeDiscover.vue'
import PwaUpdatePrompt from './components/PwaUpdatePrompt.vue'
import ReadingProgress from './components/ReadingProgress.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
const Comment = defineAsyncComponent(() => import('./components/Comment.vue'))
const layoutClass = shallowRef('')

watch(
  frontmatter,
  value => {
    layoutClass.value = typeof value?.layoutClass === 'string' ? value.layoutClass : ''
  },
  { immediate: true }
)
</script>
