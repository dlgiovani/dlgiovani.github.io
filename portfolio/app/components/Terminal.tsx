import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { detectLanguage, getTranslation, getLocalizedPath, removeLanguagePrefix } from "../lib/i18n";

interface TerminalProps {
  children: React.ReactNode | (({ t }: { t: ReturnType<typeof getTranslation> }) => React.ReactNode);
}

export function Terminal({ children }: TerminalProps) {
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("~");
  
  const currentLang = detectLanguage(location.pathname);
  const basePath = removeLanguagePrefix(location.pathname);
  const t = getTranslation(currentLang);

  useEffect(() => {
    const pathMap: Record<string, string> = {
      "/": "~",
      "/about": "~/about",
      "/work": "~/work", 
      "/skills": "~/skills",
      "/contact": "~/contact",
    };
    setCurrentPath(pathMap[basePath] || "~");
  }, [basePath]);

  return (
    <div className="min-h-screen bg-[var(--color-terminal-bg)] text-[var(--color-terminal-text)] p-4 font-mono">
      {/* Terminal Header */}
      <header className="mb-6 border-b border-[var(--color-terminal-secondary)] pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1" role="presentation" aria-label="Terminal window controls">
              <div className="w-3 h-3 rounded-full bg-[var(--color-terminal-error)]" aria-label="Close"></div>
              <div className="w-3 h-3 rounded-full bg-[var(--color-terminal-accent)]" aria-label="Minimize"></div>
              <div className="w-3 h-3 rounded-full bg-[var(--color-terminal-text)]" aria-label="Maximize"></div>
            </div>
            <span className="text-[var(--color-terminal-secondary)] text-xs" role="status">
              giovani@portfolio: {currentPath}
            </span>
          </div>
          <LanguageSwitcher />
        </div>
        
        {/* Navigation */}
        <nav className="space-y-1" role="navigation" aria-label="Site navigation">
          <div className="terminal-prompt" aria-hidden="true">
            <span>ls -la</span>
          </div>
          <ul className="ml-2 space-y-1 text-[var(--color-terminal-secondary)] list-none">
            <TerminalNavItem href={getLocalizedPath("/", currentLang)} label={t.navigation.readme} current={basePath === "/"} />
            <TerminalNavItem href={getLocalizedPath("/about", currentLang)} label={t.navigation.about} current={basePath === "/about"} />
            <TerminalNavItem href={getLocalizedPath("/work", currentLang)} label={t.navigation.work} current={basePath === "/work"} />
            <TerminalNavItem href={getLocalizedPath("/skills", currentLang)} label={t.navigation.skills} current={basePath === "/skills"} />
            <TerminalNavItem href={getLocalizedPath("/contact", currentLang)} label={t.navigation.contact} current={basePath === "/contact"} />
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl">
        {typeof children === 'function' ? children({ t }) : children}
      </main>

      {/* Footer */}
      <footer className="mt-16 pt-4 border-t border-[var(--color-terminal-secondary)] text-[var(--color-terminal-secondary)] text-xs">
        <div className="terminal-prompt">
          <span>echo "© 2025 Giovani Drosda Lima"</span>
        </div>
        <div className="ml-2">© 2025 Giovani Drosda Lima</div>
      </footer>
    </div>
  );
}

interface TerminalNavItemProps {
  href: string;
  label: string;
  current: boolean;
}

function TerminalNavItem({ href, label, current }: TerminalNavItemProps) {
  return (
    <li className={`terminal-tree ${current ? "text-[var(--color-terminal-text)] font-bold" : "text-[var(--color-terminal-secondary)]"}`}>
      <Link 
        to={href}
        className="hover:text-[var(--color-terminal-text)] transition-colors no-underline focus:outline-none focus:ring-2 focus:ring-[var(--color-terminal-text)] focus:ring-opacity-50 rounded"
        aria-current={current ? "page" : undefined}
      >
        {label}
      </Link>
      {current && <span className="terminal-cursor ml-1" aria-hidden="true"></span>}
    </li>
  );
}