<script setup>
import { useData } from 'vitepress'
import { ref } from 'vue'
import { getDate } from '../utils'

const defaultAuthor = 'Lyn'
const author = ref(defaultAuthor)
const { frontmatter } = useData()

const publishedTime = getDate(frontmatter.value?.date)
if (frontmatter.value?.author) {
  author.value = frontmatter.value?.author
}
</script>

<template>
  <div class="page_info">
    <span class="page_info_item">
      🎨
      <span>作者: {{ author }}</span>
    </span>
    <span v-if="publishedTime" class="page_info_item">
      🕐
      <span>发表于: {{ publishedTime }}</span>
    </span>
    <span class="page_info_item">
      📔
      <span id="busuanzi_container_page_pv">
        阅读量:
        <span id="busuanzi_value_page_pv"></span>
      </span>
    </span>
  </div>
</template>

<style>
.page_info {
  margin-bottom: 48px;
}

.page_info .page_info_item {
  font-size: 16px;
  color: #7f7f7f;
  margin-right: 10px;
}
</style>
