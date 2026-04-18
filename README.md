# ModuChat

<div align="center">

![ModuChat Logo](https://img.shields.io/badge/ModuChat-实时聊天应用-brightgreen)
![Python](https://img.shields.io/badge/Python-3.12+-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![License](https://img.shields.io/badge/License-MIT-yellow)
![Status](https://img.shields.io/badge/Status-学习研究-orange)

**一个完全由AI生成的实时聊天应用，仅限于学习和研究使用**

</div>

## 📝 项目简介

ModuChat是一个基于FastAPI和React的现代化实时聊天应用，支持用户注册、登录、实时消息通信和多用户在线状态显示。本项目展示了前后端分离架构、WebSocket实时通信、JWT用户认证等现代Web开发技术。

### ⚠️ 重要声明

**这是一个完全由AI生成的代码，仅限于最低限度的能跑，仅限于学习和研究使用。**

- 不适合生产环境部署
- 代码质量未经充分测试
- 安全性未经过专业审计
- 建议仅用于学习和研究目的

## ✨ 功能特性

### 用户功能
- ✅ 用户注册和登录
- ✅ JWT令牌认证
- ✅ 用户会话管理
- ✅ 自动登录状态保持

### 聊天功能
- ✅ 实时消息发送和接收
- ✅ 多用户聊天室
- ✅ 在线用户状态显示
- ✅ 历史消息加载
- ✅ 临时消息优化（即时反馈）

### 技术特性
- ✅ WebSocket实时通信
- ✅ 异步后端处理
- ✅ 响应式前端设计
- ✅ 类型安全的TypeScript
- ✅ 状态管理（Zustand）
- ✅ 现代化UI（Tailwind CSS）

## 🛠️ 技术栈

### 后端技术
- **FastAPI** - 现代化的Python Web框架
- **SQLAlchemy** - ORM数据库工具
- **SQLite** - 轻量级数据库
- **JWT** - JSON Web Token认证
- **WebSocket** - 实时双向通信
- **Pydantic** - 数据验证和序列化
- **Argon2** - 密码哈希算法

### 前端技术
- **React 18** - 用户界面框架
- **TypeScript** - 类型安全的JavaScript
- **Vite** - 快速的前端构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **Zustand** - 轻量级状态管理
- **Axios** - HTTP客户端

### 开发工具
- **PowerShell** - 自动化脚本
- **Git** - 版本控制
- **VS Code** - 代码编辑器

## 📁 项目结构

```
ModuChat/
├── backend/                    # 后端FastAPI应用
│   ├── app/                   # 应用核心代码
│   │   ├── api/              # API路由和端点
│   │   │   └── v1/          # API版本1
│   │   │       ├── auth.py     # 认证相关API
│   │   │       └── chat.py     # 聊天相关API
│   │   ├── core/             # 核心配置
│   │   │   ├── config.py     # 应用配置
│   │   │   └── security.py   # 安全相关功能
│   │   ├── db/               # 数据库相关
│   │   │   ├── base.py       # 数据库基类
│   │   │   └── session.py    # 数据库会话
│   │   ├── models/           # 数据模型
│   │   │   ├── user.py       # 用户模型
│   │   │   └── message.py    # 消息模型
│   │   ├── schemas/          # 数据验证模式
│   │   │   ├── auth.py       # 认证相关模式
│   │   │   └── chat.py       # 聊天相关模式
│   │   └── websockets/       # WebSocket相关
│   │       ├── manager.py    # WebSocket连接管理
│   │       └── router.py     # WebSocket路由
│   ├── main.py               # 应用入口点
│   ├── requirements.txt       # Python依赖列表
│   ├── moduchat.db          # SQLite数据库文件
│   └── venv/               # Python虚拟环境
├── frontend/                  # 前端React应用
│   ├── src/                # 源代码
│   │   ├── api/           # API调用封装
│   │   ├── components/     # React组件
│   │   │   ├── ChatBubble.tsx      # 消息气泡组件
│   │   │   ├── ChatLayout.tsx     # 聊天布局组件
│   │   │   ├── LoginForm.tsx      # 登录表单组件
│   │   │   └── UserList.tsx       # 用户列表组件
│   │   ├── store/         # 状态管理
│   │   │   ├── useAuthStore.ts      # 认证状态
│   │   │   └── useChatStore.ts     # 聊天状态
│   │   ├── types/         # TypeScript类型定义
│   │   ├── App.tsx        # 主应用组件
│   │   ├── main.tsx       # 应用入口
│   │   └── index.css       # 全局样式
│   ├── dist/               # 构建输出目录
│   ├── index.html           # HTML模板
│   ├── package.json         # Node.js依赖
│   ├── vite.config.ts       # Vite配置
│   ├── tailwind.config.js   # Tailwind配置
│   └── tsconfig.json       # TypeScript配置
├── start-frontend.bat       # Windows前端启动脚本
├── start-backend.bat        # Windows后端启动脚本
├── start-frontend.ps1      # PowerShell前端启动脚本
├── start-backend.ps1       # PowerShell后端启动脚本
├── .gitignore            # Git忽略文件
└── README.md             # 项目说明文档
```

## 🚀 快速开始

### 环境要求

- Python 3.12+
- Node.js 18+
- pnpm（推荐）或 npm
- Windows 10/11 或 Windows Server 2019+

### 后端安装

1. **克隆项目**
```bash
git clone https://github.com/your-username/ModuChat.git
cd ModuChat/backend
```

2. **创建虚拟环境**
```bash
python -m venv venv
```

3. **激活虚拟环境**
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

4. **安装依赖**
```bash
pip install -r requirements.txt
```

5. **启动后端服务器**
```bash
# 使用Python直接运行
python main.py

# 或使用批处理脚本（Windows）
cd ..
start-backend.bat
```

后端服务器将在 `http://localhost:5173` 运行

### 前端安装

1. **进入前端目录**
```bash
cd frontend
```

2. **安装依赖**
```bash
pnpm install
```

3. **启动前端开发服务器**
```bash
# 使用 pnpm（推荐）
pnpm run dev

# 或使用 npm
npm install
npm run dev

# 或使用批处理脚本（Windows）
cd ..
start-frontend.bat
```

前端应用将在 `http://localhost:8765` 运行

如果你正在从 npm 迁移到 pnpm，可参考：

- `frontend/README-pnpm.md`
- `frontend/migrate-to-pnpm.ps1`

## 📖 使用说明

### 1. 访问应用
打开浏览器访问 `http://localhost:8765`

### 2. 注册用户
- 点击"注册"按钮
- 输入用户名和密码
- 提交注册表单

### 3. 登录
- 使用注册的用户名和密码登录
- 系统会自动保存登录状态

### 4. 开始聊天
- 登录后自动进入聊天界面
- 在消息输入框中输入消息
- 按Enter键或点击发送按钮
- 实时查看其他用户的消息

### 5. 查看在线用户
- 右侧显示当前在线用户列表
- 实时更新用户在线状态

## 🔧 配置说明

### 后端配置

**端口配置** (`backend/main.py`)
```python
uvicorn.run(
    "main:app",
    host="0.0.0.0",  # 监听所有网络接口
    port=5173,        # 后端服务端口
    reload=True        # 开发模式热重载
)
```

**CORS配置** (`backend/app/core/config.py`)
```python
# 生产环境应该指定具体域名
allow_origins=["*"]  # 允许所有来源（仅开发环境）
```

### 前端配置

**端口配置** (`frontend/vite.config.ts`)
```typescript
export default defineConfig({
  server: {
    port: 8765,      // 前端服务端口
    host: true,        // 监听所有网络接口
    allowedHosts: true  // 允许所有主机访问
  }
})
```

**API代理** (`frontend/vite.config.ts`)
```typescript
proxy: {
  '/api': {
    target: 'http://localhost:5173',
    changeOrigin: true
  },
  '/ws': {
    target: 'ws://localhost:5173',
    ws: true,
    changeOrigin: true
  }
}
```

## 🌐 API文档

后端提供了自动生成的API文档：

- **Swagger UI**: `http://localhost:5173/docs`
- **ReDoc**: `http://localhost:5173/redoc`

### 主要API端点

#### 认证相关
- `POST /api/v1/auth/register` - 用户注册
- `POST /api/v1/auth/token` - 用户登录
- `GET /api/v1/auth/me` - 获取当前用户信息

#### 聊天相关
- `GET /api/v1/chat/messages` - 获取历史消息
- `WebSocket /ws/chat` - 实时消息通信

## 🚢 部署指南

### Windows Server部署

1. **准备服务器环境**
```powershell
# 安装Python 3.12+
# 安装Node.js 18+
# 配置防火墙规则
```

2. **上传项目文件**
- 将整个ModuChat文件夹上传到服务器
- 确保包含所有必要的配置文件

3. **配置后端**
```powershell
cd ModuChat\backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

4. **配置前端**
```powershell
cd ModuChat\frontend
pnpm install
pnpm run build
```

5. **启动服务**
```powershell
# 启动后端
start-backend.bat

# 启动前端
start-frontend.bat
```

### 生产环境注意事项

- 使用HTTPS证书
- 配置域名和DNS
- 使用nginx托管前端静态文件
- 配置进程守护（如PM2）
- 设置日志轮转和监控
- 限制CORS允许的域名
- 使用生产级数据库（PostgreSQL）

## 🐛 已知问题

1. **消息重复**：在特定情况下可能出现消息重复显示
2. **连接不稳定**：WebSocket连接可能在网络不稳定时断开
3. **并发限制**：SQLite在高并发情况下性能有限
4. **安全风险**：CORS设置为允许所有来源，存在安全风险

## 🔮 未来计划

- [ ] 支持文件上传和分享
- [ ] 私聊功能
- [ ] 消息撤回和编辑
- [ ] 用户头像上传
- [ ] 消息搜索功能
- [ ] 群组聊天
- [ ] 语音消息支持
- [ ] 表情符号支持
- [ ] 消息已读状态
- [ ] 用户资料编辑
- [ ] 深色模式主题

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献指南

欢迎提交问题和拉取请求！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启拉取请求

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发送邮件
- 加入讨论组

## ⚠️ 免责声明

**本项目仅用于学习和研究目的，不保证代码质量、安全性和稳定性。**

- 不建议在生产环境中使用
- 使用本项目的风险由使用者自行承担
- 作者不对任何损失或损害负责
- 建议在使用前进行充分测试

## 🙏 致谢

感谢以下开源项目和技术：

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Vite](https://vitejs.dev/)

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给个星标！**

Made with ❤️ by AI and Human Collaboration

</div>
