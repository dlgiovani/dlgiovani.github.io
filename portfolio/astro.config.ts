import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dlgiovani.dev',
  integrations: [react(), sitemap()],
  redirects: {
    '/consulting': '/work-with-me',
    '/pt-br/consultoria': '/pt-br/trabalhe-comigo',
    // Posts used to live language-agnostically under /blog/; the Portuguese
    // ones now sit under /pt-br/blog/.
    '/blog/a-teoria-da-internet-morta-vs-o-vies-do-sobrevivente':
      '/pt-br/blog/a-teoria-da-internet-morta-vs-o-vies-do-sobrevivente',
    '/blog/como-comprar-com-seguranca-na-internet':
      '/pt-br/blog/como-comprar-com-seguranca-na-internet',
    '/blog/excelentes-portfolios-de-devs-e-designers-para-se-inspirar':
      '/pt-br/blog/excelentes-portfolios-de-devs-e-designers-para-se-inspirar',
    '/blog/portfolios-e-a-queda-de-identidade-da-lingua-portuguesa-by-dlgiovani':
      '/pt-br/blog/portfolios-e-a-queda-de-identidade-da-lingua-portuguesa-by-dlgiovani',
    '/blog/uma-simples-formula-que-desmistifica-graficos-3d':
      '/pt-br/blog/uma-simples-formula-que-desmistifica-graficos-3d',
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
