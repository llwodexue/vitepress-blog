import { defineConfig, type DefaultTheme } from 'vitepress'

const base = process.env.BASE || '/'

// --vp-code-block-bg
export default defineConfig({
  base,
  title: 'VitePress123',
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark'
    }
  },
  themeConfig: {
    logo: '/avatar.png',
    siteTitle: 'Lyn Blog',

    nav: [
      // { text: '前端', link: '/front/' },
      // { text: '后端', link: '/back/' },
      // { text: '工程化', link: '/engine/' },
      { text: '运维部署', link: '/7-ops/云服务器-1.免密登陆' }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/llwodexue/vitepress-blog' }
    ],

    sidebar: [
      {
        base: '/7-ops/',
        items: sidebarOps()
      }
    ],

    footer: {
      message: '常备不懈，才能有备无患'
    }
  },
  head: [['meta', { name: 'referrer', content: 'never' }]]
})

function sidebarOps(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '云服务器',
      collapsed: false,
      items: [
        { text: '免密登陆', link: '云服务器-1.免密登陆' },
        { text: '部署后端环境', link: '云服务器-2.部署后端环境' },
        { text: '部署自动化构建环境', link: '云服务器-3.部署自动化构建环境' },
        { text: '部署数据库环境', link: '云服务器-4.部署数据库环境' },
        { text: '部署前端环境', link: '云服务器-5.部署前端环境' },
        { text: '部署Docker和Frp', link: '云服务器-6.部署Docker和Frp' },
        { text: '自动化脚本和域名绑定', link: '云服务器-7.自动化脚本和域名绑定' },
        { text: '阿里云效一键部署前后端', link: '云服务器-8.阿里云效一键部署前后端' }
      ]
    }
  ]
}
