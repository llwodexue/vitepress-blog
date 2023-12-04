import { type DefaultTheme } from 'vitepress'

export default function sidebarVue(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Vue基础',
      collapsed: false,
      items: [
        { text: 'Vue3+TypeScript', link: '01-Vue3+TypeScript.md' },
        { text: '邂逅vue3', link: '02-邂逅vue3.md' },
        { text: 'Vue3开发基础语法', link: '03-Vue3开发基础语法.md' },
        { text: 'Vue3开发基础语法(二)', link: '04-Vue3开发基础语法(二).md' },
        { text: '组件化开发', link: '05-组件化开发.md' }
      ]
    },
    {
      text: '构建工具',
      collapsed: false,
      items: [
        { text: 'webpack', link: '06-webpack.md' },
        { text: 'babel', link: '07-babel.md' },
        { text: 'devServer', link: '08-devServer.md' },
        { text: 'Vuecli和Vite', link: '09-Vuecli和Vite.md' }
      ]
    },
    {
      text: '组件化开发',
      collapsed: false,
      items: [
        { text: 'Vue3组件化开发', link: '10-Vue3组件化开发.md' },
        { text: 'Vue3实现动画', link: '11-Vue3实现动画.md' },
        { text: 'CompositionAPI', link: '12-CompositionAPI.md' },
        { text: 'Vue3高级语法补充', link: '13-Vue3高级语法补充.md' }
      ]
    },
    {
      text: 'Vue进阶',
      collapsed: false,
      items: [
        { text: 'VueRouter', link: '15-VueRouter.md' },
        { text: 'Vuex', link: '16-Vuex.md' },
        { text: 'Pinia与Vuex使用区别', link: '18-Pinia与Vuex使用区别.md' },
        { text: 'TypeScript', link: '17-TypeScript.md' }
      ]
    },
    {
      text: 'Vue源码',
      collapsed: false,
      items: [
        { text: 'Vue3源码', link: '14-Vue3源码.md' },
        { text: 'VirtualDOM的实现原理', link: '21-VirtualDOM的实现原理.md' },
        { text: 'VueRouter原理实现', link: '22-VueRouter原理实现.md' },
        { text: '模拟Vue.js响应式原理', link: '23-模拟Vue.js响应式原理.md' },
        { text: 'Vue3响应式原理', link: '24-Vue3响应式原理.md' },
        { text: 'Vite原理', link: '25-Vite原理.md' }
      ]
    },
    {
      text: 'Vue项目',
      collapsed: false,
      items: [
        { text: '项目搭建规范', link: '19-项目搭建规范.md' },
        { text: '项目打包和自动化部署', link: '20-项目打包和自动化部署.md' }
      ]
    }
  ]
}
