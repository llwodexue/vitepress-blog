# Redux

> 本文用传统 Redux 讲解核心概念。新项目优先使用 Redux Toolkit；传统写法适合帮助理解 action、reducer 与 store 的协作关系。

## 纯函数和副作用

**React 中组件就被要求像是一个纯函数**（为什么是像，因为还有 Class 组件），**Redux 中有一个 reducer 的概念**，也是要求必须是一个纯函数

**纯函数的维基百科定义：**

- 在程序设计中，若一个函数符合以下条件，那么这个函数被称为纯函数
- 此函数在相同的输入值时，需产生相同的输出
- 函数的输出和输入值以外的其他隐藏信息或状态无关，也和由 I/O 设备产生的外部输出无关
- 该函数不能有语义上可观察的函数副作用，诸如“触发事件”，使输出设备输出，或更改输出值以外物件的内容等

> 确定的输入，一定会产生确定的输出
>
> 函数在执行过程中，不能产生副作用

 **副作用（side effect）**其实本身是医学的一个概念，比如我们经常说吃什么药本来是为了治病，可能会产生一些其他的副作用

在计算机科学中，也引用了副作用的概念，表示在执行一个函数时，除了返回函数值之外，还对调用函数产生了附加的影响，比如修改了全局变量，修改参数或者改变外部的存储； 

![image-20221213213144785](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221213213144785.png)

**React 是在视图层帮助我们解决了 DOM 的渲染过程，但是 State 依然是留给我们自己来管理：**

- 无论是组件定义自己的 state，还是组件之间的通信通过 props 进行传递；也包括通过 Context 进行数据之间的共享
- React 主要负责帮助我们管理视图，state 如何维护最终还是我们自己来决定

**Redux 就是一个帮助我们管理 State 的容器：Redux 是 JavaScript 的状态容器，提供了可预测的状态管理** 

## 核心概念

**Store**

![image-20221213221152962](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221213221152962.png)

**action**

**Redux 要求我们通过 action 来更新数据：**

- 所有状态变化都必须由派发（dispatch）的 action 触发
- action 是一个普通的 JavaScript 对象，用 `type` 描述事件；附加数据通常放在 `payload` 中

![image-20221213221205960](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221213221205960.png)

**reducer**

- reducer 是一个纯函数
- reducer 做的事情就是将传入的 state 和 action 结合起来生成一个新的 state

![image-20221213221231473](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221213221231473.png)

### 最小数据流与职责边界

`UI → dispatch(action) → middleware → reducer → store → UI`

- `action` 只描述“发生了什么”，额外数据统一放在 `payload`；它不直接修改状态。
- `reducer` 只根据旧状态和 `action` 计算新状态，不承担请求、随机数或其他副作用。
- 异步请求、日志和鉴权等横切逻辑放在 middleware；请求完成后再派发普通 action。
- UI 通过 selector 读取所需状态，并只在选中的数据变化时重渲染；组件不直接修改 store。

## 三大原则

**单一数据源**

- 整个应用程序的 state 被存储在一颗 object tree 中，并且这个 object tree 只存储在一个 store 中
- Redux 并没有强制让我们不能创建多个 Store，但是那样做并不利于数据的维护
- 单一的数据源可以让整个应用程序的 state 变得方便维护、追踪、修改

**State 是只读的**

- 唯一修改 State 的方法一定是触发 action，不要试图在其他地方通过任何的方式来修改 State
- 这样就确保了 View 或网络请求都不能直接修改 state，它们只能通过 action 来描述自己想要如何修改 state
- 这样可以将同步状态更新集中处理，并按 dispatch 顺序执行；异步请求仍需通过取消、请求标识或结果校验处理竞态问题

**使用纯函数来执行修改**

- 通过 reducer 将旧 state 和 actions 联系在一起，并且返回一个新的 State
- 随着应用程序的复杂度增加，我们可以将 reducer 拆分成多个小的 reducers，分别操作不同 state tree 的一部分
- 但是所有的 reducer 都应该是纯函数，不能产生任何的副作用

## Redux 结构划分

- 创建store/index.js文件
- 创建store/reducer.js文件
- 创建store/actionCreators.js文件
- 创建store/constants.js文件

![image-20221214094925090](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214094925090.png)

## 图

![image-20221214094906375](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214094906375.png)



## 页面中使用 redux

![image-20221214110301614](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214110301614.png)

## react-redux

**Redux 和 React 没有直接的关系，你完全可以在 React、Angular、Ember、jQuery 或 vanilla JavaScript 中使用 Redux**



## 页面中使用 react-redux

![image-20221214110009978](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214110009978.png)

## 异步操作 redux-thunk

**Redux 中如何进行异步操作？**

- 中间件（Middleware）

**Redux 也引入了中间件（Middleware）的概念：**

- 这个中间件的目的是在 dispatch 的 action 和最终达到的 reducer 之间，扩展一些自己的代码
- 比如日志记录、调用异步接口、添加代码调试功能等等

![image-20221216090852993](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221216090852993.png)

**Redux Thunk 是如何做到让我们可以发送异步的请求呢？**

- 我们知道，默认情况下的 dispatch(action)，action 需要是一个 JavaScript 的对象
- Redux Thunk 可以让 dispatch(action 函数)，action 可以是一个函数
- 该函数会被调用，并且会传给这个函数一个 dispatch 函数和 getState 函数
  - dispatch 函数用于我们之后再次派发 action
  - getState 函数考虑到我们之后的一些操作需要依赖原来的状态，用于让我们可以获取之前的一些状态

![image-20221214153720855](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214153720855.png)

![image-20221214153919052](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214153919052.png)

**增加 Redux DevTools** 

```js
import { createStore, applyMiddleware, compose } from 'redux'
import reducer from './reducer'
import reduxThunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true }) || compose
const store = createStore(reducer, composeEnhancers(applyMiddleware(reduxThunk)))
```

**Redux Saga**

saga 中间件使用了 ES6 的 generator 语法

```js
function *foo() {
  console.log("111111");
  yield "Hello";
  console.log("222222");
  yield "World";
  console.log("333333");
}

// 调用一次next()是消耗一次迭代器
iterator.next(); // {value: "Hello", done: false}
// 打印111111
iterator.next(); // {value: "World", done: false}
// 打印222222
iterator.next(); // {value: undefined, done: true}
// 打印333333
```

集成 Redux Saga

```js
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createSagaMiddleware from 'redux-saga'
import reducer from './reducer.js'
import mySaga from './saga'

// 通过createSagaMiddleware函数来创建saga中间件
const sagaMiddleware = createSagaMiddleware()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({ trace: true }) || compose

// 通过applyMiddleware来结合多个Middleware, 返回一个enhancer
const enhancer = composeEnhancers(applyMiddleware(thunkMiddleware, sagaMiddleware))
// 将enhancer作为第二个参数传入到createStore中
const store = createStore(reducer, enhancer)

// 必须启动saga中间件，并且传入其要监听的generator
sagaMiddleware.run(mySaga)

export default store
```

- takeEvery：可以传入多个监听的 actionType，每一个都可以被执行（对应有一个 takeLatest，会取消前面的）
- put：在saga中派发 action 不再是通过 dispatch，而是通过 put
- all：可以在 yield 的时候 put 多个 action

```jsx
import { takeEvery, put, all } from 'redux-saga/effects'
import axios from 'axios'
import { FETCH_HOME_MULTIDATA } from './constants'
import { changeBannersAction, changeRecommendsAction } from './actionCreators'

function* fetchHomeMultidata() {
  const res = yield axios.get('http://123.207.32.32:8000/home/multidata')
  console.log(res)
  const data = res.data.data
  yield all([
    put(changeBannersAction(data.banner.list)),
    put(changeRecommendsAction(data.recommend.list)),
  ])
}

function* mySaga() {
  yield takeEvery(FETCH_HOME_MULTIDATA, fetchHomeMultidata)
}

export default mySaga
```

## Reducer 文件拆分

![image-20221214161058921](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214161058921.png)

**combineReducers 函数**

- **Redux 给我们提供了一个 combineReducers 函数可以方便的让我们对多个 reducer 进行合并**

![image-20221214161407961](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214161407961.png)

**combineReducers 是如何实现的呢？**

- 事实上，它也是将我们传入的 reducers 合并到一个对象中，最终返回一个 combination 的函数（相当于我们之前的 reducer 函数了）
- 在执行 combination 函数的过程中，它会通过判断前后返回的数据是否相同来决定返回之前的 state 还是新的 state
- Store 会在 dispatch 后通知订阅者；UI 层应通过 selector 的结果比较，避免无关状态变化引发重渲染

```js
function reducer(state = {}, action) {
  return {
    counter: counterReducer(state.counter, action),
    home: homeReducer(state.home, action),
    user: userReducer(state.user, action),
  }
}
```

## Redux Toolkit

**Redux Toolkit 是官方推荐的编写 Redux 逻辑的方法**

- 此时应该已经发现，Redux 的编写逻辑过于的繁琐和麻烦
- 并且代码通常分拆在多个文件中（虽然也可以放到一个文件管理，但是代码量过多，不利于管理）

## configureStore

**Redux Toolkit 的核心 API 主要包括：**

- configureStore：包装 createStore 以提供简化的配置选项和良好的默认值。它可以自动组合你的 slice reducer，添加你提供的任何 Redux 中间件，默认包含 Redux Thunk，并启用 Redux DevTools Extension
- createSlice：接收切片名称、初始状态和 reducer 配置，并自动生成对应的 action creator 与 reducer
- createAsyncThunk：接收 action 类型前缀和返回 Promise 的函数，并生成 `pending`、`fulfilled`、`rejected` 三类 action

![image-20221214164322621](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214164322621.png)

## createSlice

**createSlice 主要包含如下几个参数：**

name：用户标记 slice 的名称

- 在之后的 Redux DevTools 中会显示对应的名词

initialState：初始化值

- 第一次初始化时的值

reducers：相当于之前的 reducer 函数

- 对象类型，并且可以添加很多的函数
- 函数类似于 redux 原来 reducer 中的一个 case 语句；
- 函数的参数：
  - 参数一：state
  - 参数二：调用这个 action 时，传递的 action 参数

**createSlice 返回值是一个对象，包含所有的 actions**

![image-20221214164253407](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221214164253407.png)

## 异步操作

**我们通过 Redux Thunk 中间件让 dispatch 中可以进行异步操作**

- **Redux Toolkit 默认已经给我们集成了 Thunk 相关的功能：createAsyncThunk**

**当 createAsyncThunk 创建出来的 action 被 dispatch 时，会存在三种状态：**

- pending：action 被发出，但是还没有最终的结果
- fulfilled：获取到最终的结果（有返回值的结果）
- rejected：执行过程中有错误或者抛出了异常

![image-20221215102830153](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221215102830153.png)

**extraReducers 还可以传入一个函数，函数接受一个 builder 参数**

- 我们可以向 builder 中添加 case 来监听异步操作的结果

![image-20221215103216116](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221215103216116.png)

当然也可以不使用 extraReducers 直接 dispatch

![image-20221215103417166](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221215103417166.png)

## 数据不可变

**在前面我们经常会进行浅拷贝来完成某些操作，但是浅拷贝事实上也是存在问题的：**

- 比如过大的对象，进行浅拷贝也会造成性能的浪费
- 比如浅拷贝后的对象，在深层改变时，依然会对之前的对象产生影响

**Redux Toolkit 底层使用 Immer，帮助 reducer 以更接近“可变写法”的方式生成不可变更新。**

**为了节约内存，又出现了一个新的算法：Persistent Data Structure（持久化数据结构或一致性数据结构）**

- 用一种数据结构来保存数据
- 当数据被修改时，会返回一个对象，但是新的对象会尽可能的利用之前的数据结构而不会对内存造成浪费

> [https://mp.weixin.qq.com/s/hfeCDCcodBCGS5GpedxCGg](https://mp.weixin.qq.com/s/hfeCDCcodBCGS5GpedxCGg)

![640 (613×575)](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/640.gif)

## 实现原理

## connect 函数实现

connect 函数本身接受两个参数：

- 参数一：里面存放 `component` 希望使用到的 `State` 属性
- 参数二：里面存放 `component` 希望使用到的 `dispatch`动作

这个 connect 函数有一个返回值，是一个高阶组件：

- 在 `constructor` 中的 state 中保存一下我们需要获取的状态
- 在 `componentDidMount `中订阅 store 中数据的变化，并且执行  `setState` 操作
- 在 `componentWillUnmount`  中需要取消订阅
- 在 `render `函数中返回传入的 `WrappedComponent`，并且将所有的状态映射到其 `props` 中
- 这个高阶组件接受一个组件作为参数，返回一个 class 组件

如果依赖导入的 store

- 如果我们将其封装成一个独立的库，需要依赖用于创建的 store，我们应该如何去获取呢
- 正确的做法是我们提供一个 Provider，Provider 来自于我们创建的 Context，让用户将 store 传入到 value 中即可

```js
import { createContext } from 'react'

export const StoreContext = createContext()
```

```jsx
import React, { PureComponent } from 'react'
import { StoreContext } from './context'

export default function connect(mapStateToProps, mapDispatchToProps) {
  return function (WrappedComponent) {
    class ConnectCpn extends PureComponent {
      constructor(props, context) {
        super(props)
        this.state = {
          storeState: mapStateToProps(context.getState()),
        }
      }
      componentDidMount() {
        this.unsubscribe = this.context.subscribe(() => {
          this.setState({
            storeState: mapStateToProps(this.context.getState()),
          })
        })
      }
      componentWillUnmount() {
        this.unsubscribe()
      }
      render() {
        return (
          <WrappedComponent
            {...this.props}
            {...mapStateToProps(this.context.getState())}
            {...mapDispatchToProps(this.context.dispatch)}
          />
        )
      }
    }
    ConnectCpn.contextType = StoreContext
    return ConnectCpn
  }
}
```

## 中间件实现

**打印日志需求**

```js
function log(store) {
  const next = store.dispatch
  function dispatchAndLog(action) {
    console.log('当前派发的action:', action)
    next(action)
    console.log('派发之后的结果:', store.getState())
  }
  store.dispatch = dispatchAndLog
}
```

**thunk 需求**

Redux 中利用一个中间件 Redux Thunk 可以让我们的 dispatch 不再只是处理对象，并且可以处理函数

```js
function thunk(store) {
  const next = store.dispatch
  function dispatchThunk(action) {
    if (typeof action === 'function') {
      action(store.dispatch, store.getState)
    } else {
      next(action)
    }
  }
  store.dispatch = dispatchThunk
}
```

**合并中间件**

```js
function applyMiddleware(store, ...fns) {
  fns.forEach(fn => {
    fn(store)
  })
}
```

