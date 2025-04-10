const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const videoRoutes = require('./routes/video-generation');
const { basicAuth, rateLimit } = require('./middlewares/auth');

// 初始化Express应用
const app = express();

// 基本中间件
app.use(cors());  // 允许跨域请求
app.use(express.json());  // 解析JSON请求体
app.use(express.static(path.join(__dirname, '../public')));  // 静态文件服务

// API路由
app.use('/api/video', basicAuth, rateLimit, videoRoutes);

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 健康检查路由
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 未找到路由处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '未找到请求的资源' });
});

// 启动服务器
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
  console.log(`当前环境: ${config.nodeEnv}`);
});
