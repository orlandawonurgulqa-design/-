import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { StylePreset } from '../types';

// Ensure API key is present
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a negative prompt based on the positive prompt using a text model.
 * Uses gemini-2.0-flash for high availability and speed.
 */
export const generateNegativePrompt = async (positivePrompt: string): Promise<string> => {
  if (!positivePrompt.trim()) return "";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `
        Task: Generate a list of negative prompt keywords for an AI image generator based on the following positive prompt.
        Positive Prompt: "${positivePrompt}"
        
        Instructions:
        1. Identify common defects or unwanted elements associated with the style of the positive prompt.
        2. Provide a comma-separated list of keywords to exclude.
        3. Do NOT include any explanations, just the keywords.
        4. Examples of keywords: blurry, low quality, deformed, watermark, bad anatomy, extra limbs.
        
        Output:
      `,
    });
    
    return response.text?.trim() || "blurry, low quality, distorted";
  } catch (error) {
    console.error("Error generating negative prompt:", error);
    // Return a safe fallback to prevent app crash
    return "low quality, blurry, deformed, artifacts";
  }
};

/**
 * Generates an image using the Gemini Image model.
 * Uses gemini-2.5-flash-image which is generally available.
 * Supports AbortSignal for cancellation.
 */
export const generateImage = async (
  prompt: string,
  negativePrompt: string,
  style: StylePreset,
  referenceImages: string[],
  referenceImagePrompt: string,
  aspectRatio: string,
  signal?: AbortSignal
): Promise<string> => {
  
  const parts: any[] = [];

  // 1. Add Reference Images first (Context)
  // If there are reference images (Model Import), add them first
  if (referenceImages && referenceImages.length > 0) {
    referenceImages.forEach((base64String) => {
      // Robustly extract base64 data, handling both with and without data URL prefix
      const base64Data = base64String.includes(',') 
        ? base64String.split(',')[1] 
        : base64String;
        
      // Extract mime type if present, otherwise default to png
      const mimeMatch = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';

      parts.push({
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      });
    });
  }

  // 2. Construct a Structured Prompt to bind Images + Text
  // We reorganize the prompt to prioritize Reference Styles when they exist.
  let textPrompt = "";

  if (referenceImages && referenceImages.length > 0) {
    // STRICT REFERENCE MODE
    textPrompt += `[SYSTEM INSTRUCTION]\n`;
    textPrompt += `You are an expert image generation assistant specializing in style transfer and consistency. The images provided above are your SOURCE MATERIAL.\n\n`;
    
    textPrompt += `[VISUAL STYLE & CHARACTER MANDATE]\n`;
    textPrompt += `1. Analyze the attached reference images deeply. You MUST replicate their artistic style, rendering technique, color palette, and character design features.\n`;
    textPrompt += `2. If the user prompt conflicts with the visual style of the reference images, prioritize the style of the reference images.\n`;
    
    if (referenceImagePrompt) {
      textPrompt += `3. PRIMARY SUBJECT/CONCEPT: "${referenceImagePrompt}". Ensure the generated image clearly represents this subject/concept as depicted in the reference images.\n`;
    }
    
    textPrompt += `\n[GENERATION TASK]\n`;
    textPrompt += `Apply the visual style and character features defined above to generate the following scene:\n"${prompt}"\n`;
  } else {
    // STANDARD MODE (No references)
    textPrompt += `[SCENE DESCRIPTION]\n${prompt}\n`;
  }

  // Style Preset
  if (style !== StylePreset.NONE) {
    textPrompt += `\n[ADDITIONAL STYLE GUIDANCE]\n${style}\n`;
  }

  // Negative Prompt
  if (negativePrompt) {
    textPrompt += `\n[NEGATIVE CONSTRAINTS]\nExclude: ${negativePrompt}\n`;
  }

  parts.push({ text: textPrompt });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    // Check if cancelled after request returns
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const candidate = response.candidates?.[0];

    // Check for explicit safety blocking
    if (candidate?.finishReason === 'SAFETY') {
      throw new Error("Image generation was blocked by safety settings. Please modify your prompt and try again.");
    }

    // Check for empty content
    if (!candidate?.content?.parts || candidate.content.parts.length === 0) {
      throw new Error(`Model returned no content. Finish reason: ${candidate?.finishReason || 'Unknown'}`);
    }

    // Extract image
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        const base64EncodeString = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    
    // If no inlineData, check if there's text indicating a refusal or error
    const textPart = candidate.content.parts.find(p => p.text);
    if (textPart) {
      throw new Error(`Model returned text instead of image: "${textPart.text.substring(0, 150)}..."`);
    }

    throw new Error("No image data found in response.");

  } catch (error: any) {
    // If it was an abort error, rethrow it
    if (error.name === 'AbortError' || (signal?.aborted)) {
       throw new DOMException('Aborted', 'AbortError');
    }

    console.error("Image generation failed:", error);
    
    // Enhance permission error messages
    if (error.message?.includes('403') || error.message?.includes('Permission denied')) {
      throw new Error("Permission denied. Please check if the 'gemini-2.5-flash-image' model is enabled in your Google Cloud project.");
    }
    
    throw error;
  }
};