# vitepress-blog

## 开启Pages

GitHub Actions 配置文件，参考 vitepress 官方教程：[https://vitepress.dev/guide/deploy#github-pages](https://vitepress.dev/guide/deploy#github-pages)

点击 Pages，Source 选择 GitHub Actions，操作如下图：

![image-20231205105845133](https://gitee.com/lilyn/pic/raw/master/lagoulearn-img/image-20231205105845133.png)

## 设置base

vitepress 中的 base 需要设置为项目名。修改 `package.json`

- BASE 改为你 GitHub 该项目的项目名，我的项目名为 `vitepress-blog` -> `BASE=/vitepress-blog/`

```json
"scripts": {
  // 专门针对 github pages 目录设置的变量
  "build": "cross-env BASE=/vitepress-blog/ vitepress build",
  // 部署到其他地方
  "build:blog": "vitepress build"
}
```
