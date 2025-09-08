import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { 
  detectLanguage, 
  getLocalizedPath, 
  removeLanguagePrefix, 
  supportedLanguages,
  getTranslation,
  type Language 
} from "../lib/i18n";

export function LanguageSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLang = detectLanguage(location.pathname);
  const currentPath = removeLanguagePrefix(location.pathname);
  const t = getTranslation(currentLang);

  const handleLanguageChange = (lang: Language) => {
    const newPath = getLocalizedPath(currentPath, lang);
    navigate(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1 border border-[var(--color-terminal-secondary)] rounded hover:border-[var(--color-terminal-text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-terminal-text)] focus:ring-opacity-50"
        aria-label="Change language"
        aria-expanded={isOpen}
      >
        <span className="text-[var(--color-terminal-accent)]">🌐</span>
        <span className="text-xs font-mono">
          {t.common.languages[currentLang]}
        </span>
        <span 
          className={`text-[var(--color-terminal-secondary)] transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          ▼
        </span>
      </button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full right-0 mt-1 z-20 bg-[var(--color-terminal-bg)] border border-[var(--color-terminal-secondary)] rounded shadow-lg min-w-[140px]">
            {supportedLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`w-full px-3 py-2 text-left text-xs font-mono hover:bg-[var(--color-terminal-text)]/10 transition-colors first:rounded-t last:rounded-b ${
                  currentLang === lang 
                    ? 'text-[var(--color-terminal-text)] bg-[var(--color-terminal-text)]/5' 
                    : 'text-[var(--color-terminal-secondary)]'
                }`}
                disabled={currentLang === lang}
              >
                <div className="flex items-center gap-2">
                  <span>
                    {lang === 'en' && '🇺🇸'}
                    {lang === 'pt' && '🇧🇷'}  
                    {lang === 'fr' && '🇨🇦'}
                  </span>
                  <span>{t.common.languages[lang]}</span>
                  {currentLang === lang && (
                    <span className="ml-auto text-[var(--color-terminal-accent)]">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}