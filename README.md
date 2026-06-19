
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

启动后打开 http://localhost:3000 ，按以下步骤验证完整认证流程：

### 1. 注册新账号
1. 点击「注册」标签
2. 填写邮箱（如 `test@example.com`）、用户名（如 `testuser`）、密码（至少 8 位）
3. 点击「创建账号」
4. 成功后会弹出 toast 通知，并提示可登录

### 2. 登录
1. 切换到「登录」标签
2. 输入刚才注册的**用户名**（不是邮箱）和密码
3. 点击「登录」
4. 按钮会显示「正在登录...」加载状态

### 3. 查看当前用户信息
- 登录成功后自动跳转到已登录视图
- 可以看到用户头像、用户名、邮箱等信息
- 页面底部显示 `/auth/users/me/` 接口返回的**真实 JSON 数据**
- 可以点击「刷新用户信息」按钮重新调用接口

### 4. 退出登录
- 点击右上角「退出登录」按钮
- localStorage 中的 Token 被清除
- 页面自动回到未登录视图（登录/注册表单）

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
- 通过 `axios.create` 创建实例，baseURL 从 `NEXT_PUBLIC_API_URL` 环境变量读取
- 请求拦截器自动从 localStorage 读取 Token 并附加到 `Authorization` 头
- `extractErrorMessage()` 统一解析 Djoser 返回的字段级错误和全局错误
- 封装了 `register`, `login`, `getCurrentUser`, `refreshAccessToken` 等方法

### 认证上下文 (`client/contexts/AuthContext.tsx`)
- `AuthProvider` 包裹整个应用，提供全局认证状态
- 提供 `login`, `register`, `logout`, `fetchCurrentUser` 等 action
- 暴露 `loginStatus`, `registerStatus`, `fetchUserStatus` 等状态 (`idle/loading/success/error`)
- 暴露对应的 error 和 message，便于页面展示 toast/Alert
- 初始化时自动尝试用 localStorage 中的 Token 恢复登录态

### 首页 (`client/pages/index.tsx`)
- 未登录态：Tabs 切换的登录 + 注册表单，带本地表单校验、密码显示/隐藏、加载状态
- 已登录态：用户卡片 + 信息展示 + 原始 JSON 响应 + 验证步骤清单
- 所有状态反馈使用 Chakra Alert 和 useToast，清晰可见

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

