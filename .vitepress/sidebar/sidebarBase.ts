import { type DefaultTheme } from 'vitepress'

export default function sidebarBase(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: '计算机网络基础',
      collapsed: false,
      items: [
        { text: '基本概念', link: '01-基本概念.md' },
        { text: 'MAC、IP、子网', link: '02-MAC.md' },
        { text: '路由', link: '03-路由.md' }
      ]
    },
    {
      text: '计算机网络分层',
      collapsed: false,
      items: [
        { text: '物理层和数据链路层', link: '04-物理层和数据链路层.md' },
        { text: '网络层', link: '05-网络层.md' },
        { text: '传输层', link: '06-传输层.md' },
        { text: '应用层', link: '07-应用层.md' },
        { text: 'TCP重点', link: '12-TCP重点.md' }
      ]
    },
    {
      text: '计算机网络安全',
      collapsed: false,
      items: [
        { text: 'HTTPS', link: '09-HTTPS.md' },
        { text: 'HTTP版本', link: '10-HTTP版本.md' },
        { text: '其他协议', link: '11-其他协议.md' },
        { text: 'Websocket', link: '13-Websocket.md' }
      ]
    },
    {
      text: '工欲善其事',
      collapsed: false,
      items: [
        { text: 'VScode前端常用配置设置问题', link: '14-VScode前端常用配置设置问题.md' }
      ]
    },
    {
      text: '数据结构与算法',
      collapsed: false,
      items: [
        { text: '栈结构', link: '20-栈结构.md' },
        { text: '队列结构', link: '21-队列结构.md' },
        { text: '算法复杂度和哈希表', link: '22-算法复杂度和哈希表.md' },
        { text: '树结构和BST树', link: '23-树结构和BST树.md' }
      ]
    }
  ]
}
