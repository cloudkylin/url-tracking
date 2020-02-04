# URL-tracking
URL跳转追踪

DEMO：[CloudKylin的Web工具箱](http://39.108.110.17:8080)

## 版本记录

### Version 1

> dev-1.1.0
>
> - 更新 Master 和 Slave，增加版本记录，并调整 Client 端请求接口；
> 
> - 增加 Master 的构建脚本
>
> - 修改 Master 的数据库结构，支持版本记录

## 代码说明

### url-tracking-client

此目录为前端源码目录，前端项目使用 Vue 2 进行构建，使用了 TypeScript/ESLint/Babel/PWA 等组件创建。

生成的编译后的代码将会被放到 url-tracking-mater 中。

### url-tracking-master

此目录为后端中心服务器源码目录，中心服务器使用 SQLite 3 作为数据库，并向前端推送最新的已注册节点信息。

### url-tracking-slave

此目录为后端子节点源码目录，子节点用于 URL 链接地址跳转追踪，由前端直接请求，不经过中心服务器，
但中心服务器会对所有注册的子节点探活。

## 开发进度

- [ ] 前端页面完善：完成设置页面和关于页面，将部分存储逻辑移植 Vuex
- [ ] Master 拆分：将 Master 中负责URL追踪的部分拆开至 Service，并完成探活功能
- [ ] Slave 功能完善：将 Slave 中的追踪部分移植此模块，并增加探活相应功能
- [ ] 前端性能优化：完成 PWA 配置

V2 版本开发

- [ ] Slave 功能重构：使用 Node.JS + 无头浏览器，重构现在跳转追踪功能，以实现对HTML重定向和JS重定向的追踪（已完成调研）
- [ ] 前端页面改进：使用 React 重构前端页面，同时探索一个适合大量内容填充的 UI 设计