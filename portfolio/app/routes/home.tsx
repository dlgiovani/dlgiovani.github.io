import { InteractiveTerminal } from "../components/InteractiveTerminal";
import { CommandOutput } from "../components/TypingText";
import { detectLanguage, getTranslation } from "../lib/i18n";
import type { Route } from "./+types/home";

export function meta({ location }: Route.MetaArgs) {
  const lang = detectLanguage(location.pathname);
  const t = getTranslation(lang);
  
  return [
    { title: t.home.title },
    { name: "description", content: t.home.description },
    { property: "og:title", content: t.home.title },
    { property: "og:description", content: t.home.description },
    { property: "og:url", content: "https://dlgiovani.github.io" },
    { property: "og:locale", content: lang === 'en' ? 'en_US' : lang === 'pt' ? 'pt_BR' : 'fr_CA' },
  ];
}

export default function Home() {
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - 2017;

  return (
    <InteractiveTerminal>
      {({ t }) => (
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <CommandOutput
              command="whoami"
              output={t.home.whoami}
              delay={0}
            />

            <CommandOutput
              command="cat README.md"
              output={`# ${t.home.readme.title}

## ${t.home.readme.subtitle}

> ${yearsOfExperience} ${t.home.readme.experience}
> ${t.home.readme.specialization}
> ${t.home.readme.location}`}
              delay={2000}
            />
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <CommandOutput
              command="git log --oneline --since='2017' --author='Giovani' | wc -l"
              output={`${Math.floor(yearsOfExperience * 365 * 0.7)} ${t.home.stats.commits}`}
              delay={5000}
            />

            <CommandOutput
              command="ps aux | grep 'currently_working_on'"
              output={t.home.stats.processes}
              delay={7000}
            />
          </div>

          {/* Navigation Hint */}
          <div className="mt-12 p-4 border border-[var(--color-terminal-secondary)] rounded">
            <div className="terminal-prompt mb-2">
              <span>{t.home.navigation.hint}</span>
          </div>
            <div className="ml-2 text-[var(--color-terminal-secondary)] space-y-1">
              <div>{t.home.navigation.title}</div>
              <div className="ml-4 space-y-1">
                <div>• <span className="text-[var(--color-terminal-text)]">{t.navigation.about}</span> - {t.home.navigation.about}</div>
                <div>• <span className="text-[var(--color-terminal-text)]">{t.navigation.work}</span> - {t.home.navigation.work}</div>
                <div>• <span className="text-[var(--color-terminal-text)]">{t.navigation.skills}</span> - {t.home.navigation.skills}</div>
                <div>• <span className="text-[var(--color-terminal-text)]">{t.navigation.contact}</span> - {t.home.navigation.contact}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </InteractiveTerminal>
  );
}
