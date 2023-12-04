# Nuxt3核心语法

## 路由嵌套

Nuxt 和 Vue 一样，也是支持嵌套路由的，只不过在 Nuxt 中，嵌套路由也是根据目录结构和文件自动生成

编写嵌套路由步骤：

1. 创建一个一级路由，如：parent.vue
2. 创建一个与一级路由同名同级的文件夹，如：parent
3. 在 parent 文件夹下，创建一个嵌套的二级路由
   - 如：parent/child.vue，则为一个二级路由页面
   - 如：parent/index.vue，则为二级路由默认的页面
4. 需要在 parent.vue 中添加 NuxtPage 路由占位

![image-20231101175705146](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231101175705146.png)

## 中间件

### 路由中间件

Nuxt 提供了一个可定制的路由中间件，用来监听路由的导航，包括：局部和全局监听（支持服务器和客户端执行）

路由中间件分为三种：

- 匿名（或内联）路由中间件

  - 在页面中使用 definePageMeta 函数定义，可监听局部路由。当注册多个中间件时，会按照注册顺序来执行

  ```typescript
  definePageMeta({
    middleware: [
      function (to, from) {
        console.log('第一个中间件')
        // return navigateTo('/detail')
      }
    ]
  })
  ```

- 命名路由中间件

  - 在 middleware 目录下定义，并会自动加载中间件。命名规范 kabab-case

  ```typescript
  export default defineNuxtRouteMiddleware((to, from) => {
    console.log('第二个中间件')
  })
  ```

- 全局路由中间件（优先级比前面的高，支持两端）

  - 在 middleware 目录中，需带 .gloabl 后缀的文件，每次路由更改都会自动运行

![image-20231102163638020](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231102163638020.png)

### 路由验证

Nuxt 支持对每个页面路由进行验证，我们可以通过 definePageMeta 中的 validate 属性来对路由进行验证

- validate 属性接受一个回调函数，回调函数中以 route 作为参数

- 回调函数的返回值支持：

  - 返回 boolean 值来确定是否放行路由

    true 放行路由，false 默认重定向到内置的 404 页面

  - 返回对象

    `{ statusCode: 401 }` 返回自定义的 401 页面，验证失败

  ```typescript
  definePageMeta({
    validate: (route) => {
      // return /^\d+$/.test(route.params.role as string)
      return {
        statusCode: 401,
        statusMessage: 'valid error'
      }
    }
  })
  ```

- 路由验证失败，不可以自定义错误页面

  - 在项目根目录（不是 pages 目录），新建 error.vue

![image-20231102170052071](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231102170052071.png)

## 布局

### Layout

Layout 布局是页面的包装器，可以将多个页面共性东西抽取到 Layout 布局中

- 例如：每个页面的页眉和页脚组件，这些具有共性的组件我们是可以写到一个 Layout 布局中

Layout 布局是使用 `<slot>` 组件来显示页面中的内容

Layout 布局有两种使用方式：

- 方式一：默认布局

  - 在 layouts 目录下新建的布局组件，比如：layouts/default.vue
  - 然后在 app.vue 中通过 `<NuxtLayout>` 内置组件来使用

  ![image-20231102173910849](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231102173910849.png)

- 方式二：自定义布局

  - 继续在 layouts 文件夹下新建 Layout 布局组件，比如：layouts/custom-layout.vue

  - 然后在 app.vue 中给 `<NuxtLayout>` 内置组件指定 name 属性的值为：custom-layout

    也支持在页面中使用 definePageMeta 宏函数来指定 layout 布局

```typescript
definePageMeta({
  layout: 'custom-layout'
})
```

### 渲染模式

浏览器和服务器都可以解释 JavaScript 代码，都可以将 Vue.js 组件呈现为 HTML 元素，此过程称为渲染

- 在客户端将 Vue.js 组件呈现为 HTML 元素，称为：客户端渲染模式
- 在服务器将 Vue.js 组件呈现为 HTML 元素，称为：服务器渲染模式

而 Nuxt3 是支持多种渲染模式，比如：

- 客户端渲染模式（CSR）：只需将 ssr 设置为 false
- 服务器端渲染模式（SSR）：只需将 ssr 设置为 true
- 混合渲染模式（SSR | CSR | SSG | SWR）：需在 routeRules 根据每个路由动态配置渲染模式（beta 版本）

> [routerules](https://nitro.unjs.io/config#routerules)

![image-20231114094806267](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231114094806267.png)