# Webpack源码

## 打包文件模块分析

### 源码调试

![wpSourceCode1](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode1.png)

1. 打包后的文件就是一个函数自调用，当前函数调用时传入一个对象
2. 这个对象我们为了方便将之称为模块定义，它就是一个键值对
3. 这个键名就是当前被加载模块的文件名与某个目录的拼接
4. 这个键值就是一个函数，和 node.js 里的模块加载有一些类似，会将被加载模块中的内容包裹于一个函数中
5. 这个函数在将来某个时间点上会被调用，同时会接收到一定的参数，利用这些参数就可以实现模块的加载操作
6. 针对于上述的代码就相当于是将 `{}`（模块定义）传递给了 `modules`

![wpSourceCode4](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode4.png)

打开调试工具，创建 `launch.json`

- 导出的内容放到 `module.exports` 中

![wpSourceCode3](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode3.png)

### 功能函数

```js
(function (modules) {
  // 定义对象用于缓存已加载过的模块
  var installedModules = {}

  // webpack 自定义的一个加载方法，核心功能就是返回被加载模块中导出的内容
  function __webpack_require__(moduleId) {}

  // 将模块定义保存一份，通过 m 属性挂载到自定义的方法身上
  __webpack_require__.m = modules

  // 导出加载过的模块
  __webpack_require__.c = installedModules

  // 判断被传入的对象 obj 身上是否具有指定的属性 **** ,如果有则返回 true
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property)
  }

  // 可以给对象身上添加属性 name，并添加访问器
  __webpack_require__.d = function (exports, name, getter) {
    // 如果当前 exports 身上不具备 name 属性，则条件成立
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter })
    }
  }

  // 给对象身上加一个标记，通过这个标记就可以知道它是 esModule 还是非 esModule
  __webpack_require__.r = function (exports) {
    // 下面的条件如果成立就说明是一个  esModule
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    }
    // 如果条件不成立，我们也直接在 exports 对象的身上添加一个 __esModule 属性，它的值就是true
    Object.defineProperty(exports, '__esModule', { value: true })
  }

  // 1 调用 t 方法之后，我们会拿到被加载模块中的内容 value
  // 2 对于 value 来说我们可能会直接返回，也可能会处理之后再返回
  __webpack_require__.t = function (value, mode) {}

  // 如果 module 是 ES Modules 模块，返回 default
  __webpack_require__.n = function (module) {}

  // webpack 配置里面的 public
  __webpack_require__.p = ''

  // __webpack_require__.s 存储模块 id 值
  return __webpack_require__((__webpack_require__.s = './src/index.js'))
})
```

### CommonJS 模块打包

webpack 默认使用 CommonJS 规范处理打包结果

- 如果模块时使用 CommonJS 方式导入，webpack 不需要额外处理
- 如果模块时使用 ES Modules 方式导入，webpack 会进行处理

`__webpack_require__.r` 方法给 `exports` 添加标记

- `Symbol.toStringTag`：`Object.prototype.toString()` 方法会读取这个标签并作为返回值

![wpSourceCode5](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode5.png)

`__webpack_require__.d` 给属性 `age` 添加 `getter` 方法

![wpSourceCode6](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode6.png)

```js
/* index.js */
let obj = require('./login.js')
console.log('index.js内容执行了')
console.log(obj.default, '---->', obj.age)

/* login.js */
// 01 采用 cms 导出模块内容
// module.exports = 'zcegg'
// 02 采用 esModule 导出模块内容
export default 'zcegg'
export const age = 18

/* 打包后的文件 */
{
  './src/index.js': function (module, exports, __webpack_require__) {
    let obj = __webpack_require__(/*! ./login.js */ './src/login.js')
    console.log('index.js内容执行了')
    console.log(obj.default, '---->', obj.age)
  },
  './src/login.js': function (module, __webpack_exports__, __webpack_require__) {
    'use strict'
    // 01 采用 cms 导出模块内容
    // module.exports = 'zcegg'
    // 02 采用 esModule 导出模块内容
    __webpack_require__.r(__webpack_exports__)
    __webpack_require__.d(__webpack_exports__, 'age', function () {
      return age
    })
    __webpack_exports__['default'] = 'zcegg'
    const age = 18
  }
}
```

### ES Modules 模块打包

```js
/* index.js */
import name, { age } from './login.js'
console.log('index.js内容加载了')
console.log(name, '---->', age)

/* login.js */
// 01 采用 cms 导出模块内容
// module.exports = 'zce'
// 02 采用 esModule 导出模块内容
export default 'zce'
export const age = 100


/* 打包后的文件 */
{
  './src/index.js': function (module, __webpack_exports__, __webpack_require__) {
    'use strict'
    __webpack_require__.r(__webpack_exports__)
    var _login_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./login.js */ './src/login.js'
    )
    console.log('index.js内容加载了')
    console.log(
      _login_js__WEBPACK_IMPORTED_MODULE_0__['default'],
      '---->',
      _login_js__WEBPACK_IMPORTED_MODULE_0__['age']
    )
  },
  './src/login.js': function (module, __webpack_exports__, __webpack_require__) {
    'use strict'
    // 01 采用 cms 导出模块内容
    // module.exports = 'zce'
    // 02 采用 esModule 导出模块内容
    __webpack_require__.r(__webpack_exports__)
    __webpack_require__.d(__webpack_exports__, 'age', function () {
      return age
    })
    __webpack_exports__['default'] = 'zce'
    const age = 100
  }
}
```

### 手写功能函数

当我们使用 webpack 打包时，不论前面经历了什么，最终都会产出一个或多个目标 js 文件，这里主要就是生成一个自调用函数，它会接收一个对象作为参数（模块定义），用它的键作为查询模块 ID，用它的值作为要执行的函数，执行函数的过程中就完成了当前模块 ID 对应的加载，并针对不同类型使用不同工具方法

```js
;(function (modules) {
  // 01 定义对象用于将来缓存被加载过的模块
  let installedModules = {}

  // 02 定义一个 __webpack_require__ 方法来替换 import require 加载操作
  function __webpack_require__(moduleId) {
    // 2-1 判断当前缓存中是否存在要被加载的模块内容，如果存在则直接返回
    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports
    }
    // 2-2 如果当前缓存不存在则需要我们自己定义 {} 执行被导入的模内容加载
    let module = (installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    })
    // 2-3 调用当前 moduleId 对应的函数，然后完成内容的加载
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__)
    // 2-4 当上述的方法调用完成之后，我们就可以修改 l 的值用于表示当前模块内容已经加载完成了
    module.l = true
    // 2-5 加载工作完成之后，要将拿回来的内容返回至调用的位置
    return module.exports
  }

  // 03 定义 m 属性用于保存 modules
  __webpack_require__.m = modules

  // 04 定义 c 属性用于保存 cache
  __webpack_require__.c = installedModules

  // 05 定义 o 方法用于判断对象的身上是否存在指定的属性
  __webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty(object, property)
  }

  // 06 定义 d 方法用于在对象身上添加指定的属性，同时给该属性提供一个 getter
  __webpack_require__.d = function (exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter })
    }
  }

  // 07 定义 r 方法用于标识当前模块时 es6 类型
  __webpack_require__.r = function (exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    }
    Object.defineProperty(exports, '__esModule', { value: true })
  }

  // 08 定义 n 方法，用于设置具体的 getter
  __webpack_require__.n = function (module) {
    let getter =
      module && module.__esModule
        ? function getDefault() {
            return module['default']
          }
        : function getModuleExports() {
            return module
          }
    __webpack_require__.d(getter, 'a', getter)
    return getter
  }

  // 09 定义 p 属性，用于保存资源访问路径
  __webpack_require__.p = ''

  // 10 调用 __webpack_require__ 方法执行模块导入与加载操作
  return __webpack_require__((__webpack_require__.s = './src/index.js'))
})({
  './src/index.js': function (module, __webpack_exports__, __webpack_require__) {
    'use strict'
    __webpack_require__.r(__webpack_exports__)
    var _login_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
      /*! ./login.js */ './src/login.js'
    )
    console.log('index.js 执行了')
    console.log(_login_js__WEBPACK_IMPORTED_MODULE_0__['default'], '<------')
    console.log(_login_js__WEBPACK_IMPORTED_MODULE_0__['age'], '<------')
  },
  './src/login.js': function (module, __webpack_exports__, __webpack_require__) {
    'use strict'
    __webpack_require__.r(__webpack_exports__)
    __webpack_require__.d(__webpack_exports__, 'age', function () {
      return age
    })
    __webpack_exports__['default'] = 'zce'
    const age = 40
  }
})
```

## 打包文件懒加载分析

### 懒加载流程

**懒加载流程**

1. `import()` 可以实现指定模块的懒加载操作
2. 当前懒加载的核心原理就是 jsonp
3. t 方法可以针对内部进行不同的处理（处理方式取决于传入的数值：8、7、6、3、2、1）

`&` 运算符（位与）用于对于两个二进制操作数逐位进行比较

- 位运算中，数值 1 表示 true，0 表示 false

![与运算符](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E4%B8%8E%E8%BF%90%E7%AE%97%E7%AC%A6.png)

```js
let mode = 0b0001

if (mode & 1) {
  console.log('第四位上是1')
}
if (mode & 8) {
  console.log('第一位上是1')
}
// 第四位上是1
```

**t 方法的作用：**

1. 接收两个参数，一个是 value 一般用于表示被加载的模块 id，第二个值 mode 是一个二进制的数值
2. t 方法内部做的第一件事情就是调用自定义的 `require` 方法加载 value 对应的模块导出，重新赋值给 value
3. 当获取到了这个 value 值之后余下的 8、4、ns、2 都是对当前的内容进行加工处理，然后返回使用
4. 当 `mode & 8` 成立时直接将 value 返回（CommonJS）
5. 当 `mode & 4` 成立时直接将 value 返回（esModule）
6. 如果上述条件都不成立，还是要继续处理 value，定义一个 ns `{}`
   - 如果拿到的 value 是一个可以直接使用的内容，例如是一个字符串，将它挂载到 ns 的 `default` 属性上
   - 如果返回的是对象，则需要遍历

```js
// 11 定义 t 方法，用于加载指定 value 的模块内容，之后对内容进行处理再返回
__webpack_require__.t = function (value, mode) {
  // 加载 value 对应的模块内容（value 一般就是模块 id）
  // 加载之后的内容又重新赋值给 value 变量
  if (mode & 1) {
    value = __webpack_require__(value)
  }
  if (mode & 8) {
    // 加载了可以直接返回使用的内容
    return value
  }
  if (mode & 4 && typeof value === 'object' && value && value.__esModule) {
    return value
  }
  // 如果 8 和 4 都没有成立则需要自定义 ns 来通过 default 属性返回内容
  let ns = Object.create(null)
  __webpack_require__.r(ns)
  Object.defineProperty(ns, 'default', { enumerable: true, value: value })
  if (mode & 2 && typeof value !== 'string') {
    for (var key in value) {
      __webpack_require__.d(
        ns,
        key,
        function (key) {
          return value[key]
        }.bind(null, key)
      )
    }
  }
  return ns
}
```

增加测试案例

```js
{
  './src/index.js': function (module, exports, __webpack_require__) {
    let name = __webpack_require__.t(/*! ./login.js */ './src/login.js', 0b0111)
    console.log(name)
  },
  './src/login.js': function (module, exports) {
    module.exports = 'zce'
  }
}
```

### 懒加载源码分析

`installedChunks` 

- 如果是 `0` 代表以及加载过
- 如果是 `promise` 代表当前 chunk 正在加载
- 如果是 `undefined` 代表当前 chunk 没有被加载
- 如果是 `null` 代表当前 chunk 预加载（preloaded/prefetched）

第一次进入，`installedChunks` 的值为 `undefined` 会进入判断，之后判断是否存在，因为有些时候可能是一个 `promise`，需要对其进行保存，如果不进行保存，`Promise.all([])` 会直接被调用，结果显然不合理

![wpSourceCode8](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode8.png)

经过一系列操作把创建的 `script` 标签放到 head 里，最终执行 `Promise.all(promises)`

![wpSourceCode9](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode9.png)

之后会执行 `window["webpackJsonp"]` ，传入的值是一个二维数组

- 第一个值是一个数组（需要懒加载的 ids）
- 第二个值是一个对象（模块定义）

```js
(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["login"], {
  "./src/login.js":
    (function (module, exports) {
      module.exports = "懒加载导出内容"
    })
}]);
```

加载完成之后会把 `installedChunks` 改为 `0`，最终执行 `resolve`

![wpSourceCode10](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode10.png)

自此方法 `e` 就走完了，接下来会走方法 `t`，传入 `'./src/login.js', 7`

- `7 & 1` 为 true，会把当前模块进行加载并把值赋值给 value 上
- `7 & 4` 为 true，但是这里 value 为 `string` 类型，会创建一个空对象，并把 value 挂载上去，并返回 `ns`

![wpSourceCode11](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode11.png)

最终即可拿到懒加载模块的内容

![wpSourceCode12](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/wpSourceCode12.png)

### 手写单文件懒加载

```js
(function (modules) {
  // 15 定义 webpackJsonpCallback 实现：合并模块定义，改变 promise 状态执行后续行为
  function webpackJsonpCallback(data) {
    // 01 获取需要被动态加载的模块 id
    let chunkIds = data[0]
    // 02 获取需要被动态加载的模块依赖关系对象
    let moreModules = data[1]
    let chunkId,
      resolves = []
    // 03 循环判断 chunkIds 里对应的模块内容是否已经完成了加载
    for (let i = 0; i < chunkIds.length; i++) {
      chunkIds = chunkIds[i]
      if (
        Object.prototype.hasOwnProperty.call(installedChunks, chunkId) &&
        installedChunks[chunkId]
      ) {
        // 把 resolve 放进去
        resolves.push(installedChunks[chunkId][0])
      }
      // 更新当前的 chunk 状态
      installedChunks[chunkId] = 0
    }
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId]
      }
    }
    while (resolves.length) {
      resolves.shift()()
    }
  }

  // 16 定义 installedChunks 用于标识某个 chunkId 对应的 chunk 是否完成加载
  let installedChunks = {
    main: 0
  }

  // 18 定义 jsonpScriptSrc 实现 src 处理
  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + '' + chunkId + '.built.js'
  }

  // 17 定义 e 方法用于实现 jsonp 加载内容，利用 promise 实现异步加载
  __webpack_require__.e = function (chunkId) {
    // 01 定义一个数组用于存放 promise
    let promises = []
    // 02 获取 chunkId 对应的 chunk 是否已经完成了加载
    let installedChunkData = installedChunks[chunkId]
    // 03 依据当前是否已完成加载状态来执行后续逻辑
    if (installedChunkData !== 0) {
      if (installedChunkData) {
        promises.push(installedChunkData[2])
      } else {
        let promise = new Promise((resolve, reject) => {
          installedChunkData = installedChunks[chunkId] = [resolve, reject]
        })
        promises.push((installedChunkData[2] = promise))
        // 创建标签
        let script = document.createElement('script')
        // 设置 src
        script.src = jsonpScriptSrc(chunkId)
        // 写入 script 标签
        document.head.appendChild(script)
      }
    }
    // 04 执行 promise
    return Promise.all(promises)
  }

  // 12 定义变量存放数组
  let jsonpArray = (window['webpackJsonp'] = window['webpackJsonp'] || [])
  // 13 保存原生的 push 方法
  let oldJsonpFunction = jsonpArray.push.bind(jsonpArray)
  // 14 重写原生的 push 方法
  jsonpArray.push = webpackJsonpCallback
}
```

## webpack 编译流程

### tapable

**编译流程**

- 配置初始化
- 内容编译
- 输出编译后的内容

这三个过程整体执行过程就可以看成 **事件驱动型事件流工作机制**，这个机制可以将不同插件串联起来最后完成所有的工作，最核心部分如下：

- 负责编译的 `complier`
- 负责创建 `bundles` 的 `compilation`

> tapable 本身是一个独立的库，内部提供不同的类可以实例化不同的 Hook，这些 Hook 可以分为同步和异步两大类，不论哪一类都具备 4 个执行特点

**tapable 工作流程：**

- 实例化 hook 注册事件监听
- 通过 hook 触发事件监听
- 执行懒编译生成的可执行代码

Hook 本质是 tapable 实例对象，Hook 执行机制可分为同步和异步

**Hook 执行特点：**

- Hook：普通钩子，监听器之间互相独立不干扰
- BailHook：熔断钩子，某个监听返回非 undefined 时后续不执行
- WaterfallHook：瀑布钩子，上一个监听的返回值可传递至下一个
- LoopHook：循环钩子，如果当前未返回 false 则一直执行

tapable 库同步钩子

- SynckHook
- SyncBailHook
- SyncWaterfalHook
- SyncLoopHook

tapable 库异步串行钩子

- AsyncSeriesHook
- AsyncSeriesBailHook
- AsyncSeriesWaterfalHook

tapable　库异步并行钩子

- AsyncParalleHook
- AsyncParalleBailHook

### 同步钩子

Tapable 的功能与 EventEmitter 类似，不过它包含了多种不同的监听和触发事件的方式

- 发布订阅：`$on` 监听事件；`$emit` 执行事件

- hook：`tap` 监听事件，`call` 执行事件

  `hook.call` 如果没有处理数据，它在各个钩子函数中都可以使用，这里就是事件工作流机制，高内聚低耦合

  如果 fn2 不返回 `undefined` 就会出现熔断机制（fn3 不执行）

```js
const { SyncHook } = require('tapable')

// 定义函数形参，形参在添加事件处理器中可以用的上
let hook = new SyncHook(['name', 'age'])
hook.tap('fn1', function (name, age) {
  console.log('fn1--->', name, age)
})
hook.tap('fn2', function (name, age) {
  console.log('fn2--->', name, age)
  return undefined
})
hook.tap('fn3', function (name, age) {
  console.log('fn3--->', name, age)
})
hook.call('zce', 18)
// fn1---> zce 18
// fn2---> zce 18
// fn3---> zce 18
```

瀑布类型，如果当前执行的事件回调返回值不为 `undefined`，那么就把下一个事件回调的第一个参数替换成这个值

```js
const { SyncWaterfallHook } = require('tapable')

let hook = new SyncWaterfallHook(['name', 'age'])
hook.tap('fn1', function (name, age) {
  console.log('fn1--->', name, age)
  return 'ret1'
})
hook.tap('fn2', function (name, age) {
  console.log('fn2--->', name, age)
  return 'ret2'
})
hook.tap('fn3', function (name, age) {
  console.log('fn3--->', name, age)
  return 'ret3'
})
hook.call('zce', 33)
// fn1---> zce 33
// fn2---> ret1 33
// fn3---> ret2 33
```

循环类型，如果当前执行的事件回调的返回值不是 `undefined`，重新从第一个注册事件回调处执行，直到当前执行的事件回调没有返回值

![image-20220613173119650](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220613173119650.png)

```js
const { SyncLoopHook } = require('tapable')

let hook = new SyncLoopHook(['name', 'age'])
let count1 = 0
let count2 = 0
hook.tap('fn1', function (name, age) {
  console.log('fn1--->', name, age)
  if (++count1 === 1) {
    count1 = 0
    return undefined
  }
  return true
})
hook.tap('fn2', function (name, age) {
  console.log('fn2--->', name, age)
  if (++count2 === 2) {
    count2 = 0
    return undefined
  }
  return true
})
hook.tap('fn3', function (name, age) {
  console.log('fn3--->', name, age)
})
hook.call('foo', 100)
// fn1---> foo 100
// fn2---> foo 100
// fn1---> foo 100
// fn2---> foo 100
// fn3---> foo 100
```

### 异步钩子

对于异步钩子的使用，在添加事件监听时会存在三种方式：`tap`、`tapAsync`、`tapPromise`

- `tapAsync` 和 `tapPromise` 不能用于 Sync 开头的钩子类，强行使用会报错
- `callAsync` 与 `call` 不同的是：在传入了与实例化钩子类的数组长度一致个数的参数时，还需要在最后添加一个回调函数，否则在事件回调中执行回调函数可能会报错

```js
const { AsyncParallelHook } = require('tapable')

let hook = new AsyncParallelHook(['name'])

console.time('times')
hook.tapAsync('fn1', function (name, callback) {
  setTimeout(() => {
    console.log('fn1--->', name)
    callback()
  }, 1000)
})
hook.tapAsync('fn2', function (name, callback) {
  setTimeout(() => {
    console.log('fn2--->', name)
    callback()
  }, 2000)
})
hook.callAsync('lg', function () {
  console.log('最后一个回调执行了')
  console.timeEnd('times')
})
// fn1---> lg
// fn2---> lg
// 最后一个回调执行了
// times: 2.003s

console.time('time')
hook.tapPromise('fn1', function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log('fn1--->', name)
      resolve()
    }, 1000)
  })
})
hook.tapPromise('fn2', function (name) {
  return new Promise(function (resolve, reject) {
    setTimeout(() => {
      console.log('fn2--->', name)
      resolve()
    }, 2000)
  })
})
hook.promise('foo').then(() => {
  console.log('end执行了')
  console.timeEnd('time')
})
// fn1---> foo
// fn2---> foo
// end执行了
// time: 2.005s
```

`AsyncParallelBailHook` 会并行执行所有事件回调，但是这个钩子类中的事件回调返回值如果不为 `undefined`，那么 `callAsync` 传入的回调函数的第二个参数会是最先拥有返回值逻辑的事件回调的那个返回值

```js
const { AsyncParallelBailHook } = require('tapable')

let hook = new AsyncParallelBailHook(['name'])
console.time('time')
hook.tapAsync('fn1', function (name, callback) {
  setTimeout(() => {
    console.log('fn1--->', name)
    callback()
  }, 1000)
})
hook.tapAsync('fn2', function (name, callback) {
  setTimeout(() => {
    console.log('fn2--->', name)
    callback('err')
  }, 2000)
})
hook.tapAsync('fn3', function (name, callback) {
  setTimeout(() => {
    console.log('fn3--->', name)
    callback()
  }, 3000)
})
hook.callAsync('zce', function () {
  console.log('最后的回调执行了')
  console.timeEnd('time')
})
// fn1---> zce
// fn2---> zce
// 最后的回调执行了
// time: 2.003s
// fn3---> zce
```

异步的串行跟同步有些类似，在使用 `tapPromise`　注册事件回调时，事件对象必须返回一个 `Promise` 对象，否则会报错

```js
const { AsyncSeriesHook } = require('tapable')

let hook = new AsyncSeriesHook(['name'])
console.time('time')
hook.tapPromise('fn1', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('fn1--->', name)
      resolve()
    }, 1000)
  })
})
hook.tapPromise('fn2', function (name) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('fn2--->', name)
      resolve()
    }, 2000)
  })
})
hook.promise('foo').then(function () {
  console.log('~~~~')
  console.timeEnd('time')
})
// fn1---> foo
// fn2---> foo
// ~~~~
// time: 3.014s
```

### SyncHook 源码调试

- `Hook.js` 它提供了所有的东西
- `HookCodeFactory.js` 它是做代码拼接的工厂
- `SyncHook.js` 是单独写死的钩子

```js
const { SyncHook } = require('tapable')

let hook = new SyncHook(['name', 'age'])
hook.tap('fn1', function (name, age) {
  console.log('fn1--->', name, age)
})
hook.tap('fn2', function (name, age) {
  console.log('fn2--->', name, age)
})
hook.call('zce', 100)
```

实例化 `SyncHook` 对象，里面比较重要的是 `_x` 和 `taps`

![image-20220614135443287](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220614135443287.png)

合并 `sync` 属性到 `options` 中

![image-20220614140143065](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220614140143065.png)

之后调用 `_insert` 方法

![image-20220614140809173](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220614140809173.png)

多次调用 `tap` 方法，会把对应 `tap` 添加到 `this.taps` 这个数组里

![image-20220614141127431](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220614141127431.png)

调用 `call` 方法会先走 `_createCall` 方法

![image-20220614141335574](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220614141335574.png)

调用 `_createCall` 方法

![image-20220614141540179](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220614141540179.png)

开始取 `options.type -> sync`，这里面创造了一个函数，中间对其进行拆分（分为 header + content），为什么这么做呢？因为不同的钩子拼接的东西不一样

![image-20220614150228127](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220614150228127.png)

之后取出数组的每一项执行

![image-20220614151215162](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220614151215162.png)

### 手写 SyncHook

1. 实例化 hook，需要定义 `_x = [f1,  f2, ...]`（用来保存多个监听器函数）、`taps = [{}, {}]`
2. 实例调用 `tap` 方法，`taps = [{}, {}]`
3. 调用 `call` 方法，`HookCodeFactory` 里面有 `setup` 和 `create` 两个方法
4. 我们需要手写 `Hook`、`SyncHook`、`HookCodeFactory` 这几个类

![image-20220615093209493](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220615093209493.png)

- `SyncHook.js`

```js
let Hook = require('./Hook')

class HookCodeFactory {
  args() {
    return this.options.args.join(',')
  }
  head() {
    return `var _x = this._x;`
  }
  content() {
    let code = ``
    for (var i = 0; i < this.options.taps.length; i++) {
      code += `var _fn${i} = _x[${i}];_fn${i}(${this.args()});`
    }
    return code
  }
  // 先准备后续需要使用的数据
  setup(instance, options) {
    // 这里的操作在源码中是通过 init 方法实现，而我们当前是直接挂载在 this 身上
    this.options = options
    // this._x = [f1, f2, ...]
    instance._x = options.taps.map(o => o.fn)
  }
  // 核心就是创建一段可执行的代码体后返回
  create() {
    let fn
    // fn = new Function('name', 'age', 'var _x = this._x, var _fn0 = _x[0];_fn0(name, age);')
    fn = new Function(this.args(), this.head() + this.content())
    return fn
  }
}
let factory = new HookCodeFactory()

class SyncHook extends Hook {
  constructor(args) {
    super(args)
  }
  // options -> {taps: [{}, {}], args: [name, age]}
  compile(options) {
    // 由于tapable里提供不同的钩子，这些钩子都需要对代码重新组装处理
    factory.setup(this, options)
    return factory.create(options)
  }
}

module.exports = SyncHook
```

- `Hook.js`

```js
class Hook {
  constructor(args = []) {
    this.args = args
    this.taps = [] // 将来用于存放组装好的信息
    this._x = undefined // 将来在代码工厂函数中会给 _x = [f1, f2, ...]
  }
  tap(options, fn) {
    if (typeof options === 'string') {
      options = { name: options }
    }
    options = Object.assign({ fn }, options) // { fn: xx, name: fn1 }
    // 调用以下方法将组装好的 options 添加至 []
    this._insert(options)
  }
  _insert(options) {
    this.taps[this.taps.length] = options
  }
  call(...args) {
    // 01 创建将来要具体执行的函数代码结构
    let callFn = this._createCall()
    // 02 调用上述的函数（args传入进去）
    return callFn.apply(this, args)
  }
  _createCall() {
    // 提供模板，具体细节交给子类完成
    return this.compile({
      taps: this.taps,
      args: this.args
    })
  }
}

module.exports = Hook
```

### AsyncParallelHook 源码调试

```js
const { AsyncParallelHook } = require('tapable')

let hook = new AsyncParallelHook(['name', 'age'])
hook.tapAsync('fn1', function (name, age, callback) {
  console.log('fn1-->', name, age)
  callback()
})
hook.tapAsync('fn2', function (name, age, callback) {
  console.log('fn2-->', name, age)
  callback()
})
hook.callAsync('zoe66', 18, function () {
  console.log('end----')
})
```

与 `SyncHook` 不同的是，它传递的 `type -> async`。`_tap`、`_insert` 与 `SyncHook` 运行步骤没有区别

![image-20220615112840202](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220615112840202.png)

`SyncHook` 调用的是 `call`，现在调用的是 `callAsync`，里面也同样调用 `compile` 方法

![image-20220615113216439](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220615113216439.png)

`compile` 方法，里面还是代码工厂，调用 `setup` 和 `create`

![image-20220615140405290](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220615140405290.png)

`create` 会走到 `async` 的分支，因为传参有 `callback` 有这个函数才能继续往下走 `function (name, age, callback) {callback()}`

![image-20220615140837201](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220615140837201.png)

生成的函数可以简化一下

```js
(function anonymous(name, age, _callback) {
  "use strict";
  var _x = this._x;

  var _counter = 2;  // 记录有几个事件监听器执行
  var _done = (function () {
    _callback();
  });

  var _fn0 = _x[0];
  _fn0(name, age, (function () {
    if (--_counter === 0) _done();
  }));
})
```

### 手写 AsyncParallelHook

在 `Hook.js` 中添加如下方法：

```js
class Hook {
  tapAsync(options, fn) {
    if (typeof options === 'string') {
      options = { name: options }
    }
    options = Object.assign({ fn }, options)
    this._insert(options)
  }
  _createCall() {
    // 提供模板，具体细节交给子类完成
    return this.compile({
      taps: this.taps,
      args: this.args
    })
  }
}
```

- `AsyncParallelHook.js`

```js
let Hook = require('./Hook')

class HookCodeFactory {
  args({ after, before } = {}) {
    let allArgs = this.options.args
    if (before) allArgs = [before].concat(allArgs)
    if (after) allArgs = allArgs.concat(after)
    return allArgs.join(',')
  }
  head() {
    return `"use strict";var _x = this._x;`
  }
  content() {
    let code = `var _counter = ${this.options.taps.length};var _done = (function () {
      _callback();
    });`
    for (var i = 0; i < this.options.taps.length; i++) {
      code += `var _fn${i} = _x[${i}];_fn${i}(name, age, (function () {
        if (--_counter === 0) _done();
      }));`
    }
    return code
  }
  // 先准备后续需要使用的数据
  setup(instance, options) {
    // 这里的操作在源码中是通过 init 方法实现，而我们当前是直接挂载在 this 身上
    this.options = options
    // this._x = [f1, f2, ...]
    instance._x = options.taps.map(o => o.fn)
  }
  // 核心就是创建一段可执行的代码体后返回
  create() {
    let fn
    // fn = new Function('name', 'age', 'var _x = this._x, var _fn0 = _x[0];_fn0(name, age);')
    fn = new Function(this.args({ after: '_callback' }), this.head() + this.content())
    return fn
  }
}
let factory = new HookCodeFactory()

class AsyncParallelHook extends Hook {
  constructor(args) {
    super(args)
  }
  // options -> {taps: [{}, {}], args: [name, age]}
  compile(options) {
    // 由于tapable里提供不同的钩子，这些钩子都需要对代码重新组装处理
    factory.setup(this, options)
    return factory.create(options)
  }
}

module.exports = AsyncParallelHook
```

## webpack 打包流程

### 定位 webpack 打包入口

执行 `npx webpack` 相当于找 `node_modules/.bin` 下面的 `webapck` 相关命令，这里拿 `webpack.cmd` 举例，这里有个比较常见的 `dp0`，可以理解为 cwd

```bash
@ECHO off
SETLOCAL
CALL :find_dp0

IF EXIST "%dp0%\node.exe" (
  SET "_prog=%dp0%\node.exe"
) ELSE (
  SET "_prog=node"
  SET PATHEXT=%PATHEXT:;.JS;=;%
)

"%_prog%"  "%dp0%\..\webpack\bin\webpack.js" %*
ENDLOCAL
EXIT /b %errorlevel%
:find_dp0
SET dp0=%~dp0
EXIT /b
```

![image-20220616163856143](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220616163856143.png)

- cmd 文件核心的作用就是组装了 `node .../node_modules/webpack/bin/webpack.js ` 命令，并执行
- 之后在 `webpack.js` 中加载 `node_modules/webpack-cli/package.json` 找到对应的 `bin: { webpack-cli:'bin/cli.js' }` 字段执行对应的 `node_modules/webpack-cl/bin/cli.js` 文件

`cli.js` 作用：

- 当前文件一般有两个操作，处理参数，将参数交给不同的逻辑（分发业务）
- options 处理
- complier 对象
- complier.run

![image-20220617090348347](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220617090348347.png)

### 编译主流程

```js
let webpack = require('webpack')
let options = require('./webpack.config')

let compiler = webpack(options)

compiler.run((err, stats) => {
  console.log(err)
  console.log(stats.toJson({
    entries: true,
    chunks: false,
    modules: false,
    assets: false
  }))
})
```

一切从 `let compiler = webpack(options)` 开始

- webpack 函数执行后返回 `compiler` 对象，这里会先实例化 `Compiler` 类

- 设置 `NodeEnvironmentPlugin` 让 `compiler` 对象具备文件读写能力

- 通过循环挂载 `plugins`，并处理 webpack 内部默认的插件（入口文件）

- 实例化后，如果 webpack 函数接受了回调 `callback` 则会直接执行 `compiler.run()` 方法，那么 webpack 就会自动开始编译

  如果没有指定 `callback` 回调，需要自己调用 `run` 方法来启动编译

![image-20220617113224839](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220617113224839.png)

在 `Compiler` 中打印一下 hooks，里面比较重要的钩子如下：

- `compiler.beforeRun`
- `compiler.run`
- `compiler.thisCompilation`
- `compiler.beforeCompile`
- `compiler.compile`
- `compiler.make`
- `compiler.afterCompile`

```js
class Compiler extends Tapable {
	constructor(context) {
		super();
		this.hooks = { ... };
    Object.keys(this.hooks).forEach(hookName => {
      console.log(hookName);
    })
  }
}
```

### 手写 webpack.js

创建 `run.js` 文件

```js
let webpack = require('./lgPack')
let options = require('./webpack.config')

let compiler = webpack(options)

compiler.run((err, stats) => {
  console.log(err)
  console.log(stats.toJson({
    entries: true,
    chunks: false,
    modules: false,
    assets: false
  }))
})
```

创建 lgPack 文件夹，并初始化 `package.json`，并修改 `"main": 'lib/webpack.js'`

```bash
mkdir lgPack
cd lgPack
npm init -y
```

创建 `lib/webpack.js`

```js
const Compiler = require('./Compiler')
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin')

const webpack = function (options) {
  // 01 实例化 compiler 对象
  let compiler = new Compiler(options.context)
  compiler.options = options

  // 02 初始化 NodeEnvironmentPlugin（让compiler具备文件读写能力）
  new NodeEnvironmentPlugin().apply(compiler)

  // 03 挂载所有 plugins 至 compiler 对象身上
  if (options.plugins && Array.isArray(options.plugins)) {
    for (const plugin of options.plugin) {
      plugin.apply(compiler)
    }
  }

  // 04 挂载所有 webpack 内置的插件（入口）
  // compiler.options = new WebpackOptionsApply().process(options, compiler)

  // 05 返回 compiler 对象即可
  return compiler
}

module.exports = webpack
```

创建 `lib/Compiler.js`

```js
const { Tapable, AsyncSeriesHook } = require('tapable')

class Compiler extends Tapable {
  constructor(context) {
    super()
    this.context = context
    this.hooks = {
      done: new AsyncSeriesHook(['stats'])
    }
  }
  run(callback) {
    callback(null, {
      toJson() {
        return {
          entries: [], // 当前次打包的入口信息
          chunks: [], //当前次打包的 chunk 信息
          modules: [], // 模块信息
          assets: [] // 当前次打包最终生成的资源
        }
      }
    })
  }
}

module.exports = Compiler
```

创建 `lib/node/NodeEnvironmentPlugin.js`

```js
const fs = require('fs')

class NodeEnvironmentPlugin {
  constructor(options) {
    this.options = options || {}
  }
  apply(compiler) {
    compiler.inputFileSystem = fs
    compiler.outputFileSystem = fs
  }
}

module.exports = NodeEnvironmentPlugin
```

### EntryOptionsPlugin 分析

- 在 `webpack.js` 中找到 `compiler.options = new WebpackOptionsApply().process(options, compiler);`

- 执行 `process` 的时候会执行 `new EntryOptionPlugin().apply(compiler);`

  `entryOption` 在 `EntryOptionPlugin` 内部的 `apply` 方法中调用了 `tap` 注册了事件监听，该事件监听在 `new EntryOptionPlugin() ` 之后调用

- `itemToPlugin` 它是一个函数，接收三个参数 `context, item, name`

  在调用 `itemToPlugin` 时返回了一个实例对象

  里面有一个构造函数负责接收 `context, item, name`

  `compilation` 钩子监听

  make 钩子监听

![image-20220617160027093](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220617160027093.png)

![image-20220617160200095](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220617160200095.png)

![image-20220617160913517](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220617160913517.png)

### 手写 EntryOptionsPlugin

在 `webpack.js` 中把对应内容注释放开

```js
const WebpackOptionsApply = require('./WebpackOptionsApply')

const webpack = function (options) {
  // 04 挂载所有 webpack 内置的插件（入口）
  compiler.options = new WebpackOptionsApply().process(options, compiler)
}
```

创建 `lib/WebpackOptionsApply.js`

```js
const EntryOptionPlugin = require('./EntryOptionPlugin')

class WebpackOptionsApply {
  process(options, compiler) {
    new EntryOptionPlugin().apply(compiler)

    compiler.hooks.entryOption.call(options.context, options.entry)
  }
}

module.exports = WebpackOptionsApply
```

创建 `lib/EntryOptionPlugin.js`

```js
const SingleEntryPlugin = require('./SingleEntryPlugin')

const itemToPlugin = function (context, item, name) {
  return new SingleEntryPlugin(context, item, name)
}

class EntryOptionPlugin {
  apply(compiler) {
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
      itemToPlugin(context, entry, 'main').apply(compiler)
    })
  }
}

module.exports = EntryOptionPlugin
```

创建 `lib/SingleEntryPlugin.js`

```js
class SingleEntryPlugin {
  constructor(context, entry, name) {
    this.context = context
    this.entry = entry
    this.name = name
  }
  apply(compiler) {
    compiler.hooks.make.tapAsync('SingleEntryPlugin', (compilation, callback) => {
      const { context, entry, name } = this
      console.log('make 钩子监听执行了~~~')
      // compilation.addEntry(context, entry, name, callback)
    })
  }
}

module.exports = SingleEntryPlugin
```

修改 `lib/Compiler.js`

```js
const { Tapable, AsyncSeriesHook, SyncBailHook, SyncHook, AsyncParallelHook } = require('tapable')

class Compiler extends Tapable {
  constructor(context) {
    super()
    this.context = context
    this.hooks = {
      done: new AsyncSeriesHook(['stats']),
      entryOption: new SyncBailHook(['context', 'entry']),
      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']),
      make: new AsyncParallelHook(['compilation']),
      afterCompile: new AsyncSeriesHook(['compilation'])
    }
  }
  run(callback) {
    callback(null, {
      toJson() {
        return {
          entries: [],  // 当前次打包的入口信息
          chunks: [],  // 当前次打包的 chunk 信息
          modules: [],  // 模块信息
          assets: [], // 当前次打包最终生成的资源
        }
      }
    })
  }
}
```

### run 分析及实现

![image-20220620103917350](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220620103917350.png)

```js
const { Tapable, AsyncSeriesHook, SyncBailHook, SyncHook, AsyncParallelHook } = require('tapable')

class Compiler extends Tapable {
  constructor(context) {
    super()
    this.context = context
    this.hooks = {
      done: new AsyncSeriesHook(['stats']),
      entryOption: new SyncBailHook(['context', 'entry']),

      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),

      thisCompilation: new SyncHook(['compilation', 'params']),
      compilation: new SyncHook(['compilation', 'params']),

      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']),
      make: new AsyncParallelHook(['compilation']),
      afterCompile: new AsyncSeriesHook(['compilation'])
    }
  }
  run(callback) {
    console.log('run 方法执行了~~~')
    const finalCallback = function (err, stats) {
      callback(err, stats)
    }
    const onCompiled = function (err, compilation) {
      console.log('onCompiled 方法执行了~~~')
      finalCallback(err, {
        toJson() {
          return {
            entries: [], // 当前次打包的入口信息
            chunks: [], //当前次打包的 chunk 信息
            modules: [], // 模块信息
            assets: [] // 当前次打包最终生成的资源
          }
        }
      })
    }

    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled)
      })
    })
  }
  compile(callback) {}
}

module.exports = Compiler

```

### compile 分析及实现

- `newCompilationParams` 方法调用，返回 `params`（重点获取）、`normalModuleFactory`
- 调用 `beforeCompile` 钩子监听，在它的钩子回调中触发 `compile` 监听
- 调用 `newCompilation` 方法，传入上面的 `params`，返回了一个 `compilation`
- 调用一个 `createNewCompilation`（`Compilation.js`）
- 上述操作完成之后可以触发 make 钩子监听

![image-20220620110511207](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220620110511207.png)

创建 `lib/normalModuleFactory.js`

```js
class normalModuleFactory {}

module.exports = normalModuleFactory
```

创建 `lib/Compilation.js`

```js
class Compilation {}

module.exports = Compilation
```

修改 `lib/Compiler.js`

```js
const { Tapable, AsyncSeriesHook, SyncBailHook, SyncHook, AsyncParallelHook } = require('tapable')
const normalModuleFactory = require('./normalModuleFactory')
const Compilation = require('./Compilation')

class Compiler extends Tapable {
  constructor(context) {
    super()
    this.context = context
    this.hooks = {
      done: new AsyncSeriesHook(['stats']),
      entryOption: new SyncBailHook(['context', 'entry']),

      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),

      thisCompilation: new SyncHook(['compilation', 'params']),
      compilation: new SyncHook(['compilation', 'params']),

      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']),
      make: new AsyncParallelHook(['compilation']),
      afterCompile: new AsyncSeriesHook(['compilation'])
    }
  }
  run(callback) {
    console.log('run 方法执行了~~~')
    const finalCallback = function (err, stats) {
      callback(err, stats)
    }
    const onCompiled = function (err, compilation) {
      console.log('onCompiled 方法执行了~~~')
      finalCallback(err, {
        toJson() {
          return {
            entries: [], // 当前次打包的入口信息
            chunks: [], //当前次打包的 chunk 信息
            modules: [], // 模块信息
            assets: [] // 当前次打包最终生成的资源
          }
        }
      })
    }

    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled)
      })
    })
  }
  compile(callback) {
    const params = this.newCompilationParams()
    this.hooks.beforeRun.callAsync(params, err => {
      this.hooks.compile.call(params)
      const compilation = this.newCompilation(params)
      this.hooks.make.callAsync(compilation, err => {
        console.log('make 钩子监听触发了~~~')
        callback()
      })
    })
  }
  newCompilationParams() {
    const params = {
      normalModuleFactory: new normalModuleFactory()
    }
    return params
  }
  newCompilation(params) {
    const compilation = this.createCompilation()
  }
  createCompilation() {
    return new Compilation(this)
  }
}

module.exports = Compiler
```

### make 前流程回顾

**步骤**

1. 实例化 `compiler` 对象（它会贯穿整个 webpack 工作过程）
2. 由 `compiler` 调用 run 方法

**compiler 实例化操作**

1. `compiler` 继承 `tapable` 因此它具备钩子的操作能力（监听事件、触发事件，webpack 是一个事件流）
2. 在实例化了 `compiler` 对象之后就往它的身上挂载很多属性，其中 `NodeEnvironmentPlugin` 这个操作就让它具备了文件读写的能力（我们模拟时采用的是 node 自带的 fs）
3. 具备了 fs 操作能力之后有将 `plugins` 中的插件都挂载到了 `compiler` 对象身上
4. 将内部默认的插件与 `compiler` 建立管理，其中 `EntryOptionPlugin` 处理了入口模块的 id
5. 在实例化 `compiler` 的时候只是监听了 `make` 钩子（`SingleEntryPlugin`）
   - 在 `SingleEntryPlugin` 模块的 `apply` 方法中有二个钩子监听
   - 其中 `compilation` 钩子就是让 `compilation` 具备了 `normalModuleFactory` 工厂创建一个普通模块的能力
   - 因为它就是利用一个自己创建的模块来加载需要被打包的模块
   - 其中 `make` 钩子在 `compiler.run` 的时候会被触发，走到这里就意味着某个模块执行打包之前的所有准备工作就完成了
   - `addEntry` 方法调用

**run 方法执行**（当前想看的是什么时候触发了 make 钩子）

1. `run` 方法就是一堆钩子按着顺序触发（`beforeRun`、`run`、`compile`）
2. `compile` 方法执行
   - 准备参数（其中 `newCompilationParams` 是我们后续创建工厂模块的）
   - 触发钩子 `beforeCompile`
   - 将第一步的参数传给一个函数，开始创建一个 `compilation`（`newCompilation`）
   - 在调用 `newCompilation` 的内部
     - 调用了 `createCompilation`
     - 触发了 `this.compilation` 钩子和 `compilation` 钩子的监听
3. 当创建了 `compilation` 对象之后就触发了 `make` 钩子
4. 当我们触发 `make` 钩子监听的时候，将 `compilation` 对象传递过去

**总结**

1. 实例化 `compiler`
2. 调用 `compile` 方法
3. `newCompilation`
4. 实例化了一个 `compilation` 对象（它和 `compiler` 是有关系的）
5. 触发 `make` 监听
6. 调用 `addEntry` 方法（这个时候就带着 `context`、`name`、`entry` 一堆东西）就奔着编译去了

### addEntry 流程分析

1. `make` 钩子在触发的时候接收了 `compilation` 对象实现，它的身上挂载了很多内容

2. 从 `compilation` 中解构了三个值

   `entry`：当前需要被打包的模块的相对路径（`'./src/index.js'`）

   `context`：当前项目的根路径

3. `dep` 是对当前入口模块中的依赖关系进行处理

4. 调用了 `addEntry` 方法

5. 在 `compilation` 实例的身上有一个 `addEntry` 方法，然后内部调用了 `_addModuleChain` 方法去处理依赖

6. 在 `compilation` 当中我们可以通过 `NormalModuleFactory` 工厂来创建一个普通模块对象

7. 在 `webpack` 内部默认启了一个 100 并发量的打包操作，当我们看到的是 `normalModule.create()`

8. 在 `beforeResolve` 里面会触发一个 `factory` 钩子监听（这个部分的操作其实是处理 loader，当前不重点研究）

9. 上述操作完成之后获取到了一个函数被存在 `factory` 里，然后对它进行了调用

10. 在这个函数调用里又触发了一个叫 `resolver` 的钩子（处理 loader 的，此时拿到了 `resolver` 方法意味着所有的 loader 处理完毕）

11. 调用 `resolver` 方法之后，就会进入到 `afterResolve` 这个钩子，然后就会触发 `new NormalModule`

12. 在完成上述操作之后就将 `module` 进行了保存和一些其它属性的添加

13. 调用 `buildModule` 方法开始编译（调用 `build`，之后调用 `doBuild`）

### addEntry 实现

修改 `lib/Compiler.js`

```js
const { Tapable, AsyncSeriesHook, SyncBailHook, SyncHook, AsyncParallelHook } = require('tapable')
const NormalModuleFactory = require('./normalModuleFactory')
const Compilation = require('./Compilation')
const Stats = require('./Stats')

class Compiler extends Tapable {
  constructor(context) {
    super()
    this.context = context
    this.hooks = {
      done: new AsyncSeriesHook(['stats']),
      entryOption: new SyncBailHook(['context', 'entry']),

      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),

      thisCompilation: new SyncHook(['compilation', 'params']),
      compilation: new SyncHook(['compilation', 'params']),

      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']),
      make: new AsyncParallelHook(['compilation']),
      afterCompile: new AsyncSeriesHook(['compilation'])
    }
  }
  run(callback) {
    console.log('run 方法执行了~~~')

    const finalCallback = function (err, stats) {
      callback(err, stats)
    }

    const onCompiled = function (err, compilation) {
      console.log('onCompiled 方法执行了~~~')
      finalCallback(err, new Stats(compilation))
    }

    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled)
      })
    })
  }
  compile(callback) {
    const params = this.newCompilationParams()

    this.hooks.beforeRun.callAsync(params, err => {
      this.hooks.compile.call(params)
      const compilation = this.newCompilation(params)

      this.hooks.make.callAsync(compilation, err => {
        console.log('make钩子监听触发了~~~')
        callback(err, compilation)
      })
    })
  }
  newCompilationParams() {
    const params = {
      normalModuleFactory: new NormalModuleFactory()
    }
    return params
  }
  newCompilation(params) {
    const compilation = this.createCompilation()
    this.hooks.thisCompilation.call(compilation, params)
    this.hooks.compilation.call(compilation, params)
    return compilation
  }
  createCompilation() {
    return new Compilation(this)
  }
}

module.exports = Compiler
```

修改 `lib/Compilation.js`

```js
const { Tapable, SyncHook } = require('tapable')
const path = require('path')
const NormalModuleFactory = require('./normalModuleFactory')
const Parser = require('./Parser')

// 实例化一个 normalModuleFactory parser
const normalModuleFactory = new NormalModuleFactory()
const parser = new Parser()

class Compilation extends Tapable {
  constructor(compiler) {
    super()
    this.compiler = compiler
    this.context = compiler.context
    this.options = compiler.options
    // 让 compilation 具备文件的读写能力
    this.inputFileSystem = compiler.inputFileSystem
    this.outputFileSystem = compiler.outputFileSystem
    this.entries = [] // 存入所有入口模块的数组
    this.modules = [] // 存放所有模块的数据
    this.hooks = {
      succeedModule: new SyncHook(['module'])
    }
  }
  /**
   * 完成模块编译操作
   * @param {*} context 当前项目的根
   * @param {*} entry 当前的入口的相对路径
   * @param {*} name chunkName main
   * @param {*} callback 回调
   */
  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      callback(err, module)
    })
  }
  _addModuleChain(context, entry, name, callback) {
    let entryModule = normalModuleFactory.create({
      name,
      context,
      rawRequest: entry,
      // 当前操作的核心作用就是返回 entry 入口的绝对路径
      resource: path.posix.join(context, entry),
      parser
    })

    const afterBuild = function (err) {
      callback(err, entryModule)
    }

    this.buildModule(entryModule, afterBuild)

    // 当我们完成了本次的 build 操作之后将 module 进行保存
    this.entries.push(entryModule)
    this.modules.push(entryModule)
  }
  /**
   * 完成具体的 build 行为
   * @param {*} module 当前需要被编译的模块
   * @param {*} callback
   */
  buildModule(module, callback) {
    module.build(this, err => {
      // 如果代码走到这里就意味着当前 Module 的编译完成了
      this.hooks.succeedModule.call(module)
      callback(err)
    })
  }
}

module.exports = Compilation
```

新增 `lib/normalModuleFactory.js`

```js
const NormalModule = require('./normalModule')

class NormalModuleFactory {
  create(data) {
    return new NormalModule(data)
  }
}

module.exports = NormalModuleFactory
```

新增 `lib/normalModule.js`

```js
class NormalModule {
  constructor(data) {
    this.name = data.name
    this.entry = data.entry
    this.rawRequest = data.rawRequest
    this.parser = data.parser // TODO 等待完成
    this.resource = data.resource
    this._source // 存放某个模块的源代码
    this._ast // 存放某个模块代码对应的 ast
  }
  build(compilation, callback) {
    // 01 从文件中读取将来需要被加载的 module 内容
    // 02 如果当前不是 js 模块则需要 Loader 进行处理，最终返回 js 模块
    // 03 上述的操作完成之后可以将 js 代码转化为 ast 语法树
    // 04 当前 js 模块内部可能又引用了其它的模块，因此我们需要递归完成
    // 05 前面的完成之后，我们只需要重复执行即可
    this.doBuild(compilation, err => {
      this._ast = this.parser.parser(this._source)
      callback(err)
    })
  }
  doBuild(compilation, callback) {
    this.getSource(compilation, (err, source) => {
      this._source = source
      callback()
    })
  }
  getSource(compilation, callback) {
    compilation.inputFileSystem.readFile(this.resource, 'utf-8', callback)
  }
}

module.exports = NormalModule
```

安装 `babylon`

```bash
npm i babylon
```

新增 `lib/Parser.js`

```js
const babylon = require('babylon')
const { Tapable } = require('tapable')

class Parser extends Tapable {
  parse(source) {
    return babylon.parse(source, {
      sourceType: 'module',
      // 当前插件可以支持 import() 动态导入的语法
      plugins: ['dynamicImport']
    })
  }
}

module.exports = Parser
```

新增 `lib/Stats.js`

```js
class Stats {
  constructor(compilation) {
    this.entries = compilation.entries
    this.modules = compilation.modules
  }
  toJson() {
    return this
  }
}

module.exports = Stats
```

### 依赖模块处理

在 `package.json` 中增加依赖

```json
{
  "devDependencies": {
    "@babel/core": "^7.12.10",
    "@babel/generator": "^7.12.11",
    "@babel/traverse": "^7.12.12",
    "@babel/types": "^7.12.12",
    "babylon": "^6.18.0",
    "ejs": "^3.1.5",
    "mkdirp": "^1.0.4",
    "neo-async": "^2.6.2",
    "tapable": "^1.1.3",
    "webpack": "^4.45.0",
    "webpack-cli": "^3.3.12"
  }
}
```

由于 `lib/normalModule.js` 里面的 `this.entry` 和 `this.rawRequest` 是一个意思，所以将 `this.entry` 删除

1. 需要将 `src/index.js` 里的 `require` 方法替换成 `__webpack_require__`
2. 将 `./title` 替换成 `./src/title.js`
3. 实现递归操作，所以要将依赖的模块信息保存好，方便交给下一次 `create`

**babel**

- `generator`：我们把 ast 改完，但是这个不能运行（抽象的），就可以使用 `generator` 构建成代码
- `traverse`：我们拿到了 DOM 树，我们想去改上面的东西，我得有手段进这个树或看这个树上每一个节点，`traverse` 可以起到遍历的作用

有个线上小工具 [AST explorer](https://link.juejin.cn/?target=https%3A%2F%2Fastexplorer.net%2F) 可以在线将 JS 代码转换为语法树 AST，将解析器选择为 `acorn` 即可

![image-20220621104901885](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220621104901885.png)

修改 `lib/normalModule.js`

```js
const path = require('path')
const types = require('@babel/types')
const generator = require('@babel/generator').default
const traverse = require('@babel/traverse').default

class NormalModule {
  constructor(data) {
    this.context = data.context
    this.name = data.name
    this.rawRequest = data.rawRequest
    this.parser = data.parser // TODO 等待完成
    this.resource = data.resource
    this._source // 存放某个模块的源代码
    this._ast // 存放某个模块代码对应的 ast
    this.dependencies = [] // 定义一个空数组用于保存被依赖加载的模块信息
  }
  build(compilation, callback) {
    // 01 从文件中读取将来需要被加载的 module 内容
    // 02 如果当前不是 js 模块则需要 Loader 进行处理，最终返回 js 模块
    // 03 上述的操作完成之后可以将 js 代码转化为 ast 语法树
    // 04 当前 js 模块内部可能又引用了其它的模块，因此我们需要递归完成
    // 05 前面的完成之后，我们只需要重复执行即可
    this.doBuild(compilation, err => {
      this._ast = this.parser.parse(this._source)

      // 这里的 _ast 就是当前 module 的语法树，我们可以对它进行修改，最后再将 ast 转换成 code 代码
      traverse(this._ast, {
        CallExpression: nodePath => {
          let node = nodePath.node
          // 定位 require 所在的节点
          if (node.callee.name === 'require') {
            // 获取原始的请求路径
            let modulePath = node.arguments[0].value // ./title
            // 取出当前被加载的模块名称
            let moduleName = modulePath.split(path.posix.sep).pop() // title
            // [当前我们的打包器只处理 js]
            let extName = moduleName.indexOf('.') === -1 ? '.js' : ''
            moduleName += extName // title.js
            // [最终我们想要读取当前 js 里的内容]所以我们需要个绝对路径
            let depResource = path.posix.join(path.posix.dirname(this.resource), moduleName)
            // [将当前模块的 id 定位 OK]
            let depModuleId = './' + path.posix.relative(this.context, depResource) // ./src/title.js

            // 记录当前被依赖模块的信息，方便后续递归加载
            this.dependencies.push({
              name: this.name, // TODO 将来需要修改
              context: this.context,
              rawRequest: moduleName,
              moduleId: depModuleId,
              resource: depResource
            })

            // 替换内容
            node.callee.name = '__webpack_require__'
            node.arguments = [types.stringLiteral(depModuleId)]
          }
        }
      })

      // 上述的操作是利用 ast 按要求做了代码修改，下面就是利用 ... 将修改后的 ast 转回成 code
      let { code } = generator(this._ast)
      this._source = code

      callback(err)
    })
  }
  doBuild(compilation, callback) {
    this.getSource(compilation, (err, source) => {
      this._source = source
      callback()
    })
  }
  getSource(compilation, callback) {
    compilation.inputFileSystem.readFile(this.resource, 'utf8', callback)
  }
}

module.exports = NormalModule
```

修改 `lib/Compilation.js`

```js
const { Tapable, SyncHook } = require('tapable')
const path = require('path')
const async = require('neo-async')
const NormalModuleFactory = require('./normalModuleFactory')
const Parser = require('./Parser')

// 实例化一个 normalModuleFactory parser
const normalModuleFactory = new NormalModuleFactory()
const parser = new Parser()

class Compilation extends Tapable {
  constructor(compiler) {
    super()
    this.compiler = compiler
    this.context = compiler.context
    this.options = compiler.options
    // 让 compilation 具备文件的读写能力
    this.inputFileSystem = compiler.inputFileSystem
    this.outputFileSystem = compiler.outputFileSystem
    this.entries = [] // 存入所有入口模块的数组
    this.modules = [] // 存放所有模块的数据
    this.hooks = {
      succeedModule: new SyncHook(['module'])
    }
  }
  /**
   * 完成模块编译操作
   * @param {*} context 当前项目的根
   * @param {*} entry 当前的入口的相对路径
   * @param {*} name chunkName main
   * @param {*} callback 回调
   */
  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      callback(err, module)
    })
  }
  _addModuleChain(context, entry, name, callback) {
    this.createModule(
      {
        parser,
        name,
        context,
        rawRequest: entry,
        resource: path.posix.join(context, entry),
        moduleId: './' + path.posix.relative(context, path.posix.join(context, entry))
      },
      entryModule => {
        this.entries.push(entryModule)
      },
      callback
    )
  }
  /**
   * 定义一个创建的方法，达到复用的目的
   * @param {*} data 创建模块所需要的属性值
   * @param {*} doAddEntry 可选参数，在加载入口模块的时候，将入口模块的 id 写入 this.entries
   * @param {*} callback
   */
  createModule(data, doAddEntry, callback) {
    let module = normalModuleFactory.create(data)

    const afterBuild = (err, module) => {
      // 在 afterBuild 当中我们就需要判断一下，当前次 module 加载完成之后是否需要处理依赖加载
      if (module.dependencies.length > 0) {
        // 当前逻辑就表示 module 有需要依赖加载的模块，因此我们可以再单独定义一个方法来实现
        this.processDependencies(module, err => {
          callback(err, module)
        })
      }

      callback(err, module)
    }

    this.buildModule(module, afterBuild)

    // 当我们完成了本次的 build 操作之后将 module 进行保存
    doAddEntry && doAddEntry(module)
    this.modules.push(module)
  }
  /**
   * 完成具体的 build 行为
   * @param {*} module 当前需要被编译的模块
   * @param {*} callback
   */
  buildModule(module, callback) {
    module.build(this, err => {
      // 如果代码走到这里就意味着当前 Module 的编译完成了
      this.hooks.succeedModule.call(module)
      callback(err, module)
    })
  }
  processDependencies(module, callback) {
    // 01 当前的函数核心功能就是实现一个被依赖模块的递归加载
    // 02 加载模块的思路都是创建一个模块，然后想办法将被加载的模块内容拿进来
    // 03 当前我们不知道 module 需要依赖几个模块，此时我们需要想办法让所有依赖的模块都加载完成之后再执行 callback[neo-async]
    let dependencies = module.dependencies

    async.forEach(
      dependencies,
      (dependency, done) => {
        this.createModule(
          {
            parser,
            name: dependency.name,
            context: dependency.context,
            rawRequest: dependency.rawRequest,
            moduleId: dependency.moduleId,
            resource: dependency.resource
          },
          null,
          done
        )
      },
      callback
    )
  }
}

module.exports = Compilation
```

### chunk 流程分析及实现

修改 `lib/Compilation.js`

```js
const { Tapable, SyncHook } = require('tapable')
const path = require('path')
const ejs = require('ejs')
const async = require('neo-async')
const NormalModuleFactory = require('./normalModuleFactory')
const Parser = require('./Parser')
const Chunk = require('./Chunk')

// 实例化一个 normalModuleFactory parser
const normalModuleFactory = new NormalModuleFactory()
const parser = new Parser()

class Compilation extends Tapable {
  constructor(compiler) {
    super()
    this.compiler = compiler
    this.context = compiler.context
    this.options = compiler.options
    // 让 compilation 具备文件的读写能力
    this.inputFileSystem = compiler.inputFileSystem
    this.outputFileSystem = compiler.outputFileSystem
    this.entries = [] // 存入所有入口模块的数组
    this.modules = [] // 存放所有模块的数据
    this.chunks = [] // 存放当前次打包过程中所产出的 chunk
    this.assets = [] // 存放键值对
    this.files = [] // 存放 fileName
    this.hooks = {
      succeedModule: new SyncHook(['module']),
      seal: new SyncHook(),
      beforeChunks: new SyncHook(),
      afterChunks: new SyncHook()
    }
  }
  /**
   * 完成模块编译操作
   * @param {*} context 当前项目的根
   * @param {*} entry 当前的入口的相对路径
   * @param {*} name chunkName main
   * @param {*} callback 回调
   */
  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, name, (err, module) => {
      callback(err, module)
    })
  }
  _addModuleChain(context, entry, name, callback) {
    this.createModule(
      {
        parser,
        name,
        context,
        rawRequest: entry,
        resource: path.posix.join(context, entry),
        moduleId: './' + path.posix.relative(context, path.posix.join(context, entry))
      },
      entryModule => {
        this.entries.push(entryModule)
      },
      callback
    )
  }
  /**
   * 定义一个创建的方法，达到复用的目的
   * @param {*} data 创建模块所需要的属性值
   * @param {*} doAddEntry 可选参数，在加载入口模块的时候，将入口模块的 id 写入 this.entries
   * @param {*} callback
   */
  createModule(data, doAddEntry, callback) {
    let module = normalModuleFactory.create(data)

    const afterBuild = (err, module) => {
      // 在 afterBuild 当中我们就需要判断一下，当前次 module 加载完成之后是否需要处理依赖加载
      if (module.dependencies.length > 0) {
        // 当前逻辑就表示 module 有需要依赖加载的模块，因此我们可以再单独定义一个方法来实现
        this.processDependencies(module, err => {
          callback(err, module)
        })
      }

      callback(err, module)
    }

    this.buildModule(module, afterBuild)

    // 当我们完成了本次的 build 操作之后将 module 进行保存
    doAddEntry && doAddEntry(module)
    this.modules.push(module)
  }
  /**
   * 完成具体的 build 行为
   * @param {*} module 当前需要被编译的模块
   * @param {*} callback
   */
  buildModule(module, callback) {
    module.build(this, err => {
      // 如果代码走到这里就意味着当前 Module 的编译完成了
      this.hooks.succeedModule.call(module)
      callback(err, module)
    })
  }
  processDependencies(module, callback) {
    // 01 当前的函数核心功能就是实现一个被依赖模块的递归加载
    // 02 加载模块的思路都是创建一个模块，然后想办法将被加载的模块内容拿进来
    // 03 当前我们不知道 module 需要依赖几个模块，此时我们需要想办法让所有依赖的模块都加载完成之后再执行 callback[neo-async]
    let dependencies = module.dependencies

    async.forEach(
      dependencies,
      (dependency, done) => {
        this.createModule(
          {
            parser,
            name: dependency.name,
            context: dependency.context,
            rawRequest: dependency.rawRequest,
            moduleId: dependency.moduleId,
            resource: dependency.resource
          },
          null,
          done
        )
      },
      callback
    )
  }
  seal(callback) {
    this.hooks.seal.call()
    this.hooks.beforeChunks.call()

    // 01 当前所有的入口模块都被存放在了 compilation 对象的 entries 数组里
    // 02 所谓封装 chunk 指的就是依据某个入口，然后找到它的所有依赖，将它们的源代码放在一起，之后再做合并
    for (const entryModule of this.entries) {
      // 核心： 创建模块加载已有模块的内容，同时记录模块信息
      const chunk = new Chunk(entryModule)
      // 保存 chunk 信息
      this.chunks.push(chunk)
      // 给 chunk 属性赋值
      chunk.modules = this.modules.filter(module => module.name === chunk.name)
    }
    // chunk 流程梳理之后就进入到了 chunk 代码处理环节（模板文件 + 模块中的源代码）
    this.hooks.afterChunks.call(this.chunks)

    // 生成代码内容
    this.createChunkAssets()
    callback()
  }
  createChunkAssets() {
    for (let i = 0; i < this.chunks.length; i++) {
      const chunk = this.chunks[i]
      const fileName = chunk.name + '.js'
      chunk.files.push(fileName)

      // 01 获取模板文件的路径
      let tempPath = path.posix.join(__dirname, 'temp/main.ejs')
      // 02 读取模块文件中的内容
      let tempCode = this.inputFileSystem.readFileSync(tempPath, 'utf8')
      // 03 获取渲染函数
      let tempRender = ejs.compile(tempCode)
      // 04 按ejs的语法渲染数据
      let source = tempRender({
        entryModuleId: chunk.entryModule.moduleId,
        modules: chunk.modules
      })
      // 输出文件
      this.emitAssets(fileName, source)
    }
  }
  emitAssets(fileName, source) {
    this.assets[fileName] = source
    this.files.push(fileName)
  }
}

module.exports = Compilation
```

修改 `lib/Compilation.js`

```js
const { Tapable, AsyncSeriesHook, SyncBailHook, SyncHook, AsyncParallelHook } = require('tapable')
const path = require('path')
const mkdirp = require('mkdirp')
const NormalModuleFactory = require('./normalModuleFactory')
const Compilation = require('./Compilation')
const Stats = require('./Stats')

class Compiler extends Tapable {
  constructor(context) {
    super()
    this.context = context
    this.hooks = {
      done: new AsyncSeriesHook(['stats']),
      entryOption: new SyncBailHook(['context', 'entry']),

      beforeRun: new AsyncSeriesHook(['compiler']),
      run: new AsyncSeriesHook(['compiler']),

      thisCompilation: new SyncHook(['compilation', 'params']),
      compilation: new SyncHook(['compilation', 'params']),

      beforeCompile: new AsyncSeriesHook(['params']),
      compile: new SyncHook(['params']),
      make: new AsyncParallelHook(['compilation']),
      afterCompile: new AsyncSeriesHook(['compilation']),

      emit: new AsyncSeriesHook(['compilation'])
    }
  }
  emitAssets(compilation, callback) {
    // 当前需要做的核心 01 创建 dist 02 在目录创建完成之后执行文件的写操作
    // 01 定义一个工具方法用于执行文件的生成操作
    const emitFiles = err => {
      const assets = compilation.assets
      let outputPath = this.options.output.path
      for (let file in assets) {
        let source = assets[file]
        let targetPath = path.posix.join(outputPath, file)
        this.outputFileSystem.writeFileSync(targetPath, source, 'utf8')
      }
      callback(err)
    }
    // 创建目录之后启动文件写入
    this.hooks.emit.callAsync(compilation, err => {
      mkdirp.sync(this.options.output.path)
      emitFiles()
    })
  }
  run(callback) {
    console.log('run 方法执行了~~~')

    const finalCallback = function (err, stats) {
      callback(err, stats)
    }

    const onCompiled = (err, compilation) => {
      console.log('onCompiled 方法执行了~~~')

      // 最终在这里将处理好的 chunk 写入到指定的文件然后输出至 dist
      this.emitAssets(compilation, err => {
        let stats = new Stats(compilation)
        finalCallback(err, stats)
      })
    }

    this.hooks.beforeRun.callAsync(this, err => {
      this.hooks.run.callAsync(this, err => {
        this.compile(onCompiled)
      })
    })
  }
  compile(callback) {
    const params = this.newCompilationParams()

    this.hooks.beforeRun.callAsync(params, err => {
      this.hooks.compile.call(params)
      const compilation = this.newCompilation(params)

      this.hooks.make.callAsync(compilation, err => {
        // console.log('make钩子监听触发了~~~~~')
        // callback(err, compilation)

        // 在这里我们开始处理 chunk
        compilation.seal(err => {
          this.hooks.afterCompile.callAsync(compilation, err => {
            callback(err, compilation)
          })
        })
      })
    })
  }
  newCompilationParams() {
    const params = {
      normalModuleFactory: new NormalModuleFactory()
    }
    return params
  }
  newCompilation(params) {
    const compilation = this.createCompilation()
    this.hooks.thisCompilation.call(compilation, params)
    this.hooks.compilation.call(compilation, params)
    return compilation
  }
  createCompilation() {
    return new Compilation(this)
  }
}

module.exports = Compiler
```

