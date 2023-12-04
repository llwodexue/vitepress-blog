import { type DefaultTheme } from 'vitepress'

export default function sidebarReact(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'React基础',
      collapsed: false,
      items: [
        { text: 'React基本使用', link: '01-React基本使用.md' },
        { text: 'Jsx语法', link: '02-Jsx语法.md' },
        { text: 'React脚手架', link: '03-React脚手架.md' }
      ]
    },
    {
      text: '组件化开发',
      collapsed: false,
      items: [
        { text: '组件化开发', link: '04-组件化开发.md' },
        { text: '组件化开发(二)', link: '05-组件化开发(二).md' },
        { text: '过渡动画', link: '06-过渡动画.md' },
        { text: 'CSS使用方式', link: '07-CSS使用方式.md' }
      ]
    },
    {
      text: 'React进阶',
      collapsed: false,
      items: [
        { text: 'rudux', link: '08-rudux.md' },
        { text: '路由', link: '09-路由.md' },
        { text: 'hooks', link: '10-hooks.md' },
        { text: '项目搭建', link: '11-项目搭建.md' }
      ]
    },
    {
      text: 'React源码',
      collapsed: false,
      items: [
        {
          text: 'requestIdleCallback的认知',
          link: '12.1-requestIdleCallback的认知.md'
        },
        {
          text: '创建任务队列和完成任务调度逻辑',
          link: '12.2-创建任务队列和完成任务调度逻辑.md'
        },
        { text: '构建Fiber对象', link: '12.3-构建Fiber对象.md' },
        { text: '构建Fiber对象第二阶段', link: '12.4-构建Fiber对象第二阶段.md' }
      ]
    }
  ]
}
