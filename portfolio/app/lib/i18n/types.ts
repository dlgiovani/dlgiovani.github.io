export type Language = 'en' | 'pt' | 'fr';

export interface Translation {
  home: {
    title: string;
    description: string;
    whoami: string;
    readme: {
      title: string;
      subtitle: string;
      experience: string;
      specialization: string;
      location: string;
    };
    stats: {
      commits: string;
      processes: string;
    };
    navigation: {
      title: string;
      hint: string;
      about: string;
      work: string;
      skills: string;
      contact: string;
    };
  };
  about: {
    title: string;
    description: string;
    personal: {
      title: string;
      intro: string;
      journey: string;
      specialization: string;
    };
    philosophy: {
      title: string;
      content: string;
      beliefs: string[];
    };
    currentFocus: {
      title: string;
      areas: string[];
    };
    quickStats: {
      title: string;
      coding: string;
      location: string;
      focus: string;
      goal: string;
    };
  };
  work: {
    title: string;
    description: string;
    experience: {
      title: string;
      role: string;
      bullets: string[];
      achievements: {
        title: string;
        items: string[];
      };
    };
    projects: {
      realEstate: {
        title: string;
        stack: string;
        description: string;
        features: string[];
        impact: string;
      };
    };
    integrations: {
      title: string;
      items: string[];
    };
    technologies: {
      title: string;
      frontend: string;
      backend: string;
      tools: string;
      integrations: string;
    };
  };
  skills: {
    title: string;
    description: string;
    commands: {
      which: string;
      cat: string;
      npm: string;
      docker: string;
      systemctl: string;
      ps: string;
    };
    categories: {
      languages: string;
      frontend: string;
      backend: string;
      tools: string;
      integrations: string;
      softSkills: string[];
    };
    learning: {
      title: string;
      items: string[];
    };
    legend: string;
  };
  contact: {
    title: string;
    description: string;
    availability: {
      title: string;
      status: string;
      looking: string[];
      timezone: string;
      response: string;
    };
    channels: {
      whatsapp: {
        title: string;
        description: string;
      };
      email: {
        title: string;
        description: string;
      };
      github: {
        title: string;
        description: string;
      };
      linkedin: {
        title: string;
        description: string;
      };
    };
    inquiry: {
      title: string;
      include: string[];
      response: string[];
    };
    promise: {
      title: string;
      whatsapp: string;
      email: string;
      linkedin: string;
      github: string;
    };
  };
  navigation: {
    readme: string;
    about: string;
    work: string;
    skills: string;
    contact: string;
  };
  common: {
    languages: {
      en: string;
      pt: string;
      fr: string;
    };
    expert: string;
    advanced: string;
    intermediate: string;
    beginner: string;
  };
  terminal: {
    commands: {
      help: string;
      about: string;
      work: string;
      skills: string;
      contact: string;
      weather: string;
      time: string;
      giofetch: string;
      clear: string;
      pwd: string;
      whoami: string;
      echo: string;
      date: string;
      fortune: string;
      theme: string;
    };
    outputs: {
      navigatingTo: string;
      fetchingWeather: string;
      weatherUsage: string;
      weatherError: string;
      commandNotFound: string;
      typeHelp: string;
      availableCommands: string;
      tryCommands: string;
    };
    themes: {
      availableThemes: string;
      usage: string;
      themeChanged: string;
      themeNotFound: string;
    };
    fortune: {
      quotes: string[];
    };
    giofetch: {
      header: string;
      separator: string;
      fields: {
        os: string;
        host: string;
        kernel: string;
        uptime: string;
        packages: string;
        shell: string;
        resolution: string;
        terminal: string;
        cpu: string;
        memory: string;
        disk: string;
        location: string;
        languages: string;
      };
    };
  };
}