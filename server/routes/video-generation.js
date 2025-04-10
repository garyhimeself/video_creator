const express = require('express');
const router = express.Router();
const apiService = require('../api-service');

/**
 * 提交视频生成请求
 * 接收用户的提示词和设置，转发到硅基流动API
 */
router.post('/generate', async (req, res) => {
  try {
    // 从请求中获取参数
    const { model, prompt, negative_prompt, image_size, image, seed } = req.body;
    
    // 验证必填参数
    if (!model || !prompt) {
      return res.status(400).json({ error: '缺少必要参数：model和prompt为必填项' });
    }
    
    // 构建API请求参数
    const requestData = {
      model,
      prompt,
      image_size: image_size || '1280x720'
    };
    
    // 添加可选参数
    if (negative_prompt) requestData.negative_prompt = negative_prompt;
    if (image) requestData.image = image;
    if (seed) requestData.seed = parseInt(seed);
    
    // 调用API服务提交请求
    const result = await apiService.submitVideoGeneration(requestData);
    
    // 返回结果
    res.json(result);
  } catch (error) {
    console.error('视频生成请求失败:', error);
    res.status(500).json({ error: error.message || '服务器内部错误' });
  }
});

/**
 * 获取视频生成状态
 * 根据requestId查询视频生成进度和结果
 */
router.post('/status', async (req, res) => {
  try {
    const { requestId } = req.body;
    
    // 验证请求ID
    if (!requestId) {
      return res.status(400).json({ error: '缺少请求ID(requestId)' });
    }
    
    // 获取视频状态
    const statusResult = await apiService.getVideoStatus(requestId);
    
    // 返回结果
    res.json(statusResult);
  } catch (error) {
    console.error('获取视频状态失败:', error);
    res.status(500).json({ error: error.message || '服务器内部错误' });
  }
});

/**
 * 获取支持的模型列表
 * 返回可用的视频生成模型列表
 */
router.get('/models', (req, res) => {
  // 这里可以从配置或动态获取模型列表
  // 目前是静态列表
  const models = [
    {
      id: 'Wan-AI/Wan2.1-I2V-14B-720P',
      name: 'Wan AI 图生视频 (标准版)',
      description: '将图片转换为视频的模型',
      type: 'image-to-video'
    },
    {
      id: 'Wan-AI/Wan2.1-I2V-14B-720P-Turbo',
      name: 'Wan AI 图生视频 (快速版)',
      description: '将图片转换为视频的快速模型',
      type: 'image-to-video'
    },
    {
      id: 'Wan-AI/Wan2.1-T2V-14B',
      name: 'Wan AI 文生视频 (标准版)',
      description: '根据文本描述生成视频的模型',
      type: 'text-to-video'
    },
    {
      id: 'Wan-AI/Wan2.1-T2V-14B-Turbo',
      name: 'Wan AI 文生视频 (快速版)',
      description: '根据文本描述生成视频的快速模型',
      type: 'text-to-video'
    },
    {
      id: 'tencent/HunyuanVideo',
      name: '腾讯混元视频生成',
      description: '腾讯提供的视频生成模型',
      type: 'text-to-video'
    }
  ];
  
  res.json({ models });
});

module.exports = router;
