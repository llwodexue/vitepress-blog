# TypeScript语言

## 类型系统

TypeScript 解决 JavaScript 类型系统的问题，大大提高代码的可靠程度

- JavaScript 缺失类型系统的可靠性（不靠谱）
- JavaScript 没有编译环节，静态类型在编译环节进行类型校验

### 强类型与弱类型（类型安全）

- 强类型：语言层面显示函数的实参类型必须与形参类型相同（更强的类型约束）

  不允许任意的隐式类型转换

- 弱类型：语言层面不会限制实参的类型（几乎没有约束）

  允许任意的隐式类型转换

注意：变量类型允许随时改变的特点，不是强弱类型的差异

```bash
# node 环境
> '100' - 50
50
> Math.abs('foo')
NaN
> .exit

# python 环境
>>> '100' - 50
TypeError: unsupported operand type(s) for -: 'str' and 'int'
>>> abs('foo')
TypeError: bad operand type for abs(): 'str'
>>> exit()
```

**弱类型的问题**

```js
// 程序上的异常需要等到运行时才能发现
const obj = {}
setTimeout(() => {
  obj.foo()
}, 2000)

// 类型不明确造成功能改变
function sum(a, b) {
  return a + b
}
console.log(100, '100')

// 对象索引错误用法
obj[true] = 100
console.log(foo['true'])
```

**强类型的优势**

- 错误更早暴露（编译阶段报错）

- 代码更智能，编码更准确

  ```js
  function render(element) {
    element.className = 'container'
  }
  ```

- 重构更牢靠

  ```js
  const util = {
    // 不知道哪里用到 aaa 了
    aaa: () => {
      console.log('util func')
    },
  }
  ```

- 减少不必要的类型判断

  ```js
  function sum(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
      throw new Error('arguments must be a number')
    }
    return a + b
  }
  ```

### 静态类型与动态类型（类型检查）

- 静态类型：一个变量声明时它的类型就是明确的，声明过后类型就不允许再修改
- 动态类型：运行阶段才能够明确变量类型，而且变量的类型随时可以改变

```js
var foo = 100
foo = 'bar'
foo = true
console.log(foo)
```

## Flow 静态类型检查方案

> [Type Annotations](https://flow.org/en/docs/types/)
>
> [Flow Type Cheat Sheet](https://www.saltycrane.com/cheat-sheets/flow-type/latest/)

### 快速上手

首先需要把 `JavaScript › Validate: Enable` 取消勾选

- 禁用 JavaScript 验证

![关闭JavaScript验证](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%85%B3%E9%97%ADJavaScript%E9%AA%8C%E8%AF%81.png)

安装 `flow`

```bash
yarn init --yes
yarn add flow-bin --dev
```

使用 `flow`

- 在文件顶部添加注释标记：`@flow`
- 添加类型注解 `function sum (a: number)`

> 注意：执行 `yarn flow` 时可能会报错：`error Command failed with exit code 2.`。是因为路径有中文名，将路径改为英文就可以启动了

```bash
yarn flow init
yarn flow
# 停止flow后台任务
yarn flow stop
```

### 编译移除注释

**方案1：** `flow-remove-types`

因为在 Node 中运行会报错，所以在运行的时候需要将注解移除

- 安装 `flow-remove-types`

```bash
yarn add flow-remove-types --dev
```

- 执行 `flow-remove-types`

```bash
yarn flow-remove-types . -d dist
```

**推荐 方案2：** `babel`

- 安装：核心模块 `@babel/core`、cli 工具（命令行中使用 babel）`@babel/cli`、转换 flow 注解 `@babel/preset-flow`

```bash
yarn add @babel/core @babel/cli @babel/preset-flow
```

- 创建 `.babelrc`

```js
{
  "presets": ["@bebel/preset-flow"]
}
```

- 执行 `babel`

```bash
yarn babel TypeScript -d dist
```

### 类型推断

> 在 VSCode 中搜索 `Flow Language Support` 插件安装，保存之后会重新检查

flow 可以自动判断类型

![flow默认类型推断](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/flow%E9%BB%98%E8%AE%A4%E7%B1%BB%E5%9E%8B%E6%8E%A8%E6%96%AD.png)

**原始类型**

- `undefined` 用 `void` 表示

```js
// @flow
const a: string = 'foobar'
const b: number = Infinity // NaN
const c: boolean = false
const d: null = null
const e: void = undefined
const f: symbol = Symbol()
```

**数组类型**

```js
// @flow
const arr1: Array<number> = [1, 2, 3]
const arr2: number[] = [1, 2, 3]
const foo: [string, number] = ['foo', 100] // 元组
```

**对象类型**

```js
// @flow
const obj1: { foo: string, bar: number } = { foo: 'string', bar: 100 }
const obj2: { foo?: string, bar: number } = { bar: 100 } // 可选
const obj3 = { [string]: string } = {}
obj3.key1 = 'value1'
```

**函数类型**

- 函数没有返回值用 `void` 表示

```js
// @flow
function foo(callback: (string, number) => void) {
  callback('string', 100)
}
foo(function (str, n) {})
```

**特殊类型**

```js
// @flow
// 字面量结合联合类型
const type: 'success' | 'warning' | 'danger' = 'success'
// 用 type 声明类型
type StringOrNumber = string | number
const b: StringOrNumber = 'string'
// MayBe 类型，在具体类型基础上扩展 null 和 undefined
const gender: ?number = undefined
// 相当于
// const gender: number | null | undefined = undefined
```

**任意类型**

- `mixed` 是强类型
- `any` 是弱类型，尽量不要写这个（为了兼容才会用这个）

```js
// @flow
function passMixed (value: mixed) {
  if (typeof value === 'string') {
    value.substr(1)
  }

  if (typeof value === 'number') {
    value * value
  }
}
passMixed('string')
passMixed(100)

function passAny (value: any) {
  value.substr(1)
  value * value
}
passAny('string')
passAny(100)
```

**运行环境 API**

> [flow/lib](https://github.com/facebook/flow/tree/main/lib)

```js
// @flow
const element: HTMLElement | null = document.getElementById('app')
```

## Typescript 语言规范与基本应用

- JavaScript 的超集（superset）

- TypeScript 最终会编译成 JavaScript 去工作，所以任何一种 JavaScript 运行环境都支持

  相比 Flow，功能更为强大，生态更健全、更完善

- TypeScript 属于渐进式

![JavaScriptSuperset](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/JavaScriptSuperset.png)

### 快速上手

- 安装 `typescript`

  安装完在 `node_modules/.bin` 会生成 `tsc` 执行文件 

```bash
yarn add typescript --dev
```

- 执行 `tsc` 进行编译

```bash
yarn tsc xxx.ts
```

- 生成配置文件 `tsconfig.json`

```bash
yarn tsc --init
```

- 配置 `compilerOptions`

  > [compiler-options](https://www.tslang.cn/docs/handbook/compiler-options.html)

  配置好 `tsconfig.json` 后，就可以直接执行 `yarn tsc` 命令了

```json
{
  "compilerOptions": {
    "target": "es2015", // 新特性都转换为es2015代码
    "module": "commonjs", // 输出代码使用什么方式进行模块化
    "outDir": "dist", // 编译结果输出到的文件夹
    "rootDir": "./", // TypeScript代码所在文件夹
    "sourceMap": true, // 开启源代码映射
    "strict": true, // 开启所有类型严格检查
  }
}
```

- 显示中文错误消息

```bash
yarn tsc --locale zh-CN
```

### 原始类型

**ES6 数据类型**

- Boolean
- Number
- String
- Array
- Function
- Object
- Symbol
- undefined
- null

**TypeScript 数据类型**

在 ES6 数据类型基础上新增

- **void**
- **any**
- **never**
- **元组**
- **枚举**
- **高级类型**

```tsx
const a: string = 'foobar'
const b: number = 100 // NaN Infinity
const c: boolean = true // false
// 在非严格模式（strictNullChecks）下，
// string, number, boolean 都可以为空
// const d: string = null
// const d: number = null
// const d: boolean = null
const e: void = undefined
const f: null = null
const g: undefined = undefined
const h: symbol = Symbol()
```

标准库：内置对象所对应的声明

- `Symbol` 是 ES2015 标准中定义的成员
- 使用它的前提是必须确保有对应的 ES2015 标准库引用
- 也就是 `tsconfig.json` 中的 `lib` 选项必须包含 ES2015

```json
{
  "compilerOptions": {
    "target": "ES5",
    "lib": [
      "ES2015",
      "DOM"
    ]
  }
}
```

### 其他类型

**作用域问题**

- 默认文件中的成员会作为全局成员，多个文件中有相同成员就会出现冲突
- **解决办法：**使用模块导出 `export {}`，模块有单独的作用域

```js
// 解决办法1: IIFE 提供独立作用域
(function () {
  const a = 123
})()

// 解决办法2: 在当前文件使用 export，也就是把当前文件变成一个模块
const a = 123
export {}
```

**Object 类型**

```tsx
// object 类型是指除了原始类型以外的其它类型
const foo: object = function () {} // [] // {}
// 如果需要明确限制对象类型，则应该使用这种类型对象字面量的语法，或者是「接口」
const obj: { foo: number; bar: string } = { foo: 123, bar: 'string' }
```

**数组类型**

```tsx
// 数组类型
const arr1: Array<number> = [1, 2, 3]
const arr2: number[] = [1, 2, 3]
// 如果是 JS，需要判断是不是每个成员都是数字
function sum (...args: number[]) {
  return args.reduce((prev, current) => prev + current, 0)
}
sum(1, 2, 3)
```

**元祖类型**

```tsx
const tuple: [number, string] = [18, 'zce']
const [age, name] = tuple
const entries: [string, number][] = Object.entries({
  foo: 123,
  bar: 456
})
const [key, value] = entries[0]
```

**枚举类型**

- 常量枚举
- 计算枚举

```tsx
// 常量枚举，不会侵入编译结果
const enum PostStatus {
  Draft,
  Unpublished,
  Published
}
const post = {
  title: 'Hello TypeScript',
  content: 'TypeScript is a typed superset of JavaScript.',
  status: PostStatus.Draft
}
```

**函数类型**

```tsx
function func1 (a: number, b: number = 10, ...rest: number[]): string {
  return 'func1'
}
func1(100, 200, 300)

const func2: (a: number, b: number) => string = function (a: number, b: number): string {
  return 'func2'
}
```

**任意类型**

```tsx
function stringify (value: any) {
  return JSON.stringify(value)
}
stringify('string')
stringify(100)
stringify(true)
```

### 类型推断

**隐式类型推断**

```tsx
let age = 18 // number
// age = 'string'

let foo // any
foo = 100
```

**类型断言**

```tsx
const nums = [110, 120, 119, 112]
const res = nums.find(i => i > 0)
const num1 = res as number
const num2 = <number>res // JSX 下不能使用
```

### 接口

- 约定一个对象具体有哪些成员(约束对象的结构)

**如果直接传入对象字面量，ts 就会对额外的字段进行检查**

1. 把对象字面量传递给一个变量
2. 使用类型断言 `as Result` `<Result>`
3. 使用字符串索引签名 `[x: string]: any`

```tsx
interface Post {
  title: string
  content: string
}
function printPost(post: Post) {
  console.log(post.title)
  console.log(post.content)
}
printPost({
  title: 'Hello TypeScript',
  content: 'A javascript superset',
})
```

- 使用可选成员和只读成员

```tsx
interface Post {
  title: string
  content: string
  subtitle?: string
  readonly summary: string
}
const hello: Post = {
  title: 'Hello TypeScript',
  content: 'A javascript superset',
  summary: 'A javascript',
}

interface Cache {
  [prop: string]: string
}
const cache: Cache = {}
cache.foo = 'value1'
cache.bar = 'value2'
```

### 类

- 类：描述一类具体事务的抽象特征

实例属性除了定义在 `constructor` 方法里面的 this 上面，也可以定义在类的最顶层

```tsx
class Person {
  name: string
  age: number
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
  }
  sayHi(msg: string): void {
    console.log(`I am ${this.name}, ${msg}`)
  }
}
```

**类的修饰符**

- 所有属性默认都是共有成员 `public`
- 私有成员 `private` 只能在类的本身被调用，不能被类的实例调用也不能被子类调用
- 保护成员 `protected` 与 `private` 类似，但是它可以在子类调用
- `readonly` 将属性设置为只读的

```tsx
class Person {
  public name: string
  private age: number
  protected readonly gender: boolean
  constructor(name: string, age: number) {
    this.name = name
    this.age = age
    this.gender = true
  }
  sayHi(msg: string): void {
    console.log(`I am ${this.name}, ${msg}`)
    console.log(this.age)
  }
}
class Student extends Person {
  private constructor(name: string, age: number) {
    super(name, age)
    console.log(this.gender)
  }
  static create(name: string, age: number) {
    return new Student(name, age)
  }
}

const tom = new Person('tom', 18)
console.log(tom.name)
// console.log(tom.age)
// console.log(tom.gender)
// tom.gender = false
const jack = Student.create('jack', 18)
```

**类与接口的关系**

1. 类实现接口时必须实现声明接口的所有属性
2. 接口只能约束类的公有成员
3. 接口不能约束类的构造函数

**implements 和 extends 区别**

- `implements` 将类当做一个接口，这意味着必须去实现定义在类中的所有方法，无论这些方法是否在类中有没有默认实现，同时也不需要使用 `super()`
- `extends` 需要使用 `super()`

```tsx
interface Eat {
  eat (food: string): void
}
interface Run {
  run (distance: number): void
}

class Person implements Eat, Run {
  eat (food: string): void {
    console.log(`优雅的进餐: ${food}`)
  }
  run (distance: number) {
    console.log(`直立行走: ${distance}`)
  }
}
class Animal implements Eat, Run {
  eat (food: string): void {
    console.log(`呼噜呼噜的吃: ${food}`)
  }
  run (distance: number) {
    console.log(`爬行: ${distance}`)
  }
}
```

**抽象类**

- 抽象类跟接口有点类似也是约束子类的成员

  不同的是，抽象类可以有具体的实现，接口只能是成员的抽象

- **抽象类就是抽象方法不写实现，但子类必须实现**

- **多态就是父类的实例方法不写具体实现，让子类自己去个性化实现**

```tsx
abstract class Animal {
  eat(food: string): void {
    console.log(`呼噜呼噜的吃: ${food}`)
  }
  abstract run(distance: number): void
}

class Dog extends Animal {
  run(distance: number): void {
    console.log('四脚爬行', distance)
  }
}
const d = new Dog()
d.eat('叶子')
d.run(100)
```

### 泛型

函数重载：使用相同名称或不同参数数量或类型创建多个方法

联合类型：取值可以为多钟类型中的一个

泛型：不预先确定的数据类型，具体的类型在使用的时候才能确定

- 定义函数、接口、类时，没有指定具体类型，等到使用时再指定具体类型

```tsx
function createArray<T>(length: number, value: T): T[] {
  const arr = Array<T>(length).fill(value)
  return arr
}
const res = createArray<string>(3, 'foo')
```

### 类型声明

- 在 typescript 中引用第三方模块，如果模块中不包括声明文件，皆可以尝试去安装对应的 `@types` 类型声明模块，比如：`yarn add @types/lodash --dev`

```tsx
import { camelCase } from 'lodash'

declare function camelCase (input: string): string
```

