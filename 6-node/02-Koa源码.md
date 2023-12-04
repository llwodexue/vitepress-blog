# Koa源码

## Koa 简介

原生 http 的不足

- 令人困惑的 request 和 response

  - res.end
  - res.writeHead

- 对描述复杂业务逻辑

  - 流程描述

  - 切面描述 AOP

    语言级和框架级

Koa 是一个新的 web 框架， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有
表现力、更健壮的基石

- Koa 是 Express 的下一代基于 Node.js 的 web 框架
- Koa2 完全使用 Promise 并配合 async 来实现异步

特点：

- 轻量、无捆绑
- 中间件架构
- 优雅的 API 设计
- 增强的错误处理

Koa 中间件机制：Koa 中间件机制就是函数式 组合概念 Compose 的概念，将一组需要顺序执行的
函数复合为一个函数，外层函数的参数实际是内层函数的返回值。洋葱圈模型可以形象表示这种机
制，是源码中的精髓和难点

![image-20230323100206438](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230323100206438.png)

## Koa 原理

Koa 的目标是用更简单化、流程化、模块化的方式实现回调部分

```js
const http = require('http')
class Koa {
  listen(...args) {
    // 创建 http 服务
    const server = http.createServer((req, res) => {
      this.callback(req, res)
    })
    // 启动监听
    server.listen(...args)
  }
  use(callback) {
    this.callback = callback
  }
}
module.exports = Koa
```

Koa 为了能够简化 API，引入上下文 context 概念，将原始请求对象 req 和响应对象 res 封装并挂载到 context 上，并且在 context 上设置 getter 和 setter

```js
// request.js
module.exports = {
  get url() {
    return this.req.url
  },
  get method() {
    return this.req.method.toLowerCase()
  }
}
// response.js
module.exports = {
  get body() {
    return this._body
  },
  set body(val) {
    this._body = val
  }
}
// context.js
module.exports = {
  get url() {
    return this.request.url
  },
  get body() {
    return this.response.body
  },
  set body(val) {
    this.response.body = val
  },
  get method() {
    return this.request.method
  }
}
```

![image-20230323111058485](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230323111058485.png)

```js
const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
class Koa {
  listen(...args) {
    // 创建 http 服务
    const server = http.createServer((req, res) => {
      // 创建上下文
      let ctx = this.createContext(req, res)
      this.callback(ctx)
      // 数据响应
      res.end(ctx.body)
    })
    // 启动监听
    server.listen(...args)
  }
  use(callback) {
    this.callback = callback
  }
  /**
   * 创建上下文
   * @param {*} req
   * @param {*} res
   * @returns
   */
  createContext(req, res) {
    const ctx = Object.create(context)
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)
    ctx.req = ctx.request.req = req
    ctx.res = ctx.request.res = res
    return ctx
  }
}
module.exports = Koa
```

## 中间件 compose

Koa 中间件机制：Koa 中间件机制就是函数式组合（Compose）概念，将一组需要顺序执行的函数复合为一个函数，外层函数的参数实际是内层函数的返回值。洋葱模型可以形象表示这种机制

**两个函数组合**

```js
const compose =
  (fn1, fn2) =>
  (...args) =>
    fn2(fn1(...args))
```

**多个函数组合**：中间件数目是不固定的，可以用数组来模拟

```js
const compose =
  (...[first, ...other]) =>
  (...args) => {
    let ret = first(...args)
    other.forEach(fn => {
      ret = fn(ret)
    })
    return ret
  }
```

异步中间件：上面的函数都是同步的，挨个遍历执行即可，如果是异步的函数，是一个 promise，我们要支持 async + await 中间件，所以我们要等异步结束后，再执行下一个中间件

```js
function compose(middleWares) {
  return function () {
    function dispatch(i) {
      let fn = middleWares[i]
      if (!fn) {
        return Promise.resolve()
      }
      return Promise.resolve(
        fn(function next() {
          return dispatch(i + 1)
        })
      )
    }
    return dispatch(0)
  }
}
```

在 Koa 里实现 compose

```js
const http = require('http')
const context = require('./context')
const request = require('./request')
const response = require('./response')
class Koa {
  constructor() {
    this.middleWares = []
  }
  listen(...args) {
    // 创建 http 服务
    const server = http.createServer(async (req, res) => {
      // 创建上下文
      let ctx = this.createContext(req, res)

      // this.callback(ctx)
      // 合成
      const fn = this.compose(this.middleWares)
      await fn(ctx)

      // 数据响应
      res.end(ctx.body)
    })
    // 启动监听
    server.listen(...args)
  }
  // use(callback) {
  //   this.callback = callback
  // }
  use(middleWares) {
    this.middleWares.push(middleWares)
  }
  /**
   * 创建上下文
   * @param {*} req
   * @param {*} res
   * @returns
   */
  createContext(req, res) {
    const ctx = Object.create(context)
    ctx.request = Object.create(request)
    ctx.response = Object.create(response)

    ctx.req = ctx.request.req = req
    ctx.res = ctx.request.res = res
    return ctx
  }
  /**
   * 合成函数
   * @param {*} middleWares
   */
  compose(middleWares) {
    return function (ctx) {
      function dispatch(i) {
        const fn = middleWares[i]
        if (!fn) {
          return Promise.resolve()
        }
        return Promise.resolve(
          fn(ctx, function next() {
            return dispatch(i + 1)
          })
        )
      }
      return dispatch(0)
    }
  }
}
module.exports = Koa
```

## 中间件 router

Koa 中间件的规范：

- 一个 async 函数
- 接收 ctx 和 next 两个参数
- 任务结束需执行 next

中间件常见任务：

- 请求拦截
- 路由
- 日志
- 静态文件服务

```js
class Router {
  constructor() {
    this.stack = []
  }
  register(path, methods, middleware) {
    let route = { path, methods, middleware }
    this.stack.push(route)
  }
  get(path, middleware) {
    this.register(path, 'get', middleware)
  }
  post(path, middleware) {
    this.register(path, 'post', middleware)
  }
  routes() {
    let stock = this.stack
    return async function (ctx, next) {
      let currentPath = ctx.url
      let route
      for (let i = 0; i < stock.length; i++) {
        let item = stock[i]
        if (currentPath === item.path && item.methods.indexOf(ctx.method) >= 0) {
          // 判断path和method
          route = item.middleware
          break
        }
      }
      if (typeof route === 'function') {
        route(ctx, next)
        return
      }
      await next()
    }
  }
}
module.exports = Router
```

