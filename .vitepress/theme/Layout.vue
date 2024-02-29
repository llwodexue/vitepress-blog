<template>
  <Layout>
    <!-- <template #home-features-after>
      <Statistics />
    </template> -->
    <!-- <template #doc-before>
      <PageInfo />
    </template> -->
    <template #doc-after>
      <Comment />
    </template>
  </Layout>
</template>

<script lang="ts" setup>
import DefaultTheme from 'vitepress/theme'
import Comment from './components/Comment.vue'
// import PageInfo from './components/PageInfo.vue'
// import Statistics from './components/Statistics.vue'

const { Layout } = DefaultTheme
</script>
