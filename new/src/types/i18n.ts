import type en from '../i18n/locales/en';

export type Locale = 'en' | 'pt';

// DeepString: same structure as `en` but all leaf values widened to string.
// This enforces the same keys without constraining translations to the English strings.
type DeepString<T> = {
  [K in keyof T]: T[K] extends object ? DeepString<T[K]> : string;
};

export type UI = DeepString<typeof en>;
