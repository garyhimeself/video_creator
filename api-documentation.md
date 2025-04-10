# 硅基流动 API 集成文档

## API 概述

本项目使用硅基流动平台的视频生成API，主要用到两个接口：
1. 创建视频生成请求
2. 获取视频生成链接请求

## API 密钥管理

API 密钥必须保存在服务器端，严禁在前端代码中暴露。推荐的做法是：
- 在服务器的环境变量中保存 API 密钥
- 通过后端接口转发请求到硅基流动 API
- 使用请求认证确保只有授权用户能通过你的服务调用 API

## 接口 1: 创建视频生成请求

### 请求格式

```
POST https://api.siliconflow.cn/v1/video/submit
```

### 请求头

```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

### 请求体参数

```json
{
  "model": "Wan-AI/Wan2.1-I2V-14B-720P",
  "prompt": "<用户输入的提示词>",
  "negative_prompt": "<可选的负面提示词>",
  "image_size": "1280x720",
  "image": "<可选的参考图像URL或Base64>",
  "seed": <可选的随机种子>
}
```

### 可用的模型选项
- `Wan-AI/Wan2.1-I2V-14B-720P`
- `Wan-AI/Wan2.1-I2V-14B-720P-Turbo`
- `Wan-AI/Wan2.1-T2V-14B`
- `Wan-AI/Wan2.1-T2V-14B-Turbo`
- `tencent/HunyuanVideo`

### 可用的尺寸选项
- `1280x720`
- `720x1280`
- `960x960`

### 响应格式

```json
{
  "requestId": "<请求ID>"
}
```

## 接口 2: 获取视频生成链接

### 请求格式

```
POST https://api.siliconflow.cn/v1/video/status
```

### 请求头

```
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

### 请求体参数

```json
{
  "requestId": "<接口1返回的请求ID>"
}
```

### 响应格式

```json
{
  "status": "Succeed", // 可能的值: Succeed, InQueue, InProgress, Failed
  "reason": "<原因>",
  "results": {
    "videos": [
      {
        "url": "<视频URL>"
      }
    ],
    "timings": {
      "inference": 123
    },
    "seed": 123
  }
}
```

## 状态轮询

由于视频生成是异步过程，需要定期查询生成状态：

1. 发送视频生成请求后，获取 `requestId`
2. 使用 `requestId` 定期查询视频状态（推荐间隔 3-5 秒）
3. 根据 `status` 字段判断生成状态：
   - `InQueue`: 排队中
   - `InProgress`: 生成中
   - `Succeed`: 生成成功
   - `Failed`: 生成失败

4. 生成成功后，从 `results.videos[0].url` 获取视频地址
5. 注意：生成的视频链接仅在一小时内有效，应立即提供下载或自动保存到服务器

## 注意事项

1. 视频生成可能需要较长时间，前端应显示适当的进度指示
2. 为避免超时错误，服务器请求应设置较长的超时时间（推荐 120 秒以上）
3. 对于高频调用，应实现请求限流机制
4. 请勿在公开仓库或前端代码中暴露 API 密钥
5. 生成的视频链接会在 1 小时后过期，请确保用户及时下载 