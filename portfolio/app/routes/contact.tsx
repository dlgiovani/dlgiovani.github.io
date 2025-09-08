import type { Route } from "./+types/contact";
import { Terminal } from "../components/Terminal";
import { CommandOutput } from "../components/TypingText";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact - Giovani Drosda Lima" },
    { name: "description", content: "Get in touch with Giovani Drosda Lima. Available for freelance projects, consultations, and full-stack development opportunities." },
    { property: "og:title", content: "Contact - Giovani Drosda Lima" },
    { property: "og:description", content: "Get in touch with Giovani Drosda Lima. Available for freelance projects, consultations, and full-stack development opportunities." },
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
    <Terminal>
      <div className="space-y-8">
        <CommandOutput 
          command="whoami && echo 'Status: Available for new projects'"
          output={`giovani
Status: Available for new projects`}
          delay={0}
        />

        <CommandOutput 
          command="cat ~/contact/availability.txt"
          output={`# Current Availability: Open 🟢

Looking for:
• Full-stack development projects
• API integrations and automation
• Business dashboard development  
• Technical consulting
• Long-term partnerships

Timezone: America/Sao_Paulo (GMT-3)
Response time: Usually within 24 hours`}
          delay={2000}
        />

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
              className="p-4 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] hover:bg-[--color-terminal-text]/5 transition-all text-left group"
            >
              <div className="terminal-prompt mb-2">
                <span>cat whatsapp.link</span>
              </div>
              <div className="ml-2 text-[--color-terminal-secondary] group-hover:text-[--color-terminal-text]">
                <div className="text-[--color-terminal-accent]">📱 WhatsApp</div>
                <div className="text-xs">Quick response • Direct message</div>
                <div className="text-xs mt-1">+55 41 9 8448-6463</div>
              </div>
            </button>

            <button
              onClick={() => handleContactClick('email')}
              className="p-4 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] hover:bg-[--color-terminal-text]/5 transition-all text-left group"
            >
              <div className="terminal-prompt mb-2">
                <span>cat email.addr</span>
              </div>
              <div className="ml-2 text-[--color-terminal-secondary] group-hover:text-[--color-terminal-text]">
                <div className="text-[--color-terminal-accent]">📧 Email</div>
                <div className="text-xs">Professional • Detailed discussions</div>
                <div className="text-xs mt-1">contatogiovanidl@gmail.com</div>
              </div>
            </button>

            <button
              onClick={() => handleContactClick('github')}
              className="p-4 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] hover:bg-[--color-terminal-text]/5 transition-all text-left group"
            >
              <div className="terminal-prompt mb-2">
                <span>cat github.url</span>
              </div>
              <div className="ml-2 text-[--color-terminal-secondary] group-hover:text-[--color-terminal-text]">
                <div className="text-[--color-terminal-accent]">🐙 GitHub</div>
                <div className="text-xs">Code samples • Open source</div>
                <div className="text-xs mt-1">github.com/dlgiovani</div>
              </div>
            </button>

            <button
              onClick={() => handleContactClick('linkedin')}
              className="p-4 border border-[--color-terminal-secondary] rounded hover:border-[--color-terminal-text] hover:bg-[--color-terminal-text]/5 transition-all text-left group"
            >
              <div className="terminal-prompt mb-2">
                <span>cat linkedin.url</span>
              </div>
              <div className="ml-2 text-[--color-terminal-secondary] group-hover:text-[--color-terminal-text]">
                <div className="text-[--color-terminal-accent]">💼 LinkedIn</div>
                <div className="text-xs">Professional network • Career</div>
                <div className="text-xs mt-1">linkedin.com/in/giovani-drosda-lima</div>
              </div>
            </button>
          </div>
        </div>

        <CommandOutput 
          command="cat project-inquiry.template"
          output={`When reaching out, please include:

• Brief description of your project
• Timeline and budget range (if applicable)
• Preferred communication method
• Any specific technologies required

I'll respond with:
• Project feasibility assessment
• Estimated timeline and approach
• Next steps for collaboration`}
          delay={6000}
        />

        <div className="mt-12 p-4 border border-[--color-terminal-secondary] rounded">
          <div className="text-[--color-terminal-accent] mb-2">Quick Response Promise:</div>
          <div className="text-[--color-terminal-secondary] space-y-1">
            <div>🚀 WhatsApp: Usually within 2-4 hours</div>
            <div>📧 Email: Within 24 hours</div>
            <div>💼 LinkedIn: Within 48 hours</div>
            <div>🐙 GitHub: For technical discussions</div>
          </div>
        </div>
      </div>
    </Terminal>
  );
}