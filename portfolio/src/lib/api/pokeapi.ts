import type { Pokemon, TypeName } from '../../types/pokemon';
import { artworkUrl, spriteUrl } from '../pokemon-utils';

const BASE = 'https://pokeapi.co/api/v2';

export interface PokemonNameEntry {
  name: string;
  id: number;
}

let namesCache: PokemonNameEntry[] | null = null;
const detailCache = new Map<string, Pokemon>();

export async function fetchAllNames(): Promise<PokemonNameEntry[]> {
  if (namesCache) return namesCache;
  const res = await fetch(`${BASE}/pokemon?limit=1025`);
  if (!res.ok) return [];
  const data = await res.json() as { results: { name: string; url: string }[] };
  namesCache = data.results.map(p => ({
    name: p.name,
    id: parseInt(p.url.split('/').filter(Boolean).pop() ?? '0', 10),
  }));
  return namesCache;
}

const ptBrNamesCache = new Map<number, string>();

export async function getPtBrNames(apiUrl: string, ids: number[]): Promise<Record<number, string>> {
  const result: Record<number, string> = {};
  const missing: number[] = [];
  for (const id of ids) {
    const cached = ptBrNamesCache.get(id);
    if (cached) result[id] = cached;
    else missing.push(id);
  }
  if (missing.length === 0) return result;

  try {
    const res = await fetch(`${apiUrl}/api/pokemon/names`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: missing }),
    });
    if (!res.ok) return result;
    const data = await res.json() as Record<string, string>;
    for (const [id, name] of Object.entries(data)) {
      ptBrNamesCache.set(Number(id), name);
      result[Number(id)] = name;
    }
  } catch {
    // keep whatever was already cached
  }
  return result;
}

export async function getPokemonByName(name: string): Promise<Pokemon | null> {
  const cached = detailCache.get(name);
  if (cached) return cached;
  try {
    const res = await fetch(`${BASE}/pokemon/${name}`);
    if (!res.ok) return null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await res.json();
    const pokemon: Pokemon = {
      id: data.id,
      name: data.name,
      types: data.types.map((t: { type: { name: string } }) => t.type.name as TypeName),
      stats: data.stats.map((s: { stat: { name: string }; base_stat: number }) => ({
        name: s.stat.name,
        base: s.base_stat,
      })),
      sprite: spriteUrl(data.id),
      artwork: artworkUrl(data.id),
      height: data.height,
      weight: data.weight,
    };
    detailCache.set(name, pokemon);
    return pokemon;
  } catch {
    return null;
  }
}
