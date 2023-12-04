# Nuxt3基础语法

## Nuxt

创建一个现代应用程序，所需技术：

- 支持数据双向绑定和组件化（Nuxt 选择了 Vue.js）
- 处理客户端的导航（Nuxt 选择了 vue-router）
- 支持开发中热模块替换和生成环境代码打包（Nuxt 支持 webpack5 和 vite）
- 兼容旧版本浏览器，支持最新的 JavaScript 语法转译（Nuxt 使用 esbuild）
- 应用程序支持云开发环境服务器，也支持服务器端渲染或 API 接口开发
- Nuxt 使用 h3 来实现部署可移植性（h3 是一个极小的高性能的 http 框架）
  - 如：支持在 Serverless、Workers 和 Node.js 环境中运行


Nuxt 是一个直观的 Web 框架

- 自 2016 年 10 月以来，Nuxt 专门负责集成上述所描述的事情，并提供前端和后端的功能
- Nuxt 框架可以用来快速构建下一个 Vue.js 应用程序，如支持 CSR、SSR、SSG 渲染模式的应用等

### 发展史

Nuxt.js

- 诞生于 2016 年 10 月 25 号，由 Sebastien Chopin 创建，主要是基于 Vue2 、Webpack2、Node 和 Express
- 在 2018 年 1 月 9 日，Sebastien Chopin 正式宣布，发布 Nuxt.js1.0 版本
  - 重要的变化是放弃了对 node < 8 的支持
- 2018 年 9 月 21 日，Sebastien Chopin 正式宣布，发布 Nuxt.js2.0 版本
  - 开始使用 Webpack 4 及其技术栈，其它的并没有做出重大更改
- 2021 年 8 月 12 日至今，Nuxt.js 最新的版本为: Nuxt.js2.15.8

Nyxt3 版本

- 经过 16 个月的工作，Nuxt 3 beta 于 2021 年 10 月 12 日发布，引入了基于 Vue 3、Vite 和 Nitro（服务引擎）
- 六个月后，2022 年 4 月 20 日，Pooya Parsa 宣布 Nuxt 3 的第一个候选版本，代号为 "Mount Hope"
- 在 2022 年 11 月 16 号， Pooya Parsa 再次宣布 Nuxt3 发布为第一个正式稳定版本

### 特点

- Vue 技术栈
  - Nuxt3 是基于 Vue3 + Vue Router + Vite 等技术栈，全程 Vue3 + Vite 开发体验 (Fast)
- 自动导包
  - Nuxt 会自动导入辅助函数、组合 API 和 Vue API，无需手动导入
  - 基于规范的目录结构，Nuxt 还可以对自己的组件、 插件使用自动导入
- 约定式路由（目录结构即路由
  - Nuxt 路由基于 vue-router，在 pages/ 目录中创建的每个页面，都会根据目录结构和文件名来自动生成路由
- 渲染模式：Nuxt 支持多种渲染模式（SSR、CSR、SSG 等）
  - 通用渲染（服务器端渲染和水合）、仅客户端渲染、全静态站点生成、混合渲染（每条路由缓存策略）
- 利于搜索引擎优化: 服务器端染模式，不但可以提高首屏渲染速度，还利于 SEO
- 服务器引擎
  - 在开发环境中，它使用 Rollup 和 Node.js
  - 在生产环境中，使用 Nitro 将您的应用程序和服务器构建到一个通用 .output 目录中
  - Nitro 服务引擎提供了扩平台部署的支持，包括 Node、Deno、Serverless、Workers 等平台上部署

![image-20231027172850387](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027172850387.png)

## Nuxt3 环境搭建

### 初始化

![image-20231027173313498](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027173313498.png)

命令行工具，新建项目（hello-nuxt）

- 方式一：`npx nuxi init hello-nuxt`
- 方式二：`pnpm dlx nuxi init hello-nuxt`
- 方式三：`npm install -g nuxi && nuxi init hello-nuxt`

执行 `npx nuxi init hell-nuxt` 报错，主要是网络不通导致：

![image-20231027174835501](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231027174835501.png)

解决方案：

1. `ping raw.githubusercontent.com ` 检查是否通

2. 如果访问不通，代表网络不通

3. 配置 host，本地解析域名

   - Mac 电脑 host 配置路径：`/etc/hosts`
   - Windows 电脑 host 配置路由：`C:\Windows\System32\drivers\etc`

4. 在 host 文件中新增一行

   `185.199.108.133 raw.githubusercontent.com`

5. 重新 ping 域名，如果通了就可以用了

6. 重新开一个终端创建项目即可

运行项目：

- 或在项目根目录创建 `.npmrc` 文件写入：`shamefully-hoist=true`

```bash
$ cd hello-nuxt
$ npm install
# 使用 pnpm，需要创建一个扁平化的 node_modules 目录结构
$ pnpm install --shamefully-hoist
```

### 目录结构

![image-20231030160058103](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231030160058103.png)

```json
{
  "scripts": {
    // 打包正式版本 -> nitro -> output
    "build": "nuxt build",
    // 开发环境运行
    "dev": "nuxt dev",
    // 打包正式版项目，但是会提前预渲染每个路由，nuxt build --prerender
    "generate": "nuxt generate",
    // 打包项目之后的本地阅览效果
    "preview": "nuxt preview",
    // npm 的生命周期钩子，执行完 npm install 之后会自动执行 nuxt prepare
    "postinstall": "nuxt prepare"
  }
}
```

### Nuxt配置

默认情况下，Nuxt 会将此文件视为入口点，并为应用程序的每个路由呈现其内容，常用于：

- 定义页面布局 Layout 或自定义布局，如：NuxtLayout
- 定义路由的占位，如：NuxtPage
- 编写全局样式
- 全局监听路由等等

> [https://nuxt.com.cn/docs/api/nuxt-config#runtimeconfig](https://nuxt.com.cn/docs/api/nuxt-config#runtimeconfig)

nuxt.config.ts 配置文件位于项目的根目录，可对 Nuxt 进行自定义配置。比如：可以进行如下配置：

- runtimeConfig：运行时配置，即定义环境变量
  - 可通过 .env 文件中的环境变量来覆盖，优先级（.env > runtimeConfig）
  - .env 的变量会打入到 process.env 中，符合规则会覆盖 runtimeConfig 的变量
  - .env 一般用于某些终端启动应用时动态指定配置，同时支持 dev 和 pro
-  appConfig：应用配置，定义在构建时确定的公共变量，如：theme
  - 配置会和 app.config.ts 的配置合并（优先级：app.config.ts > appConfig）
- app 配置
  - head：给每个页面上设置 head 信息，也支持 useHead 配置和内置组件
- router：配置路由相关的信息，比如在客户端渲染可以配置 hash 路由
- alias：路由的别名，默认已配置好
- modules：配置 Nuxt 扩展的模块，比如：`@pinia/nuxt`、`@nuxt/image`
- routeRules：定义路由规则，可更改路由的渲染模式或分配基于路由缓存策略
- builder：可指定用 vite 还是 webpack 来构建应用，默认是 vite，如切换为 webpack 还需要安装额外的依赖

### 应用配置

Nuxt3 提供了一个 app.config.ts 应用配置文件，用来定义在构建时确定的公共变量，例如：

- 网站的标题、主题色以及任何不敏感的项目配置

app.config.ts 配置文件的选项不能使用 env 环境变量来覆盖，与 runtimeConfig 不同

不要将秘密或敏感信息放在 app.config.ts 文件中，该文件是客户端公开

runtimeConfig 与 app.config 对比

rutimeConfig 和 app.config 都用于向应用程序公开变量。要确定是否应用使用其中一种，以下是一些指导原则：

- runtimeConfig：定义环境变量，比如：运行时需要指定的私有或公共 token
- app.config：定义公共变量，比如：在构建时确定的公共 token、网站配置

![image-20231031103725913](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231031103725913.png)

### Nuxt3内置组件

Nuxt3 框架也提供一些内置组件，常用的如下：

- SEO 组件：Html、Body、Head、Title、Meta、Style、Link、NoScript、Base
- NuxtWelcome：欢迎页面组件，该组件是 @nuxt/ui 的一部分
- NuxtLayout：是 Nuxt 自带的页面布局组件
- NuxtPage：是 Nuxt 自带的页面占位组件
  - 需要显示位于目录中的顶级货嵌套页面 pages/
  - 是对 router-view 的封装
- ClientOnly：该组件中的默认插槽的内容只在客户端渲染
  - 而 fallback 插槽的内容只在服务器端渲染
- NuxtLink：是 Nuxt 自带的页面导航组件

![image-20231031150829451](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231031150829451.png)

### 全局样式

编写全局样式步骤：

1. 在 assets 中编写全局样式，比如：global.scss
2. 接着在 nuxt.config 中的 css 选项中配置
3. 接着执行 npm i -D sass 即可

定义全局变量步骤：

1. 在 assets 中编写全局样式变量，比如：colors.scss
2. 接着在 nuxt.config 中的 vite 选项中配置
3. 然后就可以在任意组件中或 scss 文件中直接使用全局变量

```typescript
export default defineNuxtConfig({
  css: ['@/assets/styles/global.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // 自动给 scss 模块添加额外的数据
          additionData: '@use "~/assets/styles/variables.scss" as *'
        }
      }
    }
  }
})
```

`@use` 比 `@import` 性能要好一点

```scss
/* 手动导入全局样式 */
@import '~/assets/styles/variables.scss';

/* 给这个模块起命名空间，as *：可以省略命名空间 */
@use '~/assets/styles/variables.scss' as vb;
```

### 静态资源入

public 目录

- 用作静态资源的公共服务器，可在应用程序上直接通过 URL 直接访问
- 比如：引用 public/目录中的图像文件
  - 在静态 URL 中可用 /zznh.png
  - 静态的 URL 也支持在背景中使用

![image-20231101102710855](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231101102710855.png)

assets 目录

- assets 经常用于存放如样式表、字体或 SVG
- 可以使用 ~/assets/路径引用位于 assets 目录中的资产文件
- ~/assets/路径也支持在背景中使用

![image-20231101102913697](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231101102913697.png)

### 字体图标

字体图标使用步骤

1. 将字体图标存放在 assets 目录下
2. 字体文件可以使用 ~/assets 路径引用
3. 在 nuxt.config 配置文件中导入全局样式
4. 在页面中就可以使用字体图标了

```js
export default defineNuxtConfig({
  css: ['@/assets/fonts/iconfont.css']
})
```

![image-20231101110431733](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231101110431733.png)

## 页面和导航

### 新建页面

Nuxt 项目中的页面是在 pages 目录下创建的

- 在 pages 目录创建的页面，Nuxt 会根据该页面的目录结构和其文件来自动生成对应的路由
- 页面路由也称为文件系统路由器（file system router），路由是 Nuxt 的核心功能之一

新建页面步骤

1. 创建页面文件，比如：pages/index.vue
2. 将 `<NuxtPage />` 内置组件添加到 app.vue
3. 页面如果使用 scss 那么需要安装：`npm i sass -D`

命令快速创建页面

- `npx nuxi add page home` 创建 home 页面
- `npx nuxi add page detail/[id]` 创建 detail 页面
- `npx nuxi add page user-[role]/[id]` 创建 user 页面

### 组件导航

`<NuxtLink>` 是 Nuxt 内置组件，用来实现页面导航，是对 RouterLink 的扩展，比如：进入视口的链接启用预取资源等

- 底层是一个 `<a>` 标签，因此使用 a + href 也支持路由导航
- 但是用 a 标签导航会触发浏览器默认刷新事件，而 NuxtLink 不会，NuxtLink 还扩展了其它的属性和功能

启动 Hydration 后（已激活，可交互），页面导航会通过前端路由来实现，可以防止整页刷新。当然，手动输入 URL 后，点击刷新浏览器也可导航，这会导致整个页面刷新

NuxtLink 组件属性：

- to：支持路由路径、路由对象、URL
- href：to 的别名
- replace：默认是 false，是否替换当前路由
- activeClass：激活链接的类名
- target：和 a 标签的 target 一样，指定何种方式显示新页面

### 编程导航一

Nuxt3 除了可以通过 `<NuxtLink>` 内置组件来实现导航，同时也支持编程导航：navigateTo

- 通过编程导航，在应用程序中就可以轻松实现动态导航，但是编程导航不利于 SEO

navigateTo 函数在服务器和客户端都可用，也可以在插件、中间件中使用，也可以直接调用以执行页面导航

- 当用户触发该 goToProfile() 方法时，我们通过 navigateTo 函数来实现动态导航
- 建议：goToProfile 方法总是返回 navigateTo 函数（该函数不需要导入）或返回异步函数

navigateTo(to, options)函数：

- to：可以是纯字符串或外部 URL 或路由对象
- options：导航配置，可选
  - replace：默认为 false，为 true 时会替换当前路由页面
  - external：默认为 false，不允许导航到外部链接，true 则允许

```js
await navigateTo('/category')
await navigateTo({
  path: '/category',
  query: {
    id: 200
  }
})
```

### 编程导航二

Nuxt3 的编程导航除了可以通过 navigateTo 来实现导航，同时也支持 useRouter（或 Options API 的 `this.$router`）

useRouter 常用的 API：

- back：页面返回，同 `router.go(-1)`
- forward：页面前进，同 `router.go(1)`
- go：页面返回或前进，同 `router.go(-1)` 或 `router.go(1)`
- push：以编程方式导航到新页面。建议改用 navigateTo，支持性更好
- beforeEach：路由守卫钩子，每次导航前执行（用于全局监听）
- afterEach：路由守卫钩子，每次导航后执行（用于全局监听）

```js
const router = useRouter()
const goToMore = () => router.push('/more')
const goBack = () => router.go(-1)
```

### 动态路由

Nuxt3 和 Vue 一样，也是支持动态路由的，只不过在 Nuxt3 中，动态路由也是根据目录结构和文件的名称自动生成

动态路由语法：

- 页面组件目录或页面组文件都支持 [] 方括号语法
- 方括号里编写动态路由的参数

例如：动态路由支持如下写法：

- pages/detail/[id].vue -> /detail/:id
- pages/detail/user-[id].vue -> /detail/user-:id
- pages/detail/[role]/[id].vue -> /detail/:role/:id
- pages/detail-[role]/[id].vue -> /detail-:role/:id

![image-20231101150652614](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231101150652614.png)

注意事项：

- 动态路由和 index.vue 不能同时存在，Nest.js 则可以

![image-20231101142849337](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231101142849337.png)

### 路由参数

动态路由参数

1. 通过 [] 方括号语法定义动态路由，比如：/detail/[id].vue
2. 页面跳转时，在 URL 路径中传递动态路由参数，比如：/detail/10010
3. 目标页面通过 route.params 获取动态路由参数

查询字符串参数

1. 页面跳转时，通过查询字符串方式传递参数，比如：/detail/10010?name=bird
2. 目标页面通过 router.query 获取查询字符串参数

```js
const route = useRoute()
const { id } = route.params
```

### 404Page

捕获所有不匹配路由（即 404 not found 页面）

- 通过方括号内添加三个点，如：[...slug].vue 语法，其中 slug 可以时其它字符串
- 除了支持在 pages 根目录下创建，也支持在其子目录中创建
- Nuxt3 正式版不支持 404.vue 页面了，以前的候选版本是支持 404.vue，但是 Next.js 是支持的
- 404 页面可以通过 useRoute().params.xxx 来获取页面路由参数

![image-20231101173904921](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231101173904921.png)

### 路由匹配规则

路由匹配需注意的事项

- 预定义路由优先于动态路由，动态路由优先于捕获所有路由

  1. 预定义路由：pages/detail/create.vue

     将匹配 /detail/create

  2. 动态路由：pages/detail/[id].vue

     将匹配 /detail/1，/detail/abc 等

     但不匹配 /detail/create、/detail/1/1、/detail/ 等

  3. 捕获所有路由：pages/detail/[...slug].vue

     将匹配 /detail/1/2，/detail/a/b/c

     但不匹配 /detail 等
