import React, { useRef, useState } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface StyleSelectorProps {
  referenceImages: string[];
  onReferenceImagesChange: (images: string[]) => void;
  referenceImagePrompt: string;
  onReferenceImagePromptChange: (val: string) => void;
  lang: Language;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  referenceImages,
  onReferenceImagesChange,
  referenceImagePrompt,
  onReferenceImagePromptChange,
  lang
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const t = TRANSLATIONS[lang].style;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const remainingSlots = 5 - referenceImages.length;
      if (remainingSlots <= 0) return;

      const filesToProcess = Array.from(files).slice(0, remainingSlots);
      
      // Use Promise.all to read all files asynchronously and update state once
      // This prevents race conditions and stale state closures when uploading multiple files
      Promise.all(filesToProcess.map(file => new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            resolve(reader.result as string);
          } else {
            resolve('');
          }
        };
        // Cast file to Blob to fix TypeScript error: Argument of type 'unknown' is not assignable to parameter of type 'Blob'
        reader.readAsDataURL(file as Blob);
      }))).then(results => {
        const validResults = results.filter(r => r);
        if (validResults.length > 0) {
          onReferenceImagesChange([...referenceImages, ...validResults]);
        }
      });
    }
    // Reset input so same file can be selected again if needed
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = [...referenceImages];
    newImages.splice(index, 1);
    onReferenceImagesChange(newImages);
  };

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            {t.title}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {t.desc}
          </p>
        </div>

        {/* Image Import Grid */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.importLabel}
          </label>
          
          <div className="grid grid-cols-3 gap-3">
            {referenceImages.map((img, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-600 aspect-square bg-gray-900">
                <img 
                  src={img} 
                  alt={`${t.uploadedAlt} ${index + 1}`} 
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setZoomedImage(img)}
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {referenceImages.length < 5 && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-gray-700/50 transition-colors group"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 group-hover:text-blue-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-gray-400 text-xs text-center px-1 group-hover:text-gray-200">{t.uploadText}</span>
              </div>
            )}
          </div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            multiple
            className="hidden" 
          />
        </div>

        {/* Model Prompt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t.modelPromptLabel}
          </label>
          <input 
            type="text" 
            value={referenceImagePrompt}
            onChange={(e) => onReferenceImagePromptChange(e.target.value)}
            placeholder={t.modelPromptPlaceholder}
            className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setZoomedImage(null)}
        >
          <div className="absolute top-6 right-6 z-50">
             <button className="text-white/70 hover:text-white p-2 bg-gray-800/50 rounded-full transition-colors hover:bg-gray-700/80">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          <img 
            src={zoomedImage} 
            alt="Reference Zoom" 
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
            onClick={(e) => {
               e.stopPropagation(); 
               setZoomedImage(null); 
            }}
          />
        </div>
      )}
    </>
  );
};

export default StyleSelector;