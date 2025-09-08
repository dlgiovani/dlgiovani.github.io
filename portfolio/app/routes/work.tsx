import { InteractiveTerminal } from "../components/InteractiveTerminal";
import { CommandOutput } from "../components/TypingText";
import { detectLanguage, removeLanguagePrefix, getTranslation } from "../lib/i18n";
import { useLocation } from "react-router";
import type { Route } from "./+types/work";

export function meta({ location }: Route.MetaArgs) {
  const currentLang = detectLanguage(location.pathname);
  const t = getTranslation(currentLang);
  
  return [
    { title: t.work.title },
    { name: "description", content: t.work.description },
    { property: "og:title", content: t.work.title },
    { property: "og:description", content: t.work.description },
  ];
}

export default function Work() {
  return (
    <InteractiveTerminal>
      {({ t }) => (
        <div className="space-y-8">
        <CommandOutput
          command="ls -la ~/work/"
          output={`total 42
drwxr-xr-x  5 giovani staff   160 Jan  1 12:00 .
drwxr-xr-x  8 giovani staff   256 Jan  1 12:00 ..
-rw-r--r--  1 giovani staff  2048 Jan  1 12:00 experience.md
drwxr-xr-x  4 giovani staff   128 Jan  1 12:00 projects/
drwxr-xr-x  3 giovani staff    96 Jan  1 12:00 integrations/`}
          delay={0}
        />

        <CommandOutput
          command="cat experience.md"
          output={`# ${t.work.experience.title}

## ${t.work.experience.role}
${t.work.experience.bullets.map(bullet => `• ${bullet}`).join('\n')}

## ${t.work.experience.achievements.title}
${t.work.experience.achievements.items.map(item => `• ${item}`).join('\n')}`}
          delay={2000}
        />

        <CommandOutput
          command="ls projects/"
          output={`real-estate-platform/
business-dashboard/
inventory-management/
payment-integrations/
analytics-suite/`}
          delay={5000}
        />

        <CommandOutput
          command="head -n 20 projects/real-estate-platform/README.md"
          output={`# ${t.work.projects.realEstate.title}
${t.work.projects.realEstate.stack}

${t.work.projects.realEstate.description}
${t.work.projects.realEstate.features.map(feature => `• ${feature}`).join('\n')}

${t.work.projects.realEstate.impact}`}
          delay={7000}
        />

        <CommandOutput
          command="cat integrations/overview.txt"
          output={`${t.work.integrations.title}

${t.work.integrations.items.map(item => `• ${item}`).join('\n')}`}
          delay={10000}
        />

        <div className="mt-12 p-4 border border-[--color-terminal-secondary] rounded">
          <div className="text-[--color-terminal-accent]">{t.work.technologies.title}</div>
          <div className="ml-4 text-[--color-terminal-secondary] grid grid-cols-2 gap-4 mt-2">
            <div>
              <div className="text-[--color-terminal-text]">Frontend:</div>
              <div className="whitespace-pre-line">{t.work.technologies.frontend}</div>
            </div>
            <div>
              <div className="text-[--color-terminal-text]">Backend:</div>
              <div className="whitespace-pre-line">{t.work.technologies.backend}</div>
            </div>
            <div>
              <div className="text-[--color-terminal-text]">Tools:</div>
              <div className="whitespace-pre-line">{t.work.technologies.tools}</div>
            </div>
            <div>
              <div className="text-[--color-terminal-text]">Integrations:</div>
              <div className="whitespace-pre-line">{t.work.technologies.integrations}</div>
            </div>
          </div>
        </div>
      </div>
      )}
    </InteractiveTerminal>
  );
}