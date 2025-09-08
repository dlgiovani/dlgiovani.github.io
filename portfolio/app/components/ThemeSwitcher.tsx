import { useState, useEffect } from 'react';
import { themes, getTheme, applyTheme, getStoredTheme, setStoredTheme, type TerminalTheme } from '../lib/themes';

export function ThemeSwitcher() {
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const storedTheme = getStoredTheme();
    setCurrentTheme(storedTheme);
    applyTheme(getTheme(storedTheme));
  }, []);

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    setStoredTheme(themeName);
    applyTheme(getTheme(themeName));
    setIsOpen(false);
  };

  const currentThemeObj = getTheme(currentTheme);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[var(--color-terminal-secondary)] hover:text-[var(--color-terminal-text)] transition-colors text-xs focus:outline-none focus:ring-2 focus:ring-[var(--color-terminal-text)] focus:ring-opacity-50 rounded px-2 py-1"
        aria-label="Switch terminal theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
        type="button"
      >
        <span className="flex items-center gap-1">
          <span 
            className="w-3 h-3 rounded border border-[var(--color-terminal-secondary)]" 
            style={{ backgroundColor: currentThemeObj.colors.bg }}
            aria-hidden="true"
          />
          <span className="hidden sm:inline">{currentThemeObj.displayName}</span>
          <span className="sm:hidden">Theme</span>
          <span className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </span>
      </button>

      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-1 bg-[var(--color-terminal-bg)] border border-[var(--color-terminal-secondary)] rounded shadow-lg z-50 min-w-48"
          role="menu"
          aria-label="Theme selection menu"
        >
          <div className="py-1">
            {Object.values(themes).map((theme) => (
              <button
                key={theme.name}
                onClick={() => handleThemeChange(theme.name)}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-[var(--color-terminal-text)]/5 transition-colors flex items-center gap-2 ${
                  currentTheme === theme.name 
                    ? 'text-[var(--color-terminal-text)] bg-[var(--color-terminal-text)]/10' 
                    : 'text-[var(--color-terminal-secondary)]'
                }`}
                role="menuitem"
                type="button"
              >
                <span 
                  className="w-4 h-4 rounded border border-[var(--color-terminal-secondary)] flex-shrink-0" 
                  style={{ backgroundColor: theme.colors.bg }}
                  aria-hidden="true"
                />
                <span className="flex-1">{theme.displayName}</span>
                {currentTheme === theme.name && (
                  <span className="text-[var(--color-terminal-accent)]" aria-label="Current theme">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}