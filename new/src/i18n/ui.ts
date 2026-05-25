import type { Locale } from '../types/i18n';
import en from './locales/en';
import pt from './locales/pt';

const translations = { en, pt } as const;

export function useTranslations(locale: Locale) {
  const ui = translations[locale] ?? translations.en;
  return function t(key: string): string {
    const parts = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let val: any = ui;
    for (const part of parts) val = val?.[part];
    return typeof val === 'string' ? val : key;
  };
}
