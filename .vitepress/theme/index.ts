import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import type { EnhanceAppContext, Theme } from 'vitepress'
// import busuanzi from 'busuanzi.pure.js'
import './style/index.scss'
import Layout from './Layout.vue'
import PageInfo from './components/PageInfo.vue'
import { watch, nextTick, onMounted } from 'vue'
import mediumZoom from 'medium-zoom'

const defaultSelector = ':not(a) > img:not(.image-src, .vp-sponsor-grid-image)'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ router, app }: EnhanceAppContext) {
    if (inBrowser) {
      // router.onAfterRouteChanged = to => {
      //   busuanzi.fetch()
      // }
    }
    app.component('PageInfo', PageInfo)
  },
  setup() {
    const route = useRoute()
    const initZoom = () => {
      mediumZoom(defaultSelector)
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
