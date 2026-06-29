# Codex 项目指令：easy_resume

在本仓库写代码前，先阅读 `PROJECT_STRUCTURE.md`。该文档是项目结构和重构方向的主约定。

## 项目概况

easy_resume 是一个基于 Next.js App Router 的在线简历编辑器。核心功能是简历画布编辑、模板/主题、PDF 导出、AI 简历点评和本地持久化。

主要技术栈：

- Next.js 16、React 19、TypeScript strict。
- Zustand 管理编辑器、打印、撤销重做状态。
- Ant Design、TDesign Mobile React、Tailwind CSS 4、SCSS module。
- WangEditor 处理富文本。
- Puppeteer 生成 PDF。
- OpenAI SDK 指向 DeepSeek API。
- Biome 负责格式化和 lint。

## 常用命令

- 安装依赖：`pnpm install`
- 本地开发：`pnpm dev`
- 构建：`pnpm build`
- 检查：`pnpm check`
- 格式化：`pnpm format`
- Lint：`pnpm lint`

修改代码后优先运行与改动范围匹配的检查。大改动至少运行 `pnpm check`，涉及路由、服务端、构建配置时运行 `pnpm build`。

## 代码组织

新增业务代码时优先使用以下目标结构：

- 路由入口和 API Route：`src/app`
- 简历编辑器业务：`src/features/resume-editor`
- 跨业务基础 UI：`src/components/ui`
- 底层工具和服务端 helper：`src/lib`
- 全局类型：`src/types`

当前代码还在迁移前状态，存在旧目录：

- `src/app/dashboard/components`
- `src/app/dashboard/hooks`
- `src/components`
- `src/lib/store`
- `src/lib/hooks`
- `src/lib/resume_sytle`

如果只是小修 Bug，可以就近修改旧代码；如果新增较完整的功能或重构相关模块，应优先迁移到 `src/features/resume-editor`。

## 模块边界

- `app/**/page.tsx` 保持薄，只负责路由页面组装，不承载复杂业务逻辑。
- React 组件负责渲染和交互事件转发，复杂副作用放 hook。
- Zustand store 只做状态和同步 action，不直接访问 DOM、`localStorage`、`fetch`。
- API 请求、本地存储、PDF 下载等 IO 放 service。
- 纯计算逻辑写成纯函数，放 `utils`，便于测试。
- 服务端工具放 `src/lib/server`，不要被客户端组件引用。

## 命名约定

- 目录：kebab-case，例如 `resume-editor`。
- 组件：PascalCase，例如 `ResumeCanvas.tsx`。
- Hook：`useXxx.ts`。
- Store：`xxxStore.ts`。
- 类型：PascalCase，避免新增全大写类型名。
- 新代码避免沿用现有拼写错误：`resume_sytle`、`SystemDilaog`、`useMouseOpeartion`。

## 数据模型约定

- 持久化数据不要保存 DOM `ref`。
- 坐标和尺寸内部优先用 number，渲染时再拼接 `px`。
- 简历模板数据应尽量稳定，不要在模块 import 阶段生成随机 ID。
- 富文本 HTML 需要谨慎处理。现有项目允许 `dangerouslySetInnerHTML`，但新增导入、外部输入或服务端处理时应考虑 HTML 清洗和长度限制。
- Undo/redo 保存快照时要深拷贝，不要把后续会继续 mutation 的数组引用放入历史栈。

## UI 和样式

- 新 UI 优先复用 Ant Design、TDesign Mobile React 和 Tailwind。
- 复杂局部样式可以使用 SCSS module。
- 不要把大量固定布局写成 inline style；但简历元素的用户可编辑样式可以保留在数据模型中。
- 画布尺寸、A4 尺寸、打印边距、默认缩放等常量应集中管理。
- 移动端和桌面端共享数据与 action，视图组件可以拆分。

## API 约定

- API Route 只负责 HTTP 入参、状态码和响应。
- Puppeteer、DeepSeek、Redis 等服务端细节抽到 `src/lib/server` 或已有 `src/lib/redis`。
- PDF 导出必须确保 browser 在异常时也关闭。
- 限流错误使用 `429`，不要用 `500`。
- 移除临时 `console.log`，当前 Biome 会将 console 作为错误。

## 提交前检查清单

- 改动是否符合 `PROJECT_STRUCTURE.md` 的模块边界。
- 是否避免修改无关文件。
- 是否没有引入新的拼写错误目录或类型名。
- 是否运行了合适的 `pnpm check` / `pnpm build`。
- 若没有运行检查，在最终回复中明确说明。

