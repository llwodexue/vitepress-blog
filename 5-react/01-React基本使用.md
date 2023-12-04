# React基本使用

## React 简介

React：用于构建用户界面的 JavaScript 库

- React的官网文档：[https://zh-hans.reactjs.org/](https://zh-hans.reactjs.org/)

**React 特点**

- 声明式编程 
- 组件化开发
- 多平台适配

**声明式编程**

- 声明式编程是目前整个大前端开发的模式：Vue、React、Flutter、SwiftUI
- 它允许我们只需要维护自己的状态，当状态改变时，React 可以根据最新的状态去渲染我们的 UI 界面

![image-20221031122620811](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221031122620811.png)

**组件化开发**

- 组件化开发页面目前前端的流行趋势，我们会将复杂的界面拆分成一个个小的组件
- 如何合理的进行组件的划分和设计也是后面我会讲到的一个重点

![image-20221031122805520](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221031122805520.png)

**多平台适配**

- 2013年，React 发布之初主要是开发 Web 页面
- 2015年，Facebook 推出了 ReactNative，用于开发移动端跨平台；（虽然目前 Flutter 非常火爆，但是还是有很多公司在使用 ReactNative）
- 2017年，Facebook 推出 ReactVR，用于开发虚拟现实 Web 应用程序；（VR 也会是一个火爆的应用场景）

![image-20221031122802006](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221031122802006.png)

## React 基本使用

开发React必须依赖三个库：

- react：包含 react 所必须的核心代码
- react-dom：react 渲染在不同平台所需要的核心代码
- babel：将 jsx 转换成 React 代码的工具

对于 Vue 来说，我们只是依赖一个 vue.js 文件即可，但是 react 需要依赖三个包

react-dom 针对 web 和 native 所完成的事情不同：

- web端：react-dom 会将 jsx 最终渲染成真实的 DOM，显示在浏览器中
- native端：react-dom 会将 jsx 最终渲染成原生的控件（比如 Android 中的 Button，iOS 中的 UIButton）

React 和 Babel 的关系：

- 默认情况下开发 React 其实可以不使用 babel
- 但是前提是我们自己使用 React.createElement 来编写源代码，它编写的代码非常的繁琐和可读性差
- 那么我们就可以直接编写 jsx（JavaScript XML）的语法，并且让 babel 帮助我们转换成 React.createElement

**React 依赖引入**

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script> 
<script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
```

**Hello World**

`ReactDOM.createRoot` 函数：用于创建一个 React 根，之后渲染的内容会包含在这个根中

- 参数：将渲染的内容，挂载到哪一个 HTML 元素上

`root.render` 函数:

- 参数：要渲染的根组件

![image-20221031130630872](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221031130630872.png)

## React 组件化开发

整个逻辑其实可以看做一个整体，那么我们就可以将其封装成一个组件：

-  `root.render` 参数是一个 HTML 元素或者一个组件
- 所以我们可以先将之前的业务逻辑封装到一个组件中，然后传入到 `ReactDOM.render` 函数中的第一个参数

在 React 中可以使用类的方式封装组件：

1. **定义一个类**（类名大写，组件的名称必须大写，小写会被认为是 HTML 元素）

2. **实现当前组件的 render 函数**

   render 当中返回的 jsx 内容，就是之后 React 会帮助我们渲染的内容

![image-20221031171546882](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221031171546882.png)

### 数据在哪里定义

组件化问题一：**数据在哪里定义？**

在组件中的数据，我们可以分成两类：

- **参与界面更新的数据**：当数据变量时，需要更新组件渲染的内容
- **不参与界面更新的数据**：当数据变量时，不需要更新将组建渲染的内容

参与界面更新的数据我们也可以称之为是**参与数据流**，这个数据是**定义在当前对象的 state**中

- 我们可以通过在构造函数中 `this.state = {定义的数据}`

  ![image-20221031172841765](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221031172841765.png)

- 当我们的数据发生变化时，我们可以调用 `this.setState` 来更新数据，并且通知 React 进行 update 操作

- 在进行 update 操作时，就会重新调用 render 函数，并且使用最新的数据，来渲染界面

  ![image-20221114155532154](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114155532154.png)

### 事件绑定中的 this

组件化问题二：**事件绑定中的this**

- 在类中直接定义一个函数，并且将这个函数绑定到元素的 onClick 事件上，当前这个函数的 this 指向的是谁呢？

- 默认情况下是 undefined

  - 很奇怪，因为在正常的 DOM 操作中，监听点击，监听函数中的 this 其实是节点对象（比如说是 button 对象）

- 这里有 **ES6 class 和 babel** 的原因

  - 默认情况在 ES6 中 class 定义，默认情况下是严格模式
  - babel 默认也会将代码转换为严格模式

- 我们在绑定的函数中，可能想要使用当前对象，比如执行 this.setState 函数，就必须拿到当前对象的 this

  - 我们就需要在传入函数时，给这个函数直接绑定 this

    ` <button onClick={this.changeText.bind(this)}>改变文本</button>`

### 案例

案例一：列表

![image-20221114163015327](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114163015327.png)

案例二：计数器

![image-20221114163046813](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221114163046813.png)

