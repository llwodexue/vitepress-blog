import { defineConfig } from 'vitepress'
import { sidebar, nav } from './sidebar'
// import algolia from './config/algolia'
import markdown from './config/markdown'
import { name, keywords } from './config/meta'
import { withPwa } from '@vite-pwa/vitepress'
import { pwa } from './config/pwa'

const base = process.env.BASE || '/'

export default withPwa(
  defineConfig({
    pwa,
    // outDir: '../dist',
    base,
    title: name,
    lastUpdated: true,
    cleanUrls: true,
    locales: {
      root: { label: '简体中文', lang: 'zh-CN' }
    },
    vite: {
      build: {
        chunkSizeWarningLimit: 1500
      }
    },
    sitemap: {
      hostname: 'https://www.llmysnow.top/'
    },
    markdown: markdown,
    ignoreDeadLinks: true, // 忽略所有死链接检测
    themeConfig: {
      search: {
        provider: 'local'
      },
      logo: '/images/avatar.png',
      docFooter: {
        prev: '上一篇',
        next: '下一篇'
      },
      returnToTopLabel: '返回顶部',
      outlineTitle: '导航栏',
      darkModeSwitchLabel: '外观',
      sidebarMenuLabel: '归档',
      lastUpdatedText: '最后一次更新于',
      outline: {
        level: 'deep',
        label: '目录'
      },
      socialLinks: [{ icon: 'github', link: 'https://github.com/llwodexue' }],
      footer: {
        message: '常备不懈，才能有备无患'
        // copyright: `版权所有 © 2022-${new Date().getFullYear()}`
      },
      // algolia,
      nav,
      sidebar
    },
    head: [
      // not never(no-referer), image cannot be accessed
      ['meta', { name: 'referrer', content: 'never' }],
      // must be referer, get the number of articles accessed
      // ['meta', { name: 'referrer', content: 'no-referrer-when-downgrade' }],
      ['meta', { name: 'keywords', content: keywords }],
      ['meta', { name: 'author', content: 'lyn' }],

      ['link', { rel: 'icon', type: 'image/x-icon', href: base + 'favicon.ico' }],
      ['link', { rel: 'icon', type: 'image/svg+xml', href: base + 'favicon.svg' }]
    ]
  })
)
