import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { detectLanguage, getLocalizedPath, removeLanguagePrefix, supportedLanguages } from "./lib/i18n";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  // Get current path for hreflang generation
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const basePath = removeLanguagePrefix(currentPath);
  const currentLang = detectLanguage(currentPath);

  const langMap: Record<string, string> = {
    'en': 'en-US',
    'pt': 'pt-BR',
    'fr': 'fr-CA'
  };

  return (
    <html lang={langMap[currentLang] || 'en-US'}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="description" content="Giovani Drosda Lima - Full Stack Developer specializing in web applications, integrations, and business solutions" />
        <meta name="author" content="Giovani Drosda Lima" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Giovani Drosda Lima - Developer Portfolio" />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={`https://dlgiovani.github.io${getLocalizedPath(basePath, currentLang)}`} />

        {/* Hreflang attributes for multilingual SEO */}
        {supportedLanguages.map((lang) => (
          <link
            key={lang}
            rel="alternate"
            hrefLang={langMap[lang]}
            href={`https://dlgiovani.github.io${getLocalizedPath(basePath, lang)}`}
          />
        ))}
        <link
          rel="alternate"
          hrefLang="x-default"
          href={`https://dlgiovani.github.io${getLocalizedPath(basePath, 'en')}`}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Giovani Drosda Lima",
              jobTitle: "Full Stack Developer",
              url: "https://dlgiovani.dev",
              sameAs: [
                "https://dlgiovani.github.io",
                "https://github.com/dlgiovani",
                "https://linkedin.com/in/giovani-drosda-lima"
              ],
              knowsAbout: ["React", "TypeScript", "Python", "FastAPI", "Node.js", "Full Stack Development"],
              address: { "@type": "PostalAddress", addressCountry: "BR" }
            })
          }}
        />
        <Meta />
        <Links />
      </head>
      <body className="bg-[var(--color-terminal-bg)] text-[var(--color-terminal-text)]">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
