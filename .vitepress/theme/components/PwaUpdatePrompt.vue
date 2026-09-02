<script setup lang="ts">
import { onMounted, shallowRef, watch } from 'vue'

const needRefresh = shallowRef(false)
const offlineReady = shallowRef(false)
let updateServiceWorker = () => Promise.resolve()

onMounted(async () => {
  const { useRegisterSW } = await import('virtual:pwa-register/vue')
  const registration = useRegisterSW()

  updateServiceWorker = registration.updateServiceWorker

  watch(registration.needRefresh, value => {
    needRefresh.value = value
  }, { immediate: true })

  watch(registration.offlineReady, value => {
    offlineReady.value = value
  }, { immediate: true })
})

function applyUpdate() {
  void updateServiceWorker()
}

function closePrompt() {
  offlineReady.value = false
  needRefresh.value = false
}
</script>

<template>
  <aside v-if="offlineReady || needRefresh" class="pwa-update" aria-live="polite">
    <p class="pwa-update__message">
      {{ needRefresh ? '发现新版本，刷新后即可使用。' : '本站已可离线访问。' }}
    </p>
    <div class="pwa-update__actions">
      <button
        v-if="needRefresh"
        class="pwa-update__button pwa-update__button--primary"
        type="button"
        @click="applyUpdate"
      >
        立即刷新
      </button>
      <button class="pwa-update__button" type="button" @click="closePrompt">
        稍后
      </button>
    </div>
  </aside>
</template>

<style scoped>
.pwa-update {
  position: fixed;
  z-index: 110;
  right: 24px;
  bottom: 24px;
  max-width: min(360px, calc(100vw - 32px));
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
  box-shadow: var(--vp-shadow-4);
}

.pwa-update__message {
  margin: 0 0 12px;
  color: var(--vp-c-text-1);
  font-size: 14px;
}

.pwa-update__actions {
  display: flex;
  gap: 8px;
}

.pwa-update__button {
  padding: 6px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font: inherit;
  font-size: 14px;
}

.pwa-update__button--primary {
  border-color: var(--vp-c-brand);
  background: var(--vp-c-brand);
  color: var(--vp-c-white);
}

@media (max-width: 640px) {
  .pwa-update {
    right: 16px;
    bottom: 16px;
  }
}
</style>
