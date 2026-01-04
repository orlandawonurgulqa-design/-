import React, { useState, useRef } from 'react';
import { StylePreset, GeneratedImage, Language } from './types';
import { generateImage } from './services/geminiService';
import StyleSelector from './components/StyleSelector';
import PromptControl from './components/PromptControl';
import ImagePreview from './components/ImagePreview';
import SettingsControl from './components/SettingsControl';
import { TRANSLATIONS } from './translations';

const App: React.FC = () => {
  // State
  const [lang, setLang] = useState<Language>('zh'); // Default to Chinese
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  // Style selector removed from UI, defaulting to NONE for generation
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  const [referenceImagePrompt, setReferenceImagePrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<string>('9:16');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const t = TRANSLATIONS[lang].app;

  const toggleLanguage = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  const handleGenerate = async () => {
    if (!prompt) return;

    // Abort any previous request if it exists (sanity check)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsGenerating(true);
    try {
      const imageUrl = await generateImage(
        prompt,
        negativePrompt,
        StylePreset.NONE, // No style selected via UI
        referenceImages, // Pass array of images
        referenceImagePrompt,
        aspectRatio,
        abortController.signal
      );

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
      };

      setHistory((prev) => [newImage, ...prev]);
      setCurrentImage(newImage);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generation cancelled by user');
      } else {
        // Show the specific error message to help the user understand why it failed (e.g., Safety)
        const msg = error.message || "Failed to generate image.";
        alert(`Error: ${msg}`);
        console.error(error);
      }
    } finally {
      // Only set isGenerating to false if this was the controller that initiated it
      // (though in this simple single-threaded UI logic, it mostly matches)
      if (abortControllerRef.current === abortController) {
         setIsGenerating(false);
         abortControllerRef.current = null;
      }
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsGenerating(false);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    setCurrentImage(null);
  };

  const handleDeleteImage = (id: string) => {
    setHistory((prev) => prev.filter(img => img.id !== id));
    // If the currently displayed image is deleted, switch to the first one in the new list (or null)
    if (currentImage?.id === id) {
      setCurrentImage(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{t.title}</h1>
          </div>
          <div className="flex items-center gap-4">
             <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-700 transition-colors"
            >
              {lang === 'en' ? '中文' : 'English'}
            </button>
            <div className="text-sm text-gray-500 hidden sm:block">
              {t.subtitle}
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Controls */}
          <div className="lg:col-span-5 space-y-6">
            <StyleSelector 
              referenceImages={referenceImages}
              onReferenceImagesChange={setReferenceImages}
              referenceImagePrompt={referenceImagePrompt}
              onReferenceImagePromptChange={setReferenceImagePrompt}
              lang={lang}
            />
            
            <SettingsControl 
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              lang={lang}
            />

            <PromptControl 
              prompt={prompt}
              setPrompt={setPrompt}
              negativePrompt={negativePrompt}
              setNegativePrompt={setNegativePrompt}
              onGenerate={handleGenerate}
              onStop={handleStop}
              isGenerating={isGenerating}
              lang={lang}
            />
          </div>

          {/* Right Column: Preview */}
          <div className="lg:col-span-7 h-[calc(100vh-12rem)] min-h-[600px] sticky top-6">
            <ImagePreview 
              currentImage={currentImage} 
              history={history}
              onSelectHistory={setCurrentImage}
              onClearHistory={handleClearHistory}
              onDeleteImage={handleDeleteImage}
              lang={lang}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;