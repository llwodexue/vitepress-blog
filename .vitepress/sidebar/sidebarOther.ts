import { type DefaultTheme } from 'vitepress'

export default function sidebarOther(): DefaultTheme.SidebarItem[] {
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
    },
    {
      text: '性能优化',
      collapsed: false,
      items: [
        { text: '性能优化的指标和工具', link: '优化1.性能优化的指标和工具.md' },
        { text: '渲染优化', link: '优化2.渲染优化.md' },
        { text: '代码优化', link: '优化3.代码优化.md' },
        { text: '资源优化', link: '优化4.资源优化.md' },
        { text: '构建优化', link: '优化5.构建优化.md' },
        { text: '传输加载优化', link: '优化6.传输加载优化.md' },
        { text: '前沿优化解决方案', link: '优化7.前沿优化解决方案.md' },
        { text: '性能优化问题面试指南', link: '优化8.性能优化问题面试指南.md' }
      ]
    },
    {
      text: 'math',
      collapsed: false,
      items: [{ text: 'Bezier曲线曲面绘制', link: 'Bezier曲线曲面绘制.md' }]
    }
  ]
}
