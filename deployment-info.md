# Video Creator 部署信息

## 代码仓库

项目代码已托管在GitHub上，地址为：
- https://github.com/garyhimeself/video_creator.git

## 本地开发环境配置

1. 克隆仓库：
```bash
git clone https://github.com/garyhimeself/video_creator.git
cd video_creator
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
```bash
cp .env.example .env
# 编辑.env文件，添加硅基流动API密钥
```

4. 启动开发服务器：
```bash
npm run dev
```

## 部署到生产环境

### 使用Cloudflare Pages部署

1. 登录Cloudflare账户
2. 创建新的Pages项目
3. 连接GitHub仓库
4. 配置构建设置：
   - 构建命令：`npm run build`（如需添加构建步骤）
   - 构建输出目录：`public`
   - 环境变量：确保在Cloudflare控制台中添加所有必要的环境变量，特别是API_KEY

### 使用Cloudflare Workers部署后端API

1. 安装Wrangler CLI：
```bash
npm install -g wrangler
```

2. 登录Cloudflare账户：
```bash
wrangler login
```

3. 配置wrangler.toml文件：
```toml
name = "video-creator-api"
type = "javascript"
account_id = "你的Cloudflare账号ID"
workers_dev = true
```

4. 发布API：
```bash
wrangler publish
```

## 持续集成/持续部署(CI/CD)

可以配置GitHub Actions实现自动部署：

1. 在项目中创建`.github/workflows/deploy.yml`文件
2. 配置自动部署到Cloudflare

## 域名配置

如果需要配置自定义域名：

1. 在Cloudflare中添加域名
2. 将域名指向Cloudflare Pages项目或Workers
3. 配置SSL/TLS设置为"Full"或"Full (Strict)"

## 注意事项

- API密钥应该始终保存在环境变量中，不要提交到代码仓库
- 定期更新依赖以保持安全性
- 监控API使用情况以避免超过限额 