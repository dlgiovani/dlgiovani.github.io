const BASE = 'https://api.open-meteo.com/v1';

export interface WeatherData {
  temp: number;
  kind: string;
  desc: string;
}

const cache = new Map<string, WeatherData>();

function wmoKind(code: number): string {
  if (code === 0) {
    const h = new Date().getHours();
    return h < 6 || h >= 20 ? 'clear_night' : 'sunny';
  }
  if (code <= 3)  return 'cloudy';
  if (code <= 48) return 'cloudy';
  if (code <= 67 || (code >= 80 && code <= 82)) return 'rain';
  if (code <= 77 || code === 85 || code === 86)  return 'snow';
  if (code >= 95) return 'rain';
  return 'cloudy';
}

function wmoDesc(code: number): string {
  if (code === 0)  return 'clear';
  if (code === 1)  return 'mainly clear';
  if (code === 2)  return 'partly cloudy';
  if (code === 3)  return 'overcast';
  if (code <= 48)  return 'foggy';
  if (code <= 55)  return 'drizzle';
  if (code <= 65)  return 'rain';
  if (code <= 67)  return 'freezing rain';
  if (code <= 75)  return 'snow';
  if (code === 77) return 'snow grains';
  if (code <= 82)  return 'rain showers';
  if (code <= 86)  return 'snow showers';
  if (code >= 95)  return 'thunderstorm';
  return 'cloudy';
}

export async function fetchWeatherForCoords(lat: number, lon: number): Promise<WeatherData> {
  const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
  if (cache.has(key)) return cache.get(key)!;

  try {
    const url = `${BASE}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&wind_speed_unit=ms`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('weather fetch failed');
    const data = await res.json() as {
      current: { temperature_2m: number; weather_code: number };
    };
    const result: WeatherData = {
      temp: Math.round(data.current.temperature_2m),
      kind: wmoKind(data.current.weather_code),
      desc: wmoDesc(data.current.weather_code),
    };
    cache.set(key, result);
    return result;
  } catch {
    return { temp: 20, kind: 'sunny', desc: 'pleasant' };
  }
}
