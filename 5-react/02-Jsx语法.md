# Jsx语法

## JSX 语法解析

### 基础语法

**JSX 是什么**

- JSX 是一种 JavaScript 的语法扩展（eXtension），也在很多地方称之为 JavaScript XML，因为看起就是一段XML语法
- 它用于描述我们的 UI 界面，并且其完成可以和 JavaScript 融合在一起使用
- 它不同于 Vue 中的模块语法，你不需要专门学习模块语法中的一些指令（比如v-for、v-if、v-else、v-bind）

React 认为**渲染逻辑**本质上与**其他 UI 逻辑**存在内在耦合

- 比如 UI 需要绑定事件（button、a 原生等等）
- 比如 UI 中需要展示数据状态
- 比如在某些状态发生改变时，又需要改变 UI

他们之间是密不可分，所以 React 没有将标记分离到不同的文件中，而是将它们组合到了一起，这个地方就是组件（Component）

**JSX 的书写规范**

- JSX 的顶层只能有一个根元素，所以我们很多时候会在外层包裹一个 div 或 Fragment 元素
- 为了方便阅读，我们通常在 jsx 的外层包裹一个小括号()，这样可以方便阅读，并且 jsx 可以进行换行书写
- JSX 中的标签可以是单标签，也可以是双标签
- 注意：如果是单标签，必须以 `/>` 结尾

**JSX 注释**

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114171611975.png)

### 插入内容

**JSX 嵌入变量作为子元素**

- 情况一：当变量是 Number、String、Array 类型时，可以直接显示
- 情况二：当变量是 null、undefined、Boolean 类型时，内容为空
  - 如果希望可以显示 null、undefined、Boolean，那么需要转成字符串
  - 转换的方式有很多，比如 toString 方法、和空字符串拼接，String(变量) 等方式
- 情况三：Object 对象类型不能作为子元素（not valid as a React child）

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      counter: 100,
      message: 'Hello World',
      names: ['abc', 'cba', 'nba'],
      aaa: undefined,
      bbb: null,
      ccc: true,
      friend: { name: 'kobe' },
      firstName: 'kobe',
      lastName: 'bryant',
      age: 20,
      movies: ['流浪地球', '星际穿越', '独行月球']
    }
  }

  render() {
    // 1.插入标识符
    const { message, names, counter } = this.state
    const { aaa, bbb, ccc } = this.state
    const { friend } = this.state

    // 2.对内容进行运算后显示(插入表达式)
    const { firstName, lastName } = this.state
    const fullName = firstName + ' ' + lastName
    const { age } = this.state
    const ageText = age >= 18 ? '成年人' : '未成年人'
    const liEls = this.state.movies.map(movie => <li>{movie}</li>)

    // 3.返回jsx的内容
    return (
      <div>
        {/* 1.Number/String/Array直接显示出来 */}
        <h2>{counter}</h2>
        <h2>{message}</h2>
        <h2>{names}</h2>

        {/* 2.undefined/null/Boolean */}
        <h2>{String(aaa)}</h2>
        <h2>{bbb + ''}</h2>
        <h2>{ccc.toString()}</h2>

        {/* 3.Object类型不能作为子元素进行显示*/}
        <h2>{friend.name}</h2>
        <h2>{Object.keys(friend)[0]}</h2>

        {/* 4.可以插入对应的表达式*/}
        <h2>{10 + 20}</h2>
        <h2>{firstName + ' ' + lastName}</h2>
        <h2>{fullName}</h2>

        {/* 5.可以插入三元运算符*/}
        <h2>{ageText}</h2>
        <h2>{age >= 18 ? '成年人' : '未成年人'}</h2>

        {/* 6.可以调用方法获取结果*/}
        <ul>{liEls}</ul>
        <ul>
          {this.state.movies.map(movie => (
            <li>{movie}</li>
          ))}
        </ul>
        <ul>{this.getMovieEls()}</ul>
      </div>
    )
  }

  getMovieEls() {
    const liEls = this.state.movies.map(movie => <li>{movie}</li>)
    return liEls
  }
}
```

JSX嵌入表达式

- 运算表达式
- 三元运算符
- 执行一个函数

### 绑定属性

- 比如元素都会有 title 属性
- 比如 img 元素会有 src 属性
- 比如 a 元素会有 href 属性
- 比如元素可能需要绑定 class
- 比如原生使用内联样式 style

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      title: '哈哈哈',
      href: 'https://www.baidu.com',
      isActive: true,
      objStyle: { color: 'red', fontSize: '30px' }
    }
  }

  render() {
    const { title, imgURL, href, isActive, objStyle } = this.state

    // 需求: isActive: true -> active
    // 1.class绑定的写法一: 字符串的拼接
    const className = `abc cba ${isActive ? 'active' : ''}`
    // 2.class绑定的写法二: 将所有的class放到数组中
    const classList = ['abc', 'cba']
    if (isActive) classList.push('active')
    // 3.class绑定的写法三: 第三方库classnames -> npm install classnames

    return (
      <div>
        {/* 1.基本属性绑定 */}
        <h2 title={title}>我是h2元素</h2>
        <a href={href}>百度一下</a>

        {/* 2.绑定class属性: 最好使用className */}
        <h2 className={className}>哈哈哈哈</h2>
        <h2 className={classList.join(' ')}>哈哈哈哈</h2>

        {/* 3.绑定style属性: 绑定对象类型 */}
        <h2 style={{ color: 'red', fontSize: '30px' }}>呵呵呵呵</h2>
        <h2 style={objStyle}>呵呵呵呵</h2>
      </div>
    )
  }
}
```

### 事件绑定

如果原生 DOM 原生有一个监听事件，我们可以如何操作呢？

- 方式一：获取 DOM 原生，添加监听事件
- 方式二：在 HTML 原生中，直接绑定 onclick

在 React 中是如何操作呢？我们来实现一下 React 中的事件监听，这里主要有两点不同

- React 事件的命名采用小驼峰式（camelCase），而不是纯小写
- 我们需要通过 `{}` 传入一个事件处理函数，这个函数会在事件发生时被执行

在事件执行后，我们可能需要获取当前类的对象中相关的属性，这个时候需要用到 this

- 如果我们这里直接打印 this，也会发现它是一个 undefined

为什么是 undefined 呢？

- 原因是 btnClick 函数并不是我们主动调用的，而且当 button 发生改变时，React 内部调用了 btnClick 函数
- 而它内部调用时，并不知道要如何绑定正确的 this

this 四种绑定规则：

1. 默认绑定：独立执行 `foo()`
2. 隐式绑定：被一个对象执行 `obj.foo() -> obj`
3. 显示绑定：`call/apply/bind foo.call("aaa") -> String("aaa")`
4. new 绑定：`new Foo() -> 创建一个新对象，并且赋值给 this`

如何解决 this 的问题呢？

- 方案一：bind 给 btnClick 显示绑定 this
- 方案二：使用 ES6 class fields 语法
- 方案三：事件监听时传入箭头函数（个人推荐）

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      message: 'Hello World',
      counter: 100
    }
    this.btn1Click = this.btn1Click.bind(this)
  }

  btn1Click() {
    console.log('btn1Click', this)
    this.setState({ counter: this.state.counter + 1 })
  }
  btn2Click = () => {
    console.log('btn2Click', this)
    this.setState({ counter: 1000 })
  }
  btn3Click() {
    console.log('btn3Click', this)
    this.setState({ counter: 9999 })
  }

  render() {
    const { message } = this.state
    return (
      <div>
        {/* 1.this绑定方式一: bind绑定 */}
        <button onClick={this.btn1Click}>按钮1</button>

        {/* 2.this绑定方式二: ES6 class fields */}
        <button onClick={this.btn2Click}>按钮2</button>

        {/* 3.this绑定方式三: 直接传入一个箭头函数(重要) */}
        <button onClick={() => console.log('btn3Click')}>按钮3</button>
        <button onClick={() => this.btn3Click()}>按钮3</button>
      </div>
    )
  }
}
```

**事件参数传递**

- 情况一：获取 event 对象
  - 很多时候我们需要拿到 event 对象来做一些事情（比如阻止默认行为）
  - 那么默认情况下，event 对象有被直接传入，函数就可以获取到 event 对象
- 情况二：获取更多参数
  - 有更多参数时，我们最好的方式就是传入一个箭头函数，主动执行的事件函数，并且传入相关的其他参数

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      message: 'Hello World'
    }
  }

  btnClick(event, name, age) {
    console.log('btnClick:', event, this)
    console.log('name, age:', name, age)
  }

  render() {
    const { message } = this.state
    return (
      <div>
        {/* 1.event参数的传递 */}
        <button onClick={this.btnClick.bind(this)}>按钮1</button>
        <button onClick={event => this.btnClick(event)}>按钮2</button>

        {/* 2.额外的参数传递 */}
        <button onClick={this.btnClick.bind(this, 'kobe', 30)}>
          按钮3(不推荐)
        </button>

        <button onClick={event => this.btnClick(event, 'why', 18)}>按钮4</button>
      </div>
    )
  }
}
```

### 条件渲染

某些情况下，界面的内容会根据不同的情况显示不同的内容，或者决定是否渲染某部分内容：

- 在 vue 中，我们会通过指令来控制：比如 v-if、v-show
- 在 React 中，所有的条件判断都和普通的 JavaScript 代码一致

常见的条件渲染的方式有哪些呢？

- 方式一：条件判断语句

  适合逻辑较多的情况

- 方式二：三元运算符

  适合逻辑比较简单

- 方式三：与运算符 `&&`

  适合如果条件成立，渲染某一个组件；如果条件不成立，什么内容也不渲染

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      isReady: false,
      friend: undefined
    }
  }

  render() {
    const { isReady, friend } = this.state
    // 1.条件判断方式一: 使用if进行条件判断
    
    
    
    let showElement = null
    if (isReady) {
      showElement = <h2>准备开始比赛吧</h2>
    } else {
      showElement = <h1>请提前做好准备!</h1>
    }

    return (
      <div>
        {/* 1.方式一: 根据条件给变量赋值不同的内容 */}
        <div>{showElement}</div>

        {/* 2.方式二: 三元运算符 */}
        <div>{isReady ? <button>开始战斗!</button> : <h3>赶紧准备</h3>}</div>

        {/* 3.方式三: &&逻辑与运算 */}
        {/* 场景: 当某一个值, 有可能为undefined时, 使用&&进行条件判断 */}
        <div>{friend && <div>{friend.name + ' ' + friend.desc}</div>}</div>
      </div>
    )
  }
}
```

### 列表渲染

在 React 中并没有像 Vue 模块语法中的 v-for 指令，而且需要我们通过 JavaScript 代码的方式组织数据，转成 JSX：

- 很多从 Vue 转型到 React 的同学非常不习惯，认为 Vue 的方式更加的简洁明了
- 但是 React 中的 JSX 正是因为和 JavaScript 无缝的衔接，让它可以更加的灵活
- 另外我经常会提到 React 是真正可以提高我们编写代码能力的一种方式

如何展示列表呢？

- 在 React 中，展示列表最多的方式就是使用数组的 map 高阶函数

很多时候我们在展示一个数组中的数据之前，需要先对它进行一些处理：

- 比如过滤掉一些内容：filter 函数
- 比如截取数组中的一部分内容：slice 函数

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221115104843157.png)

这个警告是告诉我们需要在列表展示的 jsx 中添加一个 key

- key 主要的作用是为了提高 diff 算法时的效率

## JSX 深入

### JSX 本质

JSX 仅仅只是 `React.createElement(component, props, ...children)` 函数的语法糖

- 所有 JSX 最终都会被转换成 React.createElement 的函数调用

createElement 需要传递三个参数：

- 参数一：type
  - 当前 ReactElement的 类型
  - 如果是标签元素，那么就使用字符串表示 div
  - 如果是组件元素，那么就直接使用组件的名称
- 参数二：config
  - 所有 jsx 中的属性都在 config 中以对象的属性和值的形式存储
  - 比如传入 className 作为元素的 class
- 参数三：children
  - 存放在标签中的内容，以 children 数组的方式进行存储；
  - 当然，如果是多个元素呢？React 内部有对它们进行处理

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221115113610693.png)

> 可以在 babel 的官网中快速查看转换的过程：[https://babeljs.io/repl/#?presets=react](https://babeljs.io/repl/#?presets=react)

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221115114113258.png)

### 虚拟 DOM

通过 `React.createElement` 最终创建出来一个 ReactElement 对象

ReactElement 对象作用：

- 原因是 React 利用 ReactElement 对象组成了一个 JavaScript 的对象树
- JavaScript 的对象树就是虚拟 DOM（Virtual DOM）

ReactElement 的树结构

- ReactElement 最终形成的树结构就是 Virtual DOM

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221115114902172.png)

### 声明式编程

Virtual DOM 是一种编程理念。

- 在这个理念中，UI 以一种理想化或者说虚拟化的方式保存在内存中，并且它是一个相对简单的 JavaScript 对象
- 我们可以通过 ReactDOM.render 让虚拟 DOM 和真实 DOM 同步起来，这个过程中叫做协调（Reconciliation）

这种编程的方式赋予了 React 声明式的 API：

- 你只需要告诉 React 希望让 UI 是什么状态
- React 来确保 DOM 和这些状态是匹配的
- 你不需要直接进行 DOM 操作，就可以从手动更改 DOM、属性操作、事件处理中解放出来

### 购物车案例

```jsx
class App extends React.Component {
  constructor() {
    super()
    this.state = {
      books: books
    }
  }

  getTotalPrice() {
    return this.state.books.reduce((acc, cur) => {
      return acc + cur.count * cur.price
    }, 0)
  }

  changeCount(index, count) {
    const newBooks = [...this.state.books]
    newBooks[index].count += count
    this.setState({ books: newBooks })
  }

  removeItem(index) {
    const newBooks = [...this.state.books]
    newBooks.splice(index, 1)
    this.setState({ books: newBooks })
  }

  renderBookEmpty() {
    return (
      <div>
        <h2>购物车为空, 请添加书籍~</h2>
      </div>
    )
  }

  renderBookList() {
    const { books } = this.state
    const formatPrice = price => {
      return '¥' + price.toFixed(2)
    }

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>序号</th>
              <th>书籍名称</th>
              <th>出版日期</th>
              <th>价格</th>
              <th>购买数量</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {books.map((item, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.date}</td>
                  <td>{formatPrice(item.price)}</td>
                  <td>
                    <button
                      disabled={item.count <= 1}
                      onClick={() => this.changeCount(index, -1)}
                    >
                      -1
                    </button>
                    {item.count}
                    <button onClick={() => this.changeCount(index, +1)}>+1</button>
                  </td>
                  <td>
                    <button onClick={() => this.removeItem(index)}>删除</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <h2>总价格：{formatPrice(this.getTotalPrice())}</h2>
        </table>
      </div>
    )
  }

  render() {
    const { books } = this.state
    return books.length ? this.renderBookList() : this.renderBookEmpty()
  }
}
```

