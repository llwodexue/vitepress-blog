# Webpack实践

## 脚手架生成文件

在封装脚手架时，需要考虑模块中用到的依赖包装一层，让模板依赖所包装的模板（让模板依赖不变的东西）

> [https://cli.vuejs.org/zh/guide/webpack.html](https://cli.vuejs.org/zh/guide/webpack.html)

vue-cli 调整 webpack 的配置

- 配置方式：在 `vue.config.js` 中的 `configureWebpack` 选项提供一个对象，这个对象会被 `webpack-merge` 合并入最终的 webpack 配置
- 链式操作：内部是通过 `webpack-chain` 维护的，它允许我们更细粒度的控制其内部配置

> [https://create-react-app.bootcss.com/docs/available-scripts#npm-run-eject](https://create-react-app.bootcss.com/docs/available-scripts#npm-run-eject)

create-react-app 可以在项目根目录执行 `npm run eject` 提取内置配置

- 默认跟 vue-cli 一样把 webpack 配置包装到一个黑盒中，使用 `react-scripts eject` 后就把 webpack 配置拿到了本地

## 多页面打包

最早都是使用 MPA，只是在一些应用场景下必须实现 SPA，例如网易云音乐之类的产品，具体原因：音乐播放，如果都是不同的页面，从 A 页面跳转到 B 页面过后，音乐如何继续播放。再者就是一些关联性比较强的页面，例如：商品列表和商品明细，希望通过 SPA 提升用户使用上的体验

但是也并不是所有应用都需要做成 SPA 应用的，例如：活动页、专题页，每隔一段时间，上线一个新产品，就会单独出一个专题页

`chunk` 和 `bundle` 的关系：

- 一次打包时可能有多个 `chunk`
- 一次打包的结果就是一个 `bundle`

## 不同环境下的环境变量

使用不同的 `.env` 文件控制，一般在项目根目录下会添加 `.env.development`、`.env.test`、`.env.production` 这样的环境变量配置文件

- vue-cli：只有 `NODE_ENV`、`BASE_URL`、`VUE_APP_` 开头的变量才会通过 `webpack.definePlugin` 静态地嵌入到客户端的代码中，这是为了避免意外公开机器上可能具有相同名称的私钥
- create-react-app：要求环境变量需要以 `REACT_APP_` 开头

执行 webpack 打包时通过 `NODE_ENV` 控制具体使用哪一个环境，然后 webpack 配置文件使用 `dotenv` 读取对应环境配置，通过 `DefinePlugin` 注入

## Webpack 面试会考到的点

1. webpack 的价值体现、你对 webpack 的看法

2. webpack 与 gulp、grunt 之类工具的差异

   三者都是前端构建工具，严格来说 webpack 是模块打包工具，Grunt 和 Gulp 是自动化构建工具

   grunt 和 gulp 是基于任务和流的。Grunt 工作过程是基于临时文件实现的（编译后将结果写入到临时文件，下一个插件直接读取这个临时文件进行操作）。Gulp 是基于内存实现的，对文件的处理都是在内存中完成

   Webpack 作为 **模块打包器（Module bundler）**，可以把零散的文件打包到一个 JS 中，对于有环境兼容的代码可以在打包过程中通过 **模块加载器（Loader）** 对其进行编译转换；Webpack 还具备 **代码拆分（Code Splitting）** 能力，将应用中所有代码按照我们的需要进行打包，这样就可以渐进式加载，不会导致文件过碎或过大；Webpack 支持以模块化的方式载入任意类型文件，通过 **资源模块（Asset Module）**

3. Loader 与 Plugin 之间的差异

   Loader 文件资源转换器，在模块打包之前，会将模块根据配置交给不同的 Loader 处理。Loader 主要负责资源文件从输入到输出的转换，实际上是一种管道的概念，对于同一个资源可以依次使用多个 Loader（use 属性的值是一个由 Loader 组成的数组）

   Plugin 扩展器，为了解决资源加载的一些自动化工作。Plugin 通过钩子机制实现，通过在生命周期的钩子中挂载函数实现扩展

4. 用过的 Loader 和 Plugin（以此来判断你遇到过的问题）

   **Loader**

   - `css-loader`：读取、合并 CSS 文件

     `style-loader`：把 CSS 注入到 JS 中

     `sass-loader`：解析 SASS 文件（安装 `node-sass` 或 `sass`）

     `postcss-loader`：浏览器兼容

   - `file-loader`：拷贝物理文件

     `url-loader`：Data Urls 展示文件

   - `babel-loader`：兼容 JS

     `thread-loader`：由于 `babel-loader` 消耗时间比较长，可以使用 `thread-loader` 对其优化

   **Plugin**

   - `mini-css-extract-plugin`：提取 CSS 到单个文件

     `optimize-css-assets-webpack-plugin` 或 `optimize-cssnano-plugin`：压缩 CSS

   - `terser-webpack-plugin` 或 `uglifyjs-webpack-plugin`：压缩 JS

   - `html-webpack-plugin`：自动生成 html 解决硬编码问题

   - `copy-webpack-plugin`：拷贝一些不参与构建的静态文件

   - `clean-webpack-plugin`：清除 dist 目录文件

   - `DefinePlugin`：webpack 内部，为代码注入全局成员

   - `script-ext-html-webpack-plugin`：将 `runtime` 代码内联在 index.html

5. Tree-shaking、sideEffects、Scope Hoisting

   Tree Shaking 前提是 ES Modules，webpack 打包的代码必须是 ESM

   注意：如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效

   - `usedExports`：负责标记（枯树叶）

   - `minimize`：负责（摇掉）它们

   - `concatenateModules`：尽可能将所有模块合并输出到一个函数中

     即提升了运行效率，又减少了代码的体积，又称为 `Scope Hoisting` 作用域提升（webapck 3 开始支持）

   开启 `sideEffects` 后，webpack 在打包时就会先检查 `package.json` 中有没有 `sideEffects` 标识，以此判断这个模块是否有副作用，如果这个模块没有副作用，没有用到的模块就不会打包

6. Source Map 的最佳实践

   Source Map 有很多种方式，大概有如下几种，可以相互进行组合

   `inline`：不生成映射关系文件，嵌入进 main.js

   `cheap`：只精确到行不精确到列，只管业务代码不管第三方模块

   `module`：不仅管业务代码还管第三方模块，并能得到 Loader 处理之前的源代码

   `eval`：是否使用 eval 执行模块代码，通过 sourceURL 标注模块文件的路径

   如果生产模式使用会造成安全隐患，开发环境可以使用 `cheap-module-eval-source-map`，生产环境可以使用如下方式

   - `source-map` 文件访问权限（nginx 那一层做），对于 map 这一类文件只允许局域网访问
   - `nosources-source-map` 可以结合监控平台来做
   - `hidden-source-map` 只暴露行列信息，不暴露源代码

7. webpack 的核心工作过程

8. 文件名 hash（文件指纹）控制缓存

   1. `hash`：每次 webpack 构建时会生成一个唯一的 hash 值。不管文件是否有变化它都会变化
   2. `chunkhash`：如果打包来源于同一个 chunk，那么 hash 值就一样。如果在 js 中引入 css，js 和 css 就会绑定在一起
   3. `contenthash`：根据文件的内容生成 hash 值。不同文件 hash 值一定不一样

9. webpack 如何打包优化

   [记一次前端面试记录（头条、蚂蚁）](https://juejin.cn/post/6844904138359193608#heading-2)

解答思路：

1. 定义
2. 实践
3. 实践中出现的问题、解决办法

## Webpack 内 rules 的常用属性和配置

具体取决于所使用的 loader，每个 rule 对象中正常只会用到 test 和 use

- 如果这个 loader 需要设置一些配置选项，可以使用 options

  `file-loader` 可以指定生成 dataURLS 的文件大小。`babel-loader` 可以指定 `preset`

- 如果需要让这个 loader 选择性的忽略一部分文件，可以使用 `include`、`exclude`

- 如果需要对同一个文件使用多个 loader，例如先使用 `eslint-loader` 再使用 `babel-loader`，可以使用 `enforce: 'pre'` 属性控制当前这个规则的优先与否

## 基于 Webpack 构建 Vue.js 应用

### 配置文件

VSCode 类型系统增强

```js
// webpack.config.js
import { Configuration } from 'webpack'
/**
 * @type {Configuration}
 */
const config = {
  entry: './src/main.js'
}
module.exports = config
```

- `@type` 是 `jsdoc` 的特性

  `import('webpack').Configuration` 是 TS 的特性

```js
/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  entry: './src/main.js'
}
```

### 安装依赖

```json
{
  "dependencies": {
    "core-js": "^3.6.5",
    "vue": "^2.6.11"
  },
  "devDependencies": {
    "clean-webpack-plugin": "^3.0.0",
    "copy-webpack-plugin": "^5.1.2",
    "css-loader": "^3.6.0",
    "dotenv": "^8.2.0",
    "eslint": "^7.15.0",
    "eslint-config-standard": "^16.0.2",
    "eslint-plugin-import": "^2.22.1",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-promise": "^4.2.1",
    "eslint-plugin-vue": "^7.2.0",
    "file-loader": "^4.3.0",
    "html-webpack-plugin": "^3.2.0",
    "less": "^3.12.2",
    "less-loader": "^7.1.0",
    "style-loader": "^1.3.0",
    "url-loader": "^4.1.1",
    "vue-loader": "^15.9.5",
    "vue-template-compiler": "^2.6.12",
    "webpack": "^4.44.2",
    "webpack-cli": "^3.3.12",
    "webpack-dev-server": "^3.11.0",
    "webpack-merge": "^4.2.2"
  },
}
```

### webpack.common.js

```js
const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const env = process.env.NODE_ENV || 'production'
dotenv.config({ path: '.env.' + env }) // load .env.production
dotenv.config() // load .env

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/bundle.[contenthash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.png|jpe?g|gif$/,
        use: {
          loader: 'url-loader', // 能转 base64 就转，不能转就使用 file-loader
          options: {
            name: 'img/[name].[contenthash:8].[ext]',
            esModule: false,
            limit: 4 * 1024 // kb
          }
        }
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({ template: './public/index.html', title: 'Vue App Sample' }),
    new webpack.DefinePlugin({
      BASE_URL: '"/"'
    })
  ]
}
```

