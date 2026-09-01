<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { useData } from 'vitepress'
import { getDate } from '../../utils'

interface Props {
  readTime?: number | string
  words?: number | string
}

const props = defineProps<Props>()
const defaultAuthor = 'Lyn'
const { frontmatter } = useData()
const copied = shallowRef(false)

const author = computed(() =>
  typeof frontmatter.value?.author === 'string' ? frontmatter.value.author : defaultAuthor
)
const publishedTime = computed(() => getDate(frontmatter.value?.date))

async function copyLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = window.location.href
    textArea.setAttribute('readonly', '')
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    textArea.remove()
  }

  copied.value = true
  window.setTimeout(() => {
    copied.value = false
  }, 1600)
}
</script>

<template>
  <div class="page_info">
    <span class="page_info_item">
      🎨
      <span>作者：{{ author }}</span>
    </span>
    <span v-if="publishedTime" class="page_info_item">
      🕐
      <span>发表于：{{ publishedTime }}</span>
    </span>
    <span v-if="props.words != null" class="page_info_item">
      📝
      <span>
        字数：{{ Number(props.words) >= 1000 ? `${Math.round(Number(props.words) / 100) / 10}k` : props.words }} 字
      </span>
    </span>
    <span v-if="props.readTime != null" class="page_info_item">
      📖
      <span>阅读时间：{{ props.readTime }} 分钟</span>
    </span>
    <button
      class="page_info_copy"
      type="button"
      :aria-label="copied ? '链接已复制' : '复制文章链接'"
      @click="copyLink"
    >
      {{ copied ? '已复制' : '复制链接' }}
    </button>
    <!-- <span class="page_info_item">
      📔
      <span id="busuanzi_container_page_pv">
        阅读量:
        <span id="busuanzi_value_page_pv"></span>
      </span>
    </span> -->
  </div>
</template>

<style scoped>
.page_info {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  margin-top: 15px;
  margin-bottom: 25px;
}

.page_info .page_info_item {
  font-size: 16px;
  color: #7f7f7f;
}

.page_info_copy {
  padding: 3px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  cursor: pointer;
  font: inherit;
  font-size: 13px;
  transition: border-color 0.2s, color 0.2s;
}

.page_info_copy:hover {
  border-color: var(--vp-c-brand);
  color: var(--vp-c-brand);
}
</style>
