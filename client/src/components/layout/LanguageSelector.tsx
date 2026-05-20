// Dropdown for switching the app's display language. Supports English, Spanish, Somali, and Hmong.
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n/config';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'so', name: 'Somali', nativeName: 'Soomaali' },
  { code: 'hmn', name: 'Hmong', nativeName: 'Hmoob' }
];

const LanguageSelector: React.FC = () => {
  const { t } = useTranslation(); // Only use for re-rendering
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLanguageChange = async (langCode: string) => {
    try {
      if (i18n && typeof i18n.changeLanguage === 'function') {
        await i18n.changeLanguage(langCode);
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const currentLanguage = LANGUAGES.find(lang => lang.code === i18n.language) || LANGUAGES[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-brand-red/10 transition group"
        title="Change language"
      >
        <svg
          className="w-5 h-5 text-gray-700 group-hover:text-brand-red"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        <span className="text-sm font-medium text-gray-700 group-hover:text-brand-red hidden sm:inline">
          {currentLanguage.nativeName}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-2">
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              className={`w-full text-left px-4 py-2.5 hover:bg-brand-red/10 transition flex items-center justify-between ${
                i18n.language === language.code ? 'bg-brand-red/10' : ''
              }`}
            >
              <div>
                <div className="font-medium text-gray-900">{language.nativeName}</div>
                <div className="text-xs text-gray-500">{language.name}</div>
              </div>
              {i18n.language === language.code && (
                <svg
                  className="w-5 h-5 text-brand-red"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
