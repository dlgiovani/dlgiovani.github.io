import { useEffect, useState } from "react";

const Header = () => {

  const [weather, setWeather] = useState(null);

  useEffect(() => {

    const fetchWeather = async () => {
      try {
        var response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=7a870ed4880f4ba98b845519232111&q=auto:ip&days=1&aqi=yes&alerts=yes');
        var data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    }

    fetchWeather()
  }, [])

  return (
    <header className='fixed z-50 w-full flex justify-end items-center gap-2 py-1 px-4'>
      {weather &&
        <>
          <img src={weather.current.condition.icon} className='h-8' />
          <span>{weather.current.temp_c}°C em {weather.location.name}</span>
        </>
      }
    </header>
  )
}

export default Header;