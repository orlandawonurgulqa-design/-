import { Language, StylePreset } from './types';

export const TRANSLATIONS = {
  en: {
    app: {
      title: "Gemini Vision Studio",
      subtitle: "Powered by Google Gemini"
    },
    style: {
      title: "1. Character Model & Reference",
      desc: "Import up to 5 reference images or models for character consistency.",
      label: "Artistic Style",
      importLabel: "Import Model / Reference Images (Max 5)",
      uploadText: "Upload Image",
      uploadedAlt: "Reference Image",
      modelPromptLabel: "Model Prompt / Trigger Word",
      modelPromptPlaceholder: "Describe the reference images or add trigger words..."
    },
    settings: {
      title: "Output Settings",
      aspectRatio: "Aspect Ratio"
    },
    prompt: {
      title: "2. Storyboard & Prompts",
      desc: "Describe your scene. The system can automatically deduce unwanted elements.",
      positiveLabel: "Positive Prompt (Scene Description)",
      positivePlaceholder: "e.g., A futuristic cyberpunk detective standing in neon rain, glowing blue holographic coat...",
      negativeLabel: "Negative Prompt (Exclusions)",
      negativePlaceholder: "e.g., blurry, low quality, bad hands...",
      autoGenerate: "Auto-Generate",
      generate: "Generate Image",
      stop: "Stop Generation",
      dreaming: "Dreaming...",
      clear: "Clear"
    },
    preview: {
      readyTitle: "Ready to Create",
      readyDesc: "Set your style, write a prompt, and watch your imagination come to life.",
      title: "Preview",
      download: "Download HD",
      recent: "Recent Generations",
      noImage: "No image selected",
      clearHistory: "Clear History"
    }
  },
  zh: {
    app: {
      title: "Gemini 视觉工作室",
      subtitle: "由 Google Gemini 提供支持"
    },
    style: {
      title: "1. 角色模型与参考",
      desc: "导入最多5张参考图片或模型以保持角色一致性。",
      label: "艺术风格",
      importLabel: "导入模型 / 参考图 (最多5张)",
      uploadText: "上传图片",
      uploadedAlt: "参考图片",
      modelPromptLabel: "模型提示词",
      modelPromptPlaceholder: "描述参考图或添加触发词..."
    },
    settings: {
      title: "输出设置",
      aspectRatio: "画面比例"
    },
    prompt: {
      title: "2. 分镜与提示词",
      desc: "描述您的场景。系统可以自动推断不需要的元素。",
      positiveLabel: "正向提示词 (场景描述)",
      positivePlaceholder: "例如：一位站在霓虹雨中的未来赛博朋克侦探，穿着发光的蓝色全息外套...",
      negativeLabel: "反向提示词 (排除项)",
      negativePlaceholder: "例如：模糊，低质量，坏手...",
      autoGenerate: "自动生成",
      generate: "生成图片",
      stop: "停止生成",
      dreaming: "构思中...",
      clear: "清除"
    },
    preview: {
      readyTitle: "准备创作",
      readyDesc: "设置风格，编写提示词，让您的想象力变为现实。",
      title: "预览",
      download: "下载高清图",
      recent: "最近生成",
      noImage: "未选择图片",
      clearHistory: "清空历史"
    }
  }
};

export const STYLE_LABELS: Record<StylePreset, { en: string; zh: string }> = {
  [StylePreset.NONE]: { en: 'None', zh: '无' },
  [StylePreset.CINEMATIC]: { en: 'Cinematic', zh: '电影感' },
  [StylePreset.ANIME]: { en: 'Anime', zh: '动漫' },
  [StylePreset.PHOTOREALISTIC]: { en: 'Photorealistic', zh: '真实感' },
  [StylePreset.OIL_PAINTING]: { en: 'Oil Painting', zh: '油画' },
  [StylePreset.CYBERPUNK]: { en: 'Cyberpunk', zh: '赛博朋克' },
  [StylePreset.SKETCH]: { en: 'Pencil Sketch', zh: '素描' },
  [StylePreset.XXX_BLOCK]: { en: '3D Render', zh: '3D渲染' },
};

export const RATIO_LABELS: Record<string, { en: string; zh: string }> = {
  'Square (1:1)': { en: 'Square (1:1)', zh: '方形 (1:1)' },
  'Landscape (16:9)': { en: 'Landscape (16:9)', zh: '横屏 (16:9)' },
  'Portrait (9:16)': { en: 'Portrait (9:16)', zh: '竖屏 (9:16)' },
  'Standard (4:3)': { en: 'Standard (4:3)', zh: '标准 (4:3)' },
  'Tall (3:4)': { en: 'Tall (3:4)', zh: '高挑 (3:4)' },
};