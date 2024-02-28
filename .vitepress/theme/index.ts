import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import type { EnhanceAppContext, Theme } from 'vitepress'
import { onMounted, watch, nextTick, h } from 'vue'
import mediumZoom from 'medium-zoom'
import busuanzi from 'busuanzi.pure.js'
import './style/vars.css'
import './style/global.css'
import Statistics from './components/Statistics.vue'
import PageInfo from './components/PageInfo.vue'

const theme: Theme = {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'home-features-after': () => h(Statistics),
      'doc-before': () => h(PageInfo)
    })
  },
  enhanceApp({ router }: EnhanceAppContext) {
    if (inBrowser) {
      router.onAfterRouteChanged = to => {
        busuanzi.fetch()
      }
    }
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      mediumZoom('.main img', { background: 'var(--vp-img-bg)' })
    }
    onMounted(() => {
      initZoom()
    })
    watch(
      () => route.path,
      () => nextTick(() => initZoom())
    )
  }
}

export default theme
