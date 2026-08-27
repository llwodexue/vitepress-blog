# 智能开发助手的 Skills、MCP 与 Plugins 指南

本文记录当前开发环境中 Codex 与 Claude Code 使用的 Skills、MCP 和 Plugins，并说明它们之间的区别、共享方式与维护原则。

## 一、三种能力的区别

| 类型 | 核心作用 | 典型内容 | 是否依赖外部进程 |
| --- | --- | --- | --- |
| Skill | 告诉 Agent 在特定任务中应该遵循什么工作流 | `SKILL.md`、脚本、模板、参考资料 | 通常不依赖 |
| MCP | 通过标准协议向 Agent 提供工具和外部数据 | 文档查询、数据库、浏览器、业务系统 | 是 |
| Plugin | 将 Skill、MCP、连接器或 UI 打包为完整扩展 | 浏览器、文档、表格、邮件、Slack | 视插件而定 |

简单理解：

- Skill 是“工作说明书”
- MCP 是“工具接口”
- Plugin 是“能力安装包”

## 二、当前 Skills 清单

当前 Codex 主清单共发现 90 个 Skill 文件，分为系统、用户全局、项目和插件随附能力。

### 1. 系统与全局 Skills

| Skill | 用途 |
| --- | --- |
| `imagegen` | 生成或编辑图片、插画、纹理和视觉稿 |
| `openai-docs` | 查询 Codex、ChatGPT 和 OpenAI API 官方资料 |
| `plugin-creator` | 创建 Codex Plugin |
| `review-agent` | 对指定代码变更进行只读代码审查 |
| `skill-creator` | 创建或更新自定义 Skill |
| `skill-installer` | 从官方精选列表或 GitHub 安装 Skill |
| `playwright` | 浏览器自动化、页面测试、截图和 UI 流程调试 |
| `security-best-practices` | JavaScript、TypeScript 等语言的安全审查 |
| `gh-fix-ci` | 分析并修复 GitHub Actions 检查失败 |

### 2. Vue 开发 Skills

| Skill | 用途 |
| --- | --- |
| `vue-best-practices` | Vue 3、Composition API、TypeScript 最佳实践 |
| `vue-debug-guides` | Vue 运行时、异步和 hydration 问题排查 |
| `vue-jsx-best-practices` | Vue JSX 语法和配置规范 |
| `vue-options-api-best-practices` | Vue 3 Options API 专项规范 |
| `vue-pinia-best-practices` | Pinia Store 与响应式状态管理 |
| `vue-router-best-practices` | Vue Router 4、守卫和路由生命周期 |
| `vue-testing-best-practices` | Vitest、Vue Test Utils 和 Playwright 测试规范 |
| `create-adaptable-composable` | 创建支持普通值、Ref 和 Getter 的 Composable |

### 3. Firecrawl Skills

当前已安装 29 个 Firecrawl 相关 Skill。

| 分类 | Skills | 用途 |
| --- | --- | --- |
| 基础能力 | `firecrawl`、`firecrawl-search`、`firecrawl-scrape`、`firecrawl-map` | 搜索、抓取网页和发现站点 URL |
| 批量处理 | `firecrawl-crawl`、`firecrawl-download`、`firecrawl-agent` | 整站抓取、离线下载和结构化提取 |
| 页面交互 | `firecrawl-interact`、`firecrawl-build-interact` | 点击、输入、分页和登录态流程 |
| 项目集成 | `firecrawl-build-onboarding`、`firecrawl-build-search`、`firecrawl-build-scrape` | 将 Firecrawl API 集成到应用 |
| 研究分析 | `firecrawl-deep-research`、`firecrawl-research-papers`、`firecrawl-market-research`、`firecrawl-competitive-intel` | 深度研究、论文、市场和竞品分析 |
| 知识管理 | `firecrawl-knowledge-base`、`firecrawl-knowledge-ingest`、`firecrawl-parse` | 构建知识库和解析本地文件 |
| 网站质量 | `firecrawl-qa`、`firecrawl-demo-walkthrough`、`firecrawl-seo-audit`、`firecrawl-website-design-clone` | QA、体验走查、SEO 和设计系统提取 |
| 商务能力 | `firecrawl-company-directories`、`firecrawl-lead-gen`、`firecrawl-lead-research`、`firecrawl-dashboard-reporting`、`firecrawl-shop` | 企业、线索、仪表盘和商品研究 |
| 工作流 | `firecrawl-workflows` | 生成完整的研究、QA、线索或知识库交付物 |

### 4. 项目专属 Skills

当前 `pure-admin-thin` 项目主要使用：

| Skill | 用途 |
| --- | --- |
| `weekly-report` | 生成提交信息、周报和执行周报工作流 |
| `travel-planner` | 生成旅游计划和攻略表格，当前为 Claude Code 入口 |
| `duty-report-workflow` | 值班报告业务开发工作流，当前保留在历史目录 |

Codex 项目 Skill 使用 `.agents/skills/`，Claude Code 使用 `.claude/skills/`。当前 `weekly-report` 通过相同副本兼容两边。

### 5. 插件随附 Skills

| 插件类型 | 主要 Skills |
| --- | --- |
| 浏览器与可视化 | `control-in-app-browser`、`visualize` |
| 办公文档 | `documents`、`pdf`、`Presentations`、`Spreadsheets`、`excel-live-control` |
| 模板管理 | `template-creator`、20 个 `artifact-template-*` 模板 |
| 插件管理 | `plugin-management` |
| Gmail | `gmail`、`gmail-inbox-triage` |
| Google Calendar | 日程管理、每日简报、空闲时间、多人排期、会前准备 |
| Slack | 频道摘要、每日简报、通知分级、消息与回复草稿 |

这些 Skill 依赖对应插件或连接器，不能只复制 `SKILL.md` 使用。

## 三、当前 MCP 清单

| MCP | 用途 | Codex | Claude Code |
| --- | --- | --- | --- |
| `context7` | 获取最新框架和第三方库文档 | 已配置 | 已配置 |
| `figma-developer-mcp` | 读取 Figma 设计上下文 | 已配置 | 已配置但连接失败 |
| `node_repl` | Codex 内置 Node/JavaScript 运行桥接 | 已配置 | 未配置 |

`context7` 通过 `@upstash/context7-mcp@latest` 启动。MCP Server 可以共用，但两边需要分别配置，授权状态也不会自动同步。

## 四、当前 Plugins 清单

当前 Codex 配置中启用了 10 个 Plugin：

| Plugin | 用途 |
| --- | --- |
| `visualize@openai-bundled` | 交互式图表、模拟器和可视化工具 |
| `browser@openai-bundled` | 应用内浏览器控制和本地页面测试 |
| `documents@openai-primary-runtime` | Word 文档创建、编辑和渲染验证 |
| `pdf@openai-primary-runtime` | PDF 读取、创建和验证 |
| `spreadsheets@openai-primary-runtime` | Excel、CSV 和 TSV 处理 |
| `presentations@openai-primary-runtime` | PPT/PPTX 与 Slides 处理 |
| `template-creator@openai-primary-runtime` | 创建可复用产物模板 |
| `gmail@openai-curated` | Gmail 邮件处理 |
| `google-calendar@openai-curated` | Google Calendar 日程处理 |
| `slack@openai-curated` | Slack 消息和频道处理 |

Plugin 是平台级能力。Codex Plugin 不能直接复制给 Claude Code 使用，除非插件底层服务另行提供了 Claude Code 支持的 MCP Server 或 CLI。

## 五、Codex 与 Claude Code 能否共用

| 能力 | 是否可共用 | 说明 |
| --- | --- | --- |
| Skills | 可以复用内容 | Codex 使用 `.agents/skills/`，Claude Code 使用 `.claude/skills/`，需要复制或同步 |
| MCP | 可以共用 Server | 两边必须分别配置；当前 `context7` 已同时配置 |
| Plugins | 通常不可以 | 平台插件依赖各自运行时，只能复用其公开 MCP、API 或 CLI |

同步 Skill 时仍要检查平台特有工具，例如 Codex Plugin 工具在 Claude Code 中可能不存在。

## 六、当前项目推荐组合

| 开发场景 | 推荐能力 |
| --- | --- |
| Vue 页面开发 | `vue-best-practices`、`vue-router-best-practices`、`vue-pinia-best-practices` |
| 组件测试 | `vue-testing-best-practices` |
| E2E 和浏览器调试 | `playwright`、`control-in-app-browser` |
| Vue 故障排查 | `vue-debug-guides`、`context7` |
| TypeScript 安全审查 | `security-best-practices` |
| GitHub Actions 修复 | `gh-fix-ci` |
| 网站 QA 和设计分析 | `firecrawl-qa`、`firecrawl-website-design-clone` |
| 周报与提交信息 | `weekly-report` |

## 七、安装与维护

```bash
# 搜索
npx skills find "vue testing"

# 全局安装
npx skills add <owner/repo@skill> -g -y

# 检查更新
npx skills check
```

1. 新建 Codex 项目 Skill 优先放入 `.agents/skills/`
2. 需要 Claude Code 共用时，同步到 `.claude/skills/`
3. API Key、Token 等凭据通过环境变量管理，不要写入文档或 Git
4. Plugin 升级后重新检查随附 Skill 和 MCP 配置

## 八、使用 DeepSwitch 切换 Codex 与 DeepSeek

DeepSwitch 是一个第三方开源命令行工具，可以在 Codex 原有配置、DeepSeek V4 Flash 和 DeepSeek V4 Pro 之间切换。

- 项目地址：[Juberstine/deepswitch](https://github.com/Juberstine/deepswitch)
- 下载地址：[DeepSwitch Releases](https://github.com/Juberstine/deepswitch/releases/latest)

Windows 用户在 Releases 中下载对应压缩包，解压得到 `deepswitch.exe`，放入固定目录并加入系统 `PATH`。

首次使用时配置 DeepSeek API Key：

```powershell
# 默认使用 DeepSeek V4 Flash
deepswitch setup

# 使用 DeepSeek V4 Pro
deepswitch setup pro
```

常用切换命令：

```powershell
# 切回 Codex
deepswitch codex

# 切换到 DeepSeek V4 Flash
deepswitch deepseek

# 切换到 DeepSeek V4 Pro
deepswitch deepseek pro

# 查看当前状态
deepswitch status
```

不带参数运行 `deepswitch` 也可以通过菜单选择。切换完成后，重新启动 Codex CLI 或 Codex Desktop 会话即可。

> Windows 原生 Codex 使用 `deepswitch.exe`；WSL 中的 Codex 使用 Linux 版本，两者不要混用。

## 九、Claude Code 下载、安装与切换

### 1. 官方下载入口

Claude Code 官方文档：[Claude Code 安装指南](https://code.claude.com/docs/en/getting-started)

使用 npm 安装前，需要准备 Node.js 22 或更高版本：

```powershell
npm install -g @anthropic-ai/claude-code
```

升级 Claude Code：

```powershell
npm install -g @anthropic-ai/claude-code@latest
```

安装后验证：

```powershell
claude --version
claude doctor
```

在项目目录启动：

```powershell
cd E:\pure-admin-thin
claude
```

首次运行会引导浏览器登录。Claude Code 官方订阅登录需要支持 Claude Code 的账户，也可以按官方文档接入 Anthropic API、Amazon Bedrock、Google Cloud 或 Microsoft Foundry。

### 2. 切换 Claude Code 模型

进入 Claude Code 后执行：

```text
/model
```

在菜单中选择当前账户可用的模型。也可以在启动时通过 Claude Code 支持的模型参数指定模型，具体名称以 `/model` 实际显示为准。

模型切换与 Provider 切换不同：

- 模型切换：仍使用同一个账户或 Provider，只改变具体模型
- Provider 切换：在 Anthropic 官方、第三方兼容 API 或其他云平台之间切换
- 账户切换：退出当前登录后，使用另一个账号重新登录

### 3. 切换官方 Claude 账户

在 Claude Code 中运行退出登录命令，完成退出后重新执行：

```powershell
claude
```

然后按浏览器提示登录另一个账户。不同版本的内置命令可能变化，可在交互会话中执行 `/help` 查看当前可用的登录和退出命令。

频繁切换 Provider 或第三方 API 时，建议使用 CC Switch，避免手工反复修改：

```text
%USERPROFILE%\.claude\settings.json
```

## 十、使用 CC Switch 管理 Claude Code 和 Codex

CC Switch 是第三方开源桌面工具，可以集中管理 Claude Code、Codex 等开发助手的 Provider、MCP 和 Skills。

- 项目地址：[farion1231/cc-switch](https://github.com/farion1231/cc-switch)
- 下载地址：[CC Switch Releases](https://github.com/farion1231/cc-switch/releases/latest)

Windows 用户可在 Releases 中选择：

- `CC-Switch-v{version}-Windows.msi`：安装版
- `CC-Switch-v{version}-Windows-Portable.zip`：便携版

首次打开时，先导入已有的 Claude Code 和 Codex 配置，再添加新的 Provider：

```text
选择 Claude Code 或 Codex
→ 添加 Provider
→ 选择预设或填写 Base URL、API Key、模型
→ 保存并点击“启用”
```

日常切换可以在主界面选择 Provider，也可以通过系统托盘快速切换。Claude Code 通常可以直接生效，Codex 建议在切换后重启 CLI 或 Desktop 会话。

切回官方账号时，选择 `Official Login` Provider，然后按对应工具的官方登录流程重新认证。

同步 MCP 或 Skills：

```text
进入 MCP 或 Skills 页面
→ 添加或导入配置
→ 选择 Claude Code、Codex 等目标应用
→ 开启同步
```

> API Key 不要提交到 Git。DeepSwitch 和 CC Switch 都会修改 Codex Provider 配置，建议只选择一个工具负责日常切换。

## 十一、当前维护状态

- Codex 主清单共 90 个 Skill 文件
- Codex 配置了 3 个 MCP Server
- Codex 启用了 10 个 Plugin
- `context7` 已分别配置给 Codex 和 Claude Code
- MCP 配置中未发现常见明文密钥字段
- `weekly-report` 的三个兼容副本内容一致
- `travel-planner` 和 `duty-report-workflow` 因存在目录自引用，暂时保持原位置
