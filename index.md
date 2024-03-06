---
layout: home
layoutClass: 'l-home-layout'
title: LynDocs

hero:
  name: LynDocs
  text: Front-end learning
  tagline: 一站式前端内容网站，包括学习路线、知识体系
  image:
    src: /rem.png
    alt: lyn
  actions:
    - theme: brand
      text: 开始阅读
      link: /3-base/01-基本概念
    - theme: alt
      text: 运维部署
      link: /7-ops/云服务器-1.免密登陆

features:
  - icon: 🛠️
    title: 前端开发
    details: JS、Vue、React、小程序、uniapp...
  - icon: 📚
    title: 计算机基础
    details: 计算机网络、数据结构与算法、操作系统、linux...
  - icon: 📦
    title: 工程化
    details: Webpack、Vite、Grunt、Gulp、性能优化...
  - icon: 💻
    title: 运维部署
    details: 前端环境、后端环境、数据库环境、容器环境、自动部署...
---

<style>
.l-home-layout .image-src {
  border-radius: 50%;
}
.l-home-layout .image-src:hover {
  transform: translate(-50%, -50%) rotate(666turn);
  transition: transform 59s 1s cubic-bezier(0.3, 0, 0.8, 1);
}
</style>
