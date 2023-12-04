# JavaScript性能优化

## JavaScript 内存管理

![一段代码的性能](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E4%B8%80%E6%AE%B5%E4%BB%A3%E7%A0%81%E7%9A%84%E6%80%A7%E8%83%BD.png)

**内存管理**

- 内存：由可读写单元组成，表示一片可操作性空间
- 管理：人为的去操作一片空间的申请、使用和释放
- 内存管理：开发者主动申请空间、使用空间、释放空间
- 管理流程：申请-使用-释放

**JS 内存管理**

- 申请内存空间
- 使用内存空间
- 释放内存空间

```js
// 申请空间
let obj = {}
// 使用空间
obj.name = 'jack'
// 释放空间
obj = null
```

## 垃圾回收与常见 GC 算法

### JavaScript 中的垃圾回收

- JavaScript 中内存管理是自动的
- 对象不再被 **引用** 时是垃圾
- 对象不能 **从根上访问到** 时是垃圾

**JavaScript 中的可达对象**

- 可以访问到的对象就是可达对象（引用、作用域链）
- 可达的标准就是从根出发是否能够被找到
- JavaScript 中的根可以理解为 **全局变量**

```js
let obj = { name: 'bird' }
let dog = obj
// 虽然被清理了，但是dog还在引用着，还是可达的
obj = null
```

![可达对象图示](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%8F%AF%E8%BE%BE%E5%AF%B9%E8%B1%A1%E5%9B%BE%E7%A4%BA.png)

```js
function objGroup(obj1, obj2) {
  obj1.next = obj2
  obj2.prev = obj1
  return {
    o1: obj1,
    o2: obj2,
  }
}
let obj = objGroup({ name: 'obj1' }, { name: 'obj2' })
```

现在通过 delete 语句，把 obj 中对 o1 的引用（`delete obj.o1`）以及 obj2 对 obj1 的引用（`delete obj2.prev`）都 delete 掉，因为没有办法通过某些方式找到 o1，所以 o1 会被垃圾回收

![可达对象进行delete](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%8F%AF%E8%BE%BE%E5%AF%B9%E8%B1%A1%E8%BF%9B%E8%A1%8Cdelete.png)

### GC 算法

**GC 定义与作用**

- GC 就是垃圾回收机制的简写（Garbage Collection）
- GC 可以找到内存中的垃圾、并释放和回收空间

![GC里的垃圾是什么](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/GC%E9%87%8C%E7%9A%84%E5%9E%83%E5%9C%BE%E6%98%AF%E4%BB%80%E4%B9%88.png)

**GC 算法是什么**

- GC 是一种机制，垃圾回收器完成具体的工作
- 工作的内容就是查找垃圾释放空间、回收空间
- 算法就是工作时查找和回收所遵循的规则

**常见 GC 算法**

- 引用计数
- 标记清除
- 标记整理
- 分代回收

#### 引用计数

- 核心思想：设置引用数，判断当前引用数是否为 0
- 引用计数器，引用关系改变时修改引用数字
- 引用数字为 0 时立即回收

```js
const user1 = { age: 11 }
const user2 = { age: 22 }
// 即使脚本执行完，因为在全局还是找到到，所以不会被回收
const nameList = [user1.age, user2.age]

function fn() {
  // 因为挂载在window上，即使fn执行完毕，计数也不是0
  num1 = 1
  // 加上const后只在作用域内起作用，从全局是找不到的，计数为0
  const num2 = 2
}
fn()
```

**引用计数算法优缺点**

- 优点：发现垃圾时立即回收；最大限度减少程序卡顿时间

- 缺点：无法回收循环引用的对象；资源消耗较大、时间开销较大（需要监控对象数值变化）

```js
function fn() {
  const obj1 = {}
  const obj2 = {}
	// obj1引用obj2，obj2引用obj1
  obj1.name = obj2
  obj2.name = obj1
}
fn()
```

#### 标记清除

- 核心思想：分标记和清除两个阶段完成
- 遍历所有对象找到标记活动对象
- 遍历所有对象清除没有标记对象
- 回收相应的空间

![标记清除](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%A0%87%E8%AE%B0%E6%B8%85%E9%99%A4.png)

**标记清除算法优缺点**

- 优点：相对引用计数来说，解决了对象循环引用无法回收问题

- 缺点：容易产生空间碎片化、浪费空间（当前回收的对象在地址上是不连续的）；不会立即回收垃圾对象

  任何空间都会有两部分组成，一个是存储空间的头元信息（大小、地址），另一个是存放数据的域

![标记清除算法缺点图解](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%A0%87%E8%AE%B0%E6%B8%85%E9%99%A4%E7%AE%97%E6%B3%95%E7%BC%BA%E7%82%B9%E5%9B%BE%E8%A7%A3.png)

#### 标记整理

- 标记整理可以看做是标记清除的增强
- 标记阶段的操作和标记清除一致
- 清除阶段会先执行整理，移动对象位置

有很多活动对象、非活动对象、空闲空间

![整理清除回收前](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%95%B4%E7%90%86%E6%B8%85%E9%99%A4%E5%9B%9E%E6%94%B6%E5%89%8D.png)

执行标记整理，会将活动对象进行整理，地址变为连续

![整理清除整理后](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%95%B4%E7%90%86%E6%B8%85%E9%99%A4%E6%95%B4%E7%90%86%E5%90%8E.png)

这样回收后就可以最大化利用空间

![整理清除回收后](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%95%B4%E7%90%86%E6%B8%85%E9%99%A4%E5%9B%9E%E6%94%B6%E5%90%8E.png)

**标记清除算法优缺点**

- 优点：减少碎片化空间
- 缺点：不会立即回收垃圾对象

## V8 引擎的垃圾回收

- V8 是一款主流 JavaScript 执行引擎

- V8 采用即时编译

  之前很多 JavaScript 引擎都需要将代码先转换成字节码，然后去执行。V8 可以直接将源码翻译成可执行的机器码，所以速度非常快

- V8 内存设限

  64位不超过 1.5G，32位不超过 800M

  当垃圾回收达到 1.5G 时，采用增量标记进行垃圾回收，只需消耗 50ms，如果采用非增量标记去进行垃圾回收，需要 1s
  
- V8 采用基于分代回收思想实现垃圾回收

  V8 内存分为新生代（复制 + 标记整理）和老生代（标记清除 + 标记整理 + 增量标记）

### V8 垃圾回收策略

- 采用分代回收的思想
- 内存分为新生代、老生代
- 针对不同对象采用不同算法

![V8内存策略](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/V8%E5%86%85%E5%AD%98%E7%AD%96%E7%95%A5.png)

**V8 中常用 GC 算法**

- 分代回收
- 空间复制
- 标记清除
- 标记整理
- 增量标记

### V8 回收新老生代对象

![V8新老生代存储](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/V8%E6%96%B0%E8%80%81%E7%94%9F%E4%BB%A3%E5%AD%98%E5%82%A8.png)

- **V8 内存空间一分为二**（左侧->新生代；右侧->老生代）

- 左侧小空间用于存储新生代对象（64位32M | 32位16M）

  新生代指的是存活时间较短的对象

- 右侧大空间用于存储老生代对象（64位1.4G | 32位700M）

  老生代对象就是指存活时间较长的对象（Global、Closure）

**新生代回收实现**

- 回收过程采用复制算法 + 标记整理

- **新生代内存区分为两个等大小空间**

- 使用空间为 From，空闲空间为 To

- 活动对象存储于 From 空间

  如果要申请空间来会用，首先会所有变量对象都分配到 From 空间

  一旦 From 空间达到一定存储量后，就会触发 GC 操作

- 标记整理后将活动对象拷贝至 To

  这时候位置连续，没有碎片化空间

- From 与 To 交换空间完成释放

**新生代回收细节说明**

- 拷贝过程中可能出现晋升（晋升就是将新生代对象移动至老生代）

  一轮 GC 还活的新生代需要晋升

  To 空间的使用率超过 25%

**老生代回收实现**

- 主要采用标记清除、标记整理、增量标记算法
- 首先使用标记清除完成垃圾空间的回收
- 采用标记整理进行空间优化
- 采用增量标记进行效率优化

**细节对比**

- 新生代区域垃圾回收使用空间换时间
- 老生代区域垃圾回收不适合复制算法

**标记增量如何优化垃圾回收**

- 当进行垃圾回收时会阻塞 JavaScript 执行
- 标记增量就是将一整段垃圾回收操作拆分成多个小步组合完成回收，这样执行程序和垃圾回收交替进行

![标记增量](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%A0%87%E8%AE%B0%E5%A2%9E%E9%87%8F.png)

## Performance 工具

GC 的目的是为了实现内存空间的良性循环

- 良性循环的基石是合理使用，时刻关注才能确定是否合理
- 通过 Performance 时刻监控内存

**内存问题的外在表现**

- 页面出现延迟加载或经常性暂停

  频繁垃圾回收，某一块代码瞬间让内存爆掉（通过内存变化图进行分析）

- 页面持续性出现糟糕的性能

  内存膨胀，当前界面为了达到最佳使用速度会申请内存空间，但这个内存空间远超当前设备所能提供的大小

- 页面的性能随时间越长越来越差

  出现内存泄露，内存使用持续升高

**监控内存的几种方式**

- 浏览器任务管理器
- TimeLine 时序图记录
- 堆快照查找分离 DOM
- 判断是否存在频繁的垃圾回收

**为什么要确定频繁垃圾回收**

- GC 工作时应用程序是停止的
- 频繁且过长的 GC 会导致应用假死
- 用户使用中感知应用卡顿

**确定频繁的垃圾回收**

- Timeline 中频繁的上升下降
- 任务管理器中数据频繁的增加减少

### 任务管理器监控内存

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>任务管理器监控内存变化</title>
  </head>
  <body>
    <button id="btn">Add</button>
    <script>
      const btn = document.getElementById('btn')
      btn.onclick = function () {
        let arrList = new Array(1000000)
      }
    </script>
  </body>
</html>
```

- `Shift + Esc` 打开浏览器的任务管理器（右键把 JavaScript 内存勾上）
- 主要看当前 DOM 所占用的内存变化、JavaScript 堆所占内存变化

![浏览器任务管理器](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%B5%8F%E8%A7%88%E5%99%A8%E4%BB%BB%E5%8A%A1%E7%AE%A1%E7%90%86%E5%99%A8.png)

### Timeline 记录内存

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>时间线记录内存变化</title>
  </head>
  <body>
    <button id="btn">Add</button>
    <script>
      const arr = []
      function test() {
        for (let i = 0; i < 100000; i++) {
          document.body.appendChild(document.createElement('p'))
        }
        arr.push(new Array(1000000).join('x'))
      }
      document.getElementById('btn').addEventListener('click', test)
    </script>
  </body>
</html>
```

![Timeline记录内存](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/Timeline%E8%AE%B0%E5%BD%95%E5%86%85%E5%AD%98.png)

### 堆快照查询分离 DOM

- 页面元素存活在 DOM 树上

- 垃圾对象时的 DOM 节点

  脱离 DOM 树就是垃圾，而且 JS 没有引用这个 DOM 

- 分离状态的 DOM 节点

  当前 DOM 节点只是从 DOM 树上脱离了，但是在 JS 代码中还在引用着，这种 DOM 称为分离 DOM

  分离 DOM 是看不见的，但是在内存中却占据空间（内存泄露），可以通过堆快照功能把它从这里都找出来

**注意：** 如果 `console.log` 也打印了 ul，那么 ul 也是被引用的，搜索 `Detached` 也会有分离 DOM

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>堆快照监控内存</title>
  </head>
  <body>
    <button id="id">Add</button>
    <script>
      var temEle
      var btn = document.getElementById('id')
      btn.addEventListener('click', function () {
        var ul = document.createElement('ul')
        for (let i = 0; i < 10; i++) {
          var li = document.createElement('li')
          ul.appendChild(li)
        }
        console.log(ul) // console.log也被引用记得注释
        temEle = ul
  			temEle = null
      })
    </script>
  </body>
</html>
```

## V8 引擎工作流程

- V8 引擎只是浏览器渲染引擎的 JS 执行代码的组成部分

- `Scanner` 是一个扫描器，对于纯文本 JS 代码进行词法分析，把代码分析成不同 tokens

  ```js
  const username = 'alishi'
  
  [
    { type: 'Keyword', value: 'const' }, // 关键词
    { type: 'Identifier', value: 'username' }, // 标识符
    { type: 'Punctuator', value: '=' }, // 标点符号
    { type: 'String', value: 'alishi' },
  ]
  ```

- `Parser` 是一个解析器（全量解析），解析的过程就是语法分析过程，把词法分析 tokens 转换成抽象语法树（AST）

  ```js
  {
    type: 'Program',
    body: [
      {
        type: 'VariableDeclaration',
        declaration: [
          {
            type: 'VariableDeclarator',
            id: {
              type: 'Identifier',
              name: 'username',
            },
            init: {
              type: 'Literal',
              value: 'alishi',
              raw: 'alishi',
            },
          },
        ],
        kind: 'const',
      },
    ],
    sourceType: 'script',
  }
  ```

- `PreParser` 是预解析，比如：定义一个函数但没有立即对它进行调用，使用全量解析就有很多无用功

- `Ignition` 是解释器，把抽象语法树（AST）转换成字节码（bytecode），并收集下一个编译阶段的信息

- `TurboFan` 是编译器模块，把字节码转换成汇编代码

![V8引擎](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/V8%E5%BC%95%E6%93%8E.png)

**预解析**

- 跳过未被使用的代码
- 不生成 AST，创建无变量引用和声明的 scopes
- 依据规范抛出特定错误
- 解析速度更快

**全量解析**

- 解析被使用的代码
- 生成 AST
- 构建具体 scopes 信息，变量引用、声明等
- 抛出所有语法错误

```js
// 声明时未调用，因此会被认为是不被执行的代码，进行预解析
function foo() {
  console.log('foo')
}
// 声明时未调用，因此会被认为是不被执行的代码，进行预解析
function fn() {}
// 函数立即执行，只进行一次全量解析
;(function bar() {})()
// 执行 foo，那么需要重新对 foo 函数进行全量解析，此时 foo 函数被解析了两次
```

## 堆栈内存处理

- **执行环境栈（ECStack，Execution Context Stack）**

  浏览器想要执行代码，首先需要从内存中分配出一块内存，用来执行代码（栈内存）

- 执行上下文

  不能将所有代码都放在执行环境栈，需要执行上下文管理在不同区域

  包括：**全局执行上下文（EC(G)，Execution Context Global）**、函数上下文、块级上下文

- **全局对象（GO，Global Object）** 堆

  存储浏览器内部的 API（`window.setTimeout...`），也是一个对象，它会有一个内存地址，有地址就可以对其进行访问

- **全局变量对象（VO(G)，Variable Object Global）** 栈

  存储当前上下文中生成的变量（块级上下文也是 VO）

  为了方便我们使用 GO 对象里面的属性（`setTimeout`），所以 VO(G) 里有 window 变量

- 活动对象（AO，Active Object）

  存储函数中的变量对象（私有），可以理解为是 VO 的分支

### 基本数据类型

![堆栈机制](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%A0%86%E6%A0%88%E6%9C%BA%E5%88%B6.png)

1. 基本数据类型是按值进行操作
2. 基本数据类型是存放在栈区的
3. 无论我们当前看到的栈内存，还是后续引用数据类型会使用的堆内存都属于计算机内存
4. GO 它不是 VO(G)，但是它也是一个对象，因此它会有一个内存的空间地址

### 引用数据类型

![对象堆栈执行机制](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%AF%B9%E8%B1%A1%E5%A0%86%E6%A0%88%E6%89%A7%E8%A1%8C%E6%9C%BA%E5%88%B6.png)

### 函数堆栈处理

1. 创建函数和创建变量类似，函数名此时就可以看做是一个变量名

2. 单独开辟一个堆内存用于存放函数的体（字符串形式代码）

   当前内存地址也会有一个 16 进制数值地址

3. 创建函数的时候，它的作用域 `[[scope]]` 就已经确定了（创建函数时所在的执行上下文）

4. 创建函数之后会将它的内存地址存放在栈区与对应的函数名进行关联

函数执行，目的就是为了将函数数据对应的堆内存里的字符串形式代码进行执行，代码在执行时肯定需要有一个环境，此时就意味着函数在执行的时候会生成一个新的执行上下文来管理函数体中的代码

**函数执行时做的事情**

1. 确定作用域链 `<当前执行上下文, 上级执行上下文>`
2. 确定 this
3. 初始化 arguments 对象
4. 形参赋值：相当于变量声明，然后将声明变化放置于 AO
5. 变量提升
6. 执行代码

### 闭包堆栈处理

```js
var a = 1
function foo() {
  var b = 2
  return function (c) {
    console.log(c + b++)
  }
}
var f = foo()
f(5) // 7 b->3
f(10) // 13 b->4
```

1. 闭包是一种机制，通过私有上下文来保护当中变量的机制

2. 我们也可以认为当我们创建的某一个执行上下文不被释放的时候就形成了闭包（临时不被释放）

   保护：当前上下文中的变量与其它上下文中的变量互不干扰

   保存：当前上下文的数据（堆内存）被当前上下文以外的上下文中的变量所引用，这个数据就保存下来了

## 代码优化

### 闭包与垃圾回收

1. 浏览器都自有垃圾回收（内存管理，V8 为例）
2. 栈空间、堆空间
3. 堆：当前堆内存如果被占用，就不能被释放掉，但是我们如果确认后续不再使用这个内存的数据，也可以自己主动置空，然后浏览器会对其进行回收
4. 栈：当前上下文中是否有内容，被其上下文的变量所占用，如果有则无法释放（闭包）

```js
let a = 10
function foo(a) {
  return function (b) {
    console.log(b + ++a)
  }
}
let fn = foo(10)
fn(5) // 16 私有a->11
foo(6)(7) // 14
fn(20) // 32 私有a->12
console.log(a) // 10

fn = null
foo = null
```

### 循环添加事件

```html
<button>按钮1</button>
<button>按钮2</button>
<button>按钮3</button>

<script>
  var aButtons = document.querySelectorAll('button')
  for (var i = 0; i < aButtons.length; i++) {
    aButtons[i].onclick = function () {
      console.log(`当前索引值为${i}`)
    }
  }

  // 闭包
  for (var i = 0; i < aButtons.length; i++) {
    aButtons[i].onclick = (function (i) {
      return function () {
        console.log(`当前索引值为${i}`)
      }
    })(i)
  }
  for (let i = 0; i < aButtons.length; i++) {
    aButtons[i].onclick = function () {
      console.log(`当前索引值为${i}`)
    }
  }
  // 添加自定义属性
  for (let i = 0; i < aButtons.length; i++) {
    aButtons[i].myIndex = i
    aButtons[i].onclick = function () {
      console.log(`当前索引值为${this.myIndex}`)
    }
  }
</script>
```

### 事件委托

```html
<button index="1">按钮1</button>
<button index="2">按钮2</button>
<button index="3">按钮3</button>
<script>
  document.body.onclick = function (ev) {
    var target = ev.target,
      targetDom = target.tagName
    if (targetDom === 'BUTTON') {
      var index = target.getAttribute('index')
      console.log(`当前点击的是第 ${index} 个`)
    }
  }
</script>
```

## JSBench

> [https://jsbench.me/](https://jsbench.me/)
>
> [https://jsperf.com/](https://jsperf.com/)

高性能的背后是数据快速存取，也是优秀内存管理的体现

- `Setup HTML`：初始化 HTML 元素
- `Setup JS`：初始化 JS 代码
- `Teardown JS`：一些收尾的统一操作

### 减少判断层级

- 对于判断条件嵌套的场景，可以提前 return 那些无效条件

- 如果条件判断是明确条件的枚举值，一般使用 `switch...case` 来做，代码更加清晰、易于维护

  `if...else` 主要是区间判断

![优化减少判断层级](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E4%BC%98%E5%8C%96%E5%87%8F%E5%B0%91%E5%88%A4%E6%96%AD%E5%B1%82%E7%BA%A7.png)

```js
function doSomething(part, chapter) {
  const parts = ['ES2015', 'ES2016', '工程化', 'Vue', 'React', 'Node']
  if (part) {
    if (parts.includes(part)) {
      console.log('属于当前的前端课程')
      if (chapter > 5) {
        console.log('您需要提供 VIP 身份')
      }
    }
  } else {
    console.log('请确认模块信息')
  }
}

// 提前 return
function doSomething(part, chapter) {
  const parts = ['ES2015', 'ES2016', '工程化', 'Vue', 'React', 'Node']
  if (!part) {
    console.log('请确认模块信息')
    return
  }
  if (!parts.includes(part)) return
  console.log('属于当前的前端课程')
  if (chapter > 5) {
    console.log('您需要提供 VIP 身份')
  }
}

doSomething2('ES2016', 6)
```

### 慎用全局变量

- 全局变量定义在全局执行上下文，是所有作用域链的顶端
- 全局执行上下文一直存在于上下文执行栈，直到程序退出
- 如果某个局部作用域出现了同名变量则会遮蔽或污染全局

![优化慎用全局变量](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E4%BC%98%E5%8C%96%E6%85%8E%E7%94%A8%E5%85%A8%E5%B1%80%E5%8F%98%E9%87%8F.png)

```js
// 全局变量
var i,
  str = ''
function packageDom1() {
  for (i = 0; i < 1000; i++) {
    str += i
  }
}
packageDom1()

// 局部变量
function packageDom2() {
  let str = ''
  for (let i = 0; i < 1000; i++) {
    str += i
  }
}
packageDom2()
```

### 缓存数据

- 减少声明和语句数（词法、语法）
- 缓存数据（作用域链查找变快）

![优化缓存数据](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E4%BC%98%E5%8C%96%E7%BC%93%E5%AD%98%E6%95%B0%E6%8D%AE.png)

```html
<div id="skip" class="skip"></div>

<script>
// 缓存数据：对于需要多次使用的数据进行提前保存，后续进行使用
var oBox = document.getElementById('skip')

function hasClassName1(ele, cls) {
  console.log(ele.className)
  return ele.className === cls
}
hasClassName1(oBox, 'skip')

function hasClassName2(ele, cls) {
  var clsName = ele.className
  console.log(clsName)
  return clsName === cls
}
hasClassName2(oBox, 'skip')
</script>
```

### 减少访问层级

![优化减少访问层级](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E4%BC%98%E5%8C%96%E5%87%8F%E5%B0%91%E8%AE%BF%E9%97%AE%E5%B1%82%E7%BA%A7.png)

```js
function Person1() {
  this.name = 'bird'
  this.age = 14
  this.getAge = function () {
    return this.age
  }
}
let p1 = new Person1()
console.log(p1.getAge())

function Person2() {
  this.name = 'bird'
  this.age = 14
  this.getAge = function () {
    return this.age
  }
}
let p2 = new Person2()
console.log(p2.age)
```

### 字面量与构造式

直接通过字面量来创建的执行速度远比 new 关键字创建的速度快

- 因为 new 相当于调用一个函数
- 字面量是直接开辟一个空间往里存

引用数据类型，字面量与构造式方式没有太大区别。基本数据类型，字面量与构造式方式差别就很大了

![优化字面量与构造式](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E4%BC%98%E5%8C%96%E5%AD%97%E9%9D%A2%E9%87%8F%E4%B8%8E%E6%9E%84%E9%80%A0%E5%BC%8F.png)

```js
var test = () => {
  var obj = new Object()
  obj.name = 'zce'
  obj.age = 38
  obj.slogan = '声明一个 obj'
  return obj
}

var test = () => {
  var obj = {
    name: 'zce',
    age: 38,
    slogan: '声明一个 obj',
  }
  return obj
}

console.log(test())
```

### 减少循环体活动

- 把循环体里边重复的事情，如果说值不变，没必要每次都重新获取一遍
- 采用另一种从后往前遍历思路，可以少做一些条件判断

![优化减少循环体活动](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E4%BC%98%E5%8C%96%E5%87%8F%E5%B0%91%E5%BE%AA%E7%8E%AF%E4%BD%93%E6%B4%BB%E5%8A%A8.png)

```js
var test = () => {
  var i
  var arr = ['bird', 18, 'bird can fly']
  for (i = 0; i < arr.length; i++) {
    console.log(i)
  }
}

// 对不经常发生改变的数据进行缓存
var test = () => {
  var i
  var arr = ['bird', 18, 'bird can fly']
  var len = arr.length
  for (i = 0; i < len; i++) {
    console.log(i)
  }
}

// 使用 while 循环
var test = () => {
  var arr = ['bird', 18, 'bird can fly']
  var i = arr.length
  while (i--) {
    console.log(i)
  }
}

test()
```

### 防抖和节流

在一些高频率事件触发的场景下，我们不希望对应的事件函数多次执行

- 场景：滚动事件、输入的模糊匹配、轮播图切换、点击操作
- 浏览器默认都会有自己的监听事件间隔（4~6ms），如果检测到多次事件的监听执行，那么就会造成不必要的资源浪费

防抖：对于高频操作，我们只希望识别一次点击，可以人为是第一次或者最后一次

```html
<button id="btn">点击</button>
<script>
  var btn = document.getElementById('btn')
  function btnClick(ev) {
    console.log('点击了', this, ev)
  }

  /**
   * handle 最终需要执行的事件监听
   * wait 事件触发之后多久开始执行
   * immediate 控制执行第一次还是最后一次
   */
  function myDebounce(handle, wait, immediate) {
    // 参数类型判断及默认值处理
    if (typeof handle !== 'function') throw new Error('handle must be a function')
    if (typeof wait === 'undefined') wait = 300
    if (typeof wait === 'boolean') {
      immediate = wait
      wait = 300
    }
    if (typeof immediate !== 'boolean') immediate = false

    // 如果我们想要执行最后一次，那么就意味着无论我们点击了多少次，前面N-1次都无用
    let timer = null
    return function proxy(...args) {
      // 如果要向实现第一次执行，那么可以添加 timer 为 null 的判断
      let init = immediate && !timer
      clearTimeout(timer)
      timer = setTimeout(() => {
        timer = null
        !immediate ? handle.apply(this, args) : null
      }, wait)
      // 如果当前传递进行的是 true（立即执行）
      init ? handle.apply(this, args) : null
    }
  }
  // 当我们执行了按钮点击就会执行...返回的proxy
  btn.onclick = myDebounce(btnClick, 1000, true)
</script>
```

节流：对于高频操作，我们可以自己设置频率，让本来会执行很多次的事件触发，按我们定义的频率减少触发的次数

1. 假设当前在 5ms 时间点上执行一次 proxy，我们就可以用这个时间减去上次执行的时间，此时就会有一个时间差
2. 前置条件：我们自己定义了一个 wait，比如定义的是 500ms
3. `wait - (now - previous)`
4. 此时如果上如结果是大于 0，就意味着当次的操作是一个高频触发，我们想法让它不要去执行 handle，如果这个结果小于等于 0，就意味着当次不是一个高频操作，那么我们就可以执行 handle
5. 此时我们就可以在 500ms 内想办法让所有的高频操作在将来都有一次执行就可以，不需要给每个高频操作添加一个定时器

```html
<style>
  body {
    height: 5000px;
  }
</style>
<script>
  function scrollFn() {
    console.log('滚动了')
  }
  function myThrottle(handle, wait) {
    if (typeof handle !== 'function') throw new Error('handle must be a function')
    if (typeof wait === 'undefined') wait = 300

    let previous = 0 // 上一次执行的时间
    let timer = null // 用它来管理定时器
    return function proxy(...args) {
      // 此时说明是一个非高频操作，可以执行 handle
      let now = new Date() // 当前执行的时刻时间点
      let interval = wait - (now - previous)
      if (interval <= 0) {
        clearTimeout(timer)
        timer = null
        handle.apply(this, args)
        previous = +new Date()
      }
      // 当我们发现当前系统有一个定时器，就意味着我们不需要再开启定时器
      if (!timer) {
        // 此时说明这次操作发生在我们定义的频次时间范围内，那就不执行 handle
        // 这时候我们可以定义一个定时器，让 handle 在 interval 之后去执行
        timer = setTimeout(() => {
          clearTimeout(timer) // 这个操作只是将系统中的定时器清除了，但是 timer 中的值还在
          timer = null
          handle.apply(this, args)
          previous = +new Date()
        }, interval)
      }
    }
  }
  window.onscroll = myThrottle(scrollFn, 1000)
</script>
```

