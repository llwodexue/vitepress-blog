import { type DefaultTheme } from 'vitepress'
import sidebarJavaScript from './sidebarJavaScript'
import sidebarBase from './sidebarBase'
import sidebarEngine from './sidebarEngine'
import sidebarVue from './sidebarVue'
import sidebarReact from './sidebarReact'
import sidebarNode from './sidebarNode'
import sidebarOps from './sidebarOps'
import sidebarMini from './sidebarMini'
import sidebarOther from './sidebarOther'

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
const sidebar = {
  [SIDEBAR.js]: { base: SIDEBAR.js, items: sidebarJavaScript() },
  [SIDEBAR.engine]: { base: SIDEBAR.engine, items: sidebarEngine() },
  [SIDEBAR.base]: { base: SIDEBAR.base, items: sidebarBase() },
  [SIDEBAR.vue]: { base: SIDEBAR.vue, items: sidebarVue() },
  [SIDEBAR.react]: { base: SIDEBAR.react, items: sidebarReact() },
  [SIDEBAR.node]: { base: SIDEBAR.node, items: sidebarNode() },
  [SIDEBAR.ops]: { base: SIDEBAR.ops, items: sidebarOps() },
  [SIDEBAR.mini]: { base: SIDEBAR.mini, items: sidebarMini() },
  [SIDEBAR.other]: { base: SIDEBAR.other, items: sidebarOther() }
}
const transNav = (base: string, arrFn: () => DefaultTheme.SidebarItem[]) => {
  const nav = arrFn().map(i => {
    const link = i.items![0].link
    return { text: i!.text || '', link: `${base}${link}` }
  })
  return nav
}
const nav: DefaultTheme.NavItem[] = [
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

export { sidebar, nav }
