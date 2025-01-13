import React, { useEffect, useState } from "react";
import Song from "./Song";
import About from "./About";
import Theme from "./Theme";

const Header = ({ handleChangeTheme }) => {

  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.weatherapi.com/v1/forecast.json?key=7a870ed4880f4ba98b845519232111&q=auto:ip&days=1&aqi=yes&alerts=yes');
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(fetchWeather);
    } else {
      setTimeout(fetchWeather, 0);
    }
  }, []);


  return (
    <header className='fixed z-50 w-full flex justify-evenly md:justify-center items-center md:gap-2 py-1 m  d:px-4'>
      <Theme handleChangeTheme={handleChangeTheme} />
      <About />
      <Song />
      {weather &&
        <div className="text-xs md:text-base flex items-center pr-4">
          <img src={weather.current.condition.icon} className='h-8' />
          <span>{weather.current.temp_c}°C <span className="hidden md:inline">&middot; {weather.location.name}</span></span>
        </div>
      }
    </header>
  )
}

export default Header;