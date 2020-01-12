# URL-tracking
URL跳转追踪

## 代码说明

### url-tracking-view

此目录为前端源码目录，前端项目使用 Vue 2 进行构建，使用了 TypeScript/ESLint/Babel/PWA 等组件创建。

生成的编译后的代码将会被放到 url-tracking-center 中。

### url-tracking-center

此目录为后端中心服务器源码目录，中心服务器使用 SQLite 3 作为数据库，并向前端推送最新的已注册节点信息。

### url-tracking-service （此目录暂时不存在）

此目录为后端子节点源码目录，子节点用于 URL 链接地址跳转追踪，由前端直接请求，不经过中心服务器，
但中心服务器会对所有注册的子节点探活。（此功能暂时未推送至 GitHub，将在下次更新时推送）

> 目前此部分功能在 url-tracking-center 中未拆开

## 开发进度

- [ ] 前端页面完善：完成设置页面和关于页面，将部分存储逻辑移植 Vuex
- [ ] Center 拆分：将 Center 中负责URL追踪的部分拆开至 Service，并完成探活功能
- [ ] Service 功能完善：将 Center 中的追踪部分移植此模块，并增加探活相应功能
- [ ] 前端性能优化：完成 PWA 配置

V2 版本开发

- [ ] Service 功能重构：使用 Node.JS + 无头浏览器，重构现在跳转追踪功能，以实现对HTML重定向和JS重定向的追踪（已完成调研）
- [ ] 前端页面改进：使用 React 重构前端页面，同时探索一个适合大量内容填充的 UI 设计