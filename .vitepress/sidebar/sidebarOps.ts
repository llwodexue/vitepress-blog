import { type DefaultTheme } from 'vitepress'

export default function sidebarOps(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '云服务器环境搭建',
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
    },
    {
      text: '集群环境搭建',
      collapsed: false,
      items: [
        { text: 'Docker使用', link: '虚拟-1.Docker使用.md' },
        { text: '离线安装KubeSphere', link: '虚拟-2.离线安装KubeSphere.md' }
      ]
    },
    {
      text: '其他环境搭建',
      collapsed: false,
      items: [
        { text: 'Jenkins自动化构建', link: '其他-1.Jenkins自动化构建.md' },
        { text: 'nexus搭建npm私库', link: '其他-2.nexus搭建npm私库.md' },
        { text: 'YApi接口平台搭建', link: '其他-3.YApi接口平台搭建.md' },
        { text: '前端必备nginx', link: '其他-4.前端必备nginx.md' },
        { text: '离线安装SVN', link: '其他-5.离线安装SVN.md' },
        { text: '生成可信任的SSL证书', link: '其他-6.生成可信任的SSL证书.md' },
        { text: 'Docker基础', link: '其他-7.Docker基础.md' },
        { text: 'Docker实战', link: '其他-8.Docker实战.md' },
        { text: '安装nextcloud', link: '其他-9.安装nextcloud.md' },
        { text: '安装OpenVPN', link: '其他-10.安装OpenVPN.md' },
        { text: '离线部署文档', link: '其他-11.离线部署文档.md' },
      ]
    }
  ]
}
