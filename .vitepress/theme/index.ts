import DefaultTheme from 'vitepress/theme'
import { inBrowser, useRoute } from 'vitepress'
import type { EnhanceAppContext, Theme } from 'vitepress'
import { onMounted, watch, nextTick } from 'vue'
import mediumZoom from 'medium-zoom'
// import busuanzi from 'busuanzi.pure.js'
import './style/vars.css'
import './style/global.css'
import Layout from './Layout.vue'
import PageInfo from './components/PageInfo.vue'

const theme: Theme = {
  ...DefaultTheme,
  Layout: Layout,
  enhanceApp({ router, app }: EnhanceAppContext) {
    // if (inBrowser) {
    //   ctx.router.onAfterRouteChanged = to => {
    //     busuanzi.fetch()
    //   }
    // }
    app.component('PageInfo', PageInfo)
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
