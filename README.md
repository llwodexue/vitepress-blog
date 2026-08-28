# LynDocs

基于 VitePress 的前端学习与实践笔记站点，内容按知识域组织，使用自动 sidebar 生成文章列表。

## 开发

环境要求：Node.js 18+，pnpm 9+。

```bash
pnpm install
pnpm dev
```

开发服务器启动后访问终端输出的本地地址。修改 Markdown、`.vitepress` 配置或主题组件后，页面会自动更新。

## 构建与预览

```bash
# 构建根路径部署版本
pnpm build:blog

# 构建 GitHub Pages 版本（BASE=/vitepress-blog/）
pnpm build

# 预览已构建的 dist
pnpm serve
```

`build:blog` 用于根路径部署；部署到 GitHub Pages 项目站点时使用 `build`，其 `BASE` 由脚本统一设置。若部署到其他子路径，应按实际站点路径调整 `BASE`。

## 目录结构

```text
1-js/       JavaScript、TypeScript 与浏览器 API
2-engine/   工程化、模块化与构建工具
3-base/     网络协议、数据结构与算法
4-vue/      Vue 生态、源码与项目实践
5-react/    React 基础、进阶与源码
6-node/     Node.js 与服务端框架
7-ops/      服务器、容器与部署运维
8-notes/    旅游与听书笔记
10-other/   小程序、跨端与性能优化
.vitepress/ VitePress 配置、sidebar、主题与构建扩展
```

## 文档约定

- 新文章按目录编号和主题命名，例如 `8-notes/01-旅行笔记.md`。
- 代码块按真实文件类型标注语言；小程序的 WXML、WXSS、页面 JS 分开书写。
- 版本、命令和安全建议以当前官方文档为准；历史方案需标明适用范围。
- 通用审查规则见 [`.claude/skills/doc-review.md`](.claude/skills/doc-review.md)，项目协作约定见 [`AGENTS.md`](AGENTS.md)。

## 配置入口

- `.vitepress/config.ts`：站点元数据、主题、Markdown 和 PWA 配置
- `.vitepress/sidebar/`：按目录生成 sidebar 与顶部导航
- `.vitepress/theme/`：主题组件和样式覆盖
- `.vitepress/utils/autoSidebar.ts`：按文件名前缀归类文章

## 发布

构建产物位于 `dist/`。发布流程应使用版本化产物并保留可回滚版本；不要在生产服务器上直接修改构建目录。GitHub Pages 可按 VitePress 官方部署指南配置 Actions。
