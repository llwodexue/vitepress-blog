import DefaultTheme from 'vitepress/theme'
import { inBrowser } from 'vitepress'
import type { EnhanceAppContext, Theme } from 'vitepress'
import type { App } from 'vue'
// import busuanzi from 'busuanzi.pure.js'
import './style/index.scss'
import Layout from './Layout.vue'
import PageInfo from './components/PageInfo.vue'
import { createMediumZoomProvider } from '../utils/useMediumZoom'

const theme: Theme = {
  extends: DefaultTheme,
  Layout: Layout,
  enhanceApp({ router, app }: EnhanceAppContext) {
    if (inBrowser) {
      // router.onAfterRouteChanged = to => {
      //   busuanzi.fetch()
      // }
    }
    createMediumZoomProvider(app as any as App, router)
    app.component('PageInfo', PageInfo)
  }
}

export default theme
