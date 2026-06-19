
# Django + Next.js 认证样板 (Authentication Boilerplate)

一个完整可用的 Django + Next.js 全栈认证样板，基于 Djoser + JWT 实现注册、登录、获取当前用户、退出登录等完整认证链路。

<a href="https://www.codefactor.io/repository/github/akshat2602/django-nextjs-boilerplate/overview/master" target="_blank"> <img src="https://img.shields.io/codefactor/grade/github/akshat2602/django-nextjs-boilerplate?style=flat-square" /> </a>
<a href="https://github.com/akshat2602/django-nextjs-template/blob/master/LICENSE" target="_blank"> <img src="https://img.shields.io/github/license/akshat2602/django-nextjs-template?style=flat-square" /> </a>
<a href="https://github.com/akshat2602/django-nextjs-template" target="_blank"> <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/akshat2602/django-nextjs-template?style=flat-square"> </a>

---

## 功能特性

- **后端 (Django)**
  - PostgreSQL 作为主数据库
  - Django Rest Framework 构建 REST API
  - Djoser 提供完整的用户管理工作流
  - SimpleJWT 实现 JWT 认证 (Token 前缀: `Token`)
  - CORS 已配置，允许跨域请求
  - Swagger / ReDoc API 文档自动生成
  - 内置超级用户: admin / admin@admin.com / admin

- **前端 (Next.js)**
  - TypeScript 支持
  - **Chakra UI v1 (^1.8.3)** 组件库 + 自定义紫色主题（**兼容当前依赖，未使用 v2 专属的 Card 等组件**）
  - Axios 统一 API 调用层，自动附加 Token
  - 认证状态上下文 (AuthContext) 全局管理
  - 完整的注册 / 登录 / 获取当前用户 / 退出登录 UI
  - 清晰的加载中、成功、失败反馈
  - **「认证链路真实状态」面板**：5 项状态严格跟随真实接口结果变化，无任何写死的完成态

---

## 快速开始 (Docker 开发环境)

### 前置条件
- Docker 和 Docker Compose 已安装

### 启动所有服务

```bash
# 1. 进入项目目录
cd django-nextjs-boilerplate

# 2. 构建开发容器
docker-compose -f docker-compose.dev.yml build

# 3. 启动开发环境
docker-compose -f docker-compose.dev.yml up
```

等待启动完成后，通过以下地址访问：

| 服务 | 地址 | 说明 |
|------|------|------|
| 前端 (Next.js) | http://localhost:3000 | 认证控制台首页 |
| 后端 (Django) | http://localhost:8000 | Django API 根路径 |
| Swagger API 文档 | http://localhost:8000/swagger/ | 交互式 API 文档 |
| ReDoc 文档 | http://localhost:8000/redoc/ | 另一种 API 文档视图 |
| Django Admin | http://localhost:8000/admin/ | 后台管理 (admin/admin) |

---

## 认证链路验证步骤

启动后打开 http://localhost:3000 ，按以下步骤验证完整认证流程。

> **关键提示**：页面底部的「**认证链路真实状态**」面板有 5 个勾选框，**全部默认是 ⬜ 未完成态**，只有当你真实完成对应的接口调用后才会变成 ✅。没有任何一项是写死为成功的。
>
> **登录成功语义**：登录**不会**在「刚拿到 token」时就标记为成功。只有当 `/auth/jwt/create/` 拿到令牌**并且** `/auth/users/me/` 成功拉取到当前用户、页面真正进入稳定已登录态后，`loginSucceeded` 才会变 ✅。如果拿到令牌后拉取用户失败，本次登录会被整体回滚为失败路径：令牌被清除、状态/提示/表单保持在失败状态。

### 1. 注册新账号
1. 点击「注册」标签
2. 填写邮箱（如 `test@example.com`）、用户名（如 `testuser`）、密码（至少 8 位，并在确认密码处再次输入）
3. 点击「创建账号」
4. 按钮会显示「正在注册...」加载状态
5. 成功后会弹出绿色 toast 通知；同时「认证链路真实状态」面板第 1 项（注册）变成 ✅
6. 失败时（如邮箱/用户名已被占用、密码太短）会弹出红色 toast 通知，状态不变绿，表单内容保留方便修改重试

### 2. 登录
1. 切换到「登录」标签
2. 输入刚才注册的**用户名**（例如 `testuser`，**不是邮箱**，因为 Djoser JWT 端点默认使用 `username` 字段登录）和密码
3. 点击「登录」
4. 按钮会显示「正在登录...」加载状态，**整个登录流程（拿令牌 + 拉用户）期间按钮一直处于 loading**
5. 登录成功后自动进入已登录视图，同时「认证链路真实状态」面板第 2 项（登录）、第 3 项（令牌）、第 4 项（当前用户）全部变成 ✅
6. 失败场景（密码错误 / 令牌拿到了但拉取用户失败）会弹出红色 toast，不会进入已登录视图，表单保留

### 3. 查看当前用户信息
- 登录成功后自动展示用户头像、用户名、邮箱、用户 ID
- 页面中部深色代码块内展示 `/auth/users/me/` 接口返回的**原始 JSON**
- 点击「刷新用户信息」按钮可重新调用接口，按钮会有加载状态；失败时页面内会出现红色 Alert

### 4. 退出登录
- 点击右上角「退出登录」按钮
- localStorage 中的 `auth_token` 和 `auth_refresh_token` 被清除
- 页面自动回到未登录视图（登录/注册表单）
- 「认证链路真实状态」面板第 5 项（退出）变成 ✅，第 3 项（令牌）、第 4 项（当前用户）恢复 ⬜（因为令牌和用户数据已被清空）

---

## 如何进一步验证「不是写死的 UI / 不是局部成功」

可以通过浏览器 DevTools 从 3 个维度交叉验证：

| 验证维度 | 操作方法 | 预期结果 |
|---------|---------|---------|
| Network 请求 | F12 → Network 面板，过滤 `localhost:8000` | 注册看到 `POST /auth/users/`；登录看到 `POST /auth/jwt/create/` 紧接 `GET /auth/users/me/`，后者请求头含 `Authorization: Token <jwt>` |
| localStorage | F12 → Application → Local Storage → http://localhost:3000 | 登录成功后出现 `auth_token` 和 `auth_refresh_token`；退出登录后两者消失；登录失败（拉用户失败）时也不应残留令牌 |
| 页面状态 | 故意输入错误密码 / 故意不填表单 / 用过期 token | 显示对应错误 toast；表单不会被错误地清空；checklist 不会错误地打勾；登录按钮在失败时恢复可点击 |

---

## 前端构建验证

本仓库前端已在 Node 容器中通过 `npm install && npm run build` 验证可正常构建（Chakra UI v1 ^1.8.3 兼容，无 v2 专属组件依赖）。本地复现：

```bash
# 在仓库根目录用 Node 容器构建前端（无需本机安装 node）
docker run --rm -v "%CD%\client:/src" -w /src node:lts-alpine sh -c "npm install --no-audit --no-fund && npm run build"
# Linux/macOS 把 %CD% 换成 $(pwd)
```

构建成功后会生成 `client/.next/` 产物，末尾输出类似 `✓ Compiled successfully` 与各页面的静态导出信息。

---

## 项目结构

```
django-nextjs-boilerplate/
├── client/                          # Next.js 前端
│   ├── contexts/
│   │   └── AuthContext.tsx          # 认证状态上下文
│   ├── lib/
│   │   ├── api.ts                   # Axios 实例 + 统一 API 调用层
│   │   └── types.ts                 # TypeScript 类型定义
│   ├── pages/
│   │   ├── _app.tsx                 # 应用入口，注入 ChakraProvider + AuthProvider
│   │   └── index.tsx                # 认证控制台首页
│   ├── themes/                      # Chakra UI 自定义主题
│   └── package.json
├── server/                          # Django 后端
│   └── server/
│       ├── settings.py              # Django 配置 (含 Djoser + JWT)
│       └── urls.py                  # 路由配置 (auth/, swagger, admin)
├── .env.dev                         # 开发环境变量
├── docker-compose.dev.yml           # Docker Compose 开发配置
└── README.md
```

---

## Djoser 认证接口一览

| 方法 | 路径 | 说明 | 是否需要认证 |
|------|------|------|------------|
| POST | `/auth/users/` | 用户注册 | 否 |
| POST | `/auth/jwt/create/` | 登录 (获取 access + refresh token) | 否 |
| POST | `/auth/jwt/refresh/` | 刷新 access token | 否 (需要 refresh) |
| GET | `/auth/users/me/` | 获取当前用户信息 | 是 |
| PUT | `/auth/users/me/` | 更新当前用户信息 | 是 |

**注意：** JWT 认证头格式为 `Authorization: Token <access_token>`（不是 `Bearer`），已在 `lib/api.ts` 的 axios 拦截器中自动处理。

---

## 环境变量配置

在 [.env.dev](.env.dev) 中可配置以下变量：

```bash
# 前端 API 地址 (必须以 NEXT_PUBLIC_ 前缀，Next.js 才能暴露给浏览器)
NEXT_PUBLIC_API_URL=http://localhost:8000

# PostgreSQL
POSTGRES_DB=db
POSTGRES_USER=user
POSTGRES_PASSWORD=password

# Django Admin 超级用户
DJANGO_SUPERUSER_USERNAME=admin
DJANGO_SUPERUSER_EMAIL=admin@admin.com
DJANGO_SUPERUSER_PASSWORD=admin
```

---

## 前端代码说明

### 统一 API 层 (`client/lib/api.ts`)
- 通过 `axios.create` 创建实例，`baseURL` 严格从 `NEXT_PUBLIC_API_URL` 环境变量读取，**不硬编码任何 localhost 地址**
- 请求拦截器自动从 localStorage 读取 `auth_token` 并附加到 `Authorization: Token <token>` 头
- `extractErrorMessage()` 统一解析 Djoser 返回的字段级错误、`detail`、`non_field_errors` 等多种格式
- 封装了 `register`, `login`, `getCurrentUser`, `refreshAccessToken` 四个方法

### 认证上下文 (`client/contexts/AuthContext.tsx`)
- `AuthProvider` 包裹整个应用，提供全局认证状态
- 四个核心 action **均返回 `Promise<boolean>` 表示是否成功**，调用方无需依赖陈旧的 React state 闭包来判断结果
- 暴露 `loginStatus`, `registerStatus`, `fetchUserStatus`, `logoutStatus` 四态状态机（`idle/loading/success/error`）
- 暴露对应的 `*Error` 和 `*Message` 字段，与状态机严格同步
- 暴露 `checklist` 对象（5 个布尔标记），**真实驱动页面底部的「认证链路真实状态」面板，绝不写死**
- 初始化时自动尝试用 localStorage 的 Token 恢复登录态

### 首页 (`client/pages/index.tsx`)
- **Chakra UI v1 (^1.8.3) 兼容实现**：仅使用 v1 内置组件（Box/VStack/HStack/Alert/Tabs 等），**不依赖 v2 才有的 Card/CardHeader/CardBody**，用 `Box + border/shadow` 实现同等卡片效果
- 未登录态：Tabs 切换的登录 + 注册表单，带本地表单校验（必填/最小长度/两次密码一致）、密码显隐切换、`isLoading` 按钮状态
- 已登录态：用户欢迎卡片 + 信息详情 + 深色代码块（`JSON.stringify(user)` 原始响应）+ 刷新按钮 + 退出按钮
- 所有成功/失败反馈同时通过 Chakra `Alert`（页面内）和 `useToast`（顶部弹出）双通道展示
- 无论登录态或未登录态，底部都展示**真实状态驱动的 checklist 面板**，文本内容根据 ✅/⬜ 状态动态变化（不是同一个标签换色）

---

## Technologies used

<a href="https://www.djangoproject.com/" target="_blank"><img src="https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white"/> </a>
<a href="https://www.django-rest-framework.org/" target="_blank"> <img src="https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray" /> </a>
<a href="https://djoser.readthedocs.io/" target="_blank"> <img src="https://img.shields.io/badge/DJOSER-Auth-00C7B7?style=for-the-badge&logo=django&logoColor=white"/> </a>
<a href="https://jwt.io/" target="_blank"> <img src="https://img.shields.io/badge/JWT-JSON%20Web%20Token-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/> </a>
<a href="https://www.docker.com/" target="_blank"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/> </a>
<a href="https://www.postgresql.org" target="_blank"> <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white"/></a>
<a href="https://www.nextjs.org/" target="_blank"> <img src="https://img.shields.io/badge/Next.JS-000000?style=for-the-badge&logo=next.js&logoColor=white"/> </a>
<a href="https://www.typescriptlang.org/" target="_blank"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/></a>
<a href="https://chakra-ui.com/" target="_blank"><img src="https://img.shields.io/badge/Chakra%20UI-319795?style=for-the-badge&logo=chakraui&logoColor=white"/></a>
<a href="https://axios-http.com/" target="_blank"><img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white"/></a>

---

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Akshat Sharma - [akshatsharma2602@gmail.com](mailto:akshatsharma2602@gmail.com)
Project Link: [https://github.com/akshat2602/django-nextjs-boilerplate](https://github.com/akshat2602/django-nextjs-boilerplate)

