import type { Route } from "./+types/contact";
import { InteractiveTerminal } from "../components/InteractiveTerminal";
import { CommandOutput } from "../components/TypingText";
import { detectLanguage, removeLanguagePrefix, getTranslation } from "../lib/i18n";
import { useLocation } from "react-router";

export function meta({ location }: Route.MetaArgs) {
  const currentLang = detectLanguage(location.pathname);
  const t = getTranslation(currentLang);
  
  return [
    { title: t.contact.title },
    { name: "description", content: t.contact.description },
    { property: "og:title", content: t.contact.title },
    { property: "og:description", content: t.contact.description },
  ];
}

export default function Contact() {
  const handleContactClick = (type: 'whatsapp' | 'email' | 'github' | 'linkedin') => {
    const urls = {
      whatsapp: 'https://api.whatsapp.com/send/?phone=5541984486463&text=Hi%20Giovani!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.&utm_source=portfolio',
      email: 'mailto:contatogiovanidl@gmail.com?subject=Portfolio%20Contact&body=Hi%20Giovani,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20connect.%0A%0A&utm_source=portfolio',
      github: 'https://github.com/dlgiovani?utm_source=portfolio',
      linkedin: 'https://www.linkedin.com/in/giovani-drosda-lima/?utm_source=portfolio'
    };
    
    window.open(urls[type], '_blank');
  };

  return (
    <InteractiveTerminal>
      {({ t }) => (
        <div className="space-y-8">
          <CommandOutput 
            command="whoami && echo 'Status: Available for new projects'"
            output={`giovani
${t.contact.availability.status}`}
            delay={0}
          />

          <CommandOutput 
            command="cat ~/contact/availability.txt"
            output={`# ${t.contact.availability.title}

Looking for:
${t.contact.availability.looking.map(item => `• ${item}`).join('\n')}

${t.contact.availability.timezone}
${t.contact.availability.response}`}
            delay={2000}
          />

          <div className="mt-8 space-y-2">
            <div className="terminal-prompt">
              <span>cat ~/contact/quick-links.txt</span>
            </div>
            <div className="ml-2 text-[var(--color-terminal-secondary)] space-y-1">
              <div>Quick Contact Links:</div>
              <div className="space-y-1 mt-2">
                <div>
                  <span className="text-[var(--color-terminal-accent)]">📱 WhatsApp:</span>{' '}
                  <a 
                    href="https://api.whatsapp.com/send/?phone=5541984486463&text=Hi%20Giovani!%20I%20found%20your%20portfolio%20and%20would%20like%20to%20connect.&utm_source=portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-link hover:text-[var(--color-terminal-text)] transition-colors underline focus:outline-none focus:ring-2 focus:ring-[var(--color-terminal-text)] focus:ring-opacity-50 rounded"
                    aria-label="Contact via WhatsApp"
                  >
                    +55 41 9 8448-6463
                  </a>
                </div>
                <div>
                  <span className="text-[var(--color-terminal-accent)]">📧 Email:</span>{' '}
                  <a 
                    href="mailto:contatogiovanidl@gmail.com?subject=Portfolio%20Contact&body=Hi%20Giovani,%0A%0AI%20found%20your%20portfolio%20and%20would%20like%20to%20connect.%0A%0A&utm_source=portfolio"
                    className="terminal-link hover:text-[var(--color-terminal-text)] transition-colors underline focus:outline-none focus:ring-2 focus:ring-[var(--color-terminal-text)] focus:ring-opacity-50 rounded"
                    aria-label="Send email"
                  >
                    contatogiovanidl@gmail.com
                  </a>
                </div>
                <div>
                  <span className="text-[var(--color-terminal-accent)]">🐙 GitHub:</span>{' '}
                  <a 
                    href="https://github.com/dlgiovani?utm_source=portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-link hover:text-[var(--color-terminal-text)] transition-colors underline focus:outline-none focus:ring-2 focus:ring-[var(--color-terminal-text)] focus:ring-opacity-50 rounded"
                    aria-label="Visit GitHub profile"
                  >
                    github.com/dlgiovani
                  </a>
                </div>
                <div>
                  <span className="text-[var(--color-terminal-accent)]">💼 LinkedIn:</span>{' '}
                  <a 
                    href="https://www.linkedin.com/in/giovani-drosda-lima/?utm_source=portfolio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terminal-link hover:text-[var(--color-terminal-text)] transition-colors underline focus:outline-none focus:ring-2 focus:ring-[var(--color-terminal-text)] focus:ring-opacity-50 rounded"
                    aria-label="Visit LinkedIn profile"
                  >
                    linkedin.com/in/giovani-drosda-lima
                  </a>
                </div>
              </div>
            </div>
          </div>

        <CommandOutput 
          command="ls ~/contact/channels/"
          output={`whatsapp.link
email.addr
github.url  
linkedin.url`}
          delay={4000}
        />

        <div className="space-y-4 mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => handleContactClick('whatsapp')}
              className="p-4 border border-[var(--color-terminal-secondary)] rounded hover:border-[var(--color-terminal-text)] hover:bg-[var(--color-terminal-text)]/5 transition-all text-left group"
              aria-label="Contact via WhatsApp"
              type="button"
            >
              <div className="terminal-prompt mb-2">
                <span>cat whatsapp.link</span>
              </div>
              <div className="ml-2 text-[var(--color-terminal-secondary)] group-hover:text-[var(--color-terminal-text)]">
                <div className="text-[var(--color-terminal-accent)]">📱 {t.contact.channels.whatsapp.title}</div>
                <div className="text-xs">{t.contact.channels.whatsapp.description}</div>
                <div className="text-xs mt-1">+55 41 9 8448-6463</div>
              </div>
            </button>

            <button
              onClick={() => handleContactClick('email')}
              className="p-4 border border-[var(--color-terminal-secondary)] rounded hover:border-[var(--color-terminal-text)] hover:bg-[var(--color-terminal-text)]/5 transition-all text-left group"
              aria-label="Send email"
              type="button"
            >
              <div className="terminal-prompt mb-2">
                <span>cat email.addr</span>
              </div>
              <div className="ml-2 text-[var(--color-terminal-secondary)] group-hover:text-[var(--color-terminal-text)]">
                <div className="text-[var(--color-terminal-accent)]">📧 {t.contact.channels.email.title}</div>
                <div className="text-xs">{t.contact.channels.email.description}</div>
                <div className="text-xs mt-1">contatogiovanidl@gmail.com</div>
              </div>
            </button>

            <button
              onClick={() => handleContactClick('github')}
              className="p-4 border border-[var(--color-terminal-secondary)] rounded hover:border-[var(--color-terminal-text)] hover:bg-[var(--color-terminal-text)]/5 transition-all text-left group"
              aria-label="Visit GitHub profile"
              type="button"
            >
              <div className="terminal-prompt mb-2">
                <span>cat github.url</span>
              </div>
              <div className="ml-2 text-[var(--color-terminal-secondary)] group-hover:text-[var(--color-terminal-text)]">
                <div className="text-[var(--color-terminal-accent)]">🐙 {t.contact.channels.github.title}</div>
                <div className="text-xs">{t.contact.channels.github.description}</div>
                <div className="text-xs mt-1">github.com/dlgiovani</div>
              </div>
            </button>

            <button
              onClick={() => handleContactClick('linkedin')}
              className="p-4 border border-[var(--color-terminal-secondary)] rounded hover:border-[var(--color-terminal-text)] hover:bg-[var(--color-terminal-text)]/5 transition-all text-left group"
              aria-label="Visit LinkedIn profile"
              type="button"
            >
              <div className="terminal-prompt mb-2">
                <span>cat linkedin.url</span>
              </div>
              <div className="ml-2 text-[var(--color-terminal-secondary)] group-hover:text-[var(--color-terminal-text)]">
                <div className="text-[var(--color-terminal-accent)]">💼 {t.contact.channels.linkedin.title}</div>
                <div className="text-xs">{t.contact.channels.linkedin.description}</div>
                <div className="text-xs mt-1">linkedin.com/in/giovani-drosda-lima</div>
              </div>
            </button>
          </div>
        </div>

          <CommandOutput 
            command="cat project-inquiry.template"
            output={`${t.contact.inquiry.title}

${t.contact.inquiry.include.map(item => `• ${item}`).join('\n')}

I'll respond with:
${t.contact.inquiry.response.map(item => `• ${item}`).join('\n')}`}
            delay={6000}
          />

        <div className="mt-12 p-4 border border-[var(--color-terminal-secondary)] rounded">
          <div className="text-[var(--color-terminal-accent)] mb-2">{t.contact.promise.title}</div>
          <div className="text-[var(--color-terminal-secondary)] space-y-1">
            <div>{t.contact.promise.whatsapp}</div>
            <div>{t.contact.promise.email}</div>
            <div>{t.contact.promise.linkedin}</div>
            <div>{t.contact.promise.github}</div>
          </div>
        </div>
        </div>
      )}
    </InteractiveTerminal>
  );
}