import { defineConfig, type DefaultTheme } from 'vitepress'
import {
  sidebarJavaScript,
  sidebarEngine,
  sidebarBase,
  sidebarVue,
  sidebarReact,
  sidebarOps,
  sidebarOther,
  sidebarMini,
  sidebarNode
} from './sidebar'

const base = process.env.BASE || '/'

const SIDEBAR: Record<string, string> = {
  js: '/1-js/',
  engine: '/2-engine/',
  base: '/3-base/',
  vue: '/4-vue/',
  react: '/5-react/',
  node: '/6-node/',
  ops: '/7-ops/',
  mini: '/8-mini/',
  other: '/10-other/'
}

export default defineConfig({
  base,
  lang: 'zh-CN',
  title: 'Lyn Blog',
  markdown: {
    math: true,
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark'
    },
    lineNumbers: true
  },
  themeConfig: {
    logo: '/avatar.png',
    siteTitle: 'Lyn Blog',
    nav: nav(),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/llwodexue/vitepress-blog' }
    ],
    sidebar: {
      [SIDEBAR.js]: { base: SIDEBAR.js, items: sidebarJavaScript() },
      [SIDEBAR.engine]: { base: SIDEBAR.engine, items: sidebarEngine() },
      [SIDEBAR.base]: { base: SIDEBAR.base, items: sidebarBase() },
      [SIDEBAR.vue]: { base: SIDEBAR.vue, items: sidebarVue() },
      [SIDEBAR.react]: { base: SIDEBAR.react, items: sidebarReact() },
      [SIDEBAR.node]: { base: SIDEBAR.node, items: sidebarNode() },
      [SIDEBAR.ops]: { base: SIDEBAR.ops, items: sidebarOps() },
      [SIDEBAR.mini]: { base: SIDEBAR.mini, items: sidebarMini() },
      [SIDEBAR.other]: { base: SIDEBAR.other, items: sidebarOther() }
    },
    footer: {
      message: '常备不懈，才能有备无患'
    },
    outline: 'deep'
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/dolphin.svg' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/dolphin.png' }],
    ['meta', { name: 'referrer', content: 'never' }]
  ]
})

function nav(): DefaultTheme.NavItem[] {
  const transNav = (base: string, arrFn: () => DefaultTheme.SidebarItem[]) => {
    const nav = arrFn().map(i => {
      const link = i.items![0].link
      return { text: i!.text || '', link: `${base}${link}` }
    })
    return nav
  }
  return [
    { text: 'JavaScript', items: transNav(SIDEBAR.js, sidebarJavaScript) },
    { text: '工程化', items: transNav(SIDEBAR.engine, sidebarEngine) },
    { text: '计算机基础', items: transNav(SIDEBAR.base, sidebarBase) },
    { text: 'Vue', items: transNav(SIDEBAR.vue, sidebarVue) },
    { text: 'React', items: transNav(SIDEBAR.react, sidebarReact) },
    { text: 'Node', items: transNav(SIDEBAR.node, sidebarNode) },
    { text: '运维部署', items: transNav(SIDEBAR.ops, sidebarOps) },
    { text: '小程序', items: transNav(SIDEBAR.mini, sidebarMini) },
    { text: '其他', items: transNav(SIDEBAR.other, sidebarOther) }
  ]
}
