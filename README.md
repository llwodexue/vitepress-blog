# [vitepress-blog](https://github.com/llwodexue/vitepress-blog)

vitepress 空模板

## 部署方法

参考 vitepress 官方教程 https://vitepress.dev/guide/deploy#github-pages

### 1.添加 github actions 配置

```yml
# .github/workflows/main.yml
name: 主分支部署到 github pages
on:
  workflow_dispatch: {}
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: npm
      - run: npm ci
      - name: Build
        run: npm run build
      - uses: actions/configure-pages@v2
      - uses: actions/upload-pages-artifact@v1
        with:
          path: ./.vitepress/dist
      - name: Deploy
        id: deployment
        uses: actions/deploy-pages@v1
```

### 2.设置 Pages

![github-pages-settings](http://cdn.zuo11.com/imgs/github-pages-settings.png)

### 3. 关于 base 设置

由于 github pages 使用的是 `https://dev-zuo.github.io/仓库名/` 而非 `https://dev-zuo.github.io`，因此 vitepress 中的 base 需要设置为 项目名

为了在 github pages 和在其他地方部署都不需要修改代码使用 node 的 process.env.BASE 参数做处理。

```js
// package.json
"scripts": {
    // 专门针对 github pages 目录设置的变量, 设置 process.env.BASE 值
    "build": "cross-env BASE=/new-vitepress-demo/ vitepress build",
    // 如果是部署到其他地方直接 vitepress build 即可
    "build-other-place": "vitepress build"
  },

// vitepress
// .vitepress\config.ts
const base = process.env.BASE || '/'

// --vp-code-block-bg
export default defineConfig({
  base,
}
```
