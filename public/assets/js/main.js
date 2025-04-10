/**
 * Video Creator 主要JavaScript文件
 * 处理用户界面交互和API调用
 */

// 当前语言 ('zh' 或 'en')
let currentLanguage = 'zh';

// 状态常量
const STATUS = {
  IDLE: 'idle',
  QUEUE: 'InQueue',
  PROGRESS: 'InProgress',
  SUCCESS: 'Succeed',
  FAILED: 'Failed'
};

// 当前请求状态
let currentStatus = STATUS.IDLE;
let currentRequestId = null;
let statusCheckInterval = null;

// i18n 文本
const i18n = {
  zh: {
    title: 'Video Creator',
    prompt: '提示词',
    promptPlaceholder: '请输入视频内容的详细描述...',
    model: '选择模型',
    resolution: '分辨率',
    generate: '生成视频',
    generating: '生成中...',
    status: {
      idle: '准备就绪',
      queue: '排队中',
      progress: '生成中',
      success: '生成成功',
      failed: '生成失败'
    },
    download: '下载视频',
    advanced: '高级设置',
    negPrompt: '负面提示词',
    negPromptPlaceholder: '请输入要避免的内容（可选）',
    seed: '随机种子',
    seedPlaceholder: '留空为随机',
    reset: '重置',
    videoPlaceholder: '视频将在这里显示',
    modelTypes: {
      'image-to-video': '图生视频',
      'text-to-video': '文生视频'
    },
    modelSpeed: {
      standard: '标准版',
      turbo: '快速版'
    },
    error: {
      prompt: '请输入提示词',
      server: '服务器错误，请稍后重试',
      network: '网络错误，请检查连接'
    },
    footer: '© 2023 Video Creator. 由硅基流动API提供支持。'
  },
  en: {
    title: 'Video Creator',
    prompt: 'Prompt',
    promptPlaceholder: 'Enter a detailed description of the video content...',
    model: 'Select Model',
    resolution: 'Resolution',
    generate: 'Generate Video',
    generating: 'Generating...',
    status: {
      idle: 'Ready',
      queue: 'In Queue',
      progress: 'In Progress',
      success: 'Generation Complete',
      failed: 'Generation Failed'
    },
    download: 'Download Video',
    advanced: 'Advanced Settings',
    negPrompt: 'Negative Prompt',
    negPromptPlaceholder: 'Enter content to avoid (optional)',
    seed: 'Random Seed',
    seedPlaceholder: 'Leave empty for random',
    reset: 'Reset',
    videoPlaceholder: 'Video will appear here',
    modelTypes: {
      'image-to-video': 'Image to Video',
      'text-to-video': 'Text to Video'
    },
    modelSpeed: {
      standard: 'Standard',
      turbo: 'Turbo'
    },
    error: {
      prompt: 'Please enter a prompt',
      server: 'Server error, please try again later',
      network: 'Network error, please check your connection'
    },
    footer: '© 2023 Video Creator. Powered by SiliconFlow API.'
  }
};

// DOM 元素
let elements = {};

// 页面加载完成
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

/**
 * 初始化应用
 */
function initializeApp() {
  // 获取DOM元素
  cacheElements();
  
  // 设置事件监听器
  setupEventListeners();
  
  // 加载模型列表
  loadModelList();
  
  // 设置语言
  setLanguage(currentLanguage);
  
  // 初始化UI状态
  updateUIState(STATUS.IDLE);
}

/**
 * 缓存常用DOM元素
 */
function cacheElements() {
  elements = {
    // 语言切换
    langBtns: document.querySelectorAll('.lang-btn'),
    
    // 表单元素
    promptInput: document.getElementById('prompt-input'),
    modelSelector: document.getElementById('model-selector'),
    resolutionOptions: document.querySelectorAll('.resolution-option'),
    generateBtn: document.getElementById('generate-btn'),
    
    // 高级设置
    settingsToggle: document.querySelector('.settings-toggle'),
    settingsContent: document.querySelector('.settings-content'),
    negativePrompt: document.getElementById('negative-prompt'),
    seedInput: document.getElementById('seed-input'),
    resetBtn: document.getElementById('reset-btn'),
    
    // 状态和预览
    statusText: document.querySelector('.status-text'),
    statusDot: document.querySelector('.status-dot'),
    progressBar: document.querySelector('.progress-bar'),
    videoContainer: document.querySelector('.video-wrapper'),
    videoElement: document.querySelector('video'),
    placeholder: document.querySelector('.placeholder'),
    downloadBtn: document.querySelector('.download-btn'),
    
    // 多语言元素
    i18nElements: document.querySelectorAll('[data-i18n]')
  };
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
  // 语言切换
  elements.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
  
  // 分辨率选择
  elements.resolutionOptions.forEach(option => {
    option.addEventListener('click', () => {
      elements.resolutionOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
    });
  });
  
  // 生成按钮
  elements.generateBtn.addEventListener('click', handleGenerate);
  
  // 高级设置显示/隐藏
  elements.settingsToggle.addEventListener('click', () => {
    elements.settingsContent.style.display = 
      elements.settingsContent.style.display === 'none' ? 'block' : 'none';
  });
  
  // 重置按钮
  elements.resetBtn.addEventListener('click', resetForm);
  
  // 下载按钮
  elements.downloadBtn.addEventListener('click', handleDownload);
}

/**
 * 设置界面语言
 * @param {string} lang - 语言代码 ('zh' 或 'en')
 */
function setLanguage(lang) {
  if (!i18n[lang]) return;
  
  currentLanguage = lang;
  
  // 更新语言按钮状态
  elements.langBtns.forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });
  
  // 更新所有带有data-i18n属性的元素
  elements.i18nElements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && i18n[lang][key]) {
      el.textContent = i18n[lang][key];
    }
  });
  
  // 更新占位符文本
  elements.promptInput.placeholder = i18n[lang].promptPlaceholder;
  elements.negativePrompt.placeholder = i18n[lang].negPromptPlaceholder;
  elements.seedInput.placeholder = i18n[lang].seedPlaceholder;
  
  // 更新状态文本
  updateStatusText();
}

/**
 * 加载模型列表
 */
async function loadModelList() {
  try {
    const response = await fetch('/api/video/models');
    if (!response.ok) throw new Error('无法加载模型列表');
    
    const data = await response.json();
    
    // 清空现有选项
    elements.modelSelector.innerHTML = '';
    
    // 添加新选项
    data.models.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      
      // 构建模型名称（根据当前语言）
      const modelType = i18n[currentLanguage].modelTypes[model.type] || model.type;
      const modelSpeed = model.id.includes('Turbo') ? 
                        i18n[currentLanguage].modelSpeed.turbo : 
                        i18n[currentLanguage].modelSpeed.standard;
      
      option.textContent = `${model.name} (${modelType} - ${modelSpeed})`;
      elements.modelSelector.appendChild(option);
    });
  } catch (error) {
    console.error('加载模型失败:', error);
    // 添加一些默认选项
    const defaultModels = [
      { id: 'Wan-AI/Wan2.1-T2V-14B', name: 'Wan AI 文生视频 (标准版)' },
      { id: 'Wan-AI/Wan2.1-T2V-14B-Turbo', name: 'Wan AI 文生视频 (快速版)' }
    ];
    
    defaultModels.forEach(model => {
      const option = document.createElement('option');
      option.value = model.id;
      option.textContent = model.name;
      elements.modelSelector.appendChild(option);
    });
  }
}

/**
 * 处理生成按钮点击
 */
async function handleGenerate() {
  // 验证表单
  const prompt = elements.promptInput.value.trim();
  if (!prompt) {
    showError(i18n[currentLanguage].error.prompt);
    return;
  }
  
  // 获取其他参数
  const model = elements.modelSelector.value;
  const activeResolution = document.querySelector('.resolution-option.active');
  const image_size = activeResolution ? activeResolution.getAttribute('data-resolution') : '1280x720';
  const negative_prompt = elements.negativePrompt.value.trim();
  const seed = elements.seedInput.value.trim() ? parseInt(elements.seedInput.value.trim()) : null;
  
  // 更新UI状态
  updateUIState(STATUS.QUEUE);
  
  try {
    // 发送生成请求
    const response = await fetch('/api/video/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        prompt,
        negative_prompt,
        image_size,
        seed
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '服务器错误');
    }
    
    const data = await response.json();
    currentRequestId = data.requestId;
    
    // 开始轮询状态
    startStatusPolling();
  } catch (error) {
    console.error('生成请求失败:', error);
    showError(error.message || i18n[currentLanguage].error.server);
    updateUIState(STATUS.FAILED);
  }
}

/**
 * 开始轮询视频生成状态
 */
function startStatusPolling() {
  // 清除任何现有的轮询
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
  }
  
  // 设置轮询间隔
  statusCheckInterval = setInterval(checkVideoStatus, 3000);
}

/**
 * 检查视频生成状态
 */
async function checkVideoStatus() {
  if (!currentRequestId) return;
  
  try {
    const response = await fetch('/api/video/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requestId: currentRequestId
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '服务器错误');
    }
    
    const data = await response.json();
    currentStatus = data.status;
    
    // 更新UI状态
    updateUIState(currentStatus);
    
    // 更新进度条
    updateProgressBar(currentStatus);
    
    // 如果生成完成，显示视频
    if (currentStatus === STATUS.SUCCESS) {
      displayVideo(data.results.videos[0].url);
      clearInterval(statusCheckInterval);
    }
    
    // 如果生成失败，显示错误
    if (currentStatus === STATUS.FAILED) {
      showError(data.reason || i18n[currentLanguage].error.server);
      clearInterval(statusCheckInterval);
    }
  } catch (error) {
    console.error('状态检查失败:', error);
    showError(error.message || i18n[currentLanguage].error.network);
    clearInterval(statusCheckInterval);
    updateUIState(STATUS.FAILED);
  }
}

/**
 * 更新UI状态
 * @param {string} status - 当前状态
 */
function updateUIState(status) {
  currentStatus = status;
  
  // 更新状态指示器
  elements.statusDot.className = 'status-dot';
  if (status === STATUS.QUEUE) elements.statusDot.classList.add('queue');
  if (status === STATUS.PROGRESS) elements.statusDot.classList.add('progress');
  if (status === STATUS.SUCCESS) elements.statusDot.classList.add('success');
  if (status === STATUS.FAILED) elements.statusDot.classList.add('error');
  
  // 更新状态文本
  updateStatusText();
  
  // 更新按钮状态
  elements.generateBtn.disabled = status !== STATUS.IDLE && status !== STATUS.FAILED;
  elements.generateBtn.textContent = status === STATUS.IDLE || status === STATUS.FAILED ? 
    i18n[currentLanguage].generate : i18n[currentLanguage].generating;
  
  // 显示/隐藏下载按钮
  elements.downloadBtn.classList.toggle('visible', status === STATUS.SUCCESS);
}

/**
 * 更新状态文本
 */
function updateStatusText() {
  let statusKey;
  
  switch (currentStatus) {
    case STATUS.QUEUE:
      statusKey = 'queue';
      break;
    case STATUS.PROGRESS:
      statusKey = 'progress';
      break;
    case STATUS.SUCCESS:
      statusKey = 'success';
      break;
    case STATUS.FAILED:
      statusKey = 'failed';
      break;
    default:
      statusKey = 'idle';
  }
  
  elements.statusText.textContent = i18n[currentLanguage].status[statusKey];
}

/**
 * 更新进度条
 * @param {string} status - 当前状态
 */
function updateProgressBar(status) {
  let progress = 0;
  
  switch (status) {
    case STATUS.QUEUE:
      progress = 20;
      break;
    case STATUS.PROGRESS:
      // 从20%到90%的渐进动画
      const currentWidth = parseInt(elements.progressBar.style.width || '0');
      progress = Math.min(90, Math.max(20, currentWidth + 5));
      break;
    case STATUS.SUCCESS:
      progress = 100;
      break;
    case STATUS.FAILED:
      progress = 0;
      break;
    default:
      progress = 0;
  }
  
  elements.progressBar.style.width = `${progress}%`;
}

/**
 * 显示生成的视频
 * @param {string} videoUrl - 视频URL
 */
function displayVideo(videoUrl) {
  // 隐藏占位符
  elements.placeholder.style.display = 'none';
  
  // 设置视频源并显示
  elements.videoElement.src = videoUrl;
  elements.videoElement.style.display = 'block';
  elements.videoElement.play().catch(error => {
    console.error('视频播放失败:', error);
  });
}

/**
 * 处理视频下载
 */
function handleDownload() {
  if (!elements.videoElement.src) return;
  
  // 创建一个临时链接并触发下载
  const a = document.createElement('a');
  a.href = elements.videoElement.src;
  a.download = `video_${Date.now()}.mp4`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * 重置表单和状态
 */
function resetForm() {
  elements.promptInput.value = '';
  elements.negativePrompt.value = '';
  elements.seedInput.value = '';
  
  // 重置分辨率选择
  elements.resolutionOptions.forEach((opt, index) => {
    opt.classList.toggle('active', index === 0);
  });
  
  // 重置状态
  updateUIState(STATUS.IDLE);
  
  // 重置视频
  elements.videoElement.src = '';
  elements.videoElement.style.display = 'none';
  elements.placeholder.style.display = 'flex';
  elements.progressBar.style.width = '0%';
  
  // 清除轮询
  if (statusCheckInterval) {
    clearInterval(statusCheckInterval);
    statusCheckInterval = null;
  }
  
  currentRequestId = null;
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showError(message) {
  // 创建错误消息元素
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-message';
  errorDiv.textContent = message;
  
  // 显示在控制面板顶部
  const controlPanel = document.querySelector('.control-panel');
  controlPanel.insertBefore(errorDiv, controlPanel.firstChild);
  
  // 3秒后自动删除
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}
