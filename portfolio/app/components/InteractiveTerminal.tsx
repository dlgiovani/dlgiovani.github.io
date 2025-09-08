import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { detectLanguage, getLocalizedPath, getTranslation, removeLanguagePrefix } from "../lib/i18n";
import { applyTheme, getTheme, setStoredTheme, themes } from "../lib/themes";
import { fetchWeatherData } from "../lib/weather";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";

interface CommandOutput {
  command: string;
  output: string;
  timestamp: Date;
}

interface InteractiveTerminalProps {
  children: React.ReactNode | (({ t }: { t: ReturnType<typeof getTranslation> }) => React.ReactNode);
}


export function InteractiveTerminal({ children }: InteractiveTerminalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState("~");
  const [commandHistory, setCommandHistory] = useState<CommandOutput[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDesktop, setIsDesktop] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLang = detectLanguage(location.pathname);
  const basePath = removeLanguagePrefix(location.pathname);
  const t = getTranslation(currentLang);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

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

  useEffect(() => {
    if (isDesktop && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDesktop]);

  const executeCommand = async (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const parts = trimmedCmd.split(' ');
    const command = parts[0];
    const args = parts.slice(1);

    let output = "";

    switch (command) {
      case "help":
        output = `${t.terminal.outputs.availableCommands}:\n${Object.entries(t.terminal.commands)
          .map(([cmd, desc]) => `  ${cmd.padEnd(10)} - ${desc}`)
          .join('\n')}`;
        break;

      case "about":
        navigate(getLocalizedPath("/about", currentLang));
        output = t.terminal.outputs.navigatingTo.replace("{0}", "about");
        break;

      case "work":
        navigate(getLocalizedPath("/work", currentLang));
        output = t.terminal.outputs.navigatingTo.replace("{0}", "work");
        break;

      case "skills":
        navigate(getLocalizedPath("/skills", currentLang));
        output = t.terminal.outputs.navigatingTo.replace("{0}", "skills");
        break;

      case "contact":
        navigate(getLocalizedPath("/contact", currentLang));
        output = t.terminal.outputs.navigatingTo.replace("{0}", "contact");
        break;

      case "weather":
        if (args.length === 0) {
          output = t.terminal.outputs.weatherUsage;
        } else {
          const city = args.join(' ');
          
          // Show loading state immediately
          const loadingEntry: CommandOutput = {
            command: cmd,
            output: t.terminal.outputs.fetchingWeather.replace("{0}", city),
            timestamp: new Date()
          };
          setCommandHistory(prev => [...prev, loadingEntry]);
          
          // Fetch weather data asynchronously
          fetchWeatherData(city)
            .then(weather => {
              // Update the loading entry with the result
              setCommandHistory(prev => 
                prev.map(entry => 
                  entry === loadingEntry 
                    ? { ...entry, output: weather }
                    : entry
                )
              );
            })
            .catch(error => {
              // Update the loading entry with error
              setCommandHistory(prev => 
                prev.map(entry => 
                  entry === loadingEntry 
                    ? { ...entry, output: t.terminal.outputs.weatherError.replace("{0}", city) }
                    : entry
                )
              );
            });
          
          // Return early to avoid adding another entry
          return;
        }
        break;

      case "time":
        const now = new Date();
        output = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}
UTC: ${now.toISOString()}`;
        break;

      case "giofetch":
        const yearExp = new Date().getFullYear() - 2017;
        output = `   ██████╗                          
  ██╔════╝                          ${t.terminal.giofetch.header}
  ██║  ███╗                         ${t.terminal.giofetch.separator}
  ██║   ██║                         ${t.terminal.giofetch.fields.os}
  ╚██████╔╝                         ${t.terminal.giofetch.fields.host}
   ╚═════╝                          ${t.terminal.giofetch.fields.kernel}
⠀⠀⠀⠀⠀⠀⠀⠀⣤⡀⠀⠀⠀⠀⠀⠀⠀⠀              ${t.terminal.giofetch.fields.uptime.replace('{0}', yearExp.toString())}
⠀⣀⡀⣀⠤⠒⠊⠉⠀⠙⠒⢤⣴⣲⡀⠀⠀⠀              ${t.terminal.giofetch.fields.packages}
⠀⣇⠉⢀⣀⠀⠀⠀⠀⠀⠤⠸⠀⠃⠇⠀⠀⠀              ${t.terminal.giofetch.fields.shell}
⠀⡜⠰⢻⠣⡇⠗⠈⣋⣁⠤⣴⣒⣶⠤⡄⠀⠀              ${t.terminal.giofetch.fields.resolution}
⢼⡠⠤⠴⣾⠿⢟⠛⡏⠉⢯⠀⢳⣀⣦⣸⣦⡀              ${t.terminal.giofetch.fields.terminal}
⠀⠀⠀⠘⣌⢦⢬⣷⣺⠶⠾⠟⠛⢛⣉⣉⡤⠇              ${t.terminal.giofetch.fields.cpu}
⠀⠀⠀⠀⠈⠾⠭⠤⠤⠤⠐⠒⠉⠁⠀⠀⠀⠀              ${t.terminal.giofetch.fields.memory}
                                     ${t.terminal.giofetch.fields.disk}
                                     ${t.terminal.giofetch.fields.location}
                                     ${t.terminal.giofetch.fields.languages}`;
        break;

      case "pwd":
        output = currentPath === "~" ? "/home/giovani" : `/home/giovani${currentPath.slice(1)}`;
        break;

      case "whoami":
        output = "giovani";
        break;

      case "echo":
        output = args.length > 0 ? args.join(' ') : "";
        break;

      case "date":
        const dateNow = new Date();
        const localeMap = { en: 'en-US', pt: 'pt-BR', fr: 'fr-FR' };
        output = dateNow.toLocaleDateString(localeMap[currentLang], {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        break;

      case "fortune":
        const quotes = t.terminal.fortune.quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        output = randomQuote;
        break;

      case "theme":
        if (args.length === 0) {
          const themeList = Object.values(themes).map(theme => `  ${theme.name.padEnd(12)} - ${theme.displayName}`).join('\n');
          output = `${t.terminal.themes.availableThemes}\n${themeList}\n\n${t.terminal.themes.usage}`;
        } else {
          const themeName = args[0];
          if (themes[themeName]) {
            applyTheme(getTheme(themeName));
            setStoredTheme(themeName);
            output = t.terminal.themes.themeChanged.replace('{0}', themes[themeName].displayName);
          } else {
            output = t.terminal.themes.themeNotFound.replace('{0}', themeName);
          }
        }
        break;

      case "clear":
        setCommandHistory([]);
        return;

      case "":
        return;

      default:
        output = t.terminal.outputs.commandNotFound.replace("{0}", command);
    }

    const newEntry: CommandOutput = {
      command: cmd,
      output,
      timestamp: new Date()
    };

    setCommandHistory(prev => [...prev, newEntry]);
  };


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentCommand);
      setCurrentCommand("");
      setHistoryIndex(-1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const commands = commandHistory.map(h => h.command);
      if (commands.length > 0) {
        const newIndex = historyIndex === -1 ? commands.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commands[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const commands = commandHistory.map(h => h.command);
      if (historyIndex !== -1) {
        const newIndex = historyIndex < commands.length - 1 ? historyIndex + 1 : -1;
        setHistoryIndex(newIndex);
        setCurrentCommand(newIndex === -1 ? "" : commands[newIndex]);
      }
    }
  };

  return (
    <div
      className="min-h-screen text-[var(--color-terminal-text)] p-4 font-mono terminal-background"
      role="main"
      aria-label="Interactive terminal portfolio"
    >
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
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />
          </div>
        </div>

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

      {isDesktop && (
        <section
          className="mb-6 space-y-2"
          aria-label="Terminal command interface"
        >
          <div
            className="command-history"
            role="log"
            aria-label="Command history"
            aria-live="polite"
          >
            {commandHistory.map((entry, index) => (
              <div key={index} className="mb-2">
                <div className="terminal-prompt" aria-label={`Command: ${entry.command}`}>
                  <span>{entry.command}</span>
                </div>
                <div
                  className="ml-2 text-[var(--color-terminal-secondary)] whitespace-pre font-mono"
                  role="status"
                  aria-label="Command output"
                >
                  {entry.output}
                </div>
              </div>
            ))}
          </div>

          <div className="terminal-prompt">
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              className="terminal-command-input"
              placeholder={t.terminal.outputs.typeHelp}
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal command input"
              aria-describedby="command-help"
              role="textbox"
            />
          </div>
        </section>
      )}

      <main className="max-w-4xl" role="main" aria-label="Portfolio content">
        {typeof children === 'function' ? children({ t }) : children}
      </main>

      <footer
        className="mt-16 pt-4 border-t border-[var(--color-terminal-secondary)] text-[var(--color-terminal-secondary)] text-xs"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="terminal-prompt" aria-hidden="true">
          <span>echo "© 2025 Giovani Drosda Lima"</span>
        </div>
        <div className="ml-2">© 2025 Giovani Drosda Lima</div>
        {isDesktop && (
          <div
            className="ml-2 mt-2 text-[var(--color-terminal-secondary)] opacity-60"
            id="command-help"
            aria-label="Terminal usage tip"
          >
            {t.terminal.outputs.tryCommands}
          </div>
        )}
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
      <a
        href={href}
        className={`terminal-link hover:text-[var(--color-terminal-text)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-terminal-text)] focus:ring-opacity-50 rounded ${current ? "text-[var(--color-terminal-text)]" : ""}`}
        aria-current={current ? "page" : undefined}
      >
        {label}
      </a>
      {current && <span className="terminal-cursor ml-1" aria-hidden="true"></span>}
    </li>
  );
}