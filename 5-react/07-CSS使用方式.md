# CSS使用方式

## 组件化下的 CSS

- 而 CSS 的设计就不是为组件化而生的，所以在目前组件化的框架中都在需要一种合适的 CSS 解决方案

在组件化中选择合适的 CSS 解决方案应该符合以下条件：

- 可以编写局部 css：css 具备自己的具备作用域，不会随意污染其他组件内的元素
- 可以编写动态的 css：可以获取当前组件的一些状态，根据状态的变化生成不同的 css 样式
- 支持所有的 css 特性：伪类、动画、媒体查询等
- 编写起来简洁方便、最好符合一贯的 css 风格特点

Vue 做的要好于 React：

- Vue 通过在 .vue 文件中编写 `<style><style>` 标签来编写自己的样式
- 通过是否添加 scoped 属性来决定编写的样式是全局有效还是局部有效
- 通过 lang 属性来设置你喜欢的 less、sass 等预处理器
- 通过内联样式风格的方式来根据最新状态设置和改变 css

相比而言，React 官方并没有给出在React中统一的样式风格：

- 由此，从普通的 `css`，到 `css modules`，再到 `css in js`，有几十种不同的解决方案，上百个不同的库

## 内联样式

内联样式是官方推荐的一种 css 样式的写法：

- style 接受一个采用小驼峰命名属性的 JavaScript 对象，，而不是 CSS 字符串
- 并且可以引用 state 中的状态来设置相关的样式

内联样式的优点:

1. 内联样式, 样式之间不会有冲突
2. 可以动态获取当前 state 中的状态

内联样式的缺点：

1. 写法上都需要使用驼峰标识
2. 某些样式没有提示
3. 大量的样式, 代码混乱
4. 某些样式无法编写(比如伪类/伪元素)

```jsx
import React, { PureComponent } from 'react'

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      titleSize: 30
    }
  }
  render() {
    const { titleSize } = this.state

    return (
      <div>
        <h2 style={{ color: 'red' }}>我是标题</h2>
        <p style={{ color: 'blue', fontSize: `${titleSize}px` }}>我是内容</p>
      </div>
    )
  }
}
```

## 普通的 css

 普通的 css 我们通常会编写到一个单独的文件，之后再进行引入

- 如果我们按照普通的网页标准去编写，那么也不会有太大的问题
- 但是组件化开发中我们总是希望组件是一个独立的模块，即便是样式也只是在自己内部生效，不会相互影响
- 但是普通的 css 都属于全局的 css，样式之间会相互影响

这种编写方式最大的问题是样式之间会相互层叠掉

```jsx
import React, { PureComponent } from 'react'
import './App.css'
import Home from './home/Home'
import Profile from './profile/Profile'

export class App extends PureComponent {
  render() {
    return (
      <div>
        <h2 className='title'>我是标题</h2>
        <p className='content'>我是内容</p>
        <Home />
        <Profile />
      </div>
    )
  }
}
```

## css modules

css modules 并不是 React 特有的解决方案，而是所有使用了类似于 **webpack 配置的环境**下都可以使用的

- 如果在其他项目中使用它，那么我们需要自己来进行配置，比如配置 `webpack.config.js` 中的 `modules: true` 等

React 的脚手架已经内置了 css modules 的配置

- `.css/.less/.scss` 等样式文件都需要修改成 `.module.css/.module.less/.module.scss` 等
- 之后就可以引用并且进行使用了

css modules 确实解决了局部作用域的问题，也是很多人喜欢在 React 中使用的一种方案

但是这种方案也有自己的缺陷：

- 引用的类名，**不能使用连接符(.home-title)**，在 JavaScript 中是不识别的
- 所有的 **className 都必须使用 {style.className} 的形式**来编写
- **不方便动态来修改某些样式，依然需要使用内联样式的方式**

```jsx
import React, { PureComponent } from 'react'
import Home from './home/Home'
import Profile from './profile/Profile'
import appStyle from './App.module.css'

export class App extends PureComponent {
  render() {
    return (
      <div>
        <h2 className={appStyle.title}>我是标题</h2>
        <p className={appStyle.content}>我是内容</p>
        <Home />
        <Profile />
      </div>
    )
  }
}
```

## 使用 less

安装 craco、less

```bash
$ npm i @craco/craco craco-less
```

在 `package.json` 同级目录下创建一个 `craco.config.js` 文件

```js
const CracoLessPlugin = require('craco-less')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true
          }
        }
      }
    }
  ]
}
```

## CSS in JS

- "CSS-in-JS" 是指一种模式，其中 CSS 由 JavaScript 生成而不是在外部文件中定义
- 注意此功能并不是 React 的一部分，而是由第三方库提供
- React 对样式如何定义并没有明确态度

在传统的前端开发中，我们通常会将结构（HTML）、样式（CSS）、逻辑（JavaScript）进行分离。

- 但是在前面的学习中，我们就提到过，React 的思想中认为逻辑本身和 UI 是无法分离的，所以才会有了 JSX 的语法
- 样式呢？样式也是属于 UI 的一部分
- 事实上 CSS-in-JS 的模式就是一种将样式（CSS）也写入到 JavaScript 中的方式，并且可以方便的使用 JavaScript 的状态
- 所以 React 有被人称之为 All in JS

### 标签模板字符串

模板字符串还有另外一种用法：标签模板字符串（Tagged Template Literals）

我们一起来看一个普通的 JavaScript 的函数：

- 正常情况下，我们都是通过 函数名() 方式来进行调用的，其实函数还有另外一种调用方式：

如果我们在调用的时候插入其他的变量：

- 模板字符串被拆分了
- 第一个元素是数组，是被模块字符串拆分的字符串组合
- 后面的元素是一个个模块字符串传入的内容

在 styled component中，就是通过这种方式来解析模块字符串，最终生成我们想要的样式的

```js
// 1.模板字符串基本使用
const name = 'cat'
const age = 18
const str = `my name is ${name}, age is ${age}`
console.log(str) // my name is cat, age is 18

// 2.标签模板字符串的使用
function foo(...args) {
  console.log(args)
}
foo(name, age) // [ 'cat', 18 ]
foo`my name is ${name}, age is ${age}` // [ [ 'my name is ', ', age is ', '' ], 'cat', 18 ]
```

styled-components 就用到了标签模板字符串

```js
import styled from 'styled-components'

export const AppWrapper = styled.div`
  .section {
    border: 1px solid red;

    .title {
      font-size: 30px;
      color: blue;

      &:hover {
        background-color: purple;
      }
    }
  }

  .footer {
    border: 1px solid orange;
  }
`
```

### styled-components

批评声音虽然有，但是在我们看来很多优秀的 CSS-in-JS 的库依然非常强大、方便：

- CSS-in-JS 通过 JavaScript 来为 CSS 赋予一些能力，包括类似于 CSS 预处理器一样的样式嵌套、函数定义、逻辑复用、动态修改状态等等
- 虽然 CSS 预处理器也具备某些能力，但是获取动态状态依然是一个不好处理的点
- 所以，目前可以说 CSS-in-JS 是 React 编写 CSS 最为受欢迎的一种解决方案

目前比较流行的 CSS-in-JS 的库有哪些呢？

- styled-components
- emotion
- glamorous

> [https://github.com/styled-components/styled-components](https://github.com/styled-components/styled-components)

```bash
$ npm i styled-components
```

**styled-components 的本质是通过函数的调用，最终创建出一个组件**

- 这个组件会被自动添加上一个不重复的 class
- styled-components 会给该 class 添加相关的样式

它支持类似于 CSS 预处理器一样的样式嵌套：

- 支持直接子代选择器或后代选择器，并且直接编写样式
- 可以通过 & 符号获取当前元素
- 直接伪类选择器、伪元素等

`App.jsx`

```jsx
import React, { PureComponent } from 'react'
import { AppWrapper, SectionWrapper } from './style'
import Home from './Home'

export class App extends PureComponent {
  constructor() {
    super()
    this.state = {
      size: 60,
      color: 'yellow'
    }
  }
  render() {
    const { size, color } = this.state

    return (
      <AppWrapper>
        <SectionWrapper size={size} color={color}>
          <div className='section'>
            <h2 className='title'>我是标题</h2>
            <p className='content'>我是内容</p>
          </div>

          <Home />

          <div className='footer'>
            <p>免责声明</p>
          </div>
        </SectionWrapper>
      </AppWrapper>
    )
  }
}
```

`style.js`

props 可以传递给 styled 组件

- 获取 props 需要通过 `${}` 传入一个插值函数，props 会作为该函数的参数
- 这种方式可以有效的解决动态样式的问题

```js
import styled from 'styled-components'
import { primaryColor, largeSize } from './style/variables'

// 1.基本使用
export const AppWrapper = styled.div`
  .footer {
    border: 1px solid orange;
  }
`

// 2.子元素单独抽取到一个样式组件
// 3.可以接受外部传入的 props
// 4.可以通过 attrs 给标签模板字符串中提供的属性
// 5.从一个单独的文件中引入变量
export const SectionWrapper = styled.div.attrs(props => ({
  color: props.color || 'blue'
}))`
  border: 1px solid red;

  .title {
    font-size: ${props => props.size}px;
    color: ${props => props.color};

    &:hover {
      background-color: purple;
    }
  }

  .content {
    font-size: ${largeSize}px;
    color: ${primaryColor};
  }
`
```

`Home/index.jsx`

```jsx
import React, { PureComponent } from 'react'
import { HomeWrapper } from './style'

export class Home extends PureComponent {
  render() {
    return (
      <HomeWrapper>
        <div className='top'>
          <div className='banner'>BannerContent</div>
        </div>
        <div className='bottom'>
          <div className='header'>商品列表</div>
          <ul className='product-list'>
            <li className='item'>商品列表1</li>
            <li className='item'>商品列表2</li>
            <li className='item'>商品列表3</li>
          </ul>
        </div>
      </HomeWrapper>
    )
  }
}
```

`Home/style.jsx`

- 支持样式的继承

```js
import styled from 'styled-components'

const HYButton = styled.button`
  border: 1px solid red;
  border-radius: 5px;
`

export const HYButtonWrapper = styled(HYButton)`
  background-color: #0f0;
  color: #fff;
`

export const HomeWrapper = styled.div`
  .top {
    .banner {
      color: red;
    }
  }

  .bottom {
    .header {
      color: ${props => props.theme.color};
      font-size: ${props => props.theme.size};
    }

    .product-list {
      .item {
        color: blue;
      }
    }
  }
`
```

## 添加 class

vue 中添加 class

![image-20221123104352663](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123104352663.png)

React 中添加 class

![image-20221123104516456](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123104516456.png)

我们还可以借助一个第三方库：classnames

![image-20221123105354282](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20221123105354282.png)

```jsx
import React, { PureComponent } from 'react'
import classNames from 'classnames'

export class App extends PureComponent {
  constructor() {
    super()

    this.state = {
      isbbb: true,
      isccc: true
    }
  }

  render() {
    const { isbbb, isccc } = this.state

    const classList = ['aaa']
    if (isbbb) classList.push('bbb')
    if (isccc) classList.push('ccc')
    const classname = classList.join(' ')

    return (
      <div>
        <h2 className={`aaa ${isbbb ? 'bbb' : ''} ${isccc ? 'ccc' : ''}`}>哈哈哈</h2>
        <h2 className={classname}>呵呵呵</h2>

        <h2 className={classNames('aaa', { bbb: isbbb, ccc: isccc })}>嘿嘿嘿</h2>
        <h2 className={classNames(['aaa', { bbb: isbbb, ccc: isccc }])}>嘻嘻嘻</h2>
      </div>
    )
  }
}
```

