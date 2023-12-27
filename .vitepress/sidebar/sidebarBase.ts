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
        { text: '数据结构与算法', link: '21-数据结构与算法.md' },
        { text: '栈结构', link: '22-栈结构.md' },
        { text: '队列结构', link: '23-队列结构.md' },
        { text: '链表结构', link: '24-链表结构.md' },
        { text: '算法复杂度', link: '25-算法复杂度.md' },
        { text: '哈希表', link: '26-哈希表.md' },
        { text: '树结构', link: '27-树结构.md' },
        { text: '封装BST树', link: '28-封装BST树.md' },
        { text: '图结构', link: '29-图结构.md' },
        { text: '双向链表', link: '30-双向链表.md' },
        { text: '堆结构', link: '31.堆结构.md' },
        { text: '双端、优先级队列', link: '32.双端、优先级队列.md' }
      ]
    }
  ]
}
