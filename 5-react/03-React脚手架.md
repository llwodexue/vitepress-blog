# React脚手架

## 工程化

现代的前端项目已经越来越复杂了：

- 不会再是在 HTML 中引入几个 css 文件，引入几个编写的 js 文件或者第三方的 js 文件这么简单
- 比如 css 可能是使用 less、sass 等预处理器进行编写，我们需要将它们转成普通的 css 才能被浏览器解析
- 比如 JavaScript 代码不再只是编写在几个文件中，而是通过模块化的方式，被组成在成百上千个文件中，我们需要通过模块化的技术来管理它们之间的相互依赖
- 比如项目需要依赖很多的第三方库，如何更好的管理它们（比如管理它们的依赖、版本升级等）

编程中提到的脚手架（Scaffold），其实是一种工具，帮我们可以快速生成项目的工程化结构

- 每个项目作出完成的效果不同，但是它们的基本工程化结构是相似的
- 既然相似，就没有必要每次都从零开始搭建，完全可以使用一些工具，帮助我们生产基本的工程化模板
- 不同的项目，在这个模板的基础之上进行项目开发或者进行一些配置的简单修改即可
- 这样也可以间接保证项目的基本机构一致性，方便后期的维护

总结：脚手架让项目从搭建到开发，再到部署，整个流程变得快速和便捷

## 初始化项目

**前端脚手架**

- Vue 的脚手架：`@vue/cli`
- Angular 的脚手架：`@angular/cli`
- React 的脚手架：`create-react-app`

**创建 React 项目**

```bash
$ npm i -g create-react-app
$ create-react-app 项目名称
$ cd 项目名称
```

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221115150403639.png)

**PWA**

> [渐进式 Web 应用（PWA）](https://developer.mozilla.org/zh-CN/docs/Web/Progressive_web_apps)

- PWA 全称 **Progressive Web App**，即 **渐进式 WEB 应用**
- 一个 PWA 应用首先是一个网页, 可以通过 Web 技术编写出一个网页应用
- 随后添加上 **App Manifest** 和 **Service Worker** 来实现 PWA 的**安装和离线**等功能
- 这种 Web 存在的形式，我们也称之为是 Web App

PWA 解决哪些问题

- 可以**添加至主屏幕**，点击主屏幕图标可以实现启动动画以及隐藏地址栏
- 实现**离线缓存功能**，即使用户手机没有网络，依然可以使用一些离线功能
- 实现了**消息推送**
- 等等一系列类似于 Native App 相关的功能

## 脚手架的 webpack

- React脚手架默认是基于 webpack 来开发的

- 但是，很奇怪：我们并没有在目录结构中看到任何 webpack 相关的内容？

  - 原因是 React 脚手架将 webpack 相关的配置隐藏起来了（其实从 Vue CLI3 开始，也是进行了隐藏）

  ![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221115153636221.png)

- 如果我们希望看到 webpack 的配置信息，应该怎么来做呢？

  - 我们可以执行一个 `package.json` 文件中的一个脚本：`"eject": "react-scripts eject"`