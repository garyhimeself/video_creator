# Video Creator 开发指南 (技术小白友好版)

## 前言

这个文档专为技术小白设计，帮助你了解如何开始开发 Video Creator 项目，即使你没有编程经验。

## 开发环境准备

### 1. 代码编辑器
推荐使用 [Visual Studio Code](https://code.visualstudio.com/)，它是免费的，对初学者友好。

安装步骤：
- 访问 https://code.visualstudio.com/
- 下载并安装适用于 Mac 的版本
- 打开 VS Code

### 2. 版本控制
你已经有 GitHub 账号，接下来需要：

- 安装 Git：在 Mac 终端中输入 `git --version` 检查是否已安装
- 如未安装，系统会提示你安装
- 在 GitHub 上创建一个新的仓库命名为 "video-creator"

### 3. Node.js 环境
你需要安装 Node.js 来运行 JavaScript 代码：

- 访问 https://nodejs.org/
- 下载并安装 LTS 版本
- 安装完成后，在终端运行 `node -v` 和 `npm -v` 确认安装成功

## 项目设置

### 1. 克隆项目
打开终端，导航到你的工作目录：

```bash
cd /Users/suzhen/AI\ WORKS/
git clone https://github.com/你的用户名/video-creator.git
cd video-creator
```

### 2. 创建基本项目结构
使用以下命令创建基本文件夹结构：

```bash
mkdir -p public/assets/{images,css,js}
mkdir -p server
touch public/index.html public/assets/css/style.css public/assets/js/main.js
touch server/index.js .env.example .gitignore
```

### 3. 设置 npm 项目
初始化 npm 项目并安装基本依赖：

```bash
npm init -y
npm install express dotenv node-fetch cors
npm install --save-dev nodemon
```

## 项目开发

### 1. 创建 .env 文件
复制 .env.example 为 .env 并添加你的 API 密钥：

```bash
cp .env.example .env
```

然后编辑 .env 文件，添加：

```
API_KEY=你的硅基流动API密钥
```

### 2. 创建 .gitignore 文件
编辑 .gitignore 文件，确保不会上传敏感信息：

```
node_modules/
.env
.DS_Store
```

### 3. 创建前端界面
编辑 `public/index.html` 创建基本界面结构，参考项目结构文档设计界面。

### 4. 创建服务器
编辑 `server/index.js` 创建基本服务器，实现 API 转发功能。

### 5. 添加启动脚本
在 package.json 中添加启动脚本：

```json
"scripts": {
  "start": "node server/index.js",
  "dev": "nodemon server/index.js"
}
```

## 部署到 Cloudflare

### 1. 安装 Wrangler
Wrangler 是 Cloudflare Workers 的命令行工具：

```bash
npm install -g wrangler
```

### 2. 登录 Cloudflare
在终端中运行：

```bash
wrangler login
```

### 3. 配置 wrangler.toml
在项目根目录创建 wrangler.toml 文件：

```toml
name = "video-creator"
type = "webpack"
account_id = "你的Cloudflare账号ID"
workers_dev = true
route = ""
zone_id = ""
```

### 4. 部署
将代码推送到 GitHub：

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

然后部署到 Cloudflare：

```bash
wrangler publish
```

## 发布后

一旦部署完成，Cloudflare 会提供一个 URL 供你访问你的应用。

## 常见问题

### 如何更新应用？
1. 修改代码
2. 提交更改: `git add . && git commit -m "描述更改"`
3. 推送到 GitHub: `git push origin main`
4. 重新部署: `wrangler publish`

### API 密钥不工作？
确保 .env 文件格式正确，没有多余的空格或引号。

### 无法连接到 API？
检查网络连接和防火墙设置，确保可以访问 api.siliconflow.cn。

### 部署失败？
查看 Cloudflare 提供的错误信息，通常会指出问题所在。

## 寻求帮助

如果遇到问题，可以：
- 查看 GitHub 上的问题跟踪
- 查阅 Cloudflare Workers 文档
- 在技术论坛（如 Stack Overflow）提问
- 联系硅基流动的支持团队获取 API 相关帮助 