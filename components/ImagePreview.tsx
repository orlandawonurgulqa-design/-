import React, { useState } from 'react';
import { GeneratedImage, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface ImagePreviewProps {
  currentImage: GeneratedImage | null;
  history: GeneratedImage[];
  onSelectHistory: (img: GeneratedImage) => void;
  onClearHistory: () => void;
  onDeleteImage: (id: string) => void;
  lang: Language;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ currentImage, history, onSelectHistory, onClearHistory, onDeleteImage, lang }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const t = TRANSLATIONS[lang].preview;

  if (!currentImage && history.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-full flex flex-col justify-center items-center text-center min-h-[500px]">
        <div className="bg-gray-700/50 p-6 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{t.readyTitle}</h3>
        <p className="text-gray-400 max-w-sm">
          {t.readyDesc}
        </p>
      </div>
    );
  }

  const displayImage = currentImage || history[0];

  return (
    <>
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col h-full">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-white">{t.title}</h3>
          {displayImage && (
            <a
              href={displayImage.url}
              download={`gemini-creation-${displayImage.id}.png`}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t.download}
            </a>
          )}
        </div>

        {/* Main Preview Area */}
        <div className="flex-1 bg-gray-900 rounded-lg flex items-center justify-center p-2 overflow-hidden mb-6 border border-gray-700 relative group">
          {displayImage ? (
            <div 
              className="relative w-full h-full flex items-center justify-center cursor-zoom-in"
              onClick={() => setIsZoomed(true)}
            >
              <img
                src={displayImage.url}
                alt={displayImage.prompt}
                className="max-h-[600px] w-auto max-w-full rounded shadow-2xl object-contain"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <span className="bg-black/60 text-white px-3 py-1.5 rounded-full text-sm backdrop-blur-sm flex items-center gap-2 shadow-lg">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                   {lang === 'en' ? 'Click to Zoom' : '点击放大'}
                 </span>
              </div>
            </div>
          ) : (
             <div className="text-gray-500">{t.noImage}</div>
          )}
        </div>

        {/* History Strip */}
        {history.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-400">{t.recent}</h4>
              <button
                onClick={onClearHistory}
                className="text-xs flex items-center gap-1 text-gray-500 hover:text-red-400 transition-colors"
                title={t.clearHistory}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                {t.clearHistory}
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {history.map((img) => (
                <div key={img.id} className="relative flex-shrink-0 w-20 h-20 group">
                  <button
                    onClick={() => onSelectHistory(img)}
                    className={`w-full h-full rounded-lg overflow-hidden border-2 transition-all ${
                      displayImage?.id === img.id ? 'border-blue-500 opacity-100 ring-2 ring-blue-500/50' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img.url}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteImage(img.id);
                    }}
                    className="absolute top-0 right-0 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-bl-lg rounded-tr-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    title={lang === 'en' ? 'Delete' : '删除'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && displayImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md animate-fade-in"
          onClick={() => setIsZoomed(false)}
        >
          <div className="absolute top-6 right-6 z-50">
             <button className="text-white/70 hover:text-white p-2 bg-gray-800/50 rounded-full transition-colors hover:bg-gray-700/80">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          <img 
            src={displayImage.url} 
            alt={displayImage.prompt} 
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg shadow-2xl cursor-zoom-out"
            onClick={(e) => {
               // Allow clicking image to close as well for better UX on mobile
               e.stopPropagation(); 
               setIsZoomed(false); 
            }}
          />
        </div>
      )}
    </>
  );
};

export default ImagePreview;