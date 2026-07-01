const BASE = 'https://geocoding-api.open-meteo.com/v1';

export interface CityResult {
  id: number;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  lat: number;
  lon: number;
}

const cache = new Map<string, CityResult[]>();

export async function searchCities(query: string, locale: 'en' | 'pt-br' = 'en'): Promise<CityResult[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const cacheKey = `${locale}:${q}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey)!;

  const lang = locale.startsWith('pt') ? 'pt' : 'en';
  try {
    const res = await fetch(`${BASE}/search?name=${encodeURIComponent(q)}&count=8&language=${lang}&format=json`);
    if (!res.ok) return [];
    const data = await res.json() as {
      results?: Array<{
        id: number; name: string; country: string;
        country_code: string; admin1?: string;
        latitude: number; longitude: number;
      }>;
    };
    const results: CityResult[] = (data.results ?? []).map(r => ({
      id: r.id,
      name: r.name,
      country: r.country,
      countryCode: r.country_code,
      region: r.admin1,
      lat: r.latitude,
      lon: r.longitude,
    }));
    cache.set(cacheKey, results);
    return results;
  } catch {
    return [];
  }
}
