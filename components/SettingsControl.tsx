import React from 'react';
import { ASPECT_RATIOS } from '../constants';
import { Language } from '../types';
import { TRANSLATIONS, RATIO_LABELS } from '../translations';

interface SettingsControlProps {
  aspectRatio: string;
  setAspectRatio: (val: string) => void;
  lang: Language;
}

const SettingsControl: React.FC<SettingsControlProps> = ({ aspectRatio, setAspectRatio, lang }) => {
  const t = TRANSLATIONS[lang].settings;
  
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-4">{t.title}</h3>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{t.aspectRatio}</label>
        <div className="flex flex-wrap gap-2">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio.value}
              onClick={() => setAspectRatio(ratio.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                aspectRatio === ratio.value
                  ? 'bg-purple-600 text-white shadow'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              {RATIO_LABELS[ratio.label]?.[lang] || ratio.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsControl;
