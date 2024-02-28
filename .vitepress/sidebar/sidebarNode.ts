import { type DefaultTheme } from 'vitepress'

export default function sidebarNode(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Node',
      collapsed: false,
      items: [
        { text: 'Node基础', link: '01-Node基础.md' },
        { text: 'Koa源码', link: '02-Koa源码.md' }
      ]
    },
    {
      text: 'SSR',
      collapsed: false,
      items: [
        { text: 'Node服务端渲染和SSR', link: '20-Node服务端渲染和SSR.md' },
        { text: 'Nuxt3基础语法', link: '21-Nuxt3基础语法.md' },
        { text: 'Nuxt3核心语法', link: '22-Nuxt3核心语法.md' }
      ]
    },
    {
      text: 'Node安全',
      collapsed: false,
      items: [
        { text: '前端JS加密常用方法', link: '安全1-前端JS加密常用方法.md' },
        { text: '常见Web攻击', link: '安全2-常见Web攻击.md' }
      ]
    },
    {
      text: 'Node补充',
      collapsed: false,
      items: [
        { text: 'Node事件循环及多线程', link: '补充1-Node事件循环及多线程.md' },
        { text: '文件下载的奥秘', link: '补充2-文件下载的奥秘.md' }
      ]
    }
  ]
}
