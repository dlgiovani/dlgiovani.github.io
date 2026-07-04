import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dlgiovani.dev',
  integrations: [react(), sitemap()],
  redirects: {
    '/consulting': '/work-with-me',
    '/pt-br/consultoria': '/pt-br/trabalhe-comigo',
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-br'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    shikiConfig: {
      themes: { light: 'nord', dark: 'nord' },
      wrap: true,
    },
  },
});
