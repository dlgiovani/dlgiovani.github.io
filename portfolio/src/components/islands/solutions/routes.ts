import type { Locale } from '../../../types/i18n';
import type { Category } from './types';

// Per-locale URL slugs for the "work with me" section. The parent chooser lives
// at BASE[locale]; each card is BASE[locale]/SLUGS[locale][category].
const BASE: Record<Locale, string> = {
  en: '/work-with-me',
  'pt-br': '/pt-br/trabalhe-comigo',
};

const SLUGS: Record<Locale, Record<Category, string>> = {
  en: { consulting: 'consulting', integration: 'integration', automation: 'automation', else: 'something-else' },
  'pt-br': { consulting: 'consultoria', integration: 'integracao', automation: 'automacao', else: 'outra-coisa' },
};

export const parentHref = (locale: Locale): string => BASE[locale];

export const categoryHref = (locale: Locale, cat: Category): string => `${BASE[locale]}/${SLUGS[locale][cat]}`;

// Feeds getStaticPaths in the [category] pages.
export const slugParams = (locale: Locale): { slug: string; category: Category }[] =>
  (Object.entries(SLUGS[locale]) as [Category, string][]).map(([category, slug]) => ({ slug, category }));

export const categoryHrefs = (locale: Locale): Record<Category, string> =>
  Object.fromEntries(
    slugParams(locale).map(({ category }) => [category, categoryHref(locale, category)])
  ) as Record<Category, string>;
