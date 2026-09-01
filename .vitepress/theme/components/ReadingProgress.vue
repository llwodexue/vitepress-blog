<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const progress = shallowRef(0)
let stopRouteWatch: (() => void) | undefined

function updateProgress() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight
  progress.value = maxScroll > 0
    ? Math.min(100, Math.round((window.scrollY / maxScroll) * 100))
    : 0
}

onMounted(() => {
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
  stopRouteWatch = watch(() => route.path, updateProgress)
  updateProgress()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
  stopRouteWatch?.()
})
</script>

<template>
  <div
    class="reading-progress"
    :style="{ transform: 'scaleX(' + progress / 100 + ')' }"
    aria-hidden="true"
  />
</template>

<style scoped>
.reading-progress {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  transform-origin: left;
  background: linear-gradient(90deg, var(--vp-c-brand), var(--vp-c-brand-next));
}
</style>
