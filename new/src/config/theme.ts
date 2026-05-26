export const headlineFonts = {
  'Instrument Serif': "'Instrument Serif', Georgia, serif",
  'Newsreader': "'Newsreader', Georgia, serif",
  'IBM Plex Sans': "'IBM Plex Sans', system-ui, sans-serif",
  'IBM Plex Mono': "'IBM Plex Mono', ui-monospace, monospace",
} as const;

export type CardStyle = 'flat' | 'pokedex' | 'tcg';

export const siteTheme = {
  defaultTheme: 'light' as 'light' | 'dark',
  defaultDensity: 'cozy' as 'compact' | 'cozy' | 'spacious',
  defaultAccent: '#1f6b4e',
  defaultHeadlineFont: 'Instrument Serif' as keyof typeof headlineFonts,
  tickerSpeed: 1.2,
  apod: true,
  defaultCardStyle: 'flat' as CardStyle,
} as const;
