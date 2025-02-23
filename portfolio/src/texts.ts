export const availableLanguages = {
    "ptbr": "português",
    "en": "english"
} as const;
export type LanguageCode = keyof typeof availableLanguages;

export const texts: Record<string, Record<LanguageCode, string>> = {
    "projects": {
        "en": "projects",
        "ptbr": "projetos"
    },
    "portfolios": {
        "en": "portfolios",
        "ptbr": "portifólios"
    },
    "coming (not so) soon": {
        "en": "coming (not so) soon",
        "ptbr": "em (não tão) breve"
    },
    "theme": {
        "en": "theme",
        "ptbr": "tema"
    },
    "about": {
        "en": "about",
        "ptbr": "sobre"
    },
    "song": {
        "en": "song",
        "ptbr": "música"
    },
    "where": {
        "en": "where",
        "ptbr": "onde"
    },
    "what": {
        "en": "what",
        "ptbr": "o quê"
    },
    "seniority": {
        "en": "seniority",
        "ptbr": "nível"
    },
    "certificate": {
        "en": "certificate",
        "ptbr": "certificado"
    },
    "curriculum": {
        "en": "curriculum",
        "ptbr": "currículo"
    },
    "email": {
        "en": "email",
        "ptbr": "email"
    },
    "hire me": {
        "en": "hire me",
        "ptbr": "contrate-me"
    },
    "language": {
        "en": "language",
        "ptbr": "idioma"
    },
    "my_profession": {
        "en": "IT Analyst & Programmer",
        "ptbr": "Analista de TI e Programador"
    },
    "mid-level": {
        "en": "mid-level",
        "ptbr": "pleno"
    },
    "see PDF": {
        "en": "see PDF",
        "ptbr": "ver PDF"
    },
    "close": {
        "en": "close",
        "ptbr": "fechar"
    }
};