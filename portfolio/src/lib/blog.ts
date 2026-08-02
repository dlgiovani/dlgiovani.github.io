import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../types/i18n';

export type Post = CollectionEntry<'blog'>;

// Collection ids are "<folder>/<slug>"; the folder carries the language.
const FOLDER: Record<Locale, string> = { en: 'en', 'pt-br': 'pt' };

export const postSlug = (entry: Post): string =>
  entry.id.replace(/^[^/]+\//, '').replace(/\.md$/, '');

export const postLocale = (entry: Post): Locale =>
  entry.id.startsWith(`${FOLDER['pt-br']}/`) ? 'pt-br' : 'en';

export const blogHref = (locale: Locale): string =>
  locale === 'pt-br' ? '/pt-br/blog/' : '/blog/';

export const postHref = (entry: Post): string =>
  `${blogHref(postLocale(entry))}${postSlug(entry)}/`;

/** Posts of one language, newest first. */
export async function postsFor(locale: Locale): Promise<Post[]> {
  const all = await getCollection('blog');
  return all
    .filter((e) => postLocale(e) === locale)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** The same article in the other language, paired through the shared `key`. */
export async function counterpart(entry: Post): Promise<Post | undefined> {
  const other: Locale = postLocale(entry) === 'en' ? 'pt-br' : 'en';
  return (await postsFor(other)).find((e) => e.data.key === entry.data.key);
}

/** Both language URLs for an article, falling back to the index when unpaired. */
export async function postAltHrefs(entry: Post): Promise<{ en: string; pt: string; mirrored: boolean }> {
  const other = await counterpart(entry);
  const self = postHref(entry);
  const onEn = postLocale(entry) === 'en';
  return {
    en: onEn ? self : other ? postHref(other) : blogHref('en'),
    pt: onEn ? (other ? postHref(other) : blogHref('pt-br')) : self,
    mirrored: Boolean(other),
  };
}

/** Ranked by shared tags first, then recency. Same language, excludes itself. */
export async function relatedPosts(entry: Post, limit = 3): Promise<Post[]> {
  const tags = new Set((entry.data.tags ?? []).map((t) => t.toLowerCase()));
  const pool = (await postsFor(postLocale(entry))).filter((e) => e.data.key !== entry.data.key);
  return pool
    .map((e) => ({
      entry: e,
      score: (e.data.tags ?? []).filter((t) => tags.has(t.toLowerCase())).length,
    }))
    .sort((a, b) => b.score - a.score || b.entry.data.date.valueOf() - a.entry.data.date.valueOf())
    .slice(0, limit)
    .map((x) => x.entry);
}

/** Rough reading time, with fenced code and raw HTML discounted. */
export function readingMinutes(body: string): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`\\|-]/g, ' ');
  const words = prose.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

const intlTag = (locale: Locale) => (locale === 'pt-br' ? 'pt-BR' : 'en-GB');

export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(intlTag(locale), {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Day and month only — the index prints the year separately. */
export function formatDayMonth(date: Date, locale: Locale): string {
  return date.toLocaleDateString(intlTag(locale), { month: 'short', day: 'numeric' });
}
