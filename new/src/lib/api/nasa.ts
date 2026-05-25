export interface ApodResult {
  title: string;
  explanation: string;
  url: string;
  hdurl?: string;
  media_type: 'image' | 'video';
  date: string;
}

export async function fetchApod(): Promise<ApodResult | null> {
  try {
    const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
    if (!res.ok) return null;
    return await res.json() as ApodResult;
  } catch {
    return null;
  }
}
