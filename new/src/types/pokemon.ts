export type TypeName =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export type CardStyle = 'flat' | 'pokedex' | 'tcg';

export type WeatherKind = 'clear' | 'rain' | 'snow' | 'wind' | 'thunder';

export interface PokemonStat {
  name: string;
  base: number;
}

export interface Pokemon {
  id: number;
  name: string;
  types: TypeName[];
  stats: PokemonStat[];
  sprite: string;
  artwork: string;
  height: number;
  weight: number;
}
