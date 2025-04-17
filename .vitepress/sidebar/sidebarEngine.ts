import { type DefaultTheme } from 'vitepress'

export default function sidebarEngine(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '工程化基础',
      collapsed: false,
      items: [
        { text: '工程化和脚手架入门', link: '01-工程化和脚手架入门.md' },
        { text: '自动化构建', link: '02-自动化构建.md' },
        { text: '模块化开发', link: '03-模块化开发.md' }
      ]
    },
    {
      text: '打包工具',
      collapsed: false,
      items: [
        { text: 'Webpack打包', link: '04-Webpack打包.md' },
        { text: 'Rollup和Eslint', link: '05-Rollup和Eslint.md' }
      ]
    },
    {
      text: 'Webpack源码',
      collapsed: false,
      items: [
        { text: 'Webpack源码', link: '06-Webpack源码.md' },
        { text: 'Webpack简述', link: '07-Webpack简述.md' },
        { text: 'Webpack实践', link: '08-Webpack实践.md' },
        { text: 'Webpack性能优化', link: '09-Webpack性能优化.md' }
      ]
    }
  ]
}
