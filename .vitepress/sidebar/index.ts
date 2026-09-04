import { type DefaultTheme } from 'vitepress'
import sidebarJavaScript from './sidebarJavaScript'
import sidebarEngine from './sidebarEngine'
import sidebarBase from './sidebarBase'
import sidebarVue from './sidebarVue'
import sidebarReact from './sidebarReact'
import sidebarNode from './sidebarNode'
import sidebarOps from './sidebarOps'
import sidebarNotes from './sidebarNotes'
import sidebarOther from './sidebarOther'

const sections = [
  { key: 'JavaScript', path: '/1-js/', sidebar: sidebarJavaScript },
  { key: '工程化', path: '/2-engine/', sidebar: sidebarEngine },
  { key: '计算机基础', path: '/3-base/', sidebar: sidebarBase },
  { key: 'Vue', path: '/4-vue/', sidebar: sidebarVue },
  { key: 'React', path: '/5-react/', sidebar: sidebarReact },
  { key: 'Node', path: '/6-node/', sidebar: sidebarNode },
  { key: '运维部署', path: '/7-ops/', sidebar: sidebarOps },
  { key: '家庭与教育', path: '/8-notes/', sidebar: sidebarNotes },
  { key: '其他', path: '/10-other/', sidebar: sidebarOther }
]

const sidebar: Record<string, { base: string; items: DefaultTheme.SidebarItem[] }> = {}
function withRouteLinks(
  items: DefaultTheme.SidebarItem[],
  sourcePath: string,
  currentPath: string
): DefaultTheme.SidebarItem[] {
  return items.map(item => ({
    ...item,
    items: item.items?.map(child => ({
      ...child,
      link: child.link && sourcePath !== currentPath
        ? `../${sourcePath.replace(/^\//, '').replace(/\/$/, '')}/${child.link}`
        : child.link
    }))
  }))
}

for (const section of [...sections.slice(2, 5), ...sections.slice(7)]) {
  sidebar[section.path] = { base: section.path, items: section.sidebar }
}

const javascriptAndEngineSidebar = (currentPath: string) => [
  ...withRouteLinks(sidebarJavaScript, '/1-js/', currentPath),
  ...withRouteLinks(sidebarEngine, '/2-engine/', currentPath)
]

const nodeAndOpsSidebar = (currentPath: string) => [
  ...withRouteLinks(sidebarNode, '/6-node/', currentPath),
  ...withRouteLinks(sidebarOps, '/7-ops/', currentPath)
]

sidebar['/1-js/'] = {
  base: '/1-js/',
  items: javascriptAndEngineSidebar('/1-js/')
}
sidebar['/2-engine/'] = {
  base: '/2-engine/',
  items: javascriptAndEngineSidebar('/2-engine/')
}
sidebar['/6-node/'] = {
  base: '/6-node/',
  items: nodeAndOpsSidebar('/6-node/')
}
sidebar['/7-ops/'] = {
  base: '/7-ops/',
  items: nodeAndOpsSidebar('/7-ops/')
}

const navGroups = [
  { text: 'JS 工程化', sections: sections.slice(0, 2) },
  ...sections.slice(2, 5).map(section => ({ text: section.key, sections: [section] })),
  { text: 'Node 运维', sections: sections.slice(5, 7) },
  { text: sections[7].key, sections: [sections[7]] },
  { text: sections[8].key, sections: [sections[8]] }
]

const nav: DefaultTheme.NavItem[] = navGroups.map(group => ({
  text: group.text,
  items: group.sections.flatMap(section =>
    section.sidebar.flatMap(item => {
      const link = item.items?.[0]?.link
      return link
        ? [{
            text: item.text || '',
            link: `/${section.path.replace(/^\//, '').replace(/\/$/, '')}/${link
              .replace(/^\//, '')
              .replace(/\.md$/, '')}`
          }]
        : []
    })
  )
}))

export { sidebar, nav }
