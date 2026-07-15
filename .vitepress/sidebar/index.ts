import { type DefaultTheme } from 'vitepress'
import sidebarJavaScript from './sidebarJavaScript'
import sidebarEngine from './sidebarEngine'
import sidebarBase from './sidebarBase'
import sidebarVue from './sidebarVue'
import sidebarReact from './sidebarReact'
import sidebarNode from './sidebarNode'
import sidebarOps from './sidebarOps'
import sidebarOther from './sidebarOther'

const sections = [
  { key: 'JavaScript', path: '/1-js/', sidebar: sidebarJavaScript },
  { key: '工程化', path: '/2-engine/', sidebar: sidebarEngine },
  { key: '计算机基础', path: '/3-base/', sidebar: sidebarBase },
  { key: 'Vue', path: '/4-vue/', sidebar: sidebarVue },
  { key: 'React', path: '/5-react/', sidebar: sidebarReact },
  { key: 'Node', path: '/6-node/', sidebar: sidebarNode },
  { key: '运维部署', path: '/7-ops/', sidebar: sidebarOps },
  { key: '其他', path: '/10-other/', sidebar: sidebarOther }
]

const sidebar: Record<string, { base: string; items: DefaultTheme.SidebarItem[] }> = {}
for (const s of sections) {
  sidebar[s.path] = { base: s.path, items: s.sidebar }
}

const nav: DefaultTheme.NavItem[] = sections.map(s => ({
  text: s.key,
  items: s.sidebar.map(i => ({
    text: i.text || '',
    link: `${s.path}${i.items![0].link}`
  }))
}))

export { sidebar, nav }
