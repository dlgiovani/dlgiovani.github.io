export interface CityEntry {
  city: string;
  country: string;
  x: number;
  y: number;
  count: number;
  top: string;
}

export const cities: CityEntry[] = [
  { city: 'Lisbon',       country: 'PT', x: 47.0, y: 41, count: 124, top: 'charizard' },
  { city: 'São Paulo',    country: 'BR', x: 32.0, y: 69, count: 198, top: 'venusaur' },
  { city: 'Berlin',       country: 'DE', x: 52.5, y: 33, count: 88,  top: 'gengar' },
  { city: 'Tokyo',        country: 'JP', x: 88.5, y: 41, count: 156, top: 'pikachu' },
  { city: 'New York',     country: 'US', x: 25.5, y: 41, count: 174, top: 'mewtwo' },
  { city: 'Mexico City',  country: 'MX', x: 21.5, y: 51, count: 67,  top: 'arcanine' },
  { city: 'London',       country: 'GB', x: 48.5, y: 33, count: 102, top: 'snorlax' },
  { city: 'Sydney',       country: 'AU', x: 91.0, y: 79, count: 54,  top: 'gyarados' },
  { city: 'Reykjavík',   country: 'IS', x: 44.5, y: 25, count: 18,  top: 'blastoise' },
  { city: 'Cape Town',    country: 'ZA', x: 53.0, y: 81, count: 31,  top: 'eevee' },
  { city: 'Bangalore',    country: 'IN', x: 73.0, y: 56, count: 119, top: 'pikachu' },
  { city: 'Buenos Aires', country: 'AR', x: 32.5, y: 81, count: 49,  top: 'gengar' },
  { city: 'Toronto',      country: 'CA', x: 24.5, y: 36, count: 76,  top: 'blastoise' },
  { city: 'Singapore',    country: 'SG', x: 79.0, y: 60, count: 92,  top: 'venusaur' },
];
