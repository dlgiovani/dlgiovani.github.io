export async function fetchWeatherData(city: string): Promise<string> {
  try {
    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format="%C+%t+%h+%w+%p+%P"`
    );
    
    if (!response.ok) {
      throw new Error('Weather API error');
    }
    
    const data = await response.text();
    const cleanData = data.replace(/"/g, '').trim();
    const parts = cleanData.split(' ');
    
    if (parts.length >= 5) {
      const [condition, temp, humidity, wind, pressure, precipitation] = parts;
      return `Weather in ${city}:
Condition: ${condition}
Temperature: ${temp}
Humidity: ${humidity}
Wind: ${wind}
Pressure: ${pressure}
Precipitation: ${precipitation || 'N/A'}`;
    }
    
    return `Weather in ${city}: ${cleanData}`;
  } catch (error) {
    return `Weather data temporarily unavailable for ${city}.
Try: weather london, weather tokyo, weather "new york"

Alternative: weather uses wttr.in service which may be down.
The command is functional - try again later!`;
  }
}