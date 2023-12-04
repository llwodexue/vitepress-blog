import { type DefaultTheme } from 'vitepress'

export default function sidebarMini(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '微信小程序',
      collapsed: false,
      items: [
        { text: '邂逅小程序开发', link: '01-邂逅小程序开发.md' },
        { text: '小程序的架构和配置', link: '02-小程序的架构和配置.md' },
        { text: '小程序内置组件', link: '03-小程序内置组件.md' },
        { text: 'WX语法', link: '04-WX语法.md' },
        { text: '事件处理', link: '05-事件处理.md' },
        { text: '小程序组件化开发', link: '06-小程序组件化开发.md' },
        { text: '小程序API调用', link: '07-小程序API调用.md' },
        { text: '小程序项目', link: '08-小程序项目.md' }
      ]
    },
    {
      text: 'uniapp',
      collapsed: false,
      items: [
        { text: 'uniapp基础', link: '10-uniapp基础.md' },
        { text: 'uniapp进阶', link: '11-uniapp进阶.md' }
      ]
    }
  ]
}
