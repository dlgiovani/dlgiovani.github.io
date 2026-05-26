import type { Pokemon, PokemonStat } from '../types/pokemon';

export function spriteUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function artworkUrl(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function adjustedStats(stats: PokemonStat[]): PokemonStat[] {
  return stats.map(s => ({ ...s, base: Math.round((s.base / 255) * 100) }));
}

export function typeColor(type: string): string {
  const colors: Record<string, string> = {
    normal: '#a8a878', fire: '#f08030', water: '#6890f0', electric: '#f8d030',
    grass: '#78c850', ice: '#98d8d8', fighting: '#c03028', poison: '#a040a0',
    ground: '#e0c068', flying: '#a890f0', psychic: '#f85888', bug: '#a8b820',
    rock: '#b8a038', ghost: '#705898', dragon: '#7038f8', dark: '#705848',
    steel: '#b8b8d0', fairy: '#ee99ac',
  };
  return colors[type] ?? '#68a090';
}

export function formatPokemonName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function formatStat(name: string): string {
  const map: Record<string, string> = {
    hp: 'HP', attack: 'ATK', defense: 'DEF',
    'special-attack': 'SpATK', 'special-defense': 'SpDEF', speed: 'SPD',
  };
  return map[name] ?? name;
}

export function weightFromRaw(w: number): string {
  return `${(w / 10).toFixed(1)} kg`;
}

export function heightFromRaw(h: number): string {
  return `${(h / 10).toFixed(1)} m`;
}

export function pokemonFromApi(data: Pokemon): Pokemon {
  return data;
}
