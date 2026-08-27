# Rollup 和 ESLint

## Rollup

Rollup 侧重模块与产物优化，尤其适合库构建；应用是否适合使用它取决于开发服务器、框架插件、测试和部署链路是否完整，而不是只按“库/应用”二分。

**概述**

- Rollup 以 ES Module 为核心进行依赖分析与打包
- HMR 通常由开发服务器和框架插件提供，不应把它视为 Rollup 单独负责的能力
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

安装官方 JSON 插件：

```bash
npm install --save-dev @rollup/plugin-json
```

配置 `rollup.config.js`

```js
import json from '@rollup/plugin-json'

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

Rollup 默认按文件路径加载本地模块。要解析 `node_modules` 中的包名，可使用官方的 `@rollup/plugin-node-resolve`。

配置 `rollup.config.js`

```js
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    nodeResolve()
  ]
}
```

**加载 CommonJS 模块**

配置 `rollup.config.js`

```js
import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife'
  },
  plugins: [
    json(),
    nodeResolve(),
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

- `format` 需要使用支持代码拆分的格式，例如 `es`、`system` 或 `amd`
- 代码拆分不能输出一个文件，需要以 `dir` 方式输出

```js
export default {
  input: 'src/index.js',
  output: {
    // file: 'dist/bundle.js',
    // format: 'iife'
    dir: 'dist',
    format: 'es'
  }
}
```

**多入口打包**

- 多入口打包内部会自动提取公共模块，输出格式需支持代码拆分

```js
export default {
  // input: ['src/index.js', 'src/album.js'],
  input: {
    foo: 'src/index.js',
    bar: 'src/album.js'
  },
  output: {
    dir: 'dist',
    format: 'es'
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

Rollup 的取舍

- 非 ESM 依赖通常需要 CommonJS 等插件处理
- 代码拆分的加载方式取决于输出格式与运行环境；现代浏览器通常选择 `es`，而非强依赖 AMD

如果我们正在开发应用程序，Rollup 不是很好的选择；如果我们正在开发一个框架或者类库，Rollup 是很好的选择，大多数知名框架/库都在使用 Rollup

- webpack 大而全
- rollup 小而美

## Rollup 实现 alias插件

### 构建钩子

钩子是在构建的各个阶段调用的函数。钩子可以影响构建的运行方式，提供关于构建的信息，或在构建完成后修改构建

> [构建钩子](https://cn.rollupjs.org/plugin-development/#build-hooks)

![image-20250417095827614](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250417095827614.png)

### 初步实现一个插件

初始化 `package.json`(pnpm init) 和 typescript.json(tsc --init)

创建 `src/index.ts` 文件，并安装 `rollup`

```typescript
import { Plugin } from 'rollup'

export function alias(): Plugin {
  return {
    name: 'alias',
    resolveId(source: string, importer: string | undefined) {
      console.log('alias - resolveId ->', source, importer)
      // 这里可以先写死，把 @/add -> @/src/add
      return source
    }
  }
}
```

创建 `rollup.config.js` 文件，并安装 `@rollup/plugin-typescript`

```typescript
import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'

export default defineConfig({
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'es'
  },
  plugins: [
    typescript({
      module: 'esnext'
    })
  ]
})
```

在 `package.json` 中增加 `"build": "rollup -c rollup.config.js"`，直接运行会报如下警告

- 由于 CommonJS 和 ESM 有冲突，需要在 `package.json` 中增加 `"type": "module"`

![image-20250417101521678](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250417101521678.png)

之后即可打包成功，之后还需要指定 `"main": "./dist/index.js"`

![image-20250417102548895](https://gitee.com/lilyn/pic/raw/master/md-img/image-20250417102548895.png)

### 完善插件结构

由于 alias 会接受 options 入参，需要对入参做类型校验

- 比如：先对 entries 做校验

```typescript
interface AliasOptions {
  entries: {
    [key: string]: string
  }
}
```

为了良好的代码提示，需要把声明以 .d.ts 文件形式输出到 dist 目录，需要修改 `tsconfig.json`

```json
/* Generate .d.ts files from TypeScript and JavaScript files in your project. */
"declaration": true,
/* Specify an output folder for all emitted files. */
"outDir": "./dist",   
```

给 `package.json` 文件增加 `"types": "./dist/index.d.ts"`

之后就可以完善 `rollup.config.js` 了

```typescript
import { Plugin } from 'rollup'

interface AliasOptions {
  entries: {
    [key: string]: string
  }
}
export function alias(options: AliasOptions): Plugin {
  const { entries } = options
  return {
    name: 'alias',
    resolveId(source: string) {
      // 看看是不是有对应的 alias match
      const key = Object.keys(entries).find(e => source.startsWith(e))
      if (!key) return source
      return source.replace(key, entries[key]) + '.js'
    }
  }
}
```

### 使用单元测试提高开发效率

安装 `vitest`，并修改 `package.json` 中 `"test": "vitest"`

如果报如下错误，说明 node 版本太低了，切换到 v18 以上即可

```bash
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Startup Error ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯file:///xx/alias/node_modules/.pnpm/vite@6.3.1/node_modules/vite/dist/node/chunks/dep-Bxmd1Uxj.js:4
import fsp, { constants as constants$3 } from 'node:fs/promises';
              ^^^^^^^^^
SyntaxError: The requested module 'node:fs/promises' does not provide an export named 'constants'
    at ModuleJob._instantiate (node:internal/modules/esm/module_job:128:21)        
    at async ModuleJob.run (node:internal/modules/esm/module_job:194:5)
    at async Promise.all (index 0)
    at async ESMLoader.import (node:internal/modules/esm/loader:385:24)
    at async start (file:///E:/learn/lagouBigFront/md/Webpack/code/alias/node_modules/.pnpm/vitest@3.1.1/node_modules/vitest/dist/chunks/cac.DK21mt6F.js:1467:27) 
```



## ESLint

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
- ESLint 对 TypeScript 的支持
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

- ESLint 9 起默认使用扁平配置 `eslint.config.js`。旧 `.eslintrc.*` 示例仅适用于旧项目；新项目可使用初始化命令生成起点后再按项目调整。

```bash
npm init @eslint/config@latest
```

- 修改问题

  跟上 `--fix` 自动解决

```bash
npx eslint ./01-prepare.js --fix
```

### 旧版配置文件（`.eslintrc.*`）

> 新项目请优先使用 `eslint.config.js`。扁平配置不再使用 `env`，应显式声明文件范围、语言选项和 globals。

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

- 有三个属性：`off` 关闭、`warn` 发出警告、`error` 报错

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
- `eslint-loader` 已废弃。可在 CI / npm scripts 中运行 ESLint，或使用 `eslint-webpack-plugin` 作为开发期反馈。

**注意：** 顺序是从后往前执行

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/, 
        use: 'babel-loader'
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

Vue 项目推荐由 `create-vue` 创建，并在创建时选择 ESLint：

```bash
npm create vue@latest
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

