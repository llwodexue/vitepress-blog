# Node服务端渲染和SSR

## 服务端渲染

### SPA

单页面应用程序（SPA）全称是：`Single-page application`，SPA 应用是在客户端呈现的（术语称：CRS）

- SPA 应用默认只返回一个空 HTML 页面，如：body 只有 `<div id="app"></div>`
- 而整个应用程序的内容都是通过 JavaScript 动态加载，包括应用程序的逻辑、UI 以及与服务器通信相关的所有数据
- 构建 SPA 常见常见的库和架构有：React、AngularJS、Vue.js 等

SPA 优点

- 只需加载一次
  - SPA 应用只需要在第一次请求时加载页面，页面切换不需重新加载，而传统的 Web 应用程序必须在每次请求时都得加载页面，需要花费更多时间。因此，SPA 页面加载速度要比传统 Web 应用程序更快
- 更好的用户体验
  - SPA 提供类似于桌面或移动应用程序的体验。用户切换页面不必重新加载新页面
  - 切换页面只是内容发生了变化，页面并没有重新加载，从而使体验变得更加流程
- 可轻松的构建功能丰富的 Web 应用程序

SPA 缺点

- SPA 应用默认只返回一个空 HTML 页面，不利于 SEO（search engine optimization）
- 首屏加载的资源过大时，一样会影响首屏的渲染
- 也不利于构建复杂的项目，复杂 Web 应用程序的大文件可能变得难以维护

### 爬虫工作流程

Google 爬虫的工作流程分为 3 个阶段，并非每个网页都会经历这 3 个阶段：

![image-20231026104844078](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231026104844078.png)

抓取

- 爬虫（也称蜘蛛），从互联网上发现各类网页。网页中的外部连接也会被发现
- 抓取数以十亿被发现网页的内容，如：文本、图片和视频

索引编制

- 爬虫程序会分析网页上的文本、图片和视频文件
- 并将信息存储在大型数据库（索引区）中
- 例如：`<title>` 元素和 Alt 属性、图片、视频等
- 爬虫会对内容类似的网页归类分组
- 不符合规则内容和网站会被清理
  - 如：禁止访问或需要权限访问等等

呈现搜索结果：

- 当用户在 Google 中搜索时，搜索引擎会根据内容的类型，选择一组网页中最具代表性的网页进行呈现

### 搜索引擎的优化（SEO）

- 语义性 HTML 标记
  - 标题用 `<h1>`，一个页面只有一个，副标题用 `<h2>` 到 `<h6>`
  - 不要过度使用 h 标签，多次使用不会增加 SEO（search engine optimization）
  - 段落用 `<p>`，列表用 `<ul>`，并且 li 只放在 ul 中等等
- 每个页面需包含：标题 + 内部链接
  - 每个页面对应的 title，同一网站所有页面都有内链可以指向首页
- 确保链接可供抓取
- meta 标签优化：设置 description、keywords 等
- 文本标记和 img
  - 比如 `<b>` 和 `<strong>` 加粗文本的标签，爬虫也会关注到该内容
  - img 标签添加 alt 属性，图片加载失败，爬虫会取 alt 内容
- robots.txt 文件：规定爬虫可访问你网站上的哪些网址
- sitemap.xml 站点地图：在站点地图列出所有网页，确保爬虫不会漏掉某些网页

### 静态站点生成SSG

静态站点生成（SSG）全称是：Static Site Generate，是预先生成好的静态网站

- SSG应用一般在构建阶段就确定了网站的内容
- 如果网站的内容需要更新了，那必须得重新再次构建和部署
- 构建 SSG 应用常见的库和框架有: Vue Nuxt、 React Next.js 等

SSG 的优点：

- 访问速度非常快，因为每个页面都是在构建阶段就已经提前生成好了
- 直接给浏览器返回静态的 HTML，也有利于 SEO
- SSG 应用依然保留了 SPA 应用的特性，比如: 前端路由、响应式数据、虚拟 DOM 等

SSG 的缺点：

- 页面都是静态，不利于展示实时性的内容，实时性的更适合 SSR
- 如果站点内容更新了，那必须得重新再次构建和部署

### 服务器端渲染（SSR）

服务器端渲染全称是：Server Side Render，在服务器端渲染页面，并将渲染好的 HTML 返回给浏览器呈现

- SSR 应用的页面是在服务端渲染的，用户每请求一个 SSR 页面都会先在服务端进行渲染，然后将渲染好的页面，返回给浏览器呈现
- 构建 SSR 应用常见的库和框架有：Vue Nuxt、React Next.js 等（SSR 应用也称同构应用）

服务器端渲染原理

![image-20231026144626251](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231026144626251.png)

SSR 优点

- 更快的首屏渲染速度
  - 浏览器显示静态页面的内容要比 JavaScript 动态生成的内容快得多
  - 当用户访问首页时可立即返回静态页面内容，而不需要等待浏览器先加载完整个应用程序
- 更好的 SEO
  - 爬虫是最擅长爬取静态的 HTML 页面，服务器端直接返回一个静态的 HTML 给浏览器
  - 这样有利于爬虫快速抓取网页内容，并编入索引，有利于SEO
- SSR 应用程序在 Hydration 之后依然可以保留 Web 应用程序的交互性。比如: 前端路由、响应式数据、虚拟 DOM 等

SSR 缺点

- SSR 通常需要对服务器进行更多 API 调用，以及在服务器端染需要消耗更多的服务器资源，成本高
- 增加了一定的开发成本，用户需要关心哪些代码是运行在服务器端，哪些代码是运行在浏览器端
- SSR 配置站点的缓存通常会比 SPA 站点要复杂一点

### SSR 解决方案

1. php、jsp...
2. 从零搭建 SSR 项目（Node + webpack + Vue/React）
3. 直接使用流行的框架
   - React：Next.js
   - Vue3：Nuxt3、Vue2：Nuxt.js
   - Angular：Angular Universal

SSR 应用场景非常广阔，比如：

- SaaS产品，如：电子邮件网站、在线游戏、客户关系管理系统(CRM)、采购系统等
- 门户网站、电子商务、零售网站
- 单个页面、静态网站、文档类网站

## Vue3+SSR

Vue 除了支持开发 SPA 应用之外，其实也是支持开发 SSR 应用的

在 Vue 中创建 SSR 应用，需要调用 createSSRApp 函数，而不是 createApp

- createApp：创建应用，直接挂载到页面上
- createSSRApp：创建应用，是在激活的模式下挂载应用

服务端用 `@vue/server-render` 包中的 renderToString 来进行渲染

![image-20231026145849567](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231026145849567.png)

### Node Server搭建

需安装的依赖项

```bash
$ npm i express
$ npm i -D nodemon webpack webpack-cli webpack-node-externals
```

target 为 node，需要配置 externals，不然打包体积会很大

![image-20231027092350901](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027092350901.png)

```js
/* webpack.config.js */
const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'node', // fs path 不会打包到 bundle
  mode: 'development',
  entry: './src/server/index.js',
  output: {
    filename: 'server_bundle.js',
    path: path.resolve(__dirname, '../build/server')
  },
  externals: [nodeExternals()] // 移除 node_modules 中的包
}
```

### Vue3 SSR搭建

需安装的依赖项

```bash
$ npm i express vue
$ npm i -D nodemon vue-loader babel-loader @babel/preset-env @vue/server-renderer
$ npm i -D webpack webpack-cli webpack-merge webpack-node-externals
```

app.js 返回一个函数

- 作用：避免跨请求状态的污染
- 通过函数来返回 app 实例，可以保证每个请求都返回一个新的 app 实例

```js
/* src/app.js */
import { createSSRApp } from 'vue'
import App from './App.vue'

export default function createApp() {
  const app = createSSRApp(App)
  return app
}
```

Node 返回静态页面

- 使用 `@vue/server-renderer` 的 renderToString 生成静态页面

```js
/* src/server/index.js */
const express = require('express')
import createApp from '../app'
import { renderToString } from '@vue/server-renderer'

const server = express()
const port = 3000

server.get('/', async (req, res) => {
  const app = createApp()
  const appStringHtml = await renderToString(app)

  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <div id="app">
        ${appStringHtml}
      </div>
    </body>
  </html>
  `)
})

server.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
```

打包生成静态页面

```js
/* config/server.config.js */
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const { VueLoaderPlugin } = require('vue-loader/dist/index')

module.exports = {
  target: 'node', // fs path 不会打包到 bundle
  mode: 'development',
  entry: './src/server/index.js',
  output: {
    filename: 'server_bundle.js',
    path: path.resolve(__dirname, '../build/server')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    // 项目导入文件就无需扩展名
    extensions: ['.js', '.json', '.wasm', '.jsx', '.vue']
  },
  externals: [nodeExternals()] // 移除 node_modules 中的包
}
```

生成的页面是没有附带任何 JS 文件的，点击 +1，页面不会有任何变化

- 还需要激活一下，Hydration

![image-20231027100453707](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027100453707.png)

### SSR Hydration

针对 web 进行单独配置

```js
/* config/client.config.js */
const path = require('path')
const { VueLoaderPlugin } = require('vue-loader/dist/index')
const { DefinePlugin } = require('webpack')

module.exports = {
  target: 'web',
  mode: 'development',
  entry: './src/client/index.js',
  output: {
    filename: 'client_bundle.js',
    path: path.resolve(__dirname, '../build/client')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      __VUE_OPTIONS_API__: false
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.wasm', '.jsx', '.vue']
  }
}
```

在服务器页面模板里引入 client_bundle.js 即可

服务器端渲染页面 + 客户端激活页面，使页面有交互效果（这个过程称为：Hydration 水合）

Hydration 的具体步骤如下：

1. 开发一个 App 应用，比如：App.vue
2. 将 App.vue 打包为一个客户端的 client_bundle.js 文件
   - 用来激活应用，使页面有交互效果
3. 将 App.vue 打包为一个服务器端的 server_bundle.js 文件
   - 用来在服务器端动态生成页面的 HTML
4. server_bundle.js 渲染的页面 + client_bundle.js 文件进行 Hydration

### 跨请求状态污染

在 SPA 中，整个生命周期中只有一个 App 对象实例或一个 Router 对象实例或一个 Store 对象实例都是可以的，因为每个用户在使用浏览器访问 SPA 应用时，应用模块都会重新初始化，这也是一种单例模式

然而，在 SSR 环境下，App 应用模块通常只在服务器启动时初始化一次。同一个应用模块会在多个服务器请求之间被复用，而我们的单例状态对象也一样，也会在多个请求之间被复用

- 当某个用户对共享的单例状态进行修改，那么这个状态可能会意外地泄露给另一个在请求的用户
- 我们把这种情况称为：跨请求状态污染

为了避免这种跨请求状态污染，SSR 解决方案是：

- 可以在每个请求中为整个应用创建一个全新的实例，包括：router 和 store 等实例
- 所以创建 App 或路由或 Store 对象时都是使用一个函数来创建，保证每个请求都会创建一个全新的实例
- 这样也会有缺点：需要消耗更多的服务器的资源

### Vue Router

先使用 webpack-merge 对基础配置进行抽离。之后安装 vue-router 依赖

```bash
$ npm i vue-router
```

注意事项：

- 为了避免跨请求状态污染，需要在每个请求中都创建一个全新的 router

server 里需要先安装路由插件

- 使用的是 `createMemoryHistory`
- 这里需要等路由加载完再去渲染页面

![image-20231027145514124](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027145514124.png)

client 里需要水合路由插件

- 使用的是 `createWebHistory`

![image-20231027145711829](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027145711829.png)

### Pinia

安装 pinia 依赖

```bash
$ npm i pinia
```

注意事项：

- 为了避免跨请求状态污染，需要在每个请求中都创建一个全新的 store

server 里需要先安装 pinia 插件

![image-20231027155353434](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027155353434.png)

client 里需要水合 pinia 插件

![image-20231027155311479](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027155311479.png)