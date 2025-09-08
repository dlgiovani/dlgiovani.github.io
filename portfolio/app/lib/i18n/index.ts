import type { Language, Translation } from './types';
import { en } from './en';
import { pt } from './pt';
import { fr } from './fr';

export const translations: Record<Language, Translation> = {
  en,
  pt,
  fr
};

export const defaultLanguage: Language = 'en';
export const supportedLanguages: Language[] = ['en', 'pt', 'fr'];

export function getTranslation(lang: Language): Translation {
  return translations[lang] || translations[defaultLanguage];
}

export function detectLanguage(pathname: string): Language {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  if (firstSegment && supportedLanguages.includes(firstSegment as Language)) {
    return firstSegment as Language;
  }
  
  return defaultLanguage;
}

const pathTranslations: Record<Language, Record<string, string>> = {
  en: {
    '/': '/',
    '/about': '/about',
    '/work': '/work', 
    '/skills': '/skills',
    '/contact': '/contact'
  },
  pt: {
    '/': '/pt',
    '/about': '/pt/sobre',
    '/work': '/pt/trabalho',
    '/skills': '/pt/habilidades', 
    '/contact': '/pt/contato'
  },
  fr: {
    '/': '/fr',
    '/about': '/fr/à-propos',
    '/work': '/fr/travail',
    '/skills': '/fr/compétences',
    '/contact': '/fr/contact'
  }
};

export function getLocalizedPath(path: string, lang: Language): string {
  return pathTranslations[lang][path] || path;
}

export function removeLanguagePrefix(pathname: string): string {
  // Find which language and base path this pathname corresponds to
  for (const [lang, paths] of Object.entries(pathTranslations)) {
    for (const [basePath, translatedPath] of Object.entries(paths)) {
      if (pathname === translatedPath) {
        return basePath;
      }
    }
  }
  
  return pathname;
}

export type { Language, Translation };
export { type Translation as T };