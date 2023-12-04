# Webpack简述

## Webpack 运行时

![wpSourceCode1](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode1.png)

iife 模式：

1. 打包后的文件就是一个函数自调用，当前函数调用时传入一个对象
2. 这个对象我们为了方便将之称为模块定义，它就是一个键值对
3. 这个键名就是当前被加载模块的文件名与某个目录的拼接
4. 这个键值就是一个函数，和 node.js 里的模块加载有一些类似，会将被加载模块中的内容包裹于一个函数中
5. 这个函数在将来某个时间点上会被调用，同时会接收到一定的参数，利用这些参数就可以实现模块的加载操作
6. 针对于上述的代码就相当于是将 `{}`（模块定义）传递给了 `modules`

非 iife 模式：

webpack 的 runtime 就是 webpack 最后生成的代码，做了三件事情：

1. `__webpack__modules__`：维护一个所有模块的数组。将入口模块解析为 AST，根据 AST 深度优先搜索所有的模块，并构建出这个模块数组。每个模块都由一个包裹函数 `(module, module.exports, __webpack_require__)` 对模块进行包裹构成
2. `__webpack_require__(moduleId)`: 手动实现加载一个模块。对已加载过的模块进行缓存，对未加载过的模块，执行 id 定位到 `__webpack_modules__` 中的包裹函数，执行并返回 `module.exports`，并缓存
3. `__webpack_require__(0)`: 运行第一个模块，即运行入口模块

```js
const __webpack_modules__ = [() => {}];
const __webpack_require__ = (id) => {
  const module = { exports: {} };
  const m = __webpack_modules__[id](module, __webpack_require__);
  return module.exports;
};

__webpack_require__(0);
```

## Webpack 的构建流程主要有哪些环节？

> 如果可以请尽可能详尽的描述 Webpack 打包的整个过程

- webpack 是运行在 nodejs 环境下，配置文件遵循 commonjs 规范，其配置文件 `webpack.config.js` 导出一个 `object/function/promise/array`
- webpack 在启动后，会从 entry 开始，递归解析 enrtry 依赖的所有 module，每找到一个 module，就会根据 `module.rules` 里配置的 loader 进行相应的处理，对 module 进行转换后，再解析出当前 module 依赖的 module，这些 module 会以 entry 为单位进行分组，即为一个 chunk
- 因此一个 chunk 就是一个 entry 及其所有依赖 module 合并的结果，最后 webpack 会将所有的 chunk 输出转换成 output

构建流程中，webpack 会在恰当时机执行 plugin 里定义的逻辑，从而完成 plugin 插件的优化任务。流程如下：

1. 配置初始化

   webpack 会读取配置文件，执行默认配置

2. 编译前准备

   compiler 继承 `tapable`，具备钩子操作能力（监听事件、触发事件）

   webpack 会实例化了 compiler 对象，并设置 `NodeEnvironmentPlugin` 让 compiler 对具备读写能力

   循环挂载 plugins 到 compiler 对象身上，并处理 webpack 内部默认的插件

3. resolve 前准备

   监听 make 钩子，webpack 实例化 compilation（具备了 `normalModuleFactory` 工厂创建一个普通模块的能力）

   make 钩子在 `compiler.run` 时触发

4. resolve 流程

   解析文件的路径信息以及 loader 及 inline loader 和配置的 loader 合并、排序

5. 构建 module

   runLoaders 处理源码，得到一个编译后的字符串或 buffer，将文件解析为 ast，分析 module 间的依赖关系，递归解析依赖文件

6. 生成 chunk

   实例化 chunk 并生成 chunk graph，设置 module、id、chunk id、hash 等

7. 资源构建

   使用不同的 template 渲染 chunk 资源

8. 文件生成

   创建不同的 template 渲染 chunk 资源

## Webpack DevServer

1. `webpack-dev-server` 将打包输出 bundle 使用内存型文件系统控制，而非真实的文件系统。此时使用的是 [memfs (opens new window)](https://github.com/streamich/memfs)模拟 node.js `fs` API
2. 每当文件发生变更时，`webpack` 将会重新编译，`webpack-dev-server` 将会监控到此时文件变更事件，并找到其对应的 `module`。此时使用的是 [chokidar (opens new window)](https://github.com/paulmillr/chokidar)监控文件变更
3. `webpack-dev-server` 将会把变更模块通知到浏览器端，此时使用 `websocket` 与浏览器进行交流。此时使用的是 [ws(opens new window)](https://github.com/websockets/ws)
4. 浏览器根据 `websocket` 接收到 hash，并通过 hash 以 JSONP 的方式请求更新模块的 chunk
5. 浏览器加载 chunk，并使用新的模块对旧模块进行热替换，并删除其缓存
