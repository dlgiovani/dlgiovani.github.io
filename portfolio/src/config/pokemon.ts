export interface WeatherEffect {
  boosts: Record<string, number>;
  debuffs: Record<string, number>;
  mood: string;
  vibe: string;
  emoji: string;
}

export const WEATHER_EFFECTS: Record<string, WeatherEffect> = {
  sunny:      { boosts: { fire: 0.12, grass: 0.06 },        debuffs: { water: -0.05, ice: -0.10 },
                mood: 'feeling toasty',    vibe: 'sunny',  emoji: '☀' },
  rain:       { boosts: { water: 0.12, electric: 0.06 },     debuffs: { fire: -0.10 },
                mood: 'puddle-jumping',   vibe: 'rainy',  emoji: '☔' },
  cloudy:     { boosts: { ghost: 0.06, psychic: 0.04 },      debuffs: {},
                mood: 'contemplative',    vibe: 'cloudy', emoji: '☁' },
  snow:       { boosts: { ice: 0.15, water: 0.04 },          debuffs: { fire: -0.10, grass: -0.06 },
                mood: 'shivering quietly', vibe: 'snowy', emoji: '❄' },
  wind:       { boosts: { flying: 0.10, ghost: 0.04 },       debuffs: {},
                mood: 'feathers ruffled', vibe: 'windy',  emoji: '🌬' },
  clear_night:{ boosts: { ghost: 0.10, psychic: 0.08 },      debuffs: { grass: -0.04 },
                mood: 'eyes wide open',   vibe: 'night',  emoji: '🌙' },
};
