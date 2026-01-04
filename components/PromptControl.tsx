import React, { useState } from 'react';
import { generateNegativePrompt } from '../services/geminiService';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface PromptControlProps {
  prompt: string;
  setPrompt: (val: string) => void;
  negativePrompt: string;
  setNegativePrompt: (val: string) => void;
  onGenerate: () => void;
  onStop: () => void;
  isGenerating: boolean;
  lang: Language;
}

const PromptControl: React.FC<PromptControlProps> = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  onGenerate,
  onStop,
  isGenerating,
  lang
}) => {
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const t = TRANSLATIONS[lang].prompt;

  const handleManualAutoGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsAutoGenerating(true);
    try {
      const suggested = await generateNegativePrompt(prompt);
      setNegativePrompt(suggested);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAutoGenerating(false);
    }
  };

  const clearPrompt = () => {
    setPrompt('');
    setNegativePrompt(''); // Also clear negative prompt when positive is cleared
  };

  const clearNegativePrompt = () => {
    setNegativePrompt('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{t.title}</h3>
        <p className="text-gray-400 text-sm mb-4">
          {t.desc}
        </p>
      </div>

      {/* Positive Prompt */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-green-400">
            {t.positiveLabel}
          </label>
          {prompt && (
            <button
              onClick={clearPrompt}
              className="text-xs flex items-center gap-1 px-2 py-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {t.clear}
            </button>
          )}
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t.positivePlaceholder}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none h-28"
        />
      </div>

      {/* Negative Prompt */}
      <div className="relative">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-red-400">
            {t.negativeLabel}
          </label>
          
          <div className="flex items-center gap-2">
            {/* Auto Generate Button */}
            <button
              onClick={handleManualAutoGenerate}
              disabled={isAutoGenerating || !prompt}
              className={`text-xs flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
                 isAutoGenerating || !prompt
                 ? 'text-gray-500 border-gray-700 cursor-not-allowed'
                 : 'text-blue-400 border-blue-500/30 hover:bg-blue-500/10'
              }`}
            >
              {isAutoGenerating ? (
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              {t.autoGenerate}
            </button>

            {negativePrompt && (
              <button
                onClick={clearNegativePrompt}
                className="text-xs flex items-center gap-1 px-2 py-1 rounded text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t.clear}
              </button>
            )}
          </div>
        </div>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder={t.negativePlaceholder}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none h-20"
        />
      </div>

      {/* Generate / Stop Button */}
      {isGenerating ? (
        <button
          onClick={onStop}
          className="w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 bg-red-600 hover:bg-red-700 text-white shadow-red-500/25 animate-pulse"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          {t.stop}
        </button>
      ) : (
        <button
          onClick={onGenerate}
          disabled={!prompt}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
            !prompt
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-blue-500/25'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t.generate}
        </button>
      )}
    </div>
  );
};

export default PromptControl;