import { useEffect, useRef, useState } from 'react';
// import projects from './data/projects.js';
import { TypeAnimation } from 'react-type-animation';
import Langs from './components/Langs.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';

function App() {

  const songRef = useRef(null);
  const [songSpan, setSongSpan] = useState('play_arrow');
  const [myProjects, setMyProjects] = useState([]);
  const [isLoadingScreen, setIsLoadingScreen] = useState(true);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const data = Promise.resolve(fetch('/data/projects.json'));
    data.then(async (r) => setMyProjects(await r.json()))
  }, [])

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

  if (isLoadingScreen) return <LoadingScreen setIsLoadingScreen={setIsLoadingScreen} />

  const handleSongClick = () => {
    if (songRef.current) {
      // Toggle play/pause
      if (songRef.current.paused) {
        songRef.current.play();
        setSongSpan('pause');
      } else {
        songRef.current.pause();
        setSongSpan('play_arrow');
      }
    }
  };

  const song = <button className='fixed bottom-24 right-0 -rotate-90 flex items-center btn btn-ghost drop-shadow'
    onClick={handleSongClick}>Música
    <span className='material-symbols-outlined'>{songSpan}</span>
  </button>

  const projectsList = myProjects.map((item, index) => {
    return (
      <a key={index} target='_blank' href={item.link || null}>
        <div
          className='aspect-video overflow-hidden mb-4 relative postsFade'
          style={{ backgroundImage: `url('${item.coverUrl || '/misterybox.webp'}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          {item.coverUrl.endsWith('.webm') && (
            <video src={item.coverUrl} autoPlay muted loop className='absolute inset-0 z-10'></video>
          )}
          <div className='w-full h-full lg:bg-black/50 hover:bg-black/0 ease duration-300 z-20 flex items-end justify-between absolute inset-0'>
            <div className='w-full h-fit p-2 bg-primary flex justify-between self-start'>
              <p className=''>{item.name}</p>
              <p className=''>{item.year}</p>
            </div>
          </div>
        </div>
      </a>
    );

  })

  return (
    <main className='w-full h-[85vh] bg-base-100 font-source-code-pro [&::selection]:color-success fadeInFromBlur'>
      <header className='fixed z-50 w-full flex justify-end items-center gap-2 py-1 px-4'>
        {weather &&
          <>
            <img src={weather.current.condition.icon} className='h-8' />
            <span>{weather.current.temp_c}°C em {weather.location.name}</span>
          </>
        }
      </header>
      <Langs />
      <section name="title" className='w-full text-center text-base-content h-[95vh]'>
        <div className='flex flex-col justify-center items-center w-full sticky top-[15vh] md:top-[30vh] pb-4 gap-2'>
          <h1 className='titleFade font-[Montserrat] text-5xl lg:text-8xl flex items-end gap-2'>
            <span>Giovani</span>
          </h1>
          <p className="titleFade bg-gradient-to-br from-stone-400 via-white to-stone-500 bg-clip-text text-transparent w-fit">
            <TypeAnimation
              sequence={['software developer', 'desenvolvedor de software']}
              speed={180} deletionSpeed={150} /><span className='caret text-white -translate-x-3'>|</span>
          </p>
          <div className='flex md:gap-4 text-sm md:text-base'>
            <a target='_blank' href='https://www.linkedin.com/messaging/compose?recipient=giovani-drosda-lima'
              className='btn btn-success mb-4'>Contrate-me</a>
            <a href="https://api.whatsapp.com/send?phone=5541984486463&text=Ol%C3%A1,%20Giovani!%0A%0AVi%20seu%20portf%C3%B3lio%20e%20gostaria%20de%20conversar."
              target='_blank'
              className='btn btn-ghost'>
              <span className="material-symbols-outlined">
                chat
              </span>
              whatsapp
            </a>
            <a href='https://github.com/dlgiovani/' target='_blank' className='btn btn-ghost flex items-center gap-2'>
              <img src="/social-icons/github-round.webp" className='w-6 h-6 ease duration-300 rounded-full' alt="github" />
              <span className='hidden md:block'>github</span>
            </a>
          </div>
        </div>
      </section>
      <section name="projects" className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 pb-24'>
        {projectsList}
      </section>
      {song}
      <audio ref={songRef} src='/songs/C418 - Aria Math (Minecraft Volume Beta).mp3' />
    </main>
  )
}

export default App;
