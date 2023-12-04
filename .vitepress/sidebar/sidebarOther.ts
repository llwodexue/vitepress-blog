import { type DefaultTheme } from 'vitepress'

export default function sidebarOther(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'pnpm',
      collapsed: false,
      items: [{ text: 'pnpm', link: 'pnpm.md' }]
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
    }
  ]
}
