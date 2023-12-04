# ECMAScript新特性

通常会把 ECMAScript 看作 JavaScript 的标准化规范，实际上 JavaScript 是 ECMAScript 的扩展语言，ECMAScript 只提供了最基本的语法

在浏览器 JavaScript

![NodeJS](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/NodeJS.png)

在Node JavaScript

![WebJS](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/WebJS.png)

ECMAScript 版本

![ES](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/ES%E7%89%88%E6%9C%AC.png)

重点：ES5.1 基础上的变化

- 解决原有语法上的一些问题或者不足
- 对原有语法进行增强
- 全新的对象、全新的方法、全新的功能
- 全新的数据类型和数据结构

```bash
npm i nodemon -g
```

## let const

**let**

```js
for (var i = 0; i < 3; i++) {
  for (var i = 0; i < 3; i++) {
    console.log(i) // 0 1 2
  }
}
for (let i = 0; i < 3; i++) {
  for (let i = 0; i < 3; i++) {
    console.log(i) // 0 1 2 0 1 2 0 1 2
  }
}

var el = [{}, {}, {}]
for (var i = 0; i < el.length; i++) {
  el[i].onClick = function () {
    console.log(i)
  }
}
el[1].onClick() // 3

console.log(foo) // undefined
var foo = 'bird'
```

**const**

```js
const obj = {}
obj.name = 'bird'
obj = {} // TypeError: Assignment to constant variable.
```

## 解构

**解构数组**

```js
const arr = [100, , 300, 400]
const [foo, bar = 123, ...rest] = arr
console.log(bar) // 123
console.log(rest) // [ 300, 400 ]
```

**解构对象**

- 对象解构需要跟属性名匹配提取，数组是有下标是可以按照顺序提取

```js
const obj = { name: 'bird', age: 18 }
const { name } = obj
console.log(name) // bird
```

## 字符串

**模板字符串**

```js
const name = 'tom'
const msg = `hey ${name} --- ${1 + 2} --- ${Math.random().toFixed(2)}`
console.log(msg)
```

模板字符串高级用法：定义模板字符串之前加一个标签，标签是一个函数

- 模板字符串中可能会有嵌入的表达式，表达式分割过后就是一个数组
- 可以使用标签函数的特性，做文本多语言化、检查是否包含不安全的字符

```js
alert`hello`
// 等同于
alert(['hello'])
console.log`hello world`   // [ 'hello world' ]

const name = 'tom'
const gender = true
function myTagFunc(strings, name, gender) {
  const sex = gender ? 'man' : 'woman'
  return strings[0] + name + strings[1] + sex + strings[2]
}
const result = myTagFunc`hey, ${name} is a ${gender}.`
console.log(result) // hey, tom is a man.
```

**扩展方法**

- `includes`
- `startsWith`
- `endsWith`

```js
const message = 'Error: foo is not defined.'
console.log(message.startsWith('Error'))
console.log(message.endsWith('.'))
console.log(message.includes('foo'))
```

## 函数

**参数默认值**

- 参数默认值顺序需要放在最后

```js
function foo(bar, enable = true) {
  // 以前参数默认值是这么写
  enable = enable === undefined ? true : enable
}
```

**剩余参数**

- 剩余参数顺序需要放在最后
- 以前是处理 `arguments`

```js
function foo(...args) {
  console.log(args) // [ 1, 2, 3, 4 ]
}
foo(1, 2, 3, 4)
```

**展开数组**

```js
const arr = ['foo', 'bar', 'foobar']
console.log.apply(console, arr) // foo bar foobar
console.log(...arr) // foo bar foobar
```

**箭头函数**

- 让代码简短易读
- this 指向当前作用域的 this

```js
const fnc = n => n + 1
console.log(fnc(100))

const person = {
  name: 'tom',
  sayHi() {
    console.log(`sayHi ${this.name}`)
  },
  sayHiArrow: () => {
    console.log(`sayHiArrow ${this.name}`)
  },
}
person.sayHi() // sayHi tom
person.sayHiArrow() // sayHiArrow undefined
```

## 对象

**字面量增强**

```js
const bar = '345'
const obj = {
  // 属性名：变量名
  foo: 123,
  // ES6：变量名与属性名一致可以省略
  bar,
  // 方法名：表达式
  method1: function () {
    console.log('method1')
  },
  // ES6：可以省略：和function
  method2() {
    console.log('method2')
  },
  // ES6：计算属性名
  [Math.random()]: 234
}
// 添加动态属性名
obj[Math.random()] = 123
```

**对象扩展方法**

- `Object.assign`：将多个源对象中的属性复制到一个目标对象中

```js
const source1 = {
  a: 123,
  b: 123,
}
const source2 = {
  a: 465,
  c: 456,
}
const result = Object.assign(source1, source2)
console.log(source1) // { a: 465, b: 123, c: 456 }
console.log(result === source1) // true
```

- `Object.is`：判断两个值是否相等

  使用 `===` 无法判断 `+0 === -0`、`NaN === NaN`

## 数组

- `Array.from`：用于将两类对象转为真正的数组
- `Array.of`：用于将一组值，转换为数组，基本上可以用来替代 `Array()` 或 `new Array()`
- `Array.find` ：用于找出第一个符合条件的数组成员
- `Array.findIndex`：用法与`find`方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回 `-1`
- `Array.fill` ：使用给定值填充数组
- `Array.entries()`、`Array.keys()`、`Array.values()` ：用于遍历数组

## 数值

- `Number.isNaN`：用来检查一个值是否为 NaN
- `Number.isFinite`：检测一个数值是否为有限数
- `Number.isInteger`：判断一个数是否为整数
- `Math.trunc`：将数字的小数部分抹掉
- `Math.sign`：判断一个数到底为正数、负数还是零

## Proxy

 监视某个对象的属性读写，可以使用 `Object.defineProperty`，ES6 增加 `Proxy`

```js
const person = {
  name: 'bird',
  age: 18,
}
const personProxy = new Proxy(person, {
  get(target, property) {
    return target[property]
  },
  set(target, property, value) {
    if (!Number.isInteger(value)) {
      throw new TypeError(`${value} is not an int`)
    }
    target[property] = value
  },
})
personProxy.age = 100
console.log(personProxy.age) // 100
```

- `defineProperty` 只能监视属性的读写

- `Proxy` 能够监视到更多对象操作（Delete 操作、方法调用等）

  `Proxy` 更好的支持数组对象的监视（重写数组的操作方法）

  `Proxy` 是以非侵入的方式监管了对象的读写

```js
const person = {
  name: 'bird',
  age: 18,
}
const personProxy = new Proxy(person, {
  deleteProperty(target, property) {
    console.log('delete', property) // delete age
    delete target[property]
  },
})
delete personProxy.age

const list = []
const listProxy = new Proxy(list, {
  set(target, property, value) {
    target[property] = value
    return true
  },
})
listProxy.push(100)
console.log(listProxy) // [ 100 ]
```

| handler 方法             | 触发方式                                                     |
| ------------------------ | ------------------------------------------------------------ |
| get                      | 读取某个属性                                                 |
| set                      | 写入某个属性                                                 |
| has                      | in 操作符                                                    |
| deleteProperty           | delete 操作符                                                |
| getPrototypeOf           | `Object.getPrototypeOf()`                                    |
| setPrototypeOf           | `Object.setPrototypeOf()`                                    |
| isExtensible             | `Object.isExtensible()`                                      |
| preventExtensions        | `Object.preventExtensions()`                                 |
| getOwnPropertyDescriptor | `Object.getOwnPropertyDescriptor()`                          |
| defineProperty           | `Object.defineProperty()`                                    |
| ownKeys                  | `Object.getOwnPropertyName()`、`Object.getOwnPropertySymbols` |
| apply                    | 调用一个函数                                                 |
| construct                | 用 new 调用一个函数                                          |

## Reflect

- 统一对对象操作 API（操作对象有可能使用 Object 上的方法，也有可能使用 delete 这样的操作符），且它是一个静态类（不能 `new Reflect`）
- `Reflect` 成员方法就是 `Proxy` 处理对象的默认实现

```js
const obj = {
  name: 'bird',
  age: 18,
}
const proxy = new Proxy(obj, {
  get(target, property) {
    return Reflect.get(target, property)
  },
})

console.log(Reflect.has(obj, 'name')) // true
console.log(Reflect.deleteProperty(obj, 'age')) // true
console.log(Reflect.ownKeys(obj)) // [ 'name' ]
```

## 类

Promise 解决了传统异步编程中回调函数嵌套过深的问题

在此之前，ECMAScript 都是通过定义函数以及函数原型对象实现类

- 实例方法：以前就是在构造函数对象上挂载方法
- 静态方法：新增静态成员 static 关键词

```js
class Person {
  constructor(name) {
    this.name = name
  }
  say() {
    console.log(`hi, my name is ${this.name}`)
  }
  static create(name) {
    return new Person(name)
  }
}
class Student extends Person {
  constructor (name, number) {
    super(name)
    this.number = number
  }
  hello () {
    super.say()
    console.log(`my school number is ${this.number}`)
  }
}

const s = new Student('jack', '100')
s.hello()
// hi, my name is jack
// my school number is 100
```

## Map Set

- `Set` 中会对所使用到的数据产生引用

  即便这个数据在外面被消耗，但是由于 `Set` 引用了这个数据，所以依然不会回收

- `WeakSet` 不会产生引用

  一旦数据销毁，就可以被回收，所以不会产生内存泄漏问题

```js
// 应用场景：数组去重
const arr = [1, 2, 1, 3, 4, 1]
// const result = Array.from(new Set(arr))
const result = [...new Set(arr)]
console.log(result) // [ 1, 2, 3, 4 ]
```

- `Map` 的键可以使任意类型的数据，解决了对象键只能是字符串的问题

- `Map` 中也会对所使用的数据产生引用

  即便这个数据在外面被消耗，但是由于 `Map` 引用了这个数据，所以依然不会回收

- `WeakMap` 不会产生引用

  一旦数据销毁，就可以被回收，所以不会产生内存泄漏问题

```js
const obj = {}
obj[true] = 'value'
obj[123] = 'value'
obj[{ a: 1 }] = 'value'
console.log(Object.keys(obj)) // [ '123', 'true', '[object Object]' ]
//value
console.log(obj['[object Object]']) // value

const m = new Map()
const tom = { name: 'tom' }
m.set(tom, 90)
console.log(m) // Map { { name: 'tom' } => 90 }
console.log(m.get(tom)) // 90
```

## Symbol

- 为对象添加独一无二的属性名

```js
// Symbol 可以传入描述文本
console.log(Symbol('foo')) // Symbol(foo)
// 使用 Symbol 为对象添加用不重复的键
const obj = {
  [Symbol()]: 123,
  [Symbol()]: 234,
}
console.log(obj) // { [Symbol()]: 123, [Symbol()]: 234 }

const name = Symbol()
const person = {
  [name]: 'zce',
  say() {
    console.log(this[name])
  },
}
// 由于无法创建出一样的 Symbol 值，所以无法直接访问到 person 中的私有成员
person.say()
```

**Symbol 补充**

```js
// 两个 Symbol 永远不会相等
console.log(Symbol() === Symbol()) // false
const s1 = Symbol.for('foo')
const s2 = Symbol.for('foo')
console.log(s1 === s2) // true
// 注意 由于内部会转换成字符串，即使传boolean也是true
console.log(Symbol.for(true) === Symbol.for('true')) // true

const obj = {
  [Symbol.toStringTag]: 'XObject'
}
// 如果直接从写toString可能会重复（其他地方用了 也会被影响），可以用symbol重写
console.log(obj.toString()) // [object XObject]
// 只能获取symbol属性名
console.log(Object.getOwnPropertySymbols(obj)) // [ Symbol(Symbol.toStringTag) ]
```

## 迭代接口

- 新增 `for...of` 作为遍历所有数据结构的统一方式

```js
const arr = [100, 200, 300, 400]

for (const item of arr) {
  console.log(item)
  if (item > 100) break
}
// 不能跳出循环（除非报错）通常都是使用 some 或 every 代替
arr.forEach(() => {})

// 遍历 Set 与遍历数组相同
const s = new Set(['foo', 'bar'])
for (const item of s) {
  console.log(item)
}

// 遍历 Map 可以配合数组结构语法，直接获取键值
const m = new Map()
m.set('foo', '123')
m.set('bar', '345')
for (const [key, value] of m) {
  console.log(key, value)
}

// 普通对象不能被直接 for...of 遍历
const obj = { foo: 123, bar: 456 }
for (const item of obj) {
  console.log(item) // TypeError: obj is not iterable
}
```

- ES2015 提供了 Iterable 接口

  实现了 Interable 接口就是 `for...of` 的前提（`Symbol(Symbol.iterator)`）

```js
const set = new Set(['foo', 'bar', 'baz'])

const iterator = set[Symbol.iterator]()
while (true) {
  const current = iterator.next()
  if (current.done) break
  console.log(current.value) // foo bar baz
}
```

**实现可迭代接口**

```js
const obj = {
  store: ['foo', 'bar', 'baz'],
  [Symbol.iterator]: function () {
    let index = 0
    const self = this
    // 实现迭代器接口 iterator  内部需要有一个next方法
    return {
      next: function () {
        // IteratorResult 实现迭代结果接口
        return {
          value: self.store[index],
          done: index++ >= self.store.length,
        }
      },
    }
  },
}

for (const item of obj) {
  console.log(item) // foo bar baz
}
```

**迭代器模式**

- 核心：对外提供统一接口，让外部不用关心内部结构是怎样的

```js
const todos = {
  life: ['吃饭', '睡觉', '打豆豆'],
  learn: ['语文', '数学', '外语'],
  work: ['喝茶'],
  [Symbol.iterator]: function () {
    const all = [].concat(this.life, this.learn, this.work)
    let index = 0
    return {
      next: function () {
        return {
          value: all[index],
          done: index++ >= all.length,
        }
      },
    }
  },
}

for (const item of todos) {
  console.log(item)
}
```

## 生成器

```js
function* foo() {
  console.log('zce')
  return 100
}

// 生成器对象也实现了iterator接口
function* foo() {
  yield 100
  // yield不会结束方法的执行  yield值作为next结果返回
  yield 200
  yield 300
}
const generator = foo()
console.log(generator.next()) // { value: 100, done: false }
console.log(generator.next()) // { value: 200, done: false }
console.log(generator.next()) // { value: 300, done: false }
console.log(generator.next()) // { value: undefined, done: true }
```

## ES2016

- `includes`
- `Math.pow`

```js
const arr = ['foo', 1, NaN, false]
// 找到返回元素下标
console.log(arr.indexOf('foo')) // 0
// 找不到返回 -1
console.log(arr.indexOf('bar')) // -1
// 无法找到数组中的 NaN
console.log(arr.indexOf(NaN)) // -1
// 直接返回是否存在指定元素
console.log(arr.includes('foo')) // true
// 能够查找 NaN
console.log(arr.includes(NaN)) // true

// 指数运算符
console.log(Math.pow(2, 10))
console.log(2 ** 10)
```

## ES2017

- `Object.values` 和 `Object.entries`

```JS
const obj = {
  foo: 'value1',
  bar: 'value2',
}
console.log(Object.values(obj)) // [ 'value1', 'value2' ]
for (const [key, value] of Object.entries(obj)) {
  console.log(key, value) // foo value1 // bar value2
}
```

- `Object.getOwnPropertyDescriptors`

  主要就是配合 ES5 的 `getter` 和 `setter` 来使用

```js
const p1 = {
  firstName: 'Lei',
  lastName: 'Wang',
  get fullName() {
    return this.firstName + ' ' + this.lastName
  },
}
console.log(p1.fullName) // Lei Wang
const p2 = Object.assign({}, p1)
p2.firstName = 'zce'
// Object.assign 在复制是只是把 fullName 当做普通属性复制了
console.log(p2.fullName) // Lei Wang

const descriptors = Object.getOwnPropertyDescriptors(p1)
const p3 = Object.defineProperties({}, descriptors)
p3.firstName = 'zce'
console.log(p3.fullName) // zce Wang
```

- `padStart` 和 `padEnd`

```js
const books = {
  html: 5,
  css: 16,
  javascript: 128,
}
for (const [name, count] of Object.entries(books)) {
  console.log(`${name.padEnd(16, '-')}|${count.toString().padStart(3, '0')}`)
}
/* 
html------------|005
css-------------|016
javascript------|128
*/
```

- 在函数参数中添加尾逗号  

```js
function foo(bar, baz,) {}
```

- `async` 和 `await`

