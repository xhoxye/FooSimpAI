export type Language = 'en' | 'zh';

export const translations = {
  en: {
    // Header
    appName: "FooSimpAI",
    online: "Online",
    offline: "Offline",
    switchLang: "Switch Language",
    toggleTheme: "Toggle Theme",
    openAbout: "About & Help",
    openSettings: "Settings & Status",
    
    // Sidebar - Tabs
    create: "Create",
    models: "Models",
    advanced: "Advanced",
    
    // Sidebar - Create
    positivePrompt: "Positive Prompt",
    clear: "Clear",
    clearTooltip: "Clear prompt text",
    random: "Random",
    randomTooltip: "Generate random prompt",
    artStyle: "Art Style",
    artStyleTooltip: "Click to append style keywords",
    dimensions: "Dimensions",
    
    // Sidebar - Models
    modelSettings: "Model Settings",
    checkpoint: "Checkpoint (Exact Filename)",
    checkpointPlaceholder: "Leave empty to use workflow default",
    checkpointHint: "Enter the exact filename (e.g., v1-5-pruned.ckpt). If blank, the model defined in the JSON workflow is used.",
    
    // Sidebar - Advanced
    negativePrompt: "Negative Prompt",
    negativePlaceholder: "What to avoid...",
    seed: "Seed",
    seedRandom: "-1 (Random)",
    seedRandomTooltip: "Set seed to -1 (Randomize)",
    steps: "Steps",
    cfgScale: "CFG Scale",
    sampler: "Sampler",
    scheduler: "Scheduler",
    
    // Sidebar - Footer
    connectWorkflow: "Connect Workflow",
    generate: "Generate",
    generating: "Generating...",
    calculating: "Calculating...",
    batchSize: "Batch Size",
    
    // ImageViewer
    creating: "Creating masterpiece...",
    genFailed: "Generation Failed",
    ready: "Ready to Create",
    readyHint: "Enter a prompt and choose a style to begin",
    noHistory: "No recent history",
    openInNewTab: "Open in New Tab",
    download: "Download Image",
    fullscreen: "Fullscreen View",
    close: "Close",
    clearHistory: "Clear History",
    timeElapsed: "Elapsed: ",
    timeLast: "Last: ",
    
    // Settings
    backendConfig: "Backend & Workflow Configuration",
    sectionConnection: "1. ComfyUI Connection",
    backendUrl: "Backend URL",
    check: "Check",
    noteCors: "Note: Ensure ComfyUI is launched with",
    sectionWorkflow: "2. Workflow Upload",
    uploadTitle: "Click to upload Workflow (API Format JSON)",
    uploadHint: "Export from ComfyUI using \"Save (API Format)\"",
    workflowLoaded: "Workflow loaded:",
    sectionMapping: "3. Parameter Mapping",
    autoReset: "Auto-Reset Mappings",
    uiParam: "UI Parameter",
    defaultVal: "Default Value",
    targetNode: "Target Node",
    inputField: "Input Field",
    unmapped: "-- Unmapped --",
    selectField: "-- Select Field --",
    done: "Done",
    
    // About
    aboutTitle: "About FooSimpAI",
    aboutDesc: "Next-Gen ComfyUI Frontend",
    aboutText: "FooSimpAI is a streamlined, user-friendly interface designed for ComfyUI. It bridges the gap between complex node-based workflows and simple, accessible artistic creation.",
    guide: "Quick Start Guide",
    guide1Title: "Connect Backend",
    guide1Text: "Ensure your ComfyUI instance is running with --listen and CORS enabled.",
    guide2Title: "Load Workflow",
    guide2Text: "Upload a workflow exported in API Format (JSON) from ComfyUI.",
    guide3Title: "Map Parameters",
    guide3Text: "Use the settings dialog to map UI controls to specific nodes.",
    guide4Title: "Generate",
    guide4Text: "Close settings, type your prompt, and hit Generate!",
    sourceCode: "Source Code"
  },
  zh: {
    // Header
    appName: "FooSimpAI",
    online: "在线",
    offline: "离线",
    switchLang: "切换语言",
    toggleTheme: "切换主题",
    openAbout: "关于与帮助",
    openSettings: "设置与状态",
    
    // Sidebar - Tabs
    create: "创作",
    models: "模型",
    advanced: "高级",
    
    // Sidebar - Create
    positivePrompt: "正面提示词",
    clear: "清空",
    clearTooltip: "清空提示词",
    random: "随机",
    randomTooltip: "生成随机提示词",
    artStyle: "艺术风格",
    artStyleTooltip: "点击追加风格提示词",
    dimensions: "尺寸比例",
    
    // Sidebar - Models
    modelSettings: "模型设置",
    checkpoint: "大模型 (Checkpoint)",
    checkpointPlaceholder: "留空以使用工作流默认值",
    checkpointHint: "输入确切的文件名 (如 v1-5-pruned.ckpt)。如果留空，将使用 JSON 工作流中定义的模型。",
    
    // Sidebar - Advanced
    negativePrompt: "负面提示词",
    negativePlaceholder: "想要避免的内容...",
    seed: "种子 (Seed)",
    seedRandom: "-1 (随机)",
    seedRandomTooltip: "设置为 -1 (随机)",
    steps: "步数 (Steps)",
    cfgScale: "提示词相关性 (CFG)",
    sampler: "采样器",
    scheduler: "调度器",
    
    // Sidebar - Footer
    connectWorkflow: "连接工作流",
    generate: "生成图片",
    generating: "生成中...",
    calculating: "计算中...",
    batchSize: "批次数量",
    
    // ImageViewer
    creating: "正在绘制杰作...",
    genFailed: "生成失败",
    ready: "准备创作",
    readyHint: "输入提示词并选择风格以开始",
    noHistory: "暂无历史记录",
    openInNewTab: "新窗口打开原图",
    download: "下载图片",
    fullscreen: "全屏查看",
    close: "关闭",
    clearHistory: "清空历史记录",
    timeElapsed: "耗时: ",
    timeLast: "上次: ",
    
    // Settings
    backendConfig: "后端与工作流配置",
    sectionConnection: "1. ComfyUI 连接",
    backendUrl: "后端地址",
    check: "检查连接",
    noteCors: "注意：请确保 ComfyUI 启动参数包含",
    sectionWorkflow: "2. 上传工作流",
    uploadTitle: "点击上传工作流 (API 格式 JSON)",
    uploadHint: "请使用 ComfyUI 的 \"Save (API Format)\" 导出",
    workflowLoaded: "已加载工作流:",
    sectionMapping: "3. 参数映射",
    autoReset: "自动重置映射",
    uiParam: "UI 参数",
    defaultVal: "默认值",
    targetNode: "目标节点",
    inputField: "输入字段",
    unmapped: "-- 未映射 --",
    selectField: "-- 选择字段 --",
    done: "完成",
    
    // About
    aboutTitle: "关于 FooSimpAI",
    aboutDesc: "下一代 ComfyUI 前端",
    aboutText: "FooSimpAI 是一个为 ComfyUI 设计的简洁、用户友好的界面。它弥合了复杂的节点工作流与简单的艺术创作之间的鸿沟。",
    guide: "快速入门指南",
    guide1Title: "连接后端",
    guide1Text: "确保您的 ComfyUI 实例已启用 --listen 和 CORS。",
    guide2Title: "加载工作流",
    guide2Text: "上传从 ComfyUI 导出的 API 格式 (JSON) 工作流。",
    guide3Title: "映射参数",
    guide3Text: "使用设置对话框将 UI 控件映射到特定节点。",
    guide4Title: "生成",
    guide4Text: "关闭设置，输入提示词，点击生成！",
    sourceCode: "源代码"
  }
};