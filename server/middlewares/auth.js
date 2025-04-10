/**
 * 基本的认证中间件
 * 在生产环境中可以扩展为更复杂的认证逻辑
 */
function basicAuth(req, res, next) {
  // 示例：检查请求来源
  const origin = req.headers.origin || req.headers.referer;
  
  // 这里可以添加来源验证逻辑
  // 例如，只允许来自特定域名的请求
  
  // 记录请求信息
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${origin || 'Unknown'}`);
  
  // 继续处理请求
  next();
}

/**
 * 速率限制中间件
 * 简单实现，可在生产环境中替换为更健壮的解决方案
 */
const requestCounts = {};
const WINDOW_MS = 60000; // 1分钟窗口
const MAX_REQUESTS = 10; // 每窗口最大请求数

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  
  // 初始化该IP的请求记录
  if (!requestCounts[ip]) {
    requestCounts[ip] = [];
  }
  
  // 清理过期的请求记录
  requestCounts[ip] = requestCounts[ip].filter(timestamp => now - timestamp < WINDOW_MS);
  
  // 检查是否超过限制
  if (requestCounts[ip].length >= MAX_REQUESTS) {
    return res.status(429).json({
      error: '请求过于频繁，请稍后再试',
      retryAfter: Math.ceil((WINDOW_MS - (now - requestCounts[ip][0])) / 1000)
    });
  }
  
  // 记录本次请求
  requestCounts[ip].push(now);
  
  next();
}

module.exports = {
  basicAuth,
  rateLimit
};
