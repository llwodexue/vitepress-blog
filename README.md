# vitepress-blog

参考 vitepress 官方教程：[https://vitepress.dev/guide/deploy#github-pages](https://vitepress.dev/guide/deploy#github-pages)

## 设置Actions

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

## 设置Pages

![image-20231201172803212](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231201172803212.png)

## 设置base

vitepress 中的 base 需要设置为 项目名

修改 `package.json`

```json
"scripts": {
  // 专门针对 github pages 目录设置的变量, 设置 process.env.BASE 值
  "build": "cross-env BASE=/vitepress-blog/ vitepress build"
}
```

修改 `.vitepress/config.ts`

```typescript
const base = process.env.BASE || '/'
export default defineConfig({
  base,
}
```
