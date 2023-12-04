# JavaScript异步编程

## 同步异步模式

**同步模式(Synchronous)：** 代码中的任务依次执行

- 最开始会有个匿名函数，代表所有要执行的方法
- 函数的声明不会入 Call stack，调用的方法会进入 Call stack，执行完成后会弹出

Call stack（调用栈）

- JS 在执行 引擎中维护了一个正在工作的工作表，这里会记录当前正在做的事情，当工作表任务全部清空后，这一轮工作就算结束了

排队执行的机制存在的问题：

- 如果其中某一段代码执行时间过长，后面的任务就会延迟（阻塞），这时就需要异步模式来解决

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/同步任务.png)

**异步模式（Asynchronous）：** 不会去等待这个任务的结束才开始下一个任务，开启任务过后就立即往后执行下一个任务，该任务后续逻辑一般会通过回调函数的方式定义

- 当碰到 `setTimeout` 会异步对其调用，这里它是单独工作的并不会受到 JS 线程响

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/异步模式1.png)

当调用栈已经没有任务了，这时候 Event loop 就会发挥作用（监听调用栈和消息队列），调用栈所有任务都结束了，Event loop 就会去消息队列中取第一个回调函数压入到调用栈，如此反复

- `timer2` 会先放入消息队列，`timer1` 后放入消息队列

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/异步模式2.png)

- JavaScript 是单线程，但浏览器不是单线程，JS 里某些 API 也不是单线程的，例如：计时器，单独开了线程

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/消息队列.jpg)

## Promise

> [阮一峰 Promise 对象](https://es6.ruanyifeng.com/#docs/promise)

**回调函数**

- 回调函数可以理解为一件你想要的事情
- 由调用者定义，交给执行者执行的函数

如果直接使用传统回调方式去完成复杂的异步流程，就无法避免大量回调函数嵌套（回调地狱）

```js
$.get('url1', function (data1) {
  $.get('url2', function (data2) {
    $.get('url3', function (data3) {
      $.get('url4', function (data4) {
        // ...
      })
    })
  })
})
```

### 基础使用

为了避免回调地狱问题，CommonJS 社区提出了 Promise的规范，为异步编程提供一种更强大的解决方案，后来在 ES2015 中被标准化，成为语言规范

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/Promise图.png)

安装 webpack

```bash
npm i webpack-cli webpack-dev-server webpack@4 html-webpack-plugin@4
```

执行 `webpack-dev-server`

```bash
yarn webpack-dev-server xxx.js --open
```

`webpack.config.js`

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  mode: 'none',
  stats: 'none',
  devtool: 'source-map',
  plugins: [new HtmlWebpackPlugin()],
}
```

Promise 方式的 Ajax：在根目录中新建 `public/api/foo.json` 文件

```js
function ajax(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.onload = function () {
      if (this.status === 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }
    xhr.send()
  })
}

ajax('/api/foo.json').then(
  function (res) {
    console.log(res)
  },
  function (error) {
    console.log(error)
  }
)
```

### 链式调用

**常见误区**

- Promise 本质也是使用回调函数，定义异步任务结束后所需执行的任务

- 回调函数是通过 then 方法传递的，如果连续串联多个异步任务也会出现回调函数的问题

  嵌套使用的方式是使用 Promise 最常见的错误，可以使用 Promise then 方法链式调用的特点解决这个问题，尽可能保证异步任务的扁平化

注意：then 链并不是以往直接返回 this 的方式实现的，它其实返回的是一个全新的 Promise 对象

- 每一个 then 方法实际上都是为上一个 then 返回的 Promise 对象添加状态明确后的回调，Promise 会依次调用，就会避免回调嵌套，让代码扁平化

```js
const promise = ajax('/api/foo.json')
const promise2 = promise.then(
  function onFulfilled(value) {
    console.log('onFulfilled', value)
  },
  function onRejected(value) {
    console.log('onRejected', value)
  }
)
console.log(promise === promise2) // false

ajax('/api/users.json')
  .then(function onFulfilled(value) {
    console.log('0'.repeat(3))   // 000
    return '1'
  })
  .then(function onFulfilled(value) {
    console.log(value.repeat(3)) // 111
    return '2'
  })
  .then(function onFulfilled(value) {
    console.log(value.repeat(3)) // 222
    return '3'
  })
```

**then 总结**

- Promise 对象的 then 方法会返回一个全新的 Promise 对象
- 后面的 then 方法就是在为上一个 then 返回的 Promise 注册回调
- 前面 then 方法中回调函数的返回值会作为后面 then 方法回调的参数
- 如果回调函数中返回的是 Promise，那后面 then 方法的回调会等待它的结束

### 异常处理

Promise 链条上的任何一个异常会一直向后传递，直至被捕获

```js
ajax('/api/users.json').then(
  function onFulfilled(value) {
    return ajax('/error-url')
  },
  // 只能捕获 ajax('/api/users.json') 的异常
  function onRejected(error) {
    console.log('onRejected', error) // 捕获不到异常
  }
)

ajax('/api/users.json')
  .then(function onFulfilled(value) {
    return ajax('/error-url')
  })
  .catch(function onRejected(error) {
    console.log('onRejected', error) // 能捕获到异常
  })
```

还可以在全局对象上注册一个 `unhandledrejection` 事件，去处理哪些没有被 Promise 捕获的异常

```js
// 全局捕获 Promise 异常
window.addEventListener(
  'unhandledrejection',
  event => {
    const { reason, promise } = event
    console.log(reason, promise)
    // reason => Promise 失败原因，一般是一个错误对象
    // promise => 出现异常的 Promise 对象
    event.preventDefault()
  },
  false
)

// Node.js 事件名称是驼峰命名，参数也不大相同
process.on('unhandledRejection', (reason, promise) => {
  console.log(reason, promise)
  // reason => Promise 失败原因，一般是一个错误对象
  // promise => 出现异常的 Promise 对象
})
```

### 静态方法

有时需要将现有对象转为 Promise 对象，就可以使用 `Promise.resolve`

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

- 如果参数是 Promise 实例，那么 `Promise.resolve` 将不做任何修改，原封不动地返回这个实例

```js
const promise = ajax('api/users.json') // 返回的是 Promise 实例
const promise2 = Promise.resolve(promise)
console.log(promise === promise2) // true
```

`Promise.resolve` 会将参数转换为 Promise，具有如下 then 方法的对象，可以说是实现了 `thenable` 的接口

- 原生 Promise 还没有普及之前，很多都是使用第三方的库来实现 Promise，如果想把第三方的 Promise 转换成原生的 Promise，就可以借助这个机制转换

```js
Promise.resolve({
  then: function (onFulfilled, onRejected) {
    onFulfilled('foo')
  },
}).then(function (value) {
  console.log(value) // foo
})
```

`Promise.reject` 方法也会返回一个新的 Promise 实例

```js
const p = Promise.reject('出错了')
// 等同于
const p = new Promise((resolve, reject) => reject('出错了'))
```

### 并行执行

`Promise.all` 等待所有任务结束才结束

```js
/* {
  "users": "/api/users.json",
  "posts": "/api/posts.json"
} */
ajax('/api/urls.json')
  .then(value => {
    const urls = Object.values(value)
    const tasks = urls.map(url => ajax(url))
    return Promise.all(tasks)
  })
  .then(values => {
    console.log(values)
  })
```

`Promise.race` 只会等待第一个结束的任务

```js
const request = ajax('/api/posts.json')
const timeout = new Promise((resolve, reject) => {
  setTimeout(() => reject(new Error('timeout')), 500)
})
Promise.race([request, timeout])
  .then(value => {
    console.log(value)
  })
  .catch(error => {
    console.log(error)
  })
```

### 执行时序

目前绝大多数异步调用都是作为宏任务执行，而 `Promise`、`MutationObserver`、`process.nextTick` 都会作为微任务，在本轮调用末尾执行

```js
console.log('global start')
setTimeout(() => {
  console.log('setTimeout')
}, 0)
Promise.resolve()
  .then(() => {
    console.log('promise')
  })
  .then(() => {
    console.log('promise2')
  })
console.log('global end')
/* 
global start
global end
promise
promise2
setTimeout
*/
```

- 回调队列中的任务称之为 **宏任务**

- 宏任务在执行过程中可以临时加上一些额外需求

  可以选择作为一个新的宏任务进到队列中排队

  也可以作为当前任务的 **微任务**（直接在当前任务结束过后立即执行，而不是到整个队伍末尾继续排队）

- Promise 的回调会作为微任务执行

（JS 回调队列中等待的任务）假设我现在去银行柜台办理存款业务（宏任务）， 办完存款后突然想办一张信用卡（微任务），这时你直接银行柜员你临时的需求，而银行柜员为了提高我的体验，一般会捎带脚办理了，并不算插队

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/银行柜台排队.png)

## Generator 异步方案

ES2015 提供了 Generator

- 语法上就是在普通函数的基础上多了一个 `*`

- 调用生成器函数并不会立即执行，而是得到一个生成器对象，直到调用 `next` 函数体才会执行

- 在函数内部可以随时使用 `yield` 关键字，向外返回值，可以通过 `next` 方法拿到这个值

  返回的值里面有 `done` 属性，用来表示生成器函数是否执行完毕

- `yield` 关键字并不会像 return 语句一样立即结束函数的执行，它只是暂停函数执行，直到再次调用 `next ` 方法才会从 `yield` 关键字后执行

- 调用 `next` 方法时如果传入一个参数，这个参数会作为 `yield` 的返回值

- 调用 `throw` 方法，就会对生成器内部抛异常

```js
function* foo() {
  console.log('start')
  const res = yield 'foo'
  console.log(res)
  try {
    yield 'foobar'
  } catch (e) {
    console.log(e)
  }
}
const generator = foo()
const result = generator.next('bar') 
console.log(result)
generator.next('bar')
generator.throw(new Error('Generator error'))

/* 
start
{value: 'foo', done: false}
bar
Error: Generator error
*/
```

Generator 配合 Promise 的异步方案

```js
function* main() {
  const users = yield ajax('/api/users.json')
  console.log(users)
  const posts = yield ajax('/api/posts.json')
  console.log(posts)
}
const g = main()
const result = g.next()
result.value.then(data => {
  const result2 = g.next(data)
  if (result2.done) return
  result2.value.then(data => {
    const result3 = g.next(data)
    if (result3.done) return
    result3.value.then(data => {
      g.next(data)
    })
  })
})
```

这里可以结合递归不断迭代，直到结果 `done: true`

- [co](https://github.com/tj/co) 生成器函数执行器（在 2015 年之前是比较流行的）

```js
function co(generator) {
  const g = generator()
  function handleResult(result) {
    // 生成器函数结束
    if (result.done) return
    result.value.then(
      data => {
        handleResult(g.next(data))
      },
      error => {
        g.throw(error)
      }
    )
  }
  handleResult(g.next())
}
function* main() {
  try {
    const users = yield ajax('/api/users.json')
    console.log(users)
    const posts = yield ajax('/api/posts.json')
    console.log(posts)
  } catch (e) {
    console.log(e)
  }
}
co(main)
```

## Async Await 语法糖

使用 Generator 之后，JavaScript 代码就有同步的体验了，但是使用 Generator 异步方案，需要自己手动实现一个执行器函数 `co` 函数

ES2017 里增加了 `async` 函数，同样提供了扁平化异步编程体验，其实就是生成器函数的语法糖

- `async` 函数可以返回一个 Promise 对象
- `await` 关键字只能在 `async` 函数里

```js
async function main() {
  try {
    const users = await ajax('/api/users.json')
    console.log(users)
    const posts = await ajax('/api/posts.json')
    console.log(posts)
  } catch (e) {
    console.log(e)
  }
}
const promise = main()
promise.then(() => {
  console.log('all completed')
})
```

