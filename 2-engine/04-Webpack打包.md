# Webpack打包

## 模块化工具

**由来**

- ES Modules 存在环境兼容问题
- 模块文件过多，网络请求频繁
- 所有的前端资源都需要模块化

![开发到生产-编译代码](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%BC%80%E5%8F%91%E5%88%B0%E7%94%9F%E4%BA%A7-%E7%BC%96%E8%AF%91%E4%BB%A3%E7%A0%81.png)

![开发到生产-模块带包](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%BC%80%E5%8F%91%E5%88%B0%E7%94%9F%E4%BA%A7-%E6%A8%A1%E5%9D%97%E5%B8%A6%E5%8C%85.png)

![开发到生产-多类型模块支持](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E5%BC%80%E5%8F%91%E5%88%B0%E7%94%9F%E4%BA%A7-%E5%A4%9A%E7%B1%BB%E5%9E%8B%E6%A8%A1%E5%9D%97%E6%94%AF%E6%8C%81.png)

**概要**

![webpackRollup](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/webpackRollup.png)

- Webpack 作为 **模块打包器（Module bundler）**，可以把零散的文件打包到一个 JS 中，对于有环境兼容的代码可以在打包过程中通过 **模块加载器（Loader）** 对其进行编译转换
- Webpack 还具备 **代码拆分（Code Splitting）** 能力，将应用中所有代码按照我们的需要进行打包，这样就可以渐进式加载，不会导致文件过碎或过大
- Webpack 支持以模块化的方式载入任意类型文件，通过 **资源模块（Asset Module）**

## Webpack

### 快速上手

`yarn webpack` 会先从 `src/index.js` 打包

```bash
yarn init --yes
yarn add webpack webpack-cli --dev
yarn webpack
```

打包的过程会按照约定将 `src/index.js` 作为打包入口，最终存放在 `dist/main.js` 里，可以添加 `webpack.config.js` 进行配置

- 这个文件是运行在 Node 环境的 JS 文件，我们需要按照 CommonJS 方式编写代码

```js
const path = require('path')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'output')
  }
}
```

**Webpack 工作模式**

> [webpack mode](https://webpack.js.org/configuration/mode/)
>
> [webpack4 mode](https://v4.webpack.js.org/configuration/mode/)

- production 模式，自动优化打包结果
- development 模式，自动优化打包速度，添加一些调试过程中的辅助
- none 模式，运行最原始的打包，不做任何额外处理

### 打包结果运行原理

`Ctrl + K` + `Ctrl + 0` 折叠所有代码

![webpack打包运行原理1](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/webpack%E6%89%93%E5%8C%85%E8%BF%90%E8%A1%8C%E5%8E%9F%E7%90%861.png)

`modules` 接收的就是那两个模块所对应的函数

![webpack打包运行原理2](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/webpack%E6%89%93%E5%8C%85%E8%BF%90%E8%A1%8C%E5%8E%9F%E7%90%862.png)

调用 `require` 函数进入模块入口

![webpack打包运行原理4](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/webpack%E6%89%93%E5%8C%85%E8%BF%90%E8%A1%8C%E5%8E%9F%E7%90%864.png)

## Loader

- 编译转换类
- 文件操作类
- 代码检查类

### 资源模块加载

Webpack 在所有模块打包之前，将模块根据配置交给不同的 loader 去处理，最后将处理的结果打包到一起

```bash
yarn add css-loader style-loader --dev
```

配置了多个 loader 执行顺序是从后往前

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
```

根据代码的需要动态导入资源，需要资源的不是应用，而是代码

![webpack导入资源模块](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/webpack%E5%AF%BC%E5%85%A5%E8%B5%84%E6%BA%90%E6%A8%A1%E5%9D%97.png)

通过 JavaScript 建立 JS 与资源文件依赖关系

- 逻辑合理，JS 确实需要这些资源文件
- 确保上线资源不缺失，都是必要的

```js
import './heading.css'

export default () => {
  const element = document.createElement('h2')
  element.textContent = 'Hello world'
  element.classList.add('heading')
  element.addEventListener('click', () => {
    alert('Hello webpack')
  })
  return element
}
```

### 文件资源加载器

```bash
yarn add file-loader --dev
```

`webpack-dev-server` 在不设置 `publicPath` 的情况下，将默认输出 `bundle.js` 到根目录

```js
module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
    publicPath: 'dist/',
  },
  module: {
    rules: [
      {
        test: /.png$/,
        use: 'file-loader',
      },
    ],
  },
}
```

![文件加载器打包代码](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%96%87%E4%BB%B6%E5%8A%A0%E8%BD%BD%E5%99%A8%E6%89%93%E5%8C%85%E4%BB%A3%E7%A0%81.png)

![文件加载器图例](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/%E6%96%87%E4%BB%B6%E5%8A%A0%E8%BD%BD%E5%99%A8%E5%9B%BE%E4%BE%8B.png)

URL 加载器

除了 `file-loader` 通过拷贝物理文件形式处理文件，还可以通过 `Data URLs` 方式表示文件

![DataURLs类型格式](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/DataURLs%E7%B1%BB%E5%9E%8B%E6%A0%BC%E5%BC%8F.png)

```bash
yarn add url-loader --dev
```

- 小文件使用 Data URLs，减少请求次数
- 大文件单独提取存放，提高加载速度

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024 // 10 KB
          }
        }
      }
    ]
  }
}
```

![DataURLbase64](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/DataURLbase64.png)

### ES 2015

由于 webpack 默认就能处理代码中的 `import` 和 `export`，所以有可能会认为 webpack 会自动编译 ES6 代码，实则不然，它并不能转换代码中其它 ES6 语法

```bash
yarn add babel-loader @babel/core @babel/preset-env --dev
```

- webpack 只是打包工具
- 加载器可以用来编译转换代码

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
    ]
  }
}
```

### Webpack 模块加载方式

- 遵循 ES Modules 标准的 `import` 声明

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/ESModulesImport.png)

- 遵循 CommonJS 标准的 `require` 函数

![](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/CommonJSRequire.png)

- 遵循 AMD 标准的 `define` 函数和 `require` 函数

![AMDrequireDefine](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/AMDrequireDefine.png)

代码中所有需要引用到的资源，都会被 webpack 找出来，根据配置交给不同的 loader 去处理

```html
<style>
@import url(reset.css);
</style>

```

- 样式代码中的 `@import` 指令和 url 函数
- HTML 代码中图片标签的 src 属性

```js
module.exports = {
  module: {
    rules: [
      {
        test: /.png$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10 * 1024, // 10 KB
          },
        },
      },
      {
        test: /.html$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: ['img:src', 'a:href'],
          },
        },
      },
    ],
  },
}
```

## * webpack 核心原理

webpack 会找到其中文件作为打包入口

- 根据代码中的 `import` 或 `require` 的语句解析，推断出来依赖模块，然后解析每个模块的资源依赖，形成依赖树
- 递归依赖树，找到每个节点对应的资源文件，然后根据每个模块的 `rules` 属性找到对应的加载器，然后进行加载，把加载的结果放入 `bundle.js`

![webpack核心原理](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/webpack%E6%A0%B8%E5%BF%83%E5%8E%9F%E7%90%86.png)

Loader 与 Plugin

- Loader：用于资源加载并处理各种语言的转换/编译（例如：将不同语言转换为 JavaScript）
- Plugin：用于资源加载以外的其他打包/压缩/文件处理等功能

### Loader 工作原理

Loader 负责资源文件从输入到输出的转换，Loader 实际上是一种管道的概念，对于同一个资源可以依次使用多个 Loader

- loader 配置文件中配置加载器（加载器 use 不仅可以用名字也可以用路径）

  注意：loader 管道最终需要返回 JavaScript 代码

- loader 输入：`function` 接收一个参数作为输入，该参数为文件内容

  loader 输出：`return` 一个返回值作为输出，该返回值为模块导出的字符串；loader 需要将返回值作为一个模块导出，才能更好的在 webpack 打包文件中使用，有三种导出方式：

  - 按照 ES Modules 方式导出
  - 按照 CommonJS 方式导出
  - loader 处理类似于管道，可以串联多个 loader，可以直接将返回值交给下一个 loader 继续处理

![loader文件转换流程](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/loader%E6%96%87%E4%BB%B6%E8%BD%AC%E6%8D%A2%E6%B5%81%E7%A8%8B.png)

- 可以借助其他 loader 进行处理，使其转换为 JavaScript 代码

```js
// markdown-loader.js
const marked = require('marked')
module.exports = source => {
  const html = marked(source)
  // 返回 html 字符串交给下一个 loader 处理
  return html
}

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.md$/,
        use: ['html-loader', './markdown-loader'],
      },
    ],
  },
}
```

- 可以将 html 转换成 JavaScript 字符串导出

  ``module.exports = "${html}"`` html 中的换行符、引号拼接到一起会造成语法错误，可以使用 `JSON.stringify(html)`

```js
const marked = require('marked')
module.exports = source => {
  const html = marked(source)
  // return `module.exports = "${html}"`
  return `export default ${JSON.stringify(html)}`
}

// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /.md$/,
        use: './markdown-loader',
      },
    ],
  },
}
```

### Plugin 插件使用

Loader 专注实现资源模块加载，从而实现整体项目的打包，Plugin 为了解决除了资源加载的一些自动化工作，例如：清除 dist 目录、拷贝静态文件至输出目录、压缩输出代码

**自动清除输出目录**

- `clean-webpack-plugin`

```bash
yarn add clean-webpack-plugins --dev
```

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [new CleanWebpackPlugin()]
}
```

**自动生成 HTML 插件**

```html
<script src="dist/bundle.js"></script>
```

之前都是硬编码的方式单独存在根目录下，这样有两个问题：

- 项目发布时需要同时发布根目录下的 html 和 dist 目录下所有打包结果，上线后还要确保路径正确
- 输出的文件或路径发生改变，那么 html 中的 script 的路径也要修改

解决方法：用 webpack 自动生成，一起输出到 dist 目录，`index.html` 中的 `bundle.js` 也是动态的，这样就不会出现硬编码问题

```bash
yarn add html-webpack-plugin --dev
```

- 注意：把 `output: { publicPath: 'dist' }` 给删除掉

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [new HtmlWebpackPlugin()]
}
```

接下来有这几个问题：

- 默认生成 HTML 标题需要修改

  ```html
  <h1><%= htmlWebpackPlugin.options.title %></h1>
  ```

- 自定义页面元数据标签和基础 DOM 结构

  如果要对 HTML 进行大量自定义，更好的方法是根据模板生成页面

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    })
  ]
}
```

输出多个 HTML

- 每个 `html-webpack-plugin` 对象就是负责生成一个页面文件

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  plugins: [
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: 'Webpack Plugin Sample',
      meta: {
        viewport: 'width=device-width'
      },
      template: './src/index.html'
    }),
    // 用于生成 about.html
    new HtmlWebpackPlugin({
      filename: 'about.html'
    })
  ]
}
```

**自动复制文件**

项目中还有一些不参与构建的静态文件，例如网站 `favicon`，可以把其放到 `public` 目录中，一并打包

```bash
yarn add copy-webpack-plugin --dev
```

`CopyWebpackPlugin` 要求我们传入一个数组用于指定文件的拷贝路径，可以是通配符也可以是文件路径

```js
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  plugins: [
    new CopyWebpackPlugin([
      // 'public/**'
      'public'
    ])
  ]
}
```

### Plugin 工作原理

> [webpack4 Compiler Hooks ](https://v4.webpack.js.org/api/compilation-hooks/)
>
> [compiler 钩子](https://www.webpackjs.com/api/compiler-hooks/)

相比于 Loader，Plugin 拥有更宽的能力范围

- Plugin 通过钩子机制实现，通过在生命周期的钩子中挂载函数实现扩展

  钩子机制，类似于 web 的事件，为了便于插件扩展，webpack 在每个环节都设置了钩子

![webpack钩子机制](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/webpack%E9%92%A9%E5%AD%90%E6%9C%BA%E5%88%B6.png)

webpack 要求 Plugin 必须是一个函数或者是一个包含 `apply` 方法的对象（一般会把插件定义成一个类，在类上定义一个 `apply` 方法）

- `apply` 方法有一个参数 `compiler`，通过 `compiler` 可以给 webpack 编译打包过程中添加钩子

  里面有 `emit` 的钩子，它的执行时机：生成资源 `asset` 到 `output` 目录之前执行

- 通过钩子的回调函数 `callback` 拿到打包结果对象 `compilation`（通过 `compilation.assets` 获取生成资源文件信息），然后对打包结果对象 `compilation` 进行修改

```js
// comment-plugin.js
class MyPlugin {
  // 在 webpack 启动时自动调用
  apply(compiler) {
    /**
     * @param1 插件名称
     * @param2 挂载的函数
     */
    compiler.hooks.emit.tap('MyPlugin', compilation => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        if (name.endsWith('.js')) {
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace(/\/\*\*+\*\//g, '')
          // 覆盖原有内容
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length
          }
        }
      }
    })
  }
}

// webpack.config.js
const MyPlugin = require('./comment-plugin.js')
module.exports = {
  plugins: [new MyPlugin()]
}
```

## webpack 开发环境

设想一下开发环境

1. 以 HTTP Server 运行
2. 自动编译 + 自动刷新
3. 提供 Source Map 支持

### 自动编译刷新

**自动编译**

```bash
yarn webpack --watch
```

**自动刷新浏览器**

- 同时使用两个工具效率低下，webpack 编译后写入磁盘，服务器从磁盘读取

```bash
browser-sync dist --files "**/*"
```

**Dev Server**

- 集成 自动编译 和 自动刷新浏览器 等功能

  webpack 为了提高效率，并没有输出 dist 目录，而是将结果暂存到内存中，而 server 是从内存读取文件，然后发送给浏览器，提高效率

```bash
yarn add webpack-dev-server --dev
```

- `CopyWebpackPlugin` 一般只有上线才会使用这个插件，开发如果拷贝得多，效率就低了

  需要在

- 注释掉 `CopyWebpackPlugin` 就需要在 `devServer` 配置 `contentBase`

```js
module.exports = {
  devServer: {
    contentBase: './public',
  },
  plugins: [
    // new CopyWebpackPlugin(['public'])
  ]
}
```

### Dev Server 代理

![webpackDevServerApi](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/webpackDevServerApi.png)

- 使用 CORS 的前提是 API 必须支持，并不是任何情况下 API 都应该支持

- 希望访问路径 `https://api.github.com/users`

  配置 `target` 后转换：`http://localhost:8080/api/users -> https://api.github.com/api/users`

  因为根路径没有 `/api`，所以需要使用 `pathRewrite` 重写：`http://localhost:8080/api/users -> https://api.github.com/users`

- `changeOrigin: true` 会以实际代理请求过程中的主机名进行请求，不会使用 `localhost: 8080`

```js
module.exports = {
  devServer: {
    contentBase: './public',
    proxy: {
      '/api': {
        target: 'https://api.github.com',
        pathRewrite: {
          '^/api': ''
        },
        // 不能使用 localhost:8080 作为请求 GitHub 的主机名
        changeOrigin: true
      }
    }
  },
}
```

```js
fetch('/api/users') // http://localhost:8080/api/users
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      const li = document.createElement('li')
      li.textContent = item.login
      ul.append(li)
    })
  })
```

### Source Map

- eval：将模块代码放到 `eval` 函数执行，通过 `sourceURL` 标注模块文件的路径，并没有生成 `Source-Map`，无法定位哪一个文件除了错误
- eval-souce-map：使用 `eval` 函数执行代码，不仅可以定位错误出现的文件还可以定位行和列的信息
- cheap-eval-source-map：相对于 `eval-souce-map` 它只能定位行的信息，不能定位列的信息
- cheap-module-eval-source-map：`cheap-eval-source-map` 展示的是 ES6 转换后的结果，`cheap-module-eval-source-map` 定位的源代码跟我们编写的代码是一样的

总结：

- eval：是否使用 `eval` 执行模块代码
- cheap-Source Map：是否包含行信息
- module：是否能够得到 Loader 处理之前的源代码

调式和报错都是基于运行代码，但是运行代码与源代码又不同

```js
module.exports = {
  devtool: 'source-map',
}
```

webpack 支持 12 种不同的 SourceMap 方式，每种方式的效率和效果各不相同

![SourceMap对应表](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/SourceMap%E5%AF%B9%E5%BA%94%E8%A1%A8.png)

可以通过 sourceURL 去改变 eval 执行所属环境的名称

```js
// 默认会运行在临时虚拟机中
eval('console.log(1)') // VM62:1
// 使用 sourceURL 声明代码所属路径
eval('console.log(1) //# sourceURL=./foo/bar.js') // ./foo/bar.js:1 
```

浏览器通过 eval 执行就知道这段代码所对应的源代码是哪个文件，实现定位错误所出现的文件

- 实际上不会生成 SourceMap 文件，构建速度就会比较快，但是只能定位源代码名称不能定位行列信息

![sourcemapEval](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/sourcemapEval.png)

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

const allModes = [
	'eval',
	'cheap-eval-source-map',
	'cheap-module-eval-source-map',
	'eval-source-map',
	'cheap-source-map',
	'cheap-module-source-map',
	'inline-cheap-source-map',
	'inline-cheap-module-source-map',
	'source-map',
	'inline-source-map',
	'hidden-source-map',
	'nosources-source-map'
]

module.exports = allModes.map(item => {
	return {
		devtool: item,
		mode: 'none',
		entry: './src/main.js',
		output: {
			filename: `js/${item}.js`
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env']
						}
					}
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				filename: `${item}.html`
			})
		]
	}
})
```

**选择合适 Source Map**

- 开发环境使用：cheap-module-eval-source-map

  代码每行不会超过 80 个字符

  使用框架比较多，代码经过 Loader 转换过后的差异较大

  首次打包速度慢无所谓，重新打包相对较快

- 生产模式：none 或 nosources-source-map

  Source Map 会暴露源代码

  调式是开发阶段的事情

### 自动刷新

**自动刷新导致页面状态丢失**

1. 代码中写死编辑器的内容
2. 额外代码实现刷新前保存，刷新后读取

最好的解决方法：页面不刷新的前提下，模块也可以及时更新

**HMR**（`Hot Module Replacement` 模块热替换）

- 热拔插：在一个正在运行的机器上随时插拔设备，比如：USB 接口
- 热模块替换：在应用运行过程中实时替换某个模块，应用运行状态不受影响，只将修改的模块实时替换至应用中

```bash
# 不配置webpack.config.js
yarn webpack-dev-server --hot
# 配置webpack.config.js
yarn webpack-dev-server
```

webpack 中的 HMR 并不可以开箱即用，需要手动处理模块热替换逻辑

- 为什么样式文件的热更新开箱即用？

  因为 `style-loader` 自动处理热更新

![css热更新替换](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/css%E7%83%AD%E6%9B%B4%E6%96%B0%E6%9B%BF%E6%8D%A2.png)

- 为什么脚本就需要手动处理？

  样式更新只需要把 CSS 及时替换到页面中即可

  在 JS 中有可能导出的函数有可能是对象

- 项目没有手动处理，JS 照样可以热替换

  使用框架，每种文件都是由规律

```js
const webpack = require('webpack')

module.exports = {
  devServer: {
    hot: true
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}
```

JS 模块与图片模块热替换

```js
import createEditor from './editor'
import background from './better.png'
import './global.css'

const editor = createEditor()
document.body.appendChild(editor)
const img = new Image()
img.src = background
document.body.appendChild(img)


if (module.hot) {
  let lastEditor = editor
  module.hot.accept('./editor', () => {
    const value = lastEditor.innerHTML
    document.body.removeChild(lastEditor)
    const newEditor = createEditor()
    newEditor.innerHTML = value
    document.body.appendChild(newEditor)
    lastEditor = newEditor
  })

  module.hot.accept('./better.png', () => {
    img.src = background
  })
}
```

**注意事项：**

1. 处理 HMR 的代码报错会导致自动刷新

```js
module.exports = {
  devServer: {
    hotOnly: true // 只使用 HMR，不会 fallback 到 live reloading
  },
}
```

2. 没启用 HMR 的情况下，HMR API 报错

```js
if (module.hot) {
  // donw
}
```

## webpack 生产环境

生产环境注重运行效率，以更少量更

### 不同环境下的配置

1. 配置文件根据环境不同导出不同配置

```js
module.exports = (env, argv) => {
  const config = {
    mode: 'development',
    devtool: 'cheap-eval-module-source-map',
    // ...
  }

  if (env === 'production') {
    config.mode = 'production'
    config.devtool = false
    config.plugins = [
      ...config.plugins,
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin(['public'])
    ]
  }

  return config
}
```

2. 一个环境对应一个配置文件

```js
const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const common = require('./webpack.common')

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin(['public'])
  ]
})
```

### DefinePlugin

- 为代码注入全局成员

在 Production 模式下，这个插件会往代码中注入 `process.env.NODE_ENV`

```js
const webpack = require('webpack')

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      // 值要求的是一个代码片段
      API_BASE_URL: JSON.stringify('https://api.example.com')
    })
  ]
}
```

### Tree-shaking

- 摇掉代码中未引用部分（dead-code）

Tree Shaking 不是 webpack 某个配置选项，是一组功能搭配使用后的优化效果，在生产模式自动开启

- `usedExports`：负责标记（枯树叶）

- `minimize`：负责（摇掉）它们

- `concatenateModules`：尽可能将所有模块合并输出到一个函数中

  即提升了运行效率，又减少了代码的体积，又称为 `Scope Hoisting` 作用域提升（webapck 3 开始支持）

```js
module.exports = {
  mode: 'none',
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 尽可能合并每一个模块到一个函数中
    concatenateModules: true,
    // 压缩输出结果
    minimize: true
  }
}
```

Tree Shaking 前提是 ES Modules，webpack 打包的代码必须是 ESM

- 为了转换代码中的 ECMAScript 新特性，很多时候都会使用 `babel-loader` 处理 JS
- 最新版本 `babel-loader` 自动关闭了 ES Modules 转换

`babel-loader\lib\injectCaller.js` 支持 ESM

![babel-loader支持esm](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/babel-loader%E6%94%AF%E6%8C%81esm.png)

`@babel\preset-env\lib\index.js` 自动禁用了 ESM 的转换，webpack 得到的还是 ESM 代码，`tree-shaking` 就可以正常工作了

![preset-env自动禁用module转换](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/preset-env%E8%87%AA%E5%8A%A8%E7%A6%81%E7%94%A8module%E8%BD%AC%E6%8D%A2.png)

如果 Babel 加载模块时已经转换了 ESM，则会导致 Tree Shaking 失效

```js
module.exports = {
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              // ['@babel/preset-env', { modules: 'commonjs' }]
              // ['@babel/preset-env', { modules: false }]
              // 也可以使用默认配置，也就是 auto，这样 babel-loader 会自动关闭 ESM 转换
              ['@babel/preset-env', { modules: 'auto' }]
            ]
          }
        }
      }
    ]
  }
}
```

**sideEffects**

- 副作用：模块执行时除了导出成员之外所作的事情

  `sideEffects` 一般用于 npm 包标记是否有副作用

- 在 `components/index.js` 中集中导出组件便于外部导入

  在 `index.js` 中只导入 `Button` 成员，但是 `components/index.js` 所有组件都会被加载执行

  开启 `sideEffects` 后，webpack 在打包时就会先检查 `package.json` 中有没有 `sideEffects` 标识，以此判断这个模块是否有副作用，如果这个模块没有副作用，没有用到的模块就不会打包

- 使用 `sideEffects` 的前提是确保你的代码真的没有副作用

```js
// webpack.config.js
module.exports = {
  optimization: {
    sideEffects: true,
  }
}

// package.json
{
  "sideEffects": [
    "./src/extend.js",
    "*.css"
  ]
}
```

### Code Splitting

webpack 打包问题：所有代码最终都被打包到一起，就会导致 `bundle` 体积过大，并不是每个模块在启动时都是必要的

- 合理方案：打包结果按照一定规则分离到多个 `bundle` 中，根据应用运行需要按需加载模块

HTTP1.1 缺陷：

- 同域并行请求限制
- 每次请求都会有一定的延迟
- 请求的 Header 浪费带宽流量

webpack 实现分包：

- 多入口打包

  多页应用程序：一个页面对应一个打包入口，公共部分单独提取

- 动态导入

  不同入口中肯定会有公共模块

**多入口打包**

- 把 `entry` 定义成一个对象，定义成数组就是把多个文件打包到一起，对于整个应用来说还是一个入口

  需要把 `output` 改为占用符方式动态输出文件名

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: {
    index: './src/index.js',
    album: './src/album.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index']
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album']
    })
  ]
}
```

**拆分成模块**

```js
module.exports = {
  optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    }
  },
}
```

**动态导入**

- 需要用到某个模块时，再加载这个模块
- 动态导入的模块会被自动分包

默认通过动态导入产生的 `bundle` 文件，名称就只是一个序号，如果希望给它命名，可以使用 webpack 魔法注释（Magic Comments）

```js
// import posts from './posts/posts'
// import album from './album/album'

const render = () => {
  const hash = window.location.hash || '#posts'
  const mainElement = document.querySelector('.main')
  mainElement.innerHTML = ''

  if (hash === '#posts') {
    import(/* webpackChunkName: 'components' */'./posts/posts').then(({ default: posts }) => {
      mainElement.appendChild(posts())
    })
  } else if (hash === '#album') {
    // mainElement.appendChild(album())
    import(/* webpackChunkName: 'components' */'./album/album').then(({ default: album }) => {
      mainElement.appendChild(album())
    })
  }
}
render()
window.addEventListener('hashchange', render)
```

### 压缩 CSS

- `MiniCssExtractPlugin` 提取 CSS 到单个文件
- `OptimizeCssAssetsWebpackPlugin` 压缩输出的 CSS 文件
- `TerserWebpackPlugin` 压缩输出的 JS 文件

```js
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: {
    main: './src/index.js'
  },
  output: {
    filename: '[name].bundle.js'
  },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin(),
      new OptimizeCssAssetsWebpackPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 'style-loader', // 将样式通过 style 标签注入
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Dynamic import',
      template: './src/index.html',
      filename: 'index.html'
    }),
    new MiniCssExtractPlugin()
  ]
}
```

### 输出文件名 Hash

一般部署前端资源文件时都会开启服务器静态资源缓存

- 如果缓存策略失效时间过短的话，效果不明显
- 如果缓存策略失效时间过长的话，文件修改了又没办法及时更新到客户端

为了解决这个问题，生产模式下给输出文件名添加 hash 值，这样全新的文件名就是全新的文件，这样就不会有缓存问题了

**文件资源缓存**

1. `hash`：每次 webpack 构建时会生成一个唯一的 hash 值。不管文件是否有变化它都会变化
2. `chunkhash`：如果打包来源于同一个 chunk，那么 hash 值就一样。如果在 js 中引入 css，js 和 css 就会绑定在一起
3. `contenthash`：根据文件的内容生成 hash 值。不同文件 hash 值一定不一样

```js
module.exports = {
  output: {
    filename: '[name]-[contenthash:8].bundle.js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]-[contenthash:8].bundle.css'
    })
  ]
}
```

