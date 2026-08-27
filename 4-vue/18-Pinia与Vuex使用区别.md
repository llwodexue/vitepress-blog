# Pinia 与 Vuex 使用区别

## Pinia 优势与边界

1. **Pinia 是 Vue 官方推荐的状态管理方案**：适合跨组件、跨页面共享的业务状态；组件内部短生命周期状态仍应留在组件中。

2. **支持 Vue 2 和 Vue 3**

   - Options API 和 Composition API 都可以使用。

3. **没有 Mutation**：Store 由 `state`、`getters` 和 `actions` 组成；`actions` 可以同步或异步地组织业务更新。

4. **按领域拆分 Store**：不再维护嵌套模块树，每个 Store 以唯一 id 作为命名空间。

5. **TypeScript 类型推导友好**

6. **结构更适合按需引用**：每个 Store 可独立定义和导入，但是否进入独立 chunk 仍由路由懒加载和打包器的依赖图决定。

## 状态与依赖边界

- 用 Store 存放需要共享、缓存或跨路由保留的业务状态；可由现有状态推导出的值优先使用 getter。
- 通过 action 表达有业务含义的状态变更。简单交互可直接修改状态，但不要把跨领域流程散落在多个组件中。
- Store 可以直接使用其他 Store；依赖方向应清晰，避免相互调用形成循环依赖。

### 关于按需加载

假设项目有 `user`、`app`、`tab` 三个 Store，首页只使用 `app`，个人中心使用 `user` 和 `tab`：

- Pinia 的独立 Store 便于只在需要它的页面导入；配合路由懒加载，未访问页面相关的 Store 可以不进入首屏资源。
- 这不是 Pinia 自动保证的优化。只要在入口或公共模块中静态导入所有 Store，它们仍可能进入同一 chunk；Vuex 也可以通过动态模块或动态导入实现按需加载。

## 从 Vuex 迁移到 Pinia

> 官网：[https://pinia.vuejs.org/](https://pinia.vuejs.org/)
>
> 从 Vuex 迁移：[Migrating from Vuex ≤4](https://pinia.vuejs.org/cookbook/migration-vuex.html)

其实在使用上区别不大，但是有几点需要改变：

- 如下示例为：Vuex4.x 和 Pinia 代码

### 不再使用 mutations

Vuex 如何使用 `actions` ？Pinia 这里做了两点改变

1. 第一个参数 `context` 被移除

   ```js
   // Vuex index.js
   import { createStore } from 'vuex'
   import appModule from './modules/app'
   const store = createStore({
     modules: {
       appModule
     }
   })
   
   // Vuex modules/app.js
   export default {
     namespaced: true,
     state: {
       count: 0
     },
     mutations: {
       increment (state, num) {
         state.count += num
       }
     },
     actions: {
       increment (context, num) {
         // 或是直接把 context 里的 commit 解构出来
         context.commit('increment', num)
       }
     }
   }
   ```

2. 不再使用 `dispatch` 调用 `actions`

   ```js
   // 组件中
   this.$store.dispatch('app/increment', 2)
   ```

Pinia 如何使用 `actions`？

- 在 `actions` 里直接使用 this 获取到 `state` 的值

```js
// stores/app.js
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    count: 0
  }),
  actions: {
    increment (num) {
      this.count += num
    }
  }
})

// 组件的 <script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

function increment () {
  appStore.increment(2)
}
```

### 模块改为领域 Store

```shell
# Vuex
src
└── store
    ├── index.js 
    └── modules
        ├── module1.js
        └── nested
            ├── index.js
            ├── module2.js
            └── module3.js

# Pinia
src
└── stores
    ├── index.js
    ├── module1.js
    ├── nested-module2.js
    ├── nested-module3.js
    └── nested.js
```

Vuex 通常从一个根 Store 组织模块，最终形成树形结构。

Pinia 的模块根就是 Store。Store 在应用初始化 Pinia 后按需定义和使用，整体保持扁平；目录只是组织方式，真正需要唯一的是 Store id。


```js
const useAppStore = defineStore('app', { /* ... */ })
```
- 注意：Pinia 每个 Store 都需要一个**唯一 id**，其作用类似 Vuex 的命名空间（`namespaced: true`）。
```js
import appModule from './modules/app'
const store = createStore({
  modules: {
    appModule
  }
})

// Vuex modules/app.js
export default {
  namespaced: true
}
```


### getters 用法改变

Vuex 里一个 `getters` 想使用其他 `getters`，需要借助其第二个参数

- 如下示例为：统计所有书折扣后的总价钱

```js
const useBookStore = createStore({
  state() {
    return {
      books: [
        { name: 'book1', count: 3, price: 10 },
        { name: 'book2', count: 1, price: 20 },
        { name: 'book3', count: 2, price: 15 }
      ],
      discount: 0.9
    }
  },
  getters: {
    totalPrice(state, getters) {
      const totalPrice = state.books.reduce((acc, cur) => {
        return (acc += cur.count * cur.price)
      }, 0)
      return totalPrice * getters.currentDiscount
    },
    currentDiscount(state) {
      return state.discount
    }
  }
})
```

Pinia 去掉了第二个参数，可以在 getter 中使用 `this` 访问其他 getter：

```js
import { defineStore } from 'pinia'

export const useBookStore = defineStore('book', {
  state: () => ({
    books: [
      { name: 'book1', count: 3, price: 10 },
      { name: 'book2', count: 1, price: 20 },
      { name: 'book3', count: 2, price: 15 }
    ],
    discount: 0.9
  }),
  getters: {
    totalPrice(state) {
      const totalPrice = state.books.reduce((acc, cur) => {
        return (acc += cur.count * cur.price)
      }, 0)
      return totalPrice * this.currentDiscount
    },
    currentDiscount(state) {
      return state.discount
    }
  }
})
```

这里补充一点：getter 本身不直接接收参数；需要参数时可返回一个闭包。将以下 getter 加入上面的 Pinia Store，即可统计数量大于指定值的书的折后总价：

```js
getters: {
  totalPriceGreaterN: state => n => {
    const totalPrice = state.books.reduce((total, book) => {
      return book.count > n ? total + book.count * book.price : total
    }, 0)

    return totalPrice * state.discount
  }
}
```

在 Pinia 中，将返回函数的 getter 当作方法调用即可：

```vue
<script setup>
import { useBookStore } from '@/stores/book'

const bookStore = useBookStore()
</script>

<template>
  <h2>{{ bookStore.totalPriceGreaterN(2) }}</h2>
</template>
```
