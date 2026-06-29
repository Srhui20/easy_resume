# easy_resume 项目结构规划

本文档用于统一 easy_resume 后续的代码组织、模块边界和重构路线。项目现在已经能跑，第一阶段目标不是重写，而是在保留现有功能的基础上，让后续新增功能、修 Bug 和模板扩展有稳定落点。

## 1. 项目定位

easy_resume 是一个在线简历编辑器，核心能力包括：

- 简历画布编辑：基础信息、段落模块、拖拽、选中、对齐、缩放。
- 简历内容编辑：富文本段落、标题样式、基础信息样式。
- 模板和主题：内置简历数据、主题样式切换。
- 导出：将当前简历转为适合打印的 HTML，再由 Puppeteer 生成 PDF。
- AI 点评：将简历段落提交给 DeepSeek Chat，并流式返回 Markdown 点评。
- 本地持久化：将简历数据存储到 `localStorage`。

## 2. 当前技术栈

- Next.js App Router，React Client Components 为主。
- TypeScript，路径别名 `@/* -> src/*`。
- Ant Design / TDesign Mobile React 作为主要 UI 组件库。
- Tailwind CSS 4 + 少量 SCSS module。
- Zustand 管理编辑器状态、打印状态、撤销重做状态。
- WangEditor 负责富文本编辑。
- Puppeteer 负责服务端 PDF 导出。
- OpenAI SDK + DeepSeek API 负责 AI 点评。
- Biome 负责格式化和静态检查。

## 3. 推荐目录结构

建议逐步演进到下面的结构。迁移时不需要一次完成，每次改功能时顺手把相关代码移动到正确目录即可。

```text
src/
  app/
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts
    api/
      ai/route.ts
      pdf/route.ts
      readFile/route.ts
    dashboard/
      page.tsx

  features/
    resume-editor/
      components/
        canvas/
          ResumeCanvas.tsx
          ResumeElement.tsx
          CanvasToolbar.tsx
        inspector/
          ResumeInspector.tsx
          BaseInfoInspector.tsx
          ParagraphInspector.tsx
        dialogs/
          AiReviewDialog.tsx
          SystemDialog.tsx
          ThemeDialog.tsx
        mobile/
          MobileBaseInfoPanel.tsx
          MobileParagraphPanel.tsx
      hooks/
        useCanvasDrag.ts
        useCanvasScale.ts
        useResumePersistence.ts
        useResumePrintLayout.ts
        useResumeActions.ts
      stores/
        resumeStore.ts
        printStore.ts
        undoStore.ts
      services/
        aiReviewClient.ts
        pdfExportClient.ts
        resumeStorage.ts
      templates/
        resumeStyle1.ts
        themes.ts
      types.ts
      constants.ts
      index.ts

  components/
    ui/
      MainBg.tsx
      RichTextEditor.tsx

  lib/
    redis/
      index.ts
      rateLimit.ts
    server/
      pdf.ts
      ai.ts
    utils/
      style.ts
      ids.ts
      html.ts

  types/
    global.ts
```

### 目录职责

`src/app`

只放路由、布局和 API Route。页面文件负责组装 feature，不承载复杂业务逻辑。比如 `src/app/dashboard/page.tsx` 最终应该只渲染 `<ResumeEditor />`。

`src/features/resume-editor`

简历编辑器的主业务目录。凡是只服务于简历编辑器的组件、hook、store、模板、客户端 service，都优先放这里。

`src/components/ui`

跨业务可复用的基础 UI。只有多个 feature 都会使用的组件才放这里，例如背景、通用编辑器封装、通用按钮组等。

`src/lib`

与业务无关或偏底层的工具。Redis、服务端 PDF helper、HTML 清理、ID 生成、样式工具等放这里。不要把简历编辑器的业务逻辑继续塞进 `lib/hooks` 或 `lib/store`。

`src/types`

全局类型。简历编辑器自己的类型应优先放 `features/resume-editor/types.ts`。

## 4. 模块边界规则

### 页面层

- `app/**/page.tsx` 不直接处理拖拽、持久化、打印、AI 请求等复杂逻辑。
- 页面层可以读取路由参数、做首屏布局、挂载 feature 根组件。
- 页面层不直接访问 Zustand store，除非是非常薄的页面级开关。

### Feature 层

- `features/resume-editor/components` 只负责渲染和交互事件转发。
- `features/resume-editor/hooks` 负责组合 store、DOM 事件、节流、防抖和副作用。
- `features/resume-editor/stores` 只管理状态和同步 action，不直接读写 DOM、`localStorage`、`fetch`。
- `features/resume-editor/services` 负责 IO，包括 API 请求、本地存储、PDF 下载、AI 流读取。
- `features/resume-editor/templates` 只放模板数据和主题配置。

### Lib 层

- `lib/server` 只能被 server 代码或 API Route 引用。
- `lib/redis` 只处理 Redis 连接和限流，不包含 AI 业务 prompt。
- `lib/utils` 只放纯函数，不依赖 React，不访问浏览器或服务端全局对象。

## 5. 命名规范

现有代码里有一些拼写和命名不一致的问题，后续重构时统一为：

- 目录名使用 kebab-case：`resume-editor`、`base-info`。
- React 组件使用 PascalCase：`ResumeCanvas.tsx`、`ThemeDialog.tsx`。
- Hook 使用 `useXxx.ts`：`useCanvasDrag.ts`、`useResumePersistence.ts`。
- Store 使用 `xxxStore.ts`：`resumeStore.ts`、`undoStore.ts`。
- 类型使用语义化 PascalCase，避免全大写对象类型：
  - `PAGE_ATTRIBUTE` -> `ResumeElement`
  - `PARAGRAPH_TYPE` -> `ResumeParagraphItem`
  - `RESUME_TYPE` -> `ResumeDocument`
  - `UNDO_TYPE` -> `ResumeHistory`
- 避免拼写错误进入新代码：
  - `resume_sytle` 应迁移为 `templates` 或 `resume-style`。
  - `SystemDilaog` 应迁移为 `SystemDialog`。
  - `useMouseOpeartion` 应迁移为 `useMouseOperation` 或 `useCanvasDrag`。

## 6. 数据模型建议

当前 `PAGE_ATTRIBUTE` 同时承担数据、布局、样式和 DOM ref，后续建议拆成三层：

```ts
export type ResumeElement = {
  id: string;
  type: "baseInfo" | "paragraph";
  className: string;
  layout: ResumeElementLayout;
  style: React.CSSProperties;
  content: BaseInfoContent | ParagraphSectionContent;
};

export type ResumeElementLayout = {
  left: number;
  top: number;
  zIndex?: number;
};
```

建议原则：

- 持久化数据里不要保存 `ref`。
- 业务数据和 DOM 状态分开，DOM ref 用 `Map<string, HTMLElement>` 或组件本地 ref 管理。
- 坐标内部优先用 number，渲染时再转成 `"12px"`。
- 模板数据要稳定，避免每次 import 都生成新 UUID。可以使用固定 ID 或加载模板时再补 ID。
- 富文本 HTML 必须被视为不可信内容。当前允许 `dangerouslySetInnerHTML`，后续如接收用户导入数据，应增加 HTML 清洗。

## 7. 状态管理建议

建议将 Zustand store 拆成更清晰的 slice：

- `resumeStore`
  - `elements`
  - `selectedElementId`
  - `scale`
  - `setElements`
  - `selectElement`
  - `updateElement`
  - `moveElement`
  - `deleteElement`
- `historyStore`
  - `undoStack`
  - `redoStack`
  - `pushHistory`
  - `undo`
  - `redo`
- `printStore`
  - `printElements`
  - `preparePrintLayout`
  - `clearPrintLayout`

注意事项：

- Store action 中不要直接调用另一个 store 的 action，优先在 hook/service 里编排。
- 更新数组和对象时避免原地 mutation，尤其是历史记录相关逻辑。
- 撤销栈保存快照时需要深拷贝，不能保存继续被修改的引用。
- `localStorage` 持久化放到 `useResumePersistence`，不要散落在页面组件。

## 8. API 和服务端建议

### PDF 导出

当前 `api/pdf/route.ts` 同时处理请求校验、浏览器启动、HTML 包装、PDF 生成。建议拆成：

- `app/api/pdf/route.ts`：只做 HTTP 入参、错误响应。
- `lib/server/pdf.ts`：封装 Puppeteer 启动、页面设置、PDF 生成。
- `features/resume-editor/services/pdfExportClient.ts`：封装前端下载请求。

同时建议：

- 使用 `try/finally` 确保 browser 总会关闭。
- 移除调试 `console.log`，因为 Biome 当前禁止 console。
- 对传入 HTML 做长度限制，避免接口被滥用。

### AI 点评

建议拆成：

- `app/api/ai/route.ts`：HTTP、限流、流式响应。
- `lib/server/ai.ts`：DeepSeek client、prompt、消息构造。
- `features/resume-editor/services/aiReviewClient.ts`：前端流式读取。

同时建议：

- `systemPrompt` 独立为常量文件或 server helper。
- 请求体使用明确字段名，例如 `{ resumeSections: ResumeReviewSection[] }`，少传字符串。
- 限流错误建议使用 `429` 状态码，不要用 `500` 表示用户次数耗尽。

## 9. 样式和 UI 约定

- 新增 UI 优先使用 Ant Design 和 Tailwind，不要混用太多临时 inline style。
- 元素可编辑样式可以保留在数据模型中，但固定布局样式应沉淀为 className。
- SCSS module 仅用于复杂局部样式；普通布局优先 Tailwind。
- 移动端和桌面端可以共用数据与 action，但视图组件应拆分清楚。
- 简历画布尺寸相关常量集中管理，例如 A4 宽高、打印边距、默认缩放。

建议新增：

```ts
export const A4_CANVAS = {
  width: 794,
  height: 1123,
  printMargin: 40,
} as const;
```

## 10. 迁移路线

### 第一阶段：整理边界，不改行为

- 新增 `features/resume-editor` 目录。
- 将 `src/types/resume.ts` 迁移到 `features/resume-editor/types.ts`，保留旧文件 re-export 以减少一次性改动。
- 将 `src/lib/store/*` 迁移到 `features/resume-editor/stores/*`。
- 将 `src/lib/resume_sytle/*` 迁移到 `features/resume-editor/templates/*`。
- 将 `dashboard/components` 中的简历编辑器组件迁移到 feature 目录。

### 第二阶段：抽离副作用

- 把 `localStorage` 读写移入 `useResumePersistence`。
- 把 PDF 下载流程移入 `pdfExportClient` 和 `usePdfExport`。
- 把 AI 点评请求移入 `aiReviewClient` 和 `useAiReview`。
- 把拖拽逻辑移入 `useCanvasDrag`。

### 第三阶段：稳定数据模型

- 移除持久化数据中的 `ref`。
- 坐标字段从 CSS string 迁移为 number。
- 模板 ID 改为稳定 ID 或加载时生成。
- 历史栈改为深拷贝快照。

### 第四阶段：质量保障

- 为纯函数补单元测试：排版转换、历史栈、HTML 包装、坐标计算。
- 为 API Route 补最小集成测试或 helper 测试。
- 为核心编辑器流程增加 Playwright 测试：加载模板、选中元素、移动元素、导出按钮、AI 弹窗。

## 11. 新功能开发流程

每次新增功能时按下面顺序判断落点：

1. 是路由或 API 入口吗？放 `src/app`。
2. 只服务简历编辑器吗？放 `src/features/resume-editor`。
3. 多个业务都能复用吗？放 `src/components/ui` 或 `src/lib`。
4. 涉及网络、本地存储、文件下载吗？放 `services`。
5. 涉及 React 状态组合或副作用吗？放 `hooks`。
6. 只是纯计算吗？放 `utils`，并优先写成纯函数。

## 12. 当前代码的优先修整清单

- 修正目录拼写：`resume_sytle`。
- 修正组件拼写：`SystemDilaog`。
- 修正 hook 拼写：`useMouseOpeartion`。
- 拆分 `Dashboard` 页面中的导出、持久化和弹窗状态。
- 拆分 `MainContainer` 中的画布渲染、元素渲染、拖拽、段落工具栏。
- 重写 undo/redo，避免数组引用被原地修改。
- 从模板数据中移除 import 阶段生成 UUID 的行为。
- 为 PDF route 增加 `finally browser.close()` 和 HTML 大小限制。
- 为 AI route 使用更合理的状态码和结构化请求体。

