import { type DefaultTheme } from 'vitepress'

export default function sidebarJavaScript(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '函数式编程',
      collapsed: false,
      items: [
        { text: '函数式编程范式', link: '01-函数式编程范式.md' },
        { text: 'JavaScript异步编程', link: '02-JavaScript异步编程.md' },
        { text: '手写Promise源码', link: '03-手写Promise源码.md' },
        { text: '练习题一', link: '04-练习题一.md' },
        { text: '补充一', link: '05-补充一.md' }
      ]
    },
    {
      text: 'ECMAScript',
      collapsed: false,
      items: [
        { text: 'ECMAScript新特性', link: '06-ECMAScript新特性.md' },
        { text: 'TypeScript语言', link: '07-TypeScript语言.md' },
        { text: 'JavaScript性能优化', link: '08-JavaScript性能优化.md' },
        { text: '练习题二', link: '09-练习题二.md' },
        { text: '补充二', link: '10-补充二.md' }
      ]
    },
    {
      text: 'TypeScript',
      collapsed: false,
      items: [
        { text: 'TypeScript入门', link: '11-TypeScript入门.md' },
        { text: 'TypeScript进阶', link: '12-TypeScript进阶.md' }
      ]
    }
  ]
}
