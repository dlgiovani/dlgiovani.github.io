export interface TerminalTheme {
  name: string;
  displayName: string;
  isDark: boolean;
  colors: {
    bg: string;
    text: string;
    secondary: string;
    accent: string;
    error: string;
    cursor: string;
    link: string;
    linkHover: string;
    border: string;
  };
  backgroundImage?: {
    url: string;
    opacity: number;
    position: string;
    size: string;
    repeat: string;
  };
}

export const themes: Record<string, TerminalTheme> = {
  default: {
    name: 'default',
    displayName: 'Default Dark',
    isDark: true,
    colors: {
      bg: '#0a0a0a',
      text: '#e5e5e5',
      secondary: '#a3a3a3',
      accent: '#22d3ee',
      error: '#ef4444',
      cursor: '#22d3ee',
      link: '#60a5fa',
      linkHover: '#93c5fd',
      border: '#404040',
    },
  },
  
  catppuccin: {
    name: 'catppuccin',
    displayName: 'Catppuccin Mocha',
    isDark: true,
    colors: {
      bg: '#1e1e2e',
      text: '#cdd6f4',
      secondary: '#a6adc8',
      accent: '#89b4fa',
      error: '#f38ba8',
      cursor: '#f9e2af',
      link: '#74c7ec',
      linkHover: '#89b4fa',
      border: '#313244',
    },
    backgroundImage: {
      url: '/bongocat.gif',
      opacity: 0.1,
      position: 'center right',
      size: '50vw auto',
      repeat: 'no-repeat'
    },
  },

  dracula: {
    name: 'dracula',
    displayName: 'Dracula',
    isDark: true,
    colors: {
      bg: '#282a36',
      text: '#f8f8f2',
      secondary: '#6272a4',
      accent: '#8be9fd',
      error: '#ff5555',
      cursor: '#50fa7b',
      link: '#bd93f9',
      linkHover: '#ff79c6',
      border: '#44475a',
    },
  },

  gruvbox: {
    name: 'gruvbox',
    displayName: 'Gruvbox Dark',
    isDark: true,
    colors: {
      bg: '#282828',
      text: '#fbf1c7',
      secondary: '#bdae93',
      accent: '#fabd2f',
      error: '#fb4934',
      cursor: '#fe8019',
      link: '#83a598',
      linkHover: '#8ec07c',
      border: '#504945',
    },
  },

  nord: {
    name: 'nord',
    displayName: 'Nord',
    isDark: true,
    colors: {
      bg: '#2e3440',
      text: '#d8dee9',
      secondary: '#81a1c1',
      accent: '#88c0d0',
      error: '#bf616a',
      cursor: '#a3be8c',
      link: '#5e81ac',
      linkHover: '#81a1c1',
      border: '#4c566a',
    },
  },

  solarized: {
    name: 'solarized',
    displayName: 'Solarized Dark',
    isDark: true,
    colors: {
      bg: '#002b36',
      text: '#839496',
      secondary: '#586e75',
      accent: '#268bd2',
      error: '#dc322f',
      cursor: '#b58900',
      link: '#2aa198',
      linkHover: '#859900',
      border: '#073642',
    },
  },

  monokai: {
    name: 'monokai',
    displayName: 'Monokai',
    isDark: true,
    colors: {
      bg: '#272822',
      text: '#f8f8f2',
      secondary: '#75715e',
      accent: '#a6e22e',
      error: '#f92672',
      cursor: '#fd971f',
      link: '#66d9ef',
      linkHover: '#ae81ff',
      border: '#49483e',
    },
  },

  tokyo: {
    name: 'tokyo',
    displayName: 'Tokyo Night',
    isDark: true,
    colors: {
      bg: '#24283b',
      text: '#a9b1d6',
      secondary: '#9aa5ce',
      accent: '#7aa2f7',
      error: '#f7768e',
      cursor: '#bb9af7',
      link: '#2ac3de',
      linkHover: '#7dcfff',
      border: '#32344a',
    },
  },

  cyberpunk: {
    name: 'cyberpunk',
    displayName: 'Cyberpunk',
    isDark: true,
    colors: {
      bg: '#0d001a',
      text: '#00ff9f',
      secondary: '#ff0080',
      accent: '#ffff00',
      error: '#ff073a',
      cursor: '#00ff9f',
      link: '#ff0080',
      linkHover: '#ffff00',
      border: '#660066',
    },
  },

  matrix: {
    name: 'matrix',
    displayName: 'Matrix',
    isDark: true,
    colors: {
      bg: '#000000',
      text: '#00ff00',
      secondary: '#008000',
      accent: '#00ff00',
      error: '#ff0000',
      cursor: '#00ff00',
      link: '#00ff00',
      linkHover: '#ffffff',
      border: '#003300',
    },
  },

  light: {
    name: 'light',
    displayName: 'Light Terminal',
    isDark: false,
    colors: {
      bg: '#ffffff',
      text: '#2d3748',
      secondary: '#718096',
      accent: '#3182ce',
      error: '#e53e3e',
      cursor: '#3182ce',
      link: '#2b6cb0',
      linkHover: '#2c5282',
      border: '#e2e8f0',
    },
  },

  solarizedLight: {
    name: 'solarizedLight',
    displayName: 'Solarized Light',
    isDark: false,
    colors: {
      bg: '#fdf6e3',
      text: '#657b83',
      secondary: '#93a1a1',
      accent: '#268bd2',
      error: '#dc322f',
      cursor: '#b58900',
      link: '#2aa198',
      linkHover: '#859900',
      border: '#eee8d5',
    },
  },
};

export const defaultTheme = themes.default;

export function getTheme(name: string): TerminalTheme {
  return themes[name] || defaultTheme;
}

export function applyTheme(theme: TerminalTheme): void {
  const root = document.documentElement;
  
  root.style.setProperty('--color-terminal-bg', theme.colors.bg);
  root.style.setProperty('--color-terminal-text', theme.colors.text);
  root.style.setProperty('--color-terminal-secondary', theme.colors.secondary);
  root.style.setProperty('--color-terminal-accent', theme.colors.accent);
  root.style.setProperty('--color-terminal-error', theme.colors.error);
  root.style.setProperty('--color-terminal-cursor', theme.colors.cursor);
  root.style.setProperty('--color-terminal-link', theme.colors.link);
  root.style.setProperty('--color-terminal-link-hover', theme.colors.linkHover);
  root.style.setProperty('--color-terminal-border', theme.colors.border);
  
  // Handle background image if present
  if (theme.backgroundImage) {
    const bgImage = `url('${theme.backgroundImage.url}')`;
    
    root.style.setProperty('--terminal-bg-image', bgImage);
    root.style.setProperty('--terminal-bg-position', theme.backgroundImage.position);
    root.style.setProperty('--terminal-bg-size', theme.backgroundImage.size);
    root.style.setProperty('--terminal-bg-repeat', theme.backgroundImage.repeat);
    root.style.setProperty('--terminal-bg-opacity', theme.backgroundImage.opacity.toString());
  } else {
    // Clear background image properties
    root.style.removeProperty('--terminal-bg-image');
    root.style.removeProperty('--terminal-bg-position');
    root.style.removeProperty('--terminal-bg-size');
    root.style.removeProperty('--terminal-bg-repeat');
    root.style.removeProperty('--terminal-bg-opacity');
  }
  
  // Update color-scheme for better browser integration
  document.documentElement.style.colorScheme = theme.isDark ? 'dark' : 'light';
  
  // Update meta theme-color for mobile browsers
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', theme.colors.bg);
  }
}

export function getStoredTheme(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('terminal-theme') || 'default';
  }
  return 'default';
}

export function setStoredTheme(themeName: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('terminal-theme', themeName);
  }
}