require('dotenv').config();

module.exports = {
  apiKey: process.env.API_KEY,
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiBaseUrl: 'https://api.siliconflow.cn/v1'
};
