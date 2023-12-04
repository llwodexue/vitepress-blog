# Node基础

## I/O 处理

异步非阻塞 I/O

```js
fs.readFile('./download.js', (err, data) => {
  if (err) throw err
  console.log(data, data.toString())
})

~(async () => {
  const fs = require('fs')
  const { promisify } = require('util')
  const readFile = promisify(fs.readFile)
  const data = await readFile('./download.js')
  console.log(data.toString())
})()
```

Buffer 缓冲区

- Buffer 用于 TCP 流、文件系统操作、以及其他上下文中与八位字节流进行交互
- 八位字节组成的数组，可以有效的在 JS 中存储二进制数据

```js
// 创建一个长度为10字节以0填充的Buffer
const buf1 = Buffer.alloc(10)
console.log(buf1) // <Buffer 00 00 00 00 00 00 00 00 00 00>

// 创建一个Buffer包含ascii.
const buf2 = Buffer.from('a')
console.log(buf2, buf2.toString()) // <Buffer 61> a

// 创建Buffer包含UTF-8字节
const buf3 = Buffer.from('中文')
console.log(buf3) // <Buffer e4 b8 ad e6 96 87>

// 合并Buffer
const buf4 = Buffer.concat([buf2, buf3])
console.log(buf4, buf4.toString()) // <Buffer 61 e4 b8 ad e6 96 87> a中文
```

http 服务

```js
const http = require('http')
const fs = require('fs')
const server = http.createServer((request, response) => {
  // response.end('hello ...')
  const { url, method, headers } = request
  if (url === '/' && method === 'GET') {
    // 静态页面服务
    fs.readFile('index.html', (err, data) => {
      response.statusCode = 200
      response.setHeader('Content-Type', 'text/html')
      response.end(data)
    })
  } else if (url === '/users' && method === 'GET') {
    // Ajax服务
    response.writeHead(200, {
      'Content-Type': 'application/json'
    })
    response.end(
      JSON.stringify({
        name: 'laowang'
      })
    )
  } else if (method === 'GET' && headers.accept.includes('image/*')) {
    // 图片文件服务
    fs.createReadStream('./' + url).pipe(response)
  }
})
server.listen(3000)
```

stream 流

- stream 是用于 node 中流数据交互的接口

```js
const fs = require('fs')
const rs = fs.createReadStream('./img.png')
const ws = fs.createWriteStream('./img2.png')
rs.pipe(ws)
```

## CLI 工具

注意：需要安装特定版本的 ora、chalk、open

```bash
npm i commander download-git-repo handlebars figlet clear open@8 chalk@4 ora@5 -s
```

定制命令行页面

```js
#!/usr/bin/env node
const program = require('commander')
program.version(require('../package.json').version)
program.command('init <name>').description('init project').action(require('../lib/init'))
program.parse(process.argv)
```

`lib\init.js`

```js
const { promisify } = require('util')
const figlet = promisify(require('figlet'))
const clear = require('clear')
const chalk = require('chalk')
const open = require('open')
const clone = require('./download')

const log = content => console.log(chalk.green(content))

const asyncSpawn = async (...args) => {
  const { spawn } = require('child_process')
  return new Promise(resolve => {
    const proc = spawn(...args)
    proc.stdout.pipe(process.stdout)
    proc.stderr.pipe(process.stderr)
    proc.on('close', () => {
      resolve()
    })
  })
}

module.exports = async name => {
  clear()
  const data = await figlet('Welcome')
  log(data)

  log(`创建项目：${name}`)
  await clone('github:su37josephxia/vue-template', name)

  log(`安装依赖：${name}`)
  const npmRun = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  await asyncSpawn(npmRun, ['install'], {
    cwd: `./${name}`
  })
  log(`
    安装完成：
    To get Start:
    ===========================
      cd ${name}
      npm run serve
    ===========================
  `)

  log('打开浏览器')
  open('http://localhost:8080')
  await asyncSpawn(npmRun, ['run', 'serve'], { cwd: `./${name}` })
}
```

`lib\download.js`

```js
const { promisify } = require('util')
const download = promisify(require('download-git-repo'))
const ora = require('ora')

module.exports = async (repo, desc) => {
  const process = ora(`下载... ${repo}`)
  process.start()
  try {
    await download(repo, desc)
  } catch (error) {
    console.log('err', error)
    process.fail()
  }
  process.succeed()
}
```

约定路由功能

- loader 文件
- 代码模板渲染 hbs Mustache 风格模板

```js
import fs from 'fs'
import handlebars from 'handlebars'
import chalk from 'chalk'

export default async () => {
  // 获取页面列表
  const list = fs
    .readdirSync('./src/views')
    .filter(v => v !== 'Home.vue')
    .map(v => ({
      name: v.replace('.vue', '').toLowerCase(),
      file: v
    }))

  console.log('list', list)

  // 生成路由定义
  compile(
    {
      list
    },
    './src/router.js',
    './template/router.js.hbs'
  )

  // 生成菜单
  compile(
    {
      list
    },
    './src/App.vue',
    './template/App.vue.hbs'
  )

  /**
   * 编译模板文件
   * @param meta 数据定义
   * @param filePath 目标文件路径
   * @param templatePath 模板文件路径
   */
  function compile(meta, filePath, templatePath) {
    if (fs.existsSync(templatePath)) {
      const content = fs.readFileSync(templatePath).toString()
      const result = handlebars.compile(content)(meta)
      fs.writeFileSync(filePath, result)
    }
    console.log(chalk.green(`🚀${filePath} 创建成功`))
  }
}
```

发布 npm

```bash
#!/usr/bin/env bash
npm config get registry # 检查仓库镜像库
npm config set registry=http://registry.npmjs.org
echo '请进行登录相关操作：'
npm login # 登陆
echo "-------publishing-------"
npm publish # 发布
npm config set registry=https://registry.npm.taobao.org # 设置为淘宝镜像
echo "发布完成"
exit
```

