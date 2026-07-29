# vue2.6升级vue2.7（panjiachen升级指南）

## vue2.6升级vue2.7

> [vue2.7升级指南](https://v2.cn.vuejs.org/v2/guide/migration-vue-2-7.html#升级指南)

之前的架子使用的是 [panjiachen](https://github.com/PanJiaChen/vue-element-admin)，使用的是 vue2.6.14，现在升级为 vue2.7.x

### 升级@vue/cli

**vue upgrade**

这里推荐使用 `vue upgrade` 命令自动升级

```bash
# 确保安装全局 @vue/cli
$ npm install -g @vue/cli
$ vue upgrade

WARN  There are uncommitted changes in the current repository, it's recommended to commit or stash them first.
? Still proceed? Yes
✔  Gathering package information...
  Name                    Installed       Wanted          Latest          Command to upgrade
  @vue/cli-service        4.4.4           4.4.4           5.0.8           vue upgrade @vue/cli-service
  @vue/cli-plugin-babel   4.4.4           4.4.4           5.0.8           vue upgrade @vue/cli-plugin-babel
  @vue/cli-plugin-eslint  4.4.4           4.4.4           5.0.8           vue upgrade @vue/cli-plugin-eslint
? Continue to upgrade these plugins? Yes
Upgrading @vue/cli-service from 4.4.4 to 5.0.8
🚀  Running migrator of @vue/cli-service
✔  Successfully invoked migrator for plugin: @vue/cli-service
Upgrading @vue/cli-plugin-babel from 4.4.4 to 5.0.8
🚀  Running migrator of @vue/cli-plugin-babel
✔  Successfully invoked migrator for plugin: @vue/cli-plugin-babel
Upgrading @vue/cli-plugin-eslint from 4.4.4 to 5.0.8
🚀  Running migrator of @vue/cli-plugin-eslint
📦  Installing additional dependencies...
✔  Successfully invoked migrator for plugin: @vue/cli-plugin-eslint
 eslint  ESLint upgraded from v5. to v7
```

这里发现有 3 个文件发生了修改，`babel.config.js` 实际上没有发生改变

![image-20230810101857391](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20230810101857391.png)

**vue upgrade 帮你做的事情**

如果不这么做，需要进行如下操作，十分麻烦。如果依赖冲突，可以使用 `npm i --legacy-peer-deps` 进行安装

1. 将 `@vue/cli-xxx` 依赖升级至最新版本范围，这里我打算使用 vue-cli5

   - v4 升级至 `~4.5.18`
   - v5 升级至 `~5.0.6`

   ```bash
   $ npm i @vue/cli-plugin-babel@5 @vue/cli-plugin-eslint@5 @vue/cli-service@5 -D
   
   - "@vue/cli-plugin-babel": "4.4.4"
   - "@vue/cli-plugin-eslint": "4.4.4"
   - "@vue/cli-service": "4.4.4"
   + "@vue/cli-plugin-babel": "^5.0.8"
   + "@vue/cli-plugin-eslint": "^5.0.8"
   + "@vue/cli-service": "^5.0.8"
   ```

2. 升级 `eslint`，并安装 `@babel/core`

   ```bash
   $ npm i eslint@7 eslint-plugin-vue@8 -D
   - "eslint": "6.7.2"
   - "eslint-plugin-vue": "6.2.2"
   + "eslint": "^7.32.0"
   + "eslint-plugin-vue": "^8.0.3"
   + "@babel/core": "^7.12.16"
   ```

   还需要升级 `eslint` 对应的 parser，安装 `@babel/eslint-parser`

   ```bash
   $ npm un babel-eslint
   $ npm i @babel/eslint-parser@7 @babel/core@7
   
   - "babel-eslint": "10.1.0"
   + "@babel/eslint-parser": "^7.12.16"
   ```

   之后修改 `.eslintrc.js` 对应的 parser

   ```js
   module.exports = {
parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
        babelOptions: {
          configFile: './babel.config.js'
        }
      }
   }
   ```

### 解决@vue/cli报错

升级完 vue-cli 需要解决一下 vue-cli 语法升级报的错，需要修改 `vue.config.js`

1. 之前使用 JSDoc 的形式可以改为 `defineConfig` 帮手函数

   ```js
   /**
    * @type {import('@vue/cli-service').ProjectOptions}
    */
   module.exports = { }
   
   // 需要改为如下内容
   const { defineConfig } = require('@vue/cli-service')
   module.exports = defineConfig({ })
   ```

2. `devtool` 更加严格，填写之前去 webpack 官网查一下：

   [https://www.webpackjs.com/configuration/devtool/](https://www.webpackjs.com/configuration/devtool/)

   ```bash
   # 报错信息
   ValidationError: Invalid configuration object. Webpack has been initialized using a configuration object that does not match the API schema.
   	- configuration.devtool should match pattern "^(inline-|hidden-|eval-)?(nosources-)?(cheap-(module-)?)?source-map$".
   	BREAKING CHANGE since webpack 5: The devtool option is more strict.
   Please strictly follow the order of the keywords in the pattern
   ```

   比如：你写 `cheap-module-eval-source-map` 是不合法的，需要改为 `eval-cheap-module-source-map`

   ```js
   config.when(process.env.NODE_ENV === 'development', config => config.devtool('eval-cheap-module-source-map'))
   ```

3. devServer 有很多配置发生了变化,比如：

   ```js
   {
     devServer: {
       hotOnly: true
       overlay: {
         warnings: false,
         errors: true
       },
       before: require('./mock/mock-server.js'),
       disableHostCheck: true
     }
   }
   
   // 需要改为
   {
     devServer: {
       hot: "only",
       onBeforeSetupMiddleware: require('./mock/mock-server.js'),
       client: {
         overlay: {
           warnings: false,
           errors: true
         }
       },
       allowedHosts: "all"
     }
   }
   ```

   可以参考：[https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md](https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md)

   比如这里报错 'disableHostCheck' 是未知属性，就可以在这个文档中查一下，看看它改成了什么

   ```bash
   # 报错信息
   ValidationError: Invalid options object. Dev Server has been initialized using an options
   
   object that does not match the API schema.
   	- options has an unknown property 'disableHostCheck'. These properties are valid:        
   	object { allowedHosts?, bonjour?, client?, compress?, devMiddleware?, headers?, historyApiFallback?, host?, hot?, http2?, https?, ipc?, liveReload?, magicHtml?, onAfterSetupMiddleware?, onBeforeSetupMiddleware?, onListening?, open?, port?, proxy?, server?, setupExitSignals?, setupMiddlewares?, static?, watchFiles?, webSocketServer? }
   ```

4. svg 报错问题

   ```bash
   ERROR in ./src/pages/xx/icons/svg/wechat.svg
   Module build failed (from ./node_modules/svg-sprite-loader/lib/loader.js):
   Error: Cannot find module 'webpack/lib/RuleSet'
   ```

   升级 `svg-sprite-loader` 即可

   ```bash
   $ npm i svg-sprite-loader@6
   - "svg-sprite-loader": "4.1.3"
   + "svg-sprite-loader": "^6.0.11"
   ```

5. path 模块找不到问题

   ```bash
   Module not found: Error: Can't resolve 'path' in 'E:\xx\src\pages\xx\components\layout\components\Sidebar'
   
   BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
   
   This is no longer the case. Verify if you need this module and configure a polyfill for it.
   If you want to include a polyfill, you need to:
   	- add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }'
   	- install 'path-browserify'
   If you don't want to include a polyfill, you can use an empty module like this: resolve.fallback: { "path": false }
   ```

   webpack5 不再自动填充 Node 核心模块，如果你想使用的话需要从 npm 安装兼容的模块并自己包含它们。其它模块同理

   [https://webpack.js.org/configuration/resolve/#resolvefallback](https://webpack.js.org/configuration/resolve/#resolvefallback)

   ```bash
   $ npm i path-browserify -D
   + "path-browserify": "^1.0.1"
   ```

   引入即可。不过这里我尝试用链式调用的写法去写，没生效

   ```js
   {
     configureWebpack: {
       resolve: {
         fallback: {
           path: require.resolve('path-browserify')
         }
       }
     }
   }
   ```

6. npm i 报错

   可以使用 `npm i --legacy-peer-deps` 解决

   ```bash
   npm ERR! Fix the upstream dependency conflict, or retry
   npm ERR! this command with --force, or --legacy-peer-deps
   npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
   ```

   不过也要统一把对应插件的版本全部升级一遍。比如：`copy-webpack-plugin`、`html-webpack-plugin`

   - `copy-webpack-plugin@5` 对应 `webpack@4`

     - 里面的配置写法稍有变更，照着提示改下即可

   - `html-webpack-plugin@3` 对应 `webpack@4` 

   - `script-ext-html-webpack-plugin@2` 对应 `webpack@4`

     - 内联 runtime 的代码就直接删掉了

   ```bash
   $ npm i copy-webpack-plugin@11 -D
   - "copy-webpack-plugin": "5.0.5"
   + "copy-webpack-plugin": "^11.0.0"
   
   $ npm i html-webpack-plugin@5
   - "html-webpack-plugin": "3.2.0"
   + "html-webpack-plugin": "^5.5.3"
   
   $ npm un script-ext-html-webpack-plugin
   - "script-ext-html-webpack-plugin": "2.1.3"
   ```

7. css 全局变量

   需要把 `prependData` 改为 `additionalData`

   ```js
   {
     css: {
       loaderOptions: {
         sass: {
           additionalData: '@import "~@/styles/variables.scss";'
         }
       }
     }
   }
   ```

8. 多入口 plugin 异常问题（没有使用多入口的可以跳过这个问题）

   ```bash
   # 报错信息
   Error: Cannot call .tap() on a plugin that has not yet been defined. Call plugin('preload')
   ```

   可以参考：[https://cli.vuejs.org/zh/config/#pages](https://cli.vuejs.org/zh/config/#pages) 这里面的提示

   如果你试图修改 `html-webpack-plugin` 和 `preload-webpack-plugin` 插件的选项，可以使用 `vue inspect --plugins` 看看都有哪些 plugin

   ```bash
   $ npm i @vue/preload-webpack-plugin -D
   + "@vue/preload-webpack-plugin": "^2.0.0"
   ```

   之前直接使用 tap 连接即可，现在需要指定 plugin

   ```js
   Object.keys(pages).forEach(name => {
     config.plugin(`preload-${name}`).tap(() => [
       {
         rel: 'preload',
         fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
         include: 'initial'
       }
     ])
     config.plugins.delete(`prefetch-${name}`)
   })
   
   // 需要改为如下内容
   Object.keys(pages).forEach(name => {
     config.plugin(`preload-${name}`).use(require('@vue/preload-webpack-plugin'), [
       {
         rel: 'preload',
         fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
         include: 'initial'
       }
     ])
     config.plugins.delete(`prefetch-${name}`)
   })
   ```

9. sass 警告问题

   ```bash
   Deprecation Warning: Using / for division outside of calc() is deprecated and will be removed in Dart Sass 2.0.0.
   Recommendation: math.div($--tooltip-arrow-size, 2) or calc($--tooltip-arrow-size / 2)
   More info and automated migrator: https://sass-lang.com/d/slash-div
      ╷
   89 │     margin-bottom: #{$--tooltip-arrow-size / 2};
      │                      ^^^^^^^^^^^^^^^^^^^^^^^^^
      ╵
       node_modules\element-ui\packages\theme-chalk\src\popper.scss 89:22         @content
       node_modules\element-ui\packages\theme-chalk\src\mixins\mixins.scss 74:5   b()
       node_modules\element-ui\packages\theme-chalk\src\popper.scss 4:1           @import
       node_modules\element-ui\packages\theme-chalk\src\select-dropdown.scss 3:9  @import
       node_modules\element-ui\packages\theme-chalk\src\select.scss 4:9           @import
       node_modules\element-ui\packages\theme-chalk\src\pagination.scss 4:9       @import
       node_modules\element-ui\packages\theme-chalk\src\index.scss 2:9            @import
       stdin 25:9                                                                 root stylesheet
   Warning: 33 repetitive deprecation warnings omitted.
   ```

   升级 sass 版本 和 sass-loader 版本，注意里面 deep 写法也需要改变，需要改为 `::v-deep`

   ```bash
   $ npm i sass sass-loader@12
   - "sass": "1.26.2"
   - "sass-loader": "8.0.2"
   + "sass": "^1.44.0"
   + "sass-loader": "^12.6.0"
   ```

   **这个一定要解决**

   ```bash
   warning  in ./src/pages/xx/components/layout/components/Sidebar/index.vue?vue&type=script&lang=js&
   export 'default' (imported as 'variables') was not found in '@/styles/variables.scss' (module has no exports)
   ```

   因为页面里用到了 `variables.scss` 导出的变量，新版如果没有进行处理会导致页面阻塞

   - 需要将 `variables.scss` 名改为 `variables.module.scss`

10. 打包两次问题，Vue-cli5 以后你会发现会打包两次

   > [vue2 项目升级到 vue3 之后 npm run build 执行两遍打包](https://blog.csdn.net/weixin_44243061/article/details/124401155)

   ```bash
   -  Building legacy bundle for production...
   -  Building module bundle for production...
   ```

   主要是因为要兼容浏览器导致，可以在 `.browserslistrc` 里配置 `not dead` 和 `not ie 11`

   ```js
   > 1%
   last 2 versions
   not dead
   not ie 11
   ```

   再进行打包就只会打包一次

   ```bash
   -  Building for production...
   ```

11. eslint 可能会有一些警告或报错

    - 可以先整体修复一遍，之后再解决一下没办法修复的

    ```json
    {
      "scripts": {
        "lint": "eslint . --ext .html,.vue,.js,.jsx --fix"
      }
    }
    ```

### 升级vue

1. 升级 `vue` 至 2.7。同时可以将 `vue-template-compiler` 从依赖中移除

   如果你在使用 `@vue/test-utils`，那么 `vue-template-compiler` 需要保留

   ```bash
   $ npm i vue@2.7
   $ npm un vue-template-compiler
   
   - "vue": "2.6.10",
   - "vue-template-compiler": "^2.6.11",
   + "vue": "^2.7.14",
   ```

2. 这里我没有使用 vite，很多和 vite 相关的就没必要处理了

## vue2.7升级vue3

### Element写法注意

> [Element UI 2.x 升级到 Element Plus](https://github.com/element-plus/element-plus/discussions/5658)

主要说的就是把 vue2.7 代码直接粘贴到 vue3 项目里会出现的问题

1. el-dialog 和 自己封装的组件，子组件改父组件

    - vue3 使用 v-model
    - vue2 使用 .sync

    ```html
    <!-- vue3 -->
    <el-dialog v-model="configOpen" :title="弹出框" width="800px" append-to-body />
    <Pagination
      v-model:page="queryParams.pageNumber"
      v-model:limit="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />
    
    <!-- vue2 -->
    <el-dialog :visible.sync="configOpen" :title="弹出框" width="800px" append-to-body />
    <Pagination
      :page.sync="queryParams.pageNumber"
      :limit.sync="queryParams.pageSize"
      :total="total"
      @pagination="getList"
    />
    ```

2. el-date-picker 的 format 属性写法改变

    - vue2 format 为 `yyyy-MM-dd`
    - vue3 format 为 `YYYY-MM-DD`

    ```html
    <!-- vue3 -->
    <el-date-picker v-model="form.startDate" value-format="YYYY-MM-DD" />
    
    <!-- vue2 -->
    <el-date-picker v-model="form.startDate" value-format="yyyy-MM-dd" />
    ```

3. .native

    ```html
    <!-- vue3 -->
    <el-input v-model="listQuery.jobName" @keyup.enter="handleQuery"/>
    
    <!-- vue2 -->
    <el-input v-model="listQuery.jobName" @keyup.enter.native="handleQuery"/>
    ```

4. 在 Vue2 中，`defineEmits` 是无效的

### 升级依赖

升级核心依赖至 Vue3 生态：

```bash
$ npm i vue@3 vue-router@4 pinia
$ npm un vuex vue-template-compiler

- "vue": "^2.7.14"
- "vue-router": "^3.6.5"
- "vuex": "^3.6.2"
- "vue-template-compiler": "^2.7.14"
+ "vue": "^3.4.0"
+ "vue-router": "^4.3.0"
+ "pinia": "^2.1.0"
```

### 入口文件变更

Vue3 使用 `createApp` 替代 `new Vue()`，全局 API 挂载方式改变：

```js
// vue2 main.js
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.prototype.$name = '$name'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// vue3 main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())
app.config.globalProperties.$name = '$name'
app.mount('#app')
```

### v-model 变更

Vue3 中 v-model 的 prop 和 event 名称发生了变化，且支持多个 v-model：

```html
<!-- vue2: prop 为 value, event 为 input -->
<ChildComponent v-model="visible" />

<!-- vue3: prop 为 modelValue, event 为 update:modelValue -->
<ChildComponent v-model="visible" />

<!-- vue3 多个 v-model -->
<ChildComponent
  v-model:title="title"
  v-model:content="content"
/>
```

在子组件中：

```js
// vue2
export default {
  props: { value: Boolean },
  methods: {
    close() { this.$emit('input', false) }
  }
}

// vue3
export default {
  props: { modelValue: Boolean },
  emits: ['update:modelValue'],
  methods: {
    close() { this.$emit('update:modelValue', false) }
  }
}
```

### 插槽变更

`slot` 属性被移除，统一使用 `v-slot`；`$scopedSlots` 合并入 `$slots`：

```html
<!-- vue2 -->
<div slot="header">标题</div>
<template slot-scope="{ row }">
  <span>{{ row.name }}</span>
</template>

<!-- vue3 -->
<template #header>标题</template>
<template #default="{ row }">
  <span>{{ row.name }}</span>
</template>
```

### 移除的 API

以下 API 在 Vue3 中已被移除，需要替换方案：

| 移除项 | vue2 写法 | vue3 替代方案 |
|--------|----------|-------------|
| `$listeners` | `this.$listeners` | 合并到 `$attrs` 中 |
| `$children` | `this.$children` | 使用 ref |
| `$on/$off/$once` | 事件总线 | 使用 mitt 或 provide/inject |
| `filters` | `{{ val \| filter }}` | 计算属性或方法 |
| `Vue.set` | `Vue.set(obj, key, val)` | 直接赋值即可 |
| `Vue.delete` | `Vue.delete(obj, key)` | `delete obj.key` |
| `Vue.nextTick` | `Vue.nextTick(fn)` | `import { nextTick } from 'vue'` |

事件总线替换为 mitt：

```bash
$ npm i mitt
```

```js
// vue2 bus.js
import Vue from 'vue'
export default new Vue()

// 使用
bus.$on('event', handler)
bus.$emit('event', data)
bus.$off('event', handler)

// vue3 bus.js
import mitt from 'mitt'
export default mitt()

// 使用
bus.on('event', handler)
bus.emit('event', data)
bus.off('event', handler)
```

### 生命周期钩子更名

| vue2 | vue3 |
|------|------|
| `beforeCreate` | setup 替代 |
| `created` | setup 替代 |
| `beforeMount` | `onBeforeMount` |
| `mounted` | `onMounted` |
| `beforeUpdate` | `onBeforeUpdate` |
| `updated` | `onUpdated` |
| `beforeDestroy` | `onBeforeUnmount` |
| `destroyed` | `onUnmounted` |

### .sync 修饰符

`.sync` 被移除，用 v-model 替代：

```html
<!-- vue2 -->
<ChildComponent :title.sync="title" />

<!-- vue3 -->
<ChildComponent v-model:title="title" />
```

### 过渡动画 class 名称

```css
/* vue2 */
.v-enter {}
.v-leave {}

/* vue3 */
.v-enter-from {}
.v-enter-active {}
.v-enter-to {}
.v-leave-from {}
.v-leave-active {}
.v-leave-to {}
```

### v-if/v-for 优先级

- vue2：`v-for` 优先级高于 `v-if`
- vue3：`v-if` 优先级高于 `v-for`

两者同时使用时的行为不同，建议始终不要在同一个元素上同时使用 `v-if` 和 `v-for`。

### key 属性

Vue3 中 `key` 必须写在 `<template v-for>` 上，而非子元素：

```html
<!-- vue2: key 写在子元素 -->
<template v-for="item in list">
  <div :key="item.id">{{ item.name }}</div>
</template>

<!-- vue3: key 写在 template 上 -->
<template v-for="item in list" :key="item.id">
  <div>{{ item.name }}</div>
</template>
```

### 响应式变更

Vue3 使用 `Proxy` 实现响应式，`data` 中直接赋值的属性默认也是响应式的，不再需要 `Vue.set`：

```js
// vue2: 动态新增属性需要 Vue.set
this.$set(this.obj, 'newKey', value)

// vue3: 直接赋值即可
this.obj.newKey = value
```

### Vue Router 变更

```js
// vue2 router/index.js
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [{ path: '/', component: Home }]
})
export default router

// vue3 router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: Home }]
})
export default router
```

路由匹配语法变更：

```js
// vue2
{ path: '*' }              // 404 通配
{ path: '/user/:id' }      // 动态参数

// vue3
{ path: '/:pathMatch(.*)*' } // 404 通配
{ path: '/user/:id' }        // 动态参数（不变）
```

### 其他注意事项

- **渲染函数**：`h` 不再作为 `render()` 的参数传入，需从 vue 中导入 `import { h } from 'vue'`
- **组件根节点**：Vue3 支持多个根节点（Fragment），不再要求单一根元素
- **emits 选项**：Vue3 推荐显式声明 `emits`，未声明的事件会以原生事件形式绑定到根元素
- **异步组件**：`Vue.component` 不再支持工厂函数方式，需使用 `defineAsyncComponent`
- **自定义指令钩子**：钩子名称与组件生命周期对齐，如 `bind` → `beforeMount`，`inserted` → `mounted`

### 更多 vue2 → vue3 注意事项

**$attrs 包含 $listeners**

Vue3 中 `$listeners` 被移除，所有事件监听器合并到 `$attrs` 中：

```js
// vue2: $attrs 只含非 prop 属性，$listeners 含事件
this.$attrs   // { class: 'foo' }
this.$listeners.click

// vue3: $attrs 同时包含属性和事件
this.$attrs   // { class: 'foo', onClick: fn }
```

**TransitionGroup 不再默认渲染根元素**

```html
<!-- vue2: 默认渲染一个 span 包裹 -->
<transition-group>
  <div v-for="item in list" :key="item.id">{{ item.name }}</div>
</transition-group>
<!-- 渲染为: <span><div>...</div></span> -->

<!-- vue3: 不再渲染包裹元素，需通过 tag 指定 -->
<transition-group tag="ul">
  <li v-for="item in list" :key="item.id">{{ item.name }}</li>
</transition-group>
```

**按键修饰符变更**

```html
<!-- vue2: 支持 keyCode -->
<input @keyup.13="submit" />
<input @keyup.enter="submit" />

<!-- vue3: 不再支持 keyCode 数字，必须用 kebab-case -->
<input @keyup.enter="submit" />
```

**Functional 组件变更**

```js
// vue2: 通过 functional: true 声明
export default {
  functional: true,
  render(h, { props, children }) {
    return h('div', props, children)
  }
}

// vue3: 直接使用函数定义（无需 .vue 文件）
function FunctionalComponent(props, { slots, attrs, emit }) {
  return h('div', attrs, props.text)
}
```

**全局配置变更**

```js
// vue2
Vue.config.productionTip = false
Vue.config.ignoredElements = ['my-custom-el']
Vue.prototype.$http = axios

// vue3
const app = createApp(App)
app.config.globalProperties.$http = axios
app.config.compilerOptions.isCustomElement = tag => tag.startsWith('my-')
// productionTip 已移除
```

**事件 API 需用 mitt 替换（推荐写法）**

```js
// 安装
npm i mitt

// 创建事件总线
import mitt from 'mitt'
const emitter = mitt()

// 使用（与 Vue2 的 $on/$emit 类似但 API 名不同）
emitter.on('event', callback)     // 监听
emitter.emit('event', payload)    // 触发
emitter.off('event', callback)    // 移除
emitter.all.clear()               // 清除所有
```

### Vue3.x 版本间升级

**Vue 3.2（2021.08）**

- 正式支持 `<script setup>` 语法糖，告别 `setup()` 函数和 `return`
- `defineProps`、`defineEmits`、`defineExpose` 编译器宏
- `v-memo` 指令，缓存模板子树
- `effectScope` API，更好的副作用管理
- CSS `v-bind()` 在 `<style>` 中使用组件状态

```html
<script setup>
import { ref } from 'vue'
const count = ref(0)
const color = ref('red')
defineProps({ title: String })
defineEmits(['update'])
</script>

<template>
  <h1>{{ title }}</h1>
  <button @click="count++">{{ count }}</button>
</template>

<style scoped>
h1 { color: v-bind(color); }
</style>
```

**Vue 3.3（2023.05）**

- `<script setup>` 支持 `defineSlots` 声明插槽类型
- 支持泛型组件（Generic Components）
- `defineProps` 支持外部类型导入
- `defineOptions`，在 `<script setup>` 中声明组件选项
- `toRef` / `toValue` 工具函数

```html
<script setup lang="ts" generic="T">
defineProps<{ items: T[] }>()
defineSlots<{ default(props: { item: T }): any }>()
defineOptions({ name: 'MyComponent', inheritAttrs: false })
</script>
```

**Vue 3.4（2023.12）**

- **`defineModel` 稳定版**，替代 v-model 的 prop + emit 手动声明
- `v-bind` 同名缩写：`<div :id :class>` 等价于 `<div :id="id" :class="class">`
- 响应式系统重构，更快的 `ref` / `computed`
- `watchEffect` 批处理机制优化

```html
<script setup>
// 之前需要手动声明 prop 和 emit
// const props = defineProps(['modelValue'])
// const emit = defineEmits(['update:modelValue'])

// 3.4+ 使用 defineModel
const model = defineModel()
const title = defineModel('title', { required: true })
</script>

<template>
  <input v-model="model" />
  <input v-model="title" />
</template>
```

**Vue 3.5（2024.09）**

- `useTemplateRef` 替代 ref 获取模板引用（类型更安全）
- `defineCustomElement` 自定义元素 API
- `onWatcherCleanup` 在 watcher 中注册清理函数
- Props 解构保持响应式（编译器优化）
- SSR `useId()` API

```html
<script setup>
import { useTemplateRef, onMounted } from 'vue'

// 3.5+ 模板引用新写法
const inputRef = useTemplateRef('input')
onMounted(() => inputRef.value?.focus())
</script>

<template>
  <input ref="input" />
</template>
```

### 升级策略建议

1. **先升 2.7**：在 Vue 2.6 → Vue 3 之间，先升级到 Vue 2.7 作为过渡版本，2.7 内置了 Composition API、`<script setup>`、`defineComponent` 等 Vue 3 特性，降低迁移成本
2. **逐项替换**：先升级依赖和配置文件，确保工程能跑通，再逐步替换组件语法
3. **渐进式迁移**：对于大型项目，可以保留 Vue 2 主体，通过微前端方式逐步将新模块用 Vue 3 开发
4. **关注生态兼容**：升级前检查第三方组件库（如 Element UI → Element Plus）、工具链（Vetur → Volar）的兼容性