const fetch = require('node-fetch');
const config = require('./config');

/**
 * 提交视频生成请求
 * @param {Object} data - 请求数据，包含模型、提示词、分辨率等
 * @returns {Promise<Object>} 包含requestId的响应
 */
async function submitVideoGeneration(data) {
  try {
    const response = await fetch(`${config.apiBaseUrl}/video/submit`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API错误: ${errorData.error || response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('提交视频生成请求失败:', error);
    throw error;
  }
}

/**
 * 获取视频生成状态
 * @param {string} requestId - 请求ID
 * @returns {Promise<Object>} 包含视频状态、URL等信息的响应
 */
async function getVideoStatus(requestId) {
  try {
    const response = await fetch(`${config.apiBaseUrl}/video/status`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ requestId })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API错误: ${errorData.error || response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('获取视频状态失败:', error);
    throw error;
  }
}

module.exports = {
  submitVideoGeneration,
  getVideoStatus
};
