import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { detectLanguage, getLocalizedPath, getTranslation, removeLanguagePrefix } from "../lib/i18n";
import { fetchWeatherData } from "../lib/weather";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { themes, getTheme, applyTheme, setStoredTheme } from "../lib/themes";

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
          try {
            output = t.terminal.outputs.fetchingWeather.replace("{0}", city);
            const weather = await fetchWeatherData(city);
            output = weather;
          } catch (error) {
            output = t.terminal.outputs.weatherError.replace("{0}", city);
          }
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
        output = `                    ..                    
                 .PPPPP.                  giovani@portfolio
               .PP.   .PP.                ─────────────────
              .P'       'P.               OS: Web Platform
             .P'         'P.              Host: dlgiovani.github.io  
            .P'           'P.             Kernel: React Router v7
           .P'             'P.            Uptime: ${yearExp} years
          .P'               'P.           Packages: TypeScript, Tailwind
         .P'                 'P.          Shell: Interactive Terminal
        .PPPPPPPPPPPPPPPPPPPPP.           Resolution: Responsive
       .P'                   'P.          Terminal: JetBrains Mono
      .P'                     'P.         CPU: Full Stack Developer
     .P'                       'P.        Memory: 8+ years experience
    .P'                         'P.       Disk: React, Node.js, APIs
   .PPPPPPPPPPPPPPPPPPPPPPPPPPPPP.        Location: Brazil 🇧🇷
                                          Languages: EN, PT, FR`;
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
        output = dateNow.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        break;

      case "fortune":
        const quotes = [
          "The best error message is the one that never shows up. - Thomas Fuchs",
          "Code is like humor. When you have to explain it, it's bad. - Cory House",
          "First, solve the problem. Then, write the code. - John Johnson",
          "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
          "In order to be irreplaceable, one must always be different. - Coco Chanel",
          "Java is to JavaScript what car is to Carpet. - Chris Heilmann",
          "Knowledge is power. - France is bacon",
          "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. - Dan Salomon",
          "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away. - Antoine de Saint-Exupery",
          "Code never lies, comments sometimes do. - Ron Jeffries",
          "Simplicity is the ultimate sophistication. - Leonardo da Vinci",
          "Make it work, make it right, make it fast. - Kent Beck",
          "The computer was born to solve problems that did not exist before. - Bill Gates"
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        output = randomQuote;
        break;

      case "theme":
        if (args.length === 0) {
          const themeList = Object.values(themes).map(t => `  ${t.name.padEnd(12)} - ${t.displayName}`).join('\n');
          output = `Available themes:\n${themeList}\n\nUsage: theme [theme-name]\nExample: theme catppuccin`;
        } else {
          const themeName = args[0];
          if (themes[themeName]) {
            applyTheme(getTheme(themeName));
            setStoredTheme(themeName);
            output = `Theme changed to: ${themes[themeName].displayName}`;
          } else {
            output = `Theme '${themeName}' not found. Type 'theme' to see available themes.`;
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
      className="min-h-screen bg-[--color-terminal-bg] text-[--color-terminal-text] p-4 font-mono"
      role="main"
      aria-label="Interactive terminal portfolio"
    >
      <header className="mb-6 border-b border-[--color-terminal-secondary] pb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="flex gap-1" role="presentation" aria-label="Terminal window controls">
              <div className="w-3 h-3 rounded-full bg-[--color-terminal-error]" aria-label="Close"></div>
              <div className="w-3 h-3 rounded-full bg-[--color-terminal-accent]" aria-label="Minimize"></div>
              <div className="w-3 h-3 rounded-full bg-[--color-terminal-text]" aria-label="Maximize"></div>
            </div>
            <span className="text-[--color-terminal-secondary] text-xs" role="status">
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
          <ul className="ml-2 space-y-1 text-[--color-terminal-secondary] list-none">
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
                  className="ml-2 text-[--color-terminal-secondary] whitespace-pre-line"
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
        className="mt-16 pt-4 border-t border-[--color-terminal-secondary] text-[--color-terminal-secondary] text-xs"
        role="contentinfo"
        aria-label="Site footer"
      >
        <div className="terminal-prompt" aria-hidden="true">
          <span>echo "© 2025 Giovani Drosda Lima"</span>
        </div>
        <div className="ml-2">© 2025 Giovani Drosda Lima</div>
        {isDesktop && (
          <div 
            className="ml-2 mt-2 text-[--color-terminal-secondary] opacity-60"
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
    <li className={`terminal-tree ${current ? "text-[--color-terminal-text] font-bold" : "text-[--color-terminal-secondary]"}`}>
      <a
        href={href}
        className={`terminal-link hover:text-[--color-terminal-text] transition-colors focus:outline-none focus:ring-2 focus:ring-[--color-terminal-text] focus:ring-opacity-50 rounded ${current ? "text-[--color-terminal-text]" : ""}`}
        aria-current={current ? "page" : undefined}
      >
        {label}
      </a>
      {current && <span className="terminal-cursor ml-1" aria-hidden="true"></span>}
    </li>
  );
}