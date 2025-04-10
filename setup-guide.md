# Video Creator 设置指南

## 系统要求

- 操作系统：macOS (已在 macOS 24.1.0 上测试)
- Node.js 版本：14.x 或更高
- npm 版本：6.x 或更高

## 安装步骤

### 1. 克隆仓库

如果你已在 GitHub 上创建了仓库，可以这样克隆：

```bash
git clone https://github.com/你的用户名/video-creator.git
cd video-creator
```

或者，从头开始创建项目：

```bash
mkdir -p /Users/suzhen/AI\ WORKS/video_creator
cd /Users/suzhen/AI\ WORKS/video_creator
```

### 2. 安装依赖

```bash
npm init -y
npm install express cors dotenv node-fetch@2
npm install --save-dev nodemon
```

### 3. 配置环境变量

创建 `.env.example` 文件作为模板：

```bash
touch .env.example
```

编辑 `.env.example` 添加以下内容：

```
API_KEY=your_siliconflow_api_key_here
PORT=3000
NODE_ENV=development
```

然后创建实际使用的 `.env` 文件：

```bash
cp .env.example .env
```

编辑 `.env` 文件，替换占位符为你的实际 API 密钥：

```
API_KEY=xxxxxxxxx
PORT=3000
NODE_ENV=development
```

### 4. 创建项目结构

创建基本目录结构：

```bash
mkdir -p public/assets/{css,js,images}
mkdir -p server/{routes,middlewares}
touch public/index.html
touch public/assets/css/style.css
touch public/assets/js/main.js
touch server/index.js
touch server/config.js
touch server/api-service.js
touch server/routes/video-generation.js
touch server/middlewares/auth.js
```

### 5. 配置服务器

编辑 `server/config.js` 文件：

```javascript
require('dotenv').config();

module.exports = {
  apiKey: process.env.API_KEY,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiBaseUrl: 'https://api.siliconflow.cn/v1'
};
```

编辑 `server/api-service.js` 文件：

```javascript
const fetch = require('node-fetch');
const config = require('./config');

async function submitVideoGeneration(data) {
  const response = await fetch(`${config.apiBaseUrl}/video/submit`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  return response.json();
}

async function getVideoStatus(requestId) {
  const response = await fetch(`${config.apiBaseUrl}/video/status`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requestId })
  });
  
  return response.json();
}

module.exports = {
  submitVideoGeneration,
  getVideoStatus
};
```

### 6. 配置路由

编辑 `server/routes/video-generation.js` 文件：

```javascript
const express = require('express');
const router = express.Router();
const apiService = require('../api-service');

// 提交视频生成请求
router.post('/generate', async (req, res) => {
  try {
    const result = await apiService.submitVideoGeneration(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error generating video:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// 获取视频状态
router.post('/status', async (req, res) => {
  try {
    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({ error: '缺少 requestId 参数' });
    }
    
    const result = await apiService.getVideoStatus(requestId);
    res.json(result);
  } catch (error) {
    console.error('Error checking video status:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
```

### 7. 设置认证中间件

编辑 `server/middlewares/auth.js` 文件：

```javascript
function basicAuth(req, res, next) {
  // 这里可以添加简单的认证逻辑
  // 例如，检查请求是否来自允许的来源
  
  // 如果需要，可以实现更复杂的认证
  // 例如 API 密钥验证、会话检查等
  
  next();
}

module.exports = {
  basicAuth
};
```

### 8. 设置主服务器文件

编辑 `server/index.js` 文件：

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const videoRoutes = require('./routes/video-generation');
const { basicAuth } = require('./middlewares/auth');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// 路由
app.use('/api/video', basicAuth, videoRoutes);

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 启动服务器
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${config.nodeEnv} mode`);
});
```

### 9. 配置 package.json 脚本

编辑 `package.json` 文件中的 scripts 部分：

```json
"scripts": {
  "start": "node server/index.js",
  "dev": "nodemon server/index.js"
}
```

### 10. 配置 .gitignore

创建 `.gitignore` 文件：

```
node_modules/
.env
.DS_Store
*.log
```

## 运行项目

开发模式运行（自动重启）：

```bash
npm run dev
```

生产模式运行：

```bash
npm start
```

## Cloudflare 部署准备

### 1. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

### 2. 创建 Cloudflare 配置文件

创建 `wrangler.toml` 文件：

```toml
name = "video-creator"
type = "webpack"
account_id = "你的Cloudflare账号ID"
workers_dev = true
route = ""
zone_id = ""

[site]
bucket = "./public"
entry-point = "server"

[env.production]
workers_dev = false
route = "你的域名/*"
zone_id = "你的域名区域ID"
```

## 下一步

1. 创建前端页面 (`public/index.html`)
2. 添加样式 (`public/assets/css/style.css`)
3. 实现前端交互逻辑 (`public/assets/js/main.js`)
4. 测试 API 集成
5. 部署到 Cloudflare 