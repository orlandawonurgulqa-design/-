export enum StylePreset {
  NONE = 'None',
  CINEMATIC = 'Cinematic',
  ANIME = 'Anime',
  PHOTOREALISTIC = 'Photorealistic',
  OIL_PAINTING = 'Oil Painting',
  CYBERPUNK = 'Cyberpunk',
  SKETCH = 'Pencil Sketch',
  XXX_BLOCK = '3D Render'
}

export type Language = 'en' | 'zh';

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
}

export interface GenerationConfig {
  prompt: string;
  negativePrompt: string;
  style: StylePreset;
  referenceImages: string[]; // Base64 strings
  referenceImagePrompt: string;
  aspectRatio: string;
}