# Vue3+TypeScript

## 为什么要学习 Vue3

> [Vue3+TS系统学习一 - 邂逅Vue3和TypeScript](https://mp.weixin.qq.com/s?__biz=Mzg5MDAzNzkwNA==&mid=2247484667&idx=1&sn=a1fda6ea5a1c76c6d03c1c6a78936f7d&chksm=cfe3f704f8947e129de78e6353492c7dd5d9154ed2d141c38e91dea737ff8ab80da5d861f682&scene=178&cur_album_id=1913817193960488964#rd)

在 2020 年的 9 月 19 日，万众期待的 Vue3 终于发布了正式版，命名为 **One Piece**

- 它也带来了很多新的特性：**更好的性能、更小的包体积、更好的 TypeScript 集成，更优秀的 API 设计**



**源码通过 monorepo 的形式来管理源代码**

- mono：单个的意思；repo： repository仓库的简写
- 主要是将许多项目的代码存储在同一个 respository 中

我们来看下面的图片，对比 vue2 和 vue3 源码的不同管理方式：

- Vue2.x 是将所有的源代码编写到了 src 的目录下，并且依照不同的功能划分成了多个文件夹，比如 compiler 是和模板编译相关的，core 是通用的核心运行时代码等

- Vue3.x 是将不同的模块拆分到不同 packages 下的子目录中，并且每一个模块都可以看成是一个独立的项目

- - 这个独立的项目可以有自己的类型定义、自己的 API、自己的测试用例
  - 这样每一个模块的划分更加清晰，开发者更容易阅读、理解、修改模块的代码，也提供了代码的可维护性、可扩展性
  - 并且每一个模块可以单独的进行编译，而无需从大量的 src 代码中抽离出一部分代码

![image-20220622110847315](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20220622110847315.png)

**源码使用 TypeScript 来进行重写**

- 在 Vue2.x 的时候，Vue 使用 Flow 来进行类型检测，但是 Flow 有很多的复杂场景是类型的支持并不是非常友好
- 在 Vue3.x 的时候，Vue 的源码全部使用 TypeScript 来进行重构，并且 Vue 本身对 TypeScript 支持也更好了

**使用 Proxy 进行数据劫持**

- 在 Vue2.x 的时候，使用 `Object.defineProperty` 来劫持数据的数据的 `getter` 和 `setter` 方法的

  这种方式一直存在一个缺陷就是当给对象添加或者删除属性时，是无法劫持和监听的

  在 Vue2.x 不得不提供一些特殊的 API，比如 `$set`、`$delete` 事实上都是一些 hack 方法，也增加了开发者学习新的 API 的成本

- 在 Vue3.x 的时候，使用 `Proxy` 来实现数据劫持

**删除了一些不必要的 API**

- 移除了实例上的 `$on`、`$off` 和 `$once`
- 移除了一些新特性：如 `filter`、内联模板等

**编译阶段的优化**

- 生成 `Block Tree`、`slot` 编译优化、`diff` 算法优化

**由 Options API 到 Composition API**

- 在 Vue2.x 时，我们会用过 Options API 来描述组件对象

- Options API 包括 `data`、`props`、`methods`、`computed`、生命周期等选项

- 存在比较大的问题是多个逻辑可能是在不同的地方

  比如 `created` 中会使用某一个 `method` 来修改 `data` 的数据，代码内聚性非常差

- Composition API 可以将相关联的代码放到同一处进行处理，而不需要在多个 Options 之间寻找

**Hook 函数增加代码复用性**

- 在 Vue2.x 时，我们通过 mixins 在多个组件之间共享逻辑

  但是有一个很大的缺陷就是 mixins 也是由一大堆的 Options 组成的，并且多个 mixins 会存在命名冲突问题

- 在 Vue3.x 中，我们可以通过 Hook 函数，来将一部分独立的逻辑抽取出去，并且它们还可以做到是响应式的

## 为什么学习 TypeScript

其实上由于各种历史因素，JavaScript 语言本身存在很多的缺点

- 比如 ES5 以及之前的使用的 var 关键字关于作用域的问题
- 比如最初 JavaScript 设计的数组类型并不是连续的内存空间
- 比如直到今天 JavaScript 也没有加入类型检测这一机制
  - 比如当我们去实现一个核心类库时，如果没有类型约束，那么需要对别人传入的参数进行各种验证来保证我们代码的健壮性
  - 比如我们去调用别人的函数，对方没有对函数进行任何的注释，我们只能去看里面的逻辑来理解这个函数需要传入什么参数，返回值是什么类型

编程开发中我们有一个共识：**错误出现的越早越好**

- 能在 **写代码的时候** 发现错误，就不要在 **代码编译时** 再发现（IDE 的优势就是在代码编写过程中帮助我们发现错误）
- 能在 **代码编译期间** 发现错误，就不要在 **代码运行期间** 再发现（类型检测就可以很好的帮助我们做到这一点）
- 能在开发阶段发现错误，就不要在测试期间发现错误，能在测试期间发现错误，就不要在上线后发现错误