# Web Worker 使用

> [Web Worker 使用教程](http://www.ruanyifeng.com/blog/2018/07/web-worker.html)

## 基本概述

浏览器页面的 JavaScript 默认在主线程执行；主线程既要处理交互、布局与绘制，也要执行脚本。长时间 CPU 计算会阻塞页面响应。

Web Worker 为计算任务提供独立的执行上下文。主线程把可并行的计算交给 Worker，双方通过消息交换数据；Worker 不能操作页面 DOM。

每个 Worker 都有自己的事件循环，消息回调仍由其宿主调度，并非可在任意时刻抢占执行。创建 Worker 有启动和内存成本，适合图像处理、解析、加密或大规模计算；任务结束后应显式终止。

## 职责与通信边界

- 主线程负责 UI、任务调度、展示结果与取消请求。
- Worker 负责不依赖 DOM 的计算，并只返回可序列化或可转移的数据。
- `postMessage()` 默认使用结构化克隆；传输大 `ArrayBuffer` 时可使用 transfer list 转移所有权。转移后发送方对应的 `ArrayBuffer` 会变为不可用。
- 不要把 Worker 当作网络轮询的默认方案：轮询频率、重试、鉴权和取消仍需由业务层控制；实时需求优先评估 SSE 或 WebSocket。

Web Worker 有以下几个使用注意点：

1. 同源限制

   经典 Worker 的脚本 URL 通常受同源限制。模块 Worker 还会遵循模块加载与 CORS 规则；工程中优先由构建工具生成 URL，而不是手写部署路径

2. DOM 限制

   Worker 线程所在的全局对象与主线程不同，无法读取页面 DOM，也不能使用 `document`、`window`、`parent`。可使用 `self`、`navigator`、`location`、`fetch` 等 Worker 支持的 API

3. 通信联系

   Worker 线程和主线程不在同一个上下文环境，它们不能直接通信，必须通过消息完成

4. 脚本限制

   Worker 线程不能执行 `alert()`、`confirm()` 等页面交互 API，但可以使用 `fetch()`；旧代码也可使用 `XMLHttpRequest`

5. 文件限制

   Worker 不能任意访问本机文件系统。用户选择的 `File`/`Blob` 可以经消息传入；开发时应通过 HTTP 服务访问 Worker 脚本，而非直接打开 `file://` 页面

## 基本用法

### 主线程

主线程采用 `new` 命令，调用 `Worker()` 构造函数，新建一个 Worker 线程

```js
const worker = new Worker(new URL('./work.js', import.meta.url), {
  type: 'module'
})
```

`Worker()` 构造函数的参数是一个脚本文件，该文件就是 Worker 线程所要执行的任务

然后，主线程调用 `worker.postMessage()` 方法，向 Worker 发消息

```js
worker.postMessage('Hello World')
worker.postMessage({ method: 'echo', args: ['Work'] })
```

`worker.postMessage()` 方法的参数，就是主线程传给 Worker 的数据。它可以是各种数据类型，包括二进制数据

接着，主线程通过 `worker.onmessage` 指定监听函数，接收子线程发回来的消息

```js
worker.addEventListener('message', event => {
  console.log('Received message:', event.data)
})

worker.addEventListener('error', event => {
  console.error('Worker 执行失败:', event.message)
})
```

Worker 完成任务以后，主线程就可以把它关掉

```js
worker.terminate()
```

### Worker 线程

Worker 线程内部需要有一个监听函数，监听 `message` 事件

- `self` 代表子线程自身，即子线程的全局对象
- 在模块 Worker 中可直接使用 `self`；不要依赖顶层 `this`

```js
self.addEventListener('message', event => {
  self.postMessage(`You said: ${event.data}`)
})
```

根据主线程发来的数据，Worker 线程可以调用不同的方法

- `self.close()` 用于在 Worker 内部关闭自身

```js
// Worker 线程
self.addEventListener('message', event => {
  const data = event.data
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg)
      break
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg)
      self.close()
      break
    default:
      self.postMessage('Unknown command: ' + data.msg)
  }
})

// 主线程
worker.postMessage({ cmd: 'stop', msg: 'Hello World' })
worker.postMessage({ cmd: 'start', msg: 'Hello World' })
```

### Worker 加载脚本

经典 Worker 内部可用 `importScripts()` 同步加载传统脚本；模块 Worker 应使用静态 `import`。两种模式不要混用。

```js
importScripts('script1.js')
```

### 错误处理

主线程可以监听 Worker 是否发生错误。如果发生错误，Worker 会触发主线程的 `error` 事件

```js
worker.addEventListener('error', event => {
  console.error(event.message)
})
```

### 关闭 Worker

使用完毕，为了节省系统资源，必须关闭 Worker

```js
// 主线程
worker.terminate()

// Worker 线程
self.close()
```

## 数据通信

主线程与 Worker 之间可以传递文本、对象、`File`、`Blob`、`ArrayBuffer` 等数据。默认使用**结构化克隆**：不是 JSON 字符串序列化，函数、DOM 节点等不可克隆；接收方修改克隆后的对象不会影响发送方。

主线程与 Worker 之间也可以交换二进制数据，比如 File、Blob、ArrayBuffer 等类型，也可以在线程之间发送

```js
// Worker 线程
self.onmessage = event => {
  const uInt8Array = new Uint8Array(event.data)
  postMessage({
    values: [...uInt8Array],
    byteLength: uInt8Array.byteLength
  })
}

// 主线程
const worker = new Worker(new URL('./work.js', import.meta.url), { type: 'module' })
worker.onmessage = event => {
  console.log(event.data)
}
const uInt8Array = new Uint8Array(new ArrayBuffer(10))
for (let i = 0; i < uInt8Array.length; i += 1) {
  uInt8Array[i] = i * 2 // [0, 2, 4, 6, 8,...]
}
worker.postMessage(uInt8Array.buffer, [uInt8Array.buffer])
```

但是，拷贝方式发送二进制数据，会造成性能问题

- 比如：主线程向 Worker 发送一个 500MB 文件，默认情况下浏览器会生成一个原文件的拷贝
- 为了解决这个问题，JavaScript 允许主线程把二进制数据直接转移给子线程，但是一旦转移，主线程就无法再使用这些二进制数据了，这是为了防止出现多个线程同时修改数据的麻烦局面
- 这种转移数据的方法称为 [Transferable Objects](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Transferable_objects)。它可避免大块数据复制，适合图像、音频和 3D 运算；仍须评估数据量与 Worker 启动成本

如果要直接转移数据的控制权

```js
// Transferable Objects 格式
worker.postMessage(arrayBuffer, [arrayBuffer])

// 例子
var ab = new ArrayBuffer(1)
worker.postMessage(ab, [ab])
```

## 生命周期

主线程在组件卸载、路由离开或任务取消时调用 `worker.terminate()`，并移除监听器。若 Worker 内部使用定时器、`MessagePort` 或 `fetch()`，也应接受取消消息并清理；`terminate()` 会直接停止 Worker，不会等待异步任务完成。
