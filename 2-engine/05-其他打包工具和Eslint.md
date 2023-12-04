# 其他打包工具和Eslint

## Rollup

**概述**

- Rollup 更为小巧，仅仅是一款 ESM 打包器
- Rollup 中并不支持类似 HMR 这种高级特性
- Rollup 提供一个充分利用 ESM 各项特性的高效打包器

安装

```bash
yarn add rollup --dev
```

打包命令

- `--format`：指定代码输出格式
- `--file`：指定打包路径
- Rollup 会自动开启 `tree-shaking`

```bash
yarn rollup ./src/index.js --format iife --file dist/bundle.js
```

**配置文件**

- 新建 `rollup.config.js`
- `yarn rollup --config` 使用 `--config` 指定配置文件

```js
export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  }
}
```

### 使用插件

插件是 Rollup 唯一扩展途径

- 加载其它类型资源模块
- 导入 CommonJS 模块
- 编译 ECMAScript 新特性

安装 `rollup-plugin-json`

```bash
yarn add rollup-plugin-json --dev
```

配置 `rollup.config.js`

```js
import json from 'rollup-plugin-json'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    // 这里是将调用的结果放到数组中
    json()
  ]
}
```

**加载 npm 模块**

Rollup 默认只能按照文件路径方式加载本地文件模块，对于 `node_modules` 中的第三方模块并不能通过模块名称直接导入，可以使用 `rollup-plugin-node-resolve`

配置 `rollup.config.js`

```js
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve()
  ]
}
```

**加载 CommonJS 模块**

配置 `rollup.config.js`

```js
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    resolve(),
    commonjs()
  ]
}
```

### 代码拆分

动态导入使用 `format` 格式不能是 `iife` 形式

```js
import('./logger').then(({ log }) => {
  log('code splitting~')
})
```

- `format` 需要使用 `amd` 形式
- 代码拆分不能输出一个文件，需要以 `dir` 方式输出

```js
export default {
  input: 'src/index.js',
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife'
    dir: 'dist',
    format: 'amd'
  }
}
```

**多入口打包**

- 多入口打包内部会自动提取公共模块，`format` 需要使用 `amd` 形式

```js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'amd'
  }
}
```

- AMD 标准格式的输出 `bundle` 不能在浏览器直接引用

- 需要使用 `require.js` 这样的库引用

  可以通过 `data-main` 来指定 `require` 入口模块路径

```html
<script src="https://unpkg.com/requirejs@2.3.6/require.js" data-main="foo.js"></script>
```

Rollup 优点

- 输出结果更加扁平
- 自动移除未引用代码
- 打包结果依然完全可读

Rollup 缺点

- 加载非 ESM 的第三方模块比较复杂
- 模块最终都被打包到一个函数中，无法实现 HMR
- 浏览器环境中，代码拆分功能依赖 AMD 库

如果我们正在开发应用程序，Rollup 不是很好的选择；如果我们正在开发一个框架或者类库，Rollup 是很好的选择，大多数知名框架/库都在使用 Rollup

- webpack 大而全
- rollup 小而美

## Eslint

**为什么要有规范化标准**

- 软件开发需要多人协同
- 不同开发者具有不同编码习惯和喜好
- 不同的喜好增加项目维护成本
- 每个项目或者团队需要明确统一的标准

**哪里需要规范化标准**

- 代码、文档、甚至是提交日志
- 开发过程中人为编写的成果物
- 代码标准化规范最为重要

**实施规范化的方法**

- 编码前人为的标准约定
- 通过工具实现 Lint

**常见的规范化实现方式**

- ESLint 工具使用
- 定制 ESLint 校验规则
- ESLint 对 Typescript 的支持
- ESLint 结合自动化工具或者 Webpack
- 基于 ESLint 的衍生工具
- Stylelint 工具的使用

### 快速上手

**安装**

- 初始化项目
- 安装 ESLint 模块为开发依赖
- 通过 CLI 命令验证安装结果

```bash
npm init --yes
```

查看 eslint 版本

```bash
cd node_modules/.bin/
./eslint --version

npx eslint --version
```

**初始化 eslint**

- 按照命令行提问的问题生成 `.eslintrc.js` 文件

```bash
npx eslint --init
```

- 修改问题

  跟上 `--fix` 自动解决

```bash
npx eslint ./01-prepare.js --fix
```

### 配置文件

```js
module.exports = {
  env: {
    browser: false,
    es6: false
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 2015
  },
  rules: {
    'no-alert': 'error'
  },
  globals: {
    jQuery: 'readonly'
  }
}
```

`env`：标记当前代码运行环境，eslint 会 **根据环境信息来判断某个全局成员是否可用**

- 这里需要注意，如果把 `browser: false`，按道理来说是不能使用 `document`

  是因为在生成配置时采用的是 `standard` 风格，`standard` 里做了相应的配置

- 可以去查看 `node_modules\eslint-config-standard\eslintrc.json` 里面将 `document` 设为全局只读成员

  ```json
  {
    "globals": {
      "document": "readonly",
      "navigator": "readonly",
      "window": "readonly"
    },
  }
  ```

- 使用 `alert` 是可以报错的

![eslintEnv](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/eslintEnv.png)

`parserOptions`：设置语法解析器相关配置，**版本的设置只是影响语法的检测，不代表某个成员是否可用**

- 将 `ecmaVersion: 5` 之后使用 es6 语法会报如下错误

  ```bash
  Parsing error: sourceType 'module' is not supported when ecmaVersion < 2015. Consider adding `{ ecmaVersion: 2015 }` to the parser options
  ```

  修改 `eslintrc.json` 里面的 `"sourceType": "script"`

  ```json
  {
    "parserOptions": {
      "sourceType": "script"
    },
  }
  ```

  最后才会报出如下错误

  ```bash
  Parsing error: The keyword 'const' is reserved
  ```

`rules`：配置每个校验规则的开启或关闭

- 有是哪个属性：`off` 关闭、`on` 发出警告、`error` 警告

`globals`：额外声明在代码中可以使用的全局成员

- 在新版不显示了

**配置注释**

> [configuring-rules](https://eslint.org/docs/user-guide/configuring/rules#configuring-rules)

将配置通过注释的方式写在脚本中实现校验，不过实际开发中，难免有不符合校验的地方，所以需要特殊处理

```js
/* eslint-disable no-template-curly-in-string */
const str1 = '${name} is a coder'
```

### 自动化工具

**eslint 结合 gulp**

- [https://github.com/zce/zce-gulp-demo](https://github.com/zce/zce-gulp-demo)
- 完成相应的依赖安装
- 完成 `eslint` 模块安装
- 完成 `gulp-eslint` 模块安装

```js
const script = () => {
  return src('src/assets/scripts/*.js', { base: 'src' })
    .pipe(plugins.eslint())
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({ stream: true }))
}

module.exports = {
  script
}
```

**eslint 结合 webpack**

- [https://github.com/zce/zce-react-app](https://github.com/zce/zce-react-app)
- 安装对应模块
- 安装 `eslint` 模块
- 安装 `eslint-loader` 模块
- 初始化 `.eslintrc.js` 配置文件

**注意：** 顺序是从后往前执行

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: 'babel-loader'
      },
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: 'eslint-loader',
        enforce: 'pre'
      }
    ]
  }
}
```

因为 react 比较特殊，`main.js` 确实没用到，但实际上 react 是被使用到的，这时候就要进行特殊处理，下载专门处理 react 的插件

```bash
npm install eslint-plugin-react
```

对于大多数 eslint 的插件来说都会提供一个共享的配置，从而降低使用成本，`eslint-plugin-react` 也导出 2 个共享配置：`recommended` 和 `all`

```js
module.exports = {
  env: {
    browser: false,
    es6: true
  },
  extends: ['standard', 'plugin:react/recommended'],
  parserOptions: {
    ecmaVersion: 11
  },
  /* rules: {
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2
  },
  // 这里的模块名需要去掉 eslint-plugin
  plugins: ['react'] */
}
```

### 现代化项目集成

全局安装 `@vue/cli`

```bash
npm install @vue/cli -g
```

根据项目需求初始化项目

```bash
vue create syy-vue-app
```

**检查 TypeScript**

- `parser`：指定语法解析器

```js
module.exports = {
  env: {
    browser: true,
    es2020: true
  },
  extends: ['standard'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11
  },
  plugins: ['@typescript-eslint'],
  rules: {}
}
```

**StyleLint**

- 提供默认的代码检查规则
- 提供 CLI 工具，快速调用
- 通过插件支持 Sass、Less、PostCSS
- 支持 Gulp 或 Webpack 集成

```bash
npm install stylelint -D
npm install stylelint-config-standard -D

npm install stylelint-config-sass-guidelines -D
```

配置 `.stylelintrc.js`

```js
module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-sass-guidelines']
}
```

### Prettier

安装

```bash
npm install prettier -D
```

格式化代码

```bash
npx prettier style.css --write
npx prettier . --write
```

### Git Hooks

通过 Git Hooks 在代码提交前强制 lint

- Git Hook 也称之为 git 钩子，每个钩子都对应一个任务
- 通过 shell 脚本可以编写钩子任务触发时要具体执行的操作

可以直接修改 `hooks/pre-commit.sample`，或者使用 Husky

```bash
npm install husky -D
```

在 `package.json` 增加 `husky` 的配置

```json
{
  "scripts": {
    "test": "eslint ./index.js",
  },
  "husky": {
    "hooks": {
      "pre-commit": "npm run test"
    }
  },
}
```

如果想在检查完代码后直接进行格式化并放入暂存区，使用 `husky` 就不够用了，这时需要使用 `lint-staged`

```bash
npm install lint-staged -D
```

在 `package.json` 增加 `lint-staged` 的配置

```json
{
  "lint-staged": {
    "*.js": [
      "eslint --fix",
      "git add"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
}
```

