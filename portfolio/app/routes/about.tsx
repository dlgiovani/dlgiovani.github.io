import type { Route } from "./+types/about";
import { InteractiveTerminal } from "../components/InteractiveTerminal";
import { CommandOutput } from "../components/TypingText";
import { detectLanguage, getTranslation } from "../lib/i18n";

export function meta({ location }: Route.MetaArgs) {
  const lang = detectLanguage(location.pathname);
  const t = getTranslation(lang);
  
  return [
    { title: t.about.title },
    { name: "description", content: t.about.description },
    { property: "og:title", content: t.about.title },
    { property: "og:description", content: t.about.description },
    { property: "og:locale", content: lang === 'en' ? 'en_US' : lang === 'pt' ? 'pt_BR' : 'fr_CA' },
  ];
}

export default function About() {
  return (
    <InteractiveTerminal>
      {({ t }) => (
        <div className="space-y-8">
          <CommandOutput 
            command="cd ~/about && cat personal.md"
            output={`# ${t.about.personal.title}

${t.about.personal.intro}

## ${t.about.personal.journey}

${t.about.personal.specialization}`}
            delay={0}
          />

          <CommandOutput 
            command="cat philosophy.txt"
            output={`${t.about.philosophy.title}

${t.about.philosophy.content}

${t.about.philosophy.beliefs.map(belief => `• ${belief}`).join('\n')}`}
            delay={3000}
          />

          <CommandOutput 
            command="cat current-focus.log"
            output={`${t.about.currentFocus.title}

${t.about.currentFocus.areas.map((area, i) => `[2024-2025] ${area}`).join('\n')}

Always exploring new technologies while maintaining production reliability.`}
            delay={6000}
          />

          <div className="mt-12 p-4 border border-[--color-terminal-secondary] rounded">
            <div className="text-[--color-terminal-accent]">{t.about.quickStats.title}</div>
            <div className="ml-4 text-[--color-terminal-secondary] space-y-1 mt-2">
              <div>📅 {t.about.quickStats.coding}</div>
              <div>🌍 {t.about.quickStats.location}</div>
              <div>💼 {t.about.quickStats.focus}</div>
              <div>🎯 {t.about.quickStats.goal}</div>
            </div>
          </div>
        </div>
      )}
    </InteractiveTerminal>
  );
}