# Video Creator 项目结构

## 前端部分

### 主要文件
- `index.html` - 主页面HTML结构
- `style.css` - 样式表文件
- `main.js` - 主要JavaScript逻辑文件
- `i18n.js` - 国际化（中英文支持）文件
- `assets/` - 存放静态资源的文件夹
  - `images/` - 图片资源
  - `fonts/` - 字体资源

### 组件文件
- `components/`
  - `prompt-input.js` - 提示词输入组件
  - `model-selector.js` - 模型选择组件
  - `progress-display.js` - 进度显示组件
  - `video-player.js` - 视频播放组件
  - `advanced-settings.js` - 高级设置组件

## 后端部分

### 主要文件
- `server/` - 后端服务器文件夹
  - `index.js` - 服务器入口文件
  - `api-service.js` - API调用服务
  - `config.js` - 配置文件（存储API密钥等敏感信息）
  - `middlewares/` - 中间件文件夹
    - `auth.js` - 身份验证中间件
    - `rate-limiter.js` - 请求速率限制

### API接口
- `routes/`
  - `video-generation.js` - 视频生成相关接口
  - `status.js` - 状态查询接口
  - `download.js` - 下载接口

## 部署文件
- `package.json` - 项目依赖配置
- `.env.example` - 环境变量示例文件
- `.gitignore` - Git忽略文件
- `README.md` - 项目说明文档
- `LICENSE` - 许可证文件

## 开发与构建文件
- `webpack.config.js` - Webpack配置（如果使用）
- `vite.config.js` - Vite配置（如果使用）
- `.eslintrc.js` - ESLint配置
- `.prettierrc` - Prettier配置

## Cloudflare配置
- `wrangler.toml` - Cloudflare Workers配置文件
- `_redirects` - URL重定向规则

## 说明
此项目结构为MVP（最小可行产品）阶段的建议结构，随着项目的发展可能需要进行调整和扩展。 